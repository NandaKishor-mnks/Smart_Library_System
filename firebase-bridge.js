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

    const email = String(window.firebaseAuth.currentUser.email || '').trim().toLowerCase();
    const localDB =
      typeof window.getLibraryDB === 'function'
        ? window.getLibraryDB()
        : window.db;

    let cloud = null;

    try {
      const snapshot = await window.firebaseDb
        .collection('library')
        .doc('state')
        .get({ source: 'server' });

      if (snapshot.exists && snapshot.data()?.data) {
        cloud = snapshot.data().data;
      }
    } catch (error) {
      console.warn('Firestore library/state read failed:', error);
    }

    /*
     * IMPORTANT:
     * Older versions of this project created the account in browser
     * localStorage but did not put the newly-created user into Firestore.
     * That is why Firebase Auth could succeed while library/state did not
     * contain the account.
     *
     * When that happens, migrate the local profile into the cloud database
     * once. After the migration, every phone/laptop uses library/state.
     */
    if (!cloud || !Array.isArray(cloud.users) || !Array.isArray(cloud.books)) {
      if (
        localDB &&
        Array.isArray(localDB.users) &&
        Array.isArray(localDB.books)
      ) {
        cloud = structuredClone(localDB);
      } else {
        throw new Error('Firestore library/state was not found and no local library database is available.');
      }
    }

    if (!Array.isArray(cloud.users)) cloud.users = [];
    if (!Array.isArray(cloud.books)) cloud.books = [];
    if (!Array.isArray(cloud.students)) cloud.students = [];
    if (!Array.isArray(cloud.loans)) cloud.loans = [];
    if (!Array.isArray(cloud.notifications)) cloud.notifications = [];
    if (!Array.isArray(cloud.audit)) cloud.audit = [];

    let cloudUser = cloud.users.find(
      u => String(u.email || '').trim().toLowerCase() === email
    );

    /*
     * If the profile exists only in this browser, migrate it.
     */
    if (!cloudUser && localDB && Array.isArray(localDB.users)) {
      const local = localDB.users.find(
        u => String(u.email || '').trim().toLowerCase() === email
      );

      if (local) {
        cloudUser = { ...local };
        delete cloudUser.password;
        cloudUser.uid = window.firebaseAuth.currentUser.uid;

        cloud.users.push(cloudUser);

        if (String(local.role || '').toLowerCase() === 'student') {
          const localStudent = (localDB.students || []).find(
            s =>
              String(s.studentId || '').toLowerCase() ===
              String(local.studentId || '').toLowerCase()
          );

          if (
            localStudent &&
            !cloud.students.some(
              s =>
                String(s.studentId || '').toLowerCase() ===
                String(localStudent.studentId || '').toLowerCase()
            )
          ) {
            cloud.students.push({ ...localStudent });
          }
        }

        console.log('Firebase: migrated local account into library/state');
      }
    }

    /*
     * Also try the dedicated Firestore collections created by older
     * versions of the bridge. This lets an account recover even when
     * library/state itself does not contain the profile.
     */
    if (!cloudUser) {
      const collections = [
        ['students', 'student'],
        ['teachers', 'teacher'],
        ['admins', 'admin']
      ];

      for (const [collectionName, role] of collections) {
        try {
          const snap = await window.firebaseDb
            .collection(collectionName)
            .where('email', '==', email)
            .limit(1)
            .get();

          if (!snap.empty) {
            const profile = snap.docs[0].data() || {};
            cloudUser = {
              ...profile,
              email,
              role: profile.role || role,
              uid: window.firebaseAuth.currentUser.uid,
              id: profile.id ?? window.firebaseAuth.currentUser.uid
            };
            delete cloudUser.password;
            cloud.users.push(cloudUser);

            if (role === 'student' && profile.studentId) {
              if (!cloud.students.some(
                s => String(s.studentId) === String(profile.studentId)
              )) {
                cloud.students.push({
                  id: profile.studentRecordId || profile.id || Date.now(),
                  studentId: profile.studentId,
                  name: profile.name || '',
                  department: profile.department || '',
                  semester: profile.semester || '',
                  mobile: profile.mobile || '',
                  email,
                  joined: profile.joined || new Date().toISOString().slice(0, 10)
                });
              }
            }

            break;
          }
        } catch (error) {
          console.warn(`Could not query ${collectionName}:`, error);
        }
      }
    }

    if (!cloudUser) {
      throw new Error(
        'Firebase login succeeded, but no library profile was found for this email. ' +
        'Create the account from this app once, or sign in on the device where the account was created.'
      );
    }

    cloudUser.uid = window.firebaseAuth.currentUser.uid;

    /*
     * Write the migrated/updated state back to Firestore. This is the
     * critical step that makes the account available on other devices.
     */
    await window.firebaseDb
      .collection('library')
      .doc('state')
      .set({
        data: cloud,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

    if (typeof window.setLibraryDB === 'function') {
      window.setLibraryDB(cloud);
    } else {
      window.db = cloud;
      localStorage.setItem(
        'munvarSmartLibraryV3',
        JSON.stringify(cloud)
      );
    }

    console.log('Firebase: authoritative library database loaded/migrated after login');
    return cloud;
  }

  /* ---------------------------------------------------------
     FIREBASE LOGIN
  --------------------------------------------------------- */

  async function firebaseLogin(email, password) {
    if (!cloudReady()) return false;

    try {
      const credential =
        await window.firebaseAuth.signInWithEmailAndPassword(email, password);

      const cloud = await loadCloudStateAfterAuth();

      const cloudUser = cloud.users.find(
        u =>
          String(u.email || '').trim().toLowerCase() ===
          String(email).trim().toLowerCase()
      );

      if (!cloudUser) {
        throw new Error('Library profile could not be linked to this Firebase account.');
      }

      openWithUser({
        ...cloudUser,
        uid: credential.user.uid,
        id: cloudUser.id ?? credential.user.uid
      });

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
     FIREBASE ACCOUNT CREATION
     New student/teacher accounts are created in Firebase Auth first,
     then their library profile is saved to library/state.
  --------------------------------------------------------- */

  window.createFirebaseAccount = async function(email, password) {
    if (!cloudReady()) return null;

    try {
      const credential =
        await window.firebaseAuth.createUserWithEmailAndPassword(
          email,
          password
        );

      return credential.user;
    } catch (error) {
      /*
       * If the Auth account already exists, do not silently create a
       * different account. The caller can show the real Firebase error.
       */
      throw error;
    }
  };

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