// sagas.js

import { takeEvery, put } from "redux-saga/effects";
import { incrementAsync, decrementAsync } from "./action";

function* incrementSaga() {
  yield put(incrementAsync());
}

function* decrementSaga() {
  yield put(decrementAsync());
}

function* watchIncrement() {
  yield takeEvery("INCREMENT", incrementSaga);
}

function* watchDecrement() {
  yield takeEvery("DECREMENT", decrementSaga);
}

export default function* rootSaga() {
  yield watchIncrement();
  yield watchDecrement();
}
