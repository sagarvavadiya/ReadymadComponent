export const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, coins: +state.coins + +action.payload };
    case "DECREMENT":
      return { ...state, coins: +state.coins - +action.payload };
    default:
      return state;
  }
};
