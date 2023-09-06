import React, { Suspense, lazy, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ReactLogicShortcut = () => {
  const [data, setData] = useState(0);
  useEffect(() => {
    // Example of fetching large data from JSONPlaceholder API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setTimeout(() => {
      setData(1);
    }, 2000);
  }, []);
  return (
    <>
      {/* {data === 0 ? (
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only" />
        </div>
      ) : ( */}
      <Suspense fallback={<div> Loading...</div>}>
        <div className="styleFont">
          <Link to={"/usereducer"}>
            <button className="btn btn-outline-dark">useReducer</button>
          </Link>
          <Link to={"/usecontext"}>
            <button className="btn btn-outline-dark">useContext</button>
          </Link>
          <Link to={"/ReduxSaga"}>
            <button className="btn btn-outline-dark">ReduxSaga</button>
          </Link>
          <Link to={"/Firebase"}>
            <button className="btn btn-outline-dark ">Firebase</button>
          </Link>
          <Link to={"/FirebaseAuth"}>
            <button className="btn btn-outline-dark ">FirebaseAuth</button>
          </Link>
          <Link to={"/ScreenShotPage"}>
            <button className="btn btn-outline-dark ">ScreenShotPage</button>
          </Link>
        </div>
      </Suspense>
      {/* )} */}
    </>
  );
};

export default ReactLogicShortcut;
