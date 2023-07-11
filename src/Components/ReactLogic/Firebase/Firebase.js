import React from "react";
import { db } from "./firebaseConfig";
import { addData, deleteData, getData, updateData } from "./firebase.services";
const Firebase = () => {
  // Assuming you have already initialized Firebase, e.g., firebase.initializeApp(config);

  // // Reference a specific collection
  // var collectionRef = db.collection("your_collection_name");

  // // // Retrieve all documents in the collection
  // collectionRef.get()
  //   .then(function(querySnapshot) {
  //     querySnapshot.forEach(function(doc) {
  //       // Access each document's data
  //       console.log(doc.id, " => ", doc.data());
  //     });
  //   })
  //   .catch(function(error) {
  //     console.log("Error getting documents: ", error);
  //   });

  return (
    <>
      Firebase
      <button onClick={getData}>Get data</button>
        <button onClick={addData}>Add data</button>
        <button onClick={updateData}>Update data</button>
        
        <button onClick={deleteData}>Delete data</button>
    </>
  );
};

export default Firebase;
