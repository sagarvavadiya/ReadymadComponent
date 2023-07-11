import React, { useContext } from "react";
import { StoreContext } from "./UseContext";
const GrandChild = () => {
  const Store = useContext(StoreContext);
  console.log(Store);
  return (
    <>
      <h1>
        i'm GrandChild, {Store.store}, i also have {Store.coins} Coins
      </h1>
      <button onClick={Store.Plus}>Click to increase coins</button>
      <button onClick={Store.Minus}>Click to decrease coins</button>
    </>
  );
};

export default GrandChild;
