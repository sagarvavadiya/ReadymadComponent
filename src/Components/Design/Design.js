import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import MuiGrid from "./Grid/MuiGrid";
import ReactDesignComponent from "./ReactDesign";
import AllRegulations from "../Design/DataTable/ReactDataTable";
import { Link } from "react-router-dom";
import Pagination from "./Pagination/Pagination";
import DropDown from "./SideBar/DropDown";
const ReactDesign = () => {
  return (
    <>
      <div>ReactDesign</div>

      <Router>
        <Routes>
          <Route path="/muigrid" element={<MuiGrid />} />
          <Route path="/AllRegulations" element={<AllRegulations />} />
          <Route path="/ReactDesign" element={<ReactDesignComponent />} />
          <Route path="/DropDown" element={<DropDown />} />
          <Route path="/Pagination" element={<Pagination />} />
        </Routes>
      </Router>
    </>
  );
};

export default ReactDesign;
