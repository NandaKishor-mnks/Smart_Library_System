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
    const users = Array.isArray(window.db?.users) ? window.db.users : [];

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
      const db = window.db;

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
     KEEP EXISTING saveDB FUNCTION
  --------------------------------------------------------- */

  const originalSaveDB = window.saveDB;

  window.saveDB = function () {

    const result =
      originalSaveDB?.apply(this, arguments);

    /*
      LocalStorage remains the immediate cache.
      Firebase sync happens separately.
    */

    if (cloudReady() && window.currentUser) {
      setTimeout(() => {
        syncDatabaseToFirebase();
      }, 100);
    }

    return result;
  };

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
     FIREBASE LOGIN
  --------------------------------------------------------- */

  async function firebaseLogin(email, password) {

    if (!cloudReady()) return false;

    try {

      const credential =
        await window.firebaseAuth
          .signInWithEmailAndPassword(
            email,
            password
          );

      const existingUser =
        localUser(email);

      if (existingUser) {
        openWithUser(existingUser);
      } else {

        const firebaseUser =
          credential.user;

        openWithUser({
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name:
            firebaseUser.displayName ||
            email.split('@')[0],
          role: 'student',
          active: true
        });
      }

      await syncDatabaseToFirebase();

      return true;

    } catch (error) {

      console.warn(
        'Firebase login:',
        error
      );

      /*
        First login of an existing demo/local account.
      */

      const local =
        localPass(email, password);

      if (local) {

        try {

          const credential =
            await window.firebaseAuth
              .createUserWithEmailAndPassword(
                email,
                password
              );

          if (credential.user) {

            await credential.user
              .updateProfile({
                displayName:
                  local.name || ''
              })
              .catch(() => {});

            openWithUser({
              ...local,
              uid: credential.user.uid,
              id: credential.user.uid
            });

            await syncDatabaseToFirebase();

            return true;
          }

        } catch (createError) {

          if (
            createError?.code ===
            'auth/email-already-in-use'
          ) {

            try {

              const login =
                await window.firebaseAuth
                  .signInWithEmailAndPassword(
                    email,
                    password
                  );

              openWithUser({
                ...local,
                uid: login.user.uid,
                id: login.user.uid
              });

              await syncDatabaseToFirebase();

              return true;

            } catch (loginError) {
              console.warn(loginError);
            }
          }
        }
      }

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

            const local =
              localPass(
                email,
                password
              );

            if (local) {
              openWithUser(local);
            } else {
              safeToast(
                'Invalid email or password.',
                'error'
              );
            }
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
        window.db
      ) {

        const cloud =
          snapshot.data().data;

        if (
          Array.isArray(cloud.users) &&
          Array.isArray(cloud.books)
        ) {

          window.db = cloud;

          localStorage.setItem(
            'munvarSmartLibraryV3',
            JSON.stringify(cloud)
          );

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

    installLogin();

    setTimeout(() => {

      loadCloudState();

    }, 1200);
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