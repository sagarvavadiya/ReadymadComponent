import React, { createContext, useReducer, useState } from "react";
import Parent from "./Parent";
import { counterReducer } from "./ContextStore/counterReducer";
import { initialState } from "./ContextStore/store";
// export const StoreContext = createContext();

// Create the Context
export const CounterContext = createContext();

const UseContext = () => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <h1>
        i'm store {state.store}, I have {state.coins} Coins
      </h1>
      <Parent />
    </CounterContext.Provider>
  );
};

export default React.memo(UseContext);
