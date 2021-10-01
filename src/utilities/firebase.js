import { initializeApp } from 'firebase/app';
import { useState, useEffect } from 'react';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { 
  getAuth, 
  GoogleAuthProvider, 
  onIdTokenChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCFSsh4YUAQPFUj2vXL8BC72jBxFsJqQ34",
  authDomain: "scheduler-katie.firebaseapp.com",
  databaseURL: "https://scheduler-katie-default-rtdb.firebaseio.com",
  projectId: "scheduler-katie",
  storageBucket: "scheduler-katie.appspot.com",
  messagingSenderId: "865580411200",
  appId: "1:865580411200:web:3ba4920c1c42e3a7d8b2a5",
  measurementId: "G-J5CEZMET1H"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (devMode) { console.log(`loading ${path}`); }
    return onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (devMode) { console.log(val); }
      setData(transform ? transform(val) : val);
      setLoading(false);
      setError(null);
    }, (error) => {
      setData(null);
      setLoading(false);
      setError(error);
    });
  }, [path, transform]);

  return [data, loading, error];
};

const setData = (path, value) => (
  set(ref(database, path), value)
);

const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};


export { useData, setData, signInWithGoogle, firebaseSignOut as signOut, useUserState };