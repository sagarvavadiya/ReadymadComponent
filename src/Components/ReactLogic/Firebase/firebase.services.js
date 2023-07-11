import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot ,writeBatch
} from "firebase/firestore";

export const getData = () =>{
    let getDocRef = doc (db, "Test", `testDoc`); 
   const unsub = onSnapshot(doc(db, "Test", "testDoc"), (doc) => {
        console.log("Current data: ", doc.data());
    }); 
}


export const setData = async (data) => {
  setDoc(doc(db, "Test", "testDoc"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA",
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log("Add data error: ", err);
    });
};


export const addData = async (data) => {
    addDoc(collection(db, "Test" ), {
      name: "Los Angeles", 
      info: {name:"USA", state: "CA",},
    })
      .then((res) => {
        console.log(res.id);
      })
      .catch((err) => {
        console.log("Add data Error: ", err);
      });
};


export const updateData  = (data) =>{  
  //update element of object in document
        const updateDocRef = doc (db, "Test", `CjHAb923fFO8HGVPkh4c`);
        updateDoc (updateDocRef, {
            "info.name": ["a","j"], 
          }).then((res) => {
            console.log(updateDocRef.id);
          })
          .catch((err) => {
            console.log("Update data Error: ", err);
          });;
       
}
 

export const deleteData  = (data) =>{ 
  //delete document from grandchildren collaction
    const deleteDocRef = doc (db, "Test", `testDoc`,"TestChildren","testChildren");
    deleteDoc(deleteDocRef).then((res) => {
        console.log(deleteDocRef.id);
      })
      .catch((err) => {
        console.log("Update data Error: ", err);
      });;
   
}