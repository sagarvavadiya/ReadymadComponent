import React, { useEffect, useState } from "react";

const TestComponent = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(Number(localStorage.getItem("test")) + 1);
    console.log(localStorage.getItem("test"));
  }, [window.localStorage.getItem("test")]);
  console.log("1");
  return (
    <>
      <div>TestComponent</div>
      <button
        onClick={() => localStorage.setItem("test", `${Number(value) + 1}`)}
      >
        Change local storage
      </button>
    </>
  );
};

export default TestComponent;
