import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAXFxgRVIZXPztWLmq_xSFm7J_3m-uH5eI",
    authDomain: "test-ef6c0.firebaseapp.com",
    projectId: "test-ef6c0",
    storageBucket: "test-ef6c0.appspot.com",
    messagingSenderId: "134767382712",
    appId: "1:134767382712:web:94989969ca5ab737be244d",
    measurementId: "G-RTLJ5XCEYY"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const db = getFirestore(app)

export default function handleFileUpload(file:any) {
    return new Promise((resolve, reject) => {
 
      const storageRef = ref(storage, `images/${file.name}`);
  

      uploadBytes(storageRef, file).then(() => {
        console.log("File uploaded successfully");
  
    
        getDownloadURL(storageRef).then((url) => {
       
          resolve(url);
        }).catch((error) => {
          console.error(error);
          reject(error);
        });
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });
}
