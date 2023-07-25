// Counter.js

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./redux/action";

const ReduxSagaCounter = () => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
};

export default ReduxSagaCounter;
