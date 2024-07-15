import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDwz0Bc6MlLa3A3wxpP-Agu2dPeId10pGo",
    authDomain: "instagram-clone-react-93885.firebaseapp.com",
    projectId: "instagram-clone-react-93885",
    storageBucket: "instagram-clone-react-93885.appspot.com",
    messagingSenderId: "171220272907",
    appId: "1:171220272907:web:d7234c41e5f01392d2440e",
    measurementId: "G-468Y3G7GT5"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage, ref };
