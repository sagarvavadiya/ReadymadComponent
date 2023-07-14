import React, { useContext, useState } from "react";
import { StoreContext } from "./UseContext";
const GrandChild = () => {
  const Store = useContext(StoreContext);
  console.log(Store);
  const [value, setValue] = useState(1);
  return (
    <>
      <h1>
        i'm GrandChild, {Store.store}, i also have {Store.coins} Coins
      </h1>
      <div>
        Add value :{" "}
        <input type="text" onChange={(e) => setValue(e.target.value)} />
      </div>
      <button onClick={() => Store.Plus(Number(value))}>
        Click to increase coins
      </button>
      <button onClick={() => Store.Minus(Number(value))}>
        Click to decrease coins
      </button>
    </>
  );
};

export default React.memo(GrandChild);
