const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        apiKey: "AIzaSyDummyKeyForBuildOnly12345",
        authDomain: "kinosync-demo.firebaseapp.com",
        projectId: "kinosync-demo",
        storageBucket: "kinosync-demo.appspot.com",
        messagingSenderId: "1234567890",
        appId: "1:1234567890:web:abcdef123456"
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'kinosync-watch-party';