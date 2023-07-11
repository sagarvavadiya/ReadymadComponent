import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import UseContext from "./UseContext/UseContext";
import UseReducerHook from "./UseReducer/UseReducer";
import ReactLogicShortcut from "./ReactLogicShortcut";
import Firebase from "./Firebase/Firebase";
const ReactLogic = () => {
  return (
    <>
      <div>ReactLogic</div>
      <Router>
        <Routes>
          <Route path="/usecontext" element={<UseContext />} />
          <Route path="/usereducer" element={<UseReducerHook />} />
          <Route path="/ReactLogic" element={<ReactLogicShortcut />} />
          <Route path="/Firebase" element={<Firebase />} />
        </Routes>
      </Router>
    </>
  );
};

export default ReactLogic;
