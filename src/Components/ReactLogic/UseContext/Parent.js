import React from "react";
import Child from "./Child";

const Parent = () => {
  console.log("Parent");
  return (
    <>
      <h1>Parent</h1>
      <Child />
    </>
  );
};

export default React.memo(Parent);
