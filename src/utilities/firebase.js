import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase


export const useData = (path, transform) => {
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