import React, { useContext, useState } from "react";
import { CounterContext } from "./UseContext";
const GrandChild = () => {
  // const Store = useContext(StoreContext);
  const [value, setValue] = useState(1);
  const { state, dispatch } = useContext(CounterContext);
  return (
    <>
      <h1>
        i'm GrandChild, {state.store}, i also have {state.coins} Coins
      </h1>
      <div>
        Add value :{" "}
        <input type="text" onChange={(e) => setValue(e.target.value)} />
      </div>
      <button
        onClick={() => dispatch({ type: "INCREMENT", payload: value }, 10)}
      >
        Click to increase coins
      </button>
      <button onClick={() => dispatch({ type: "DECREMENT", payload: value })}>
        Click to decrease coins
      </button>
    </>
  );
};

export default React.memo(GrandChild);
