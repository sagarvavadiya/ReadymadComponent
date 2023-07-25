import React, { useEffect, useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
const LazyLoadingRoute = () => {
  const UseContext = React.lazy(() =>
    import("./ReactLogic/UseContext/UseContext")
  );
  const ReduxSaga = React.lazy(() => import("./ReactLogic/RduxSaga/ReduxSaga"));

  const ReactLogicShortcut = React.lazy(() =>
    import("./ReactLogic/ReactLogicShortcut")
  );
  const ComponentTestNavbar = React.lazy(() => import("./ComponentTestNavbar"));
  const Pagination = React.lazy(() => import("./Design/Pagination/Pagination"));
  const DropDown = React.lazy(() => import("./Design/SideBar/DropDown"));
  const AllRegulations = React.lazy(() =>
    import("./Design/DataTable/ReactDataTable")
  );
  const UseReducerHook = React.lazy(() =>
    import("./ReactLogic/UseReducer/UseReducer")
  );
  const Firebase = React.lazy(() => import("./ReactLogic/Firebase/Firebase"));
  const ReactDesignComponent = React.lazy(() => import("./Design/ReactDesign"));
  const MuiGrid = React.lazy(() => import("./Design/Grid/MuiGrid"));
  // const FirebaseAuth = React.lazy(() =>
  //   import("./ReactLogic/Firebase/UserAuthentication/FirebaseAuth")
  // );
  return (
    <>
      <Suspense
        fallback={
          <div
            class="spinner-border text-primary"
            style={{
              margin: "0px auto !important",
              position: "absolute",
              left: "50%",
              top: "50%",
            }}
            role="status"
          >
            <span class="sr-only" />
          </div>
        }
      >
        <Router>
          <Routes>
            <Route path="/usecontext" element={<UseContext />} />
            <Route path="/ReduxSaga" element={<ReduxSaga />} />
            <Route path="/usereducer" element={<UseReducerHook />} />
            <Route path="/ReactLogic" element={<ReactLogicShortcut />} />
            <Route path="/Firebase" element={<Firebase />} />
            <Route path="/" element={<ComponentTestNavbar />} />
            <Route path="/muigrid" element={<MuiGrid />} />
            <Route path="/AllRegulations" element={<AllRegulations />} />
            <Route path="/ReactDesign" element={<ReactDesignComponent />} />
            <Route path="/DropDown" element={<DropDown />} />
            <Route path="/Pagination" element={<Pagination />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  );
};

export default LazyLoadingRoute;
