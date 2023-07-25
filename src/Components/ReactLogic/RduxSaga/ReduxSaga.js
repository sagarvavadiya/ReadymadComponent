import store from "./redux/store";
import { Provider } from "react-redux";
import ReduxSagaCounter from "./reduxSagaCounter";

function ReduxSaga() {
  return (
    <Provider store={store}>
      <ReduxSagaCounter />
    </Provider>
  );
}

export default ReduxSaga;
