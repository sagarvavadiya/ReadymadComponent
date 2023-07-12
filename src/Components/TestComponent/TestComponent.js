import React, { useEffect, useState } from "react";

const TestComponent = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(Number(localStorage.getItem("test")) + 1);
  }, [window.localStorage.getItem("test")]);

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
