import React from "react";
import GrandChild from "./GrandChild";

const Child = () => {
  console.log("Child");
  return (
    <>
      <h1>Child</h1>
      <GrandChild />
    </>
  );
};

export default React.memo(Child);
