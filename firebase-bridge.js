/* Smart Library Firebase Bridge */
(function () {
  'use strict';

  const cloudReady = () =>
    !!(window.firebaseAuth && window.firebaseDb);

  const safeToast = (message, type) => {
    if (typeof window.toast === 'function') {
      window.toast(message, type);
    }
  };

  const localUser = (email) => {
    const source = typeof window.getLibraryDB === 'function'
      ? window.getLibraryDB()
      : window.db;
    const users = Array.isArray(source?.users) ? source.users : [];

    return users.find(
      u =>
        String(u.email || '').trim().toLowerCase() ===
        String(email || '').trim().toLowerCase()
    );
  };

  const localPass = (email, password) => {
    const user = localUser(email);

    return user &&
      String(user.password || '') === String(password || '')
      ? user
      : null;
  };

  /* ---------------------------------------------------------
     FIRESTORE SYNC
  --------------------------------------------------------- */

  async function syncCollection(collectionName, items) {
    if (!cloudReady() || !Array.isArray(items)) return;

    const collection = window.firebaseDb.collection(collectionName);

    for (const item of items) {
      if (!item) continue;

      const clean = { ...item };

      /* Never store passwords in Firestore */
      delete clean.password;

      const id =
        clean.id ||
        clean.uid ||
        clean.email ||
        clean.rollNo ||
        clean.bookId;

      if (!id) continue;

      try {
        await collection.doc(String(id)).set(
          {
            ...clean,
            updatedAt:
              window.firebase.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );
      } catch (error) {
        console.warn(
          `Firebase sync failed for ${collectionName}:`,
          error
        );
      }
    }
  }

  async function syncDatabaseToFirebase() {
    if (!cloudReady() || !window.db) return;

    try {
      const db = typeof window.getLibraryDB === 'function'
        ? window.getLibraryDB()
        : window.db;

      /* Users → students / teachers */
      if (Array.isArray(db.users)) {
        const students = db.users.filter(
          u =>
            String(u.role || '').toLowerCase() === 'student'
        );

        const teachers = db.users.filter(
          u => {
            const role = String(u.role || '').toLowerCase();

            return (
              role === 'teacher' ||
              role === 'faculty'
            );
          }
        );

        const admins = db.users.filter(
          u =>
            ['admin', 'librarian'].includes(
              String(u.role || '').toLowerCase()
            )
        );

        await syncCollection('students', students);
        await syncCollection('teachers', teachers);
        await syncCollection('admins', admins);
      }

      /* Common library data */
      await syncCollection(
        'books',
        db.books || []
      );

      await syncCollection(
        'borrowings',
        db.borrowings ||
        db.loans ||
        db.transactions ||
        []
      );

      await syncCollection(
        'reservations',
        db.reservations || []
      );

      await syncCollection(
        'notifications',
        db.notifications || []
      );

      await syncCollection(
        'academicSchedules',
        db.academicSchedules ||
        db.academicSchedule ||
        []
      );

      console.log('Firebase: database sync completed');

    } catch (error) {
      console.warn(
        'Firebase database sync skipped:',
        error
      );
    }
  }

  /* ---------------------------------------------------------
     DATABASE SAVING

     script.js now writes the complete database directly to
     Firestore at library/state. No second save wrapper is needed.
  --------------------------------------------------------- */

  /* ---------------------------------------------------------
     OPEN USER
  --------------------------------------------------------- */

  function openWithUser(user) {

    if (!user) return false;

    window.currentUser = {
      ...user,
      role:
        user.role === 'librarian'
          ? 'admin'
          : user.role
    };

    localStorage.setItem(
      'munvarCurrentUser',
      JSON.stringify(window.currentUser)
    );

    if (typeof window.addAudit === 'function') {
      window.addAudit('Logged in via Firebase');
    }

    if (typeof window.showApp === 'function') {
      window.showApp();
    }

    return true;
  }

  /* ---------------------------------------------------------
     LOAD CLOUD STATE AFTER FIREBASE AUTHENTICATION

     Firestore rules commonly require an authenticated user.
     The first version tried to read library/state before login,
     which can fail on a new phone/browser. We therefore load the
     authoritative cloud database immediately after Firebase login.
  --------------------------------------------------------- */

  async function loadCloudStateAfterAuth() {
    if (!cloudReady()) {
      throw new Error('Firebase is not initialized.');
    }

    if (!window.firebaseAuth.currentUser) {
      throw new Error('Firebase authentication is not active.');
    }

    try {
      const snapshot = await window.firebaseDb
        .collection('library')
        .doc('state')
        .get({ source: 'server' });

      if (!snapshot.exists || !snapshot.data()?.data) {
        throw new Error('Firestore document library/state was not found.');
      }

      const cloud = snapshot.data().data;

      if (!Array.isArray(cloud.users) || !Array.isArray(cloud.books)) {
        throw new Error('Firestore library/state contains an invalid database structure.');
      }

      if (typeof window.setLibraryDB === 'function') {
        window.setLibraryDB(cloud);
      } else {
        window.db = cloud;
      }

      console.log('Firebase: authoritative library database loaded after login');
      return cloud;
    } catch (error) {
      console.error('Firebase cloud database load after login failed:', error);
      throw error;
    }
  }

  /* ---------------------------------------------------------
     FIREBASE LOGIN
  --------------------------------------------------------- */

  async function firebaseLogin(email, password) {
    if (!cloudReady()) return false;

    try {
      // Capture the legacy/local profile BEFORE loading cloud state.
      // loadCloudStateAfterAuth() replaces window.db with Firestore data, so
      // looking up the old profile afterwards can incorrectly return null.
      const legacyBeforeCloud = localPass(email, password) || localUser(email);

      let credential;
      try {
        credential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
      } catch (authError) {
        // Older versions of Smart Library created users only in localStorage.
        // If this is one of those legacy accounts AND the supplied password
        // matches the local record, provision the same account in Firebase Auth.
        // This converts the old account to a real cloud-authenticated account.
        if (authError?.code === 'auth/invalid-credential' || authError?.code === 'auth/user-not-found') {
          const legacy = localPass(email, password);
          if (legacy) {
            try {
              credential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
            } catch (createError) {
              // If the email already exists, the password simply does not match
              // Firebase. Never overwrite or reset an existing account here.
              if (createError?.code === 'auth/email-already-in-use') {
                throw authError;
              }
              throw createError;
            }
          } else {
            throw authError;
          }
        } else {
          throw authError;
        }
      }

      // Authentication succeeded. Do NOT fall back to localStorage if the
      // Firestore read fails; doing so could display stale phone data and then
      // overwrite the cloud database with that stale data.
      let cloud;
      try {
        cloud = await loadCloudStateAfterAuth();
      } catch (cloudError) {
        // A newly provisioned legacy account may not have a cloud state yet.
        // Seed library/state from the current library DB once, then reload it.
        const localDb = typeof window.getLibraryDB === 'function' ? window.getLibraryDB() : window.db;
        if (localDb && Array.isArray(localDb.users) && Array.isArray(localDb.books)) {
          await window.firebaseDb.collection('library').doc('state').set({
            data: localDb,
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: false });
          cloud = await loadCloudStateAfterAuth();
        } else {
          throw cloudError;
        }
      }
      const cloudUser = cloud.users.find(
        u => String(u.email || '').trim().toLowerCase() === String(email).trim().toLowerCase()
      );

      if (!cloudUser) {
        // IMPORTANT: library/state is the authoritative database, but an older
        // cloud copy can pre-date a newly registered account. Recover the user
        // from the browser copy first, then from the separate students collection.
        let legacy = legacyBeforeCloud;

        // If the browser copy was already replaced by an older cloud state,
        // recover the student profile directly from Firestore.
        if (!legacy) {
          try {
            const studentSnap = await window.firebaseDb.collection('students')
              .where('email', '==', String(email).trim().toLowerCase())
              .limit(1).get();
            if (!studentSnap.empty) {
              const student = studentSnap.docs[0].data();
              legacy = {
                id: student.id || student.studentId || credential.user.uid,
                email: student.email || email,
                role: 'student',
                name: student.name || credential.user.displayName || email.split('@')[0],
                studentId: student.studentId || student.id || credential.user.uid,
                department: student.department || '',
                semester: student.semester || '',
                mobile: student.mobile || '',
                active: true
              };
            }
          } catch (lookupError) {
            console.warn('Firebase student profile lookup failed:', lookupError);
          }
        }

        if (!legacy) {
          throw new Error('Firebase login succeeded, but no library profile was found for this email. Create the student account again from this version so it is registered in Firebase and library/state.');
        }

        // Link the authenticated Firebase UID to the library profile.
        const linkedUser = { ...legacy, uid: credential.user.uid, email };
        delete linkedUser.password;
        cloud.users = Array.isArray(cloud.users) ? cloud.users : [];
        cloud.users.push(linkedUser);

        await window.firebaseDb.collection('library').doc('state').set({
          data: cloud,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Keep the in-memory DB consistent with what was just saved.
        if (typeof window.setLibraryDB === 'function') window.setLibraryDB(cloud);
      }

      const finalUser = cloud.users.find(
        u => String(u.email || '').trim().toLowerCase() === String(email).trim().toLowerCase()
      );

      openWithUser({
        ...finalUser,
        uid: credential.user.uid,
        id: finalUser.id ?? credential.user.uid
      });

      // Keep the separate Firebase collections in sync after the authoritative
      // state has been loaded. The main database remains library/state.
      await syncDatabaseToFirebase();
      return true;

    } catch (error) {
      console.error('Firebase login/cloud load failed:', error);
      safeToast(
        `Firebase sync failed: ${error?.message || 'Unable to load cloud database.'}`,
        'error'
      );
      return false;
    }
  }

  /* ---------------------------------------------------------
     LOGIN FORM
  --------------------------------------------------------- */

  function installLogin() {

    const oldForm =
      document.getElementById('loginForm');

    if (
      !oldForm ||
      oldForm.dataset.firebaseBridge === '1'
    ) {
      return;
    }

    const form =
      oldForm.cloneNode(true);

    oldForm.parentNode.replaceChild(
      form,
      oldForm
    );

    form.dataset.firebaseBridge = '1';

    form.addEventListener(
      'submit',
      async function (event) {

        event.preventDefault();

        const email =
          (
            document.getElementById(
              'loginEmail'
            )?.value || ''
          )
            .trim()
            .toLowerCase();

        const password =
          document.getElementById(
            'loginPassword'
          )?.value || '';

        if (!email || !password) {
          safeToast(
            'Enter email and password.',
            'error'
          );
          return;
        }

        const button =
          form.querySelector(
            'button[type="submit"]'
          );

        if (button) {
          button.disabled = true;
        }

        try {

          const success =
            await firebaseLogin(
              email,
              password
            );

          if (!success) {
            // When Firebase is configured, keep the user on the login screen
            // instead of silently opening an old local database.
          }

        } finally {

          if (button) {
            button.disabled = false;
          }
        }
      }
    );
  }

  /* ---------------------------------------------------------
     FORGOT PASSWORD
  --------------------------------------------------------- */

  window.forgotPassword =
    async function () {

      const emailBox =
        document.getElementById(
          'loginEmail'
        );

      const email =
        (
          emailBox?.value || ''
        )
          .trim()
          .toLowerCase();

      if (!email) {

        safeToast(
          'Enter your registered email first.',
          'error'
        );

        emailBox?.focus();

        return;
      }

      try {

        if (!cloudReady()) {
          throw new Error(
            'Firebase is not connected.'
          );
        }

        await window.firebaseAuth
          .sendPasswordResetEmail(
            email
          );

        safeToast(
          'Password reset link sent to your email.',
          'success'
        );

      } catch (error) {

        console.error(error);

        safeToast(
          'Could not send reset email. Check the registered email.',
          'error'
        );
      }
    };

  /* ---------------------------------------------------------
     LOAD CLOUD DATA
  --------------------------------------------------------- */

  async function loadCloudState() {

    if (!cloudReady()) return;

    try {

      const snapshot =
        await window.firebaseDb
          .collection('library')
          .doc('state')
          .get();

      if (
        snapshot.exists &&
        snapshot.data()?.data &&
        (typeof window.getLibraryDB === 'function' || window.db)
      ) {

        const cloud =
          snapshot.data().data;

        if (
          Array.isArray(cloud.users) &&
          Array.isArray(cloud.books)
        ) {

          if (typeof window.setLibraryDB === 'function') {
            window.setLibraryDB(cloud);
          } else {
            window.db = cloud;
            localStorage.setItem(
              'munvarSmartLibraryV3',
              JSON.stringify(cloud)
            );
          }

          if (
            typeof window.route ===
            'function' &&
            window.currentUser
          ) {
            window.route('dashboard');
          }
        }
      }

    } catch (error) {

      console.warn(
        'Cloud state not loaded:',
        error
      );
    }
  }

  /* ---------------------------------------------------------
     START
  --------------------------------------------------------- */

  function start() {
    // Login/forgot-password bridge only.
    // Database loading is handled by script.js boot().
    installLogin();
  }

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      start
    );

  } else {

    start();
  }

})();