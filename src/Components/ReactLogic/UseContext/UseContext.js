import React, { createContext, useContext, useState } from "react";
import Parent from "./Parent";

export const StoreContext = createContext();
const UseContext = () => {
  const [store, setStore] = useState("i use context api");
  const [coins, setCoins] = useState(0);
  const Plus = () => {
    setCoins(coins + 1);
  };
  const Minus = () => {
    setCoins(coins - 1);
  };

  return (
    <StoreContext.Provider
      value={{ store, setStore, setCoins, coins, Minus, Plus }}
    >
      <h1>
        i'm store {store}, I have {coins} Coins
      </h1>
      <Parent />
    </StoreContext.Provider>
  );
};

export default UseContext;
