import React, { useState } from "react";
import { MenuItems } from "./ManuItem";
import "./sidbar.css";
const SideBar = () => {
  const [submanu, setSubmanu] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState([]);
  const [openChildSubmenu, setOpenChildSubmenu] = useState([]);

  console.log(openSubmenu, openChildSubmenu);
  const test = () => {
    setOpenSubmenu(openSubmenu.filter((i) => i != 1));
  };
  return (
 
    <>
      <div>
        {MenuItems.map((manu, index) => {
          return (
            <div className="manuTitle" key={index}>
              <div className="manuBox">
                {manu.title}
                {manu.submenu ? (
                  <button
                    className="btn btn-outline-success"
                    onClick={() => {
                      openSubmenu.includes(index)
                        ? setOpenSubmenu(openSubmenu.filter((i) => i != index))
                        : setOpenSubmenu([...openSubmenu, index]);
                    }}
                  >
                    {`>`}{" "}
                  </button>
                ) : (
                  ""
                )}
              </div>

              {openSubmenu.includes(index)
                ? manu.submenu
                  ? manu.submenu.map((submanu, sindex) => {
                      return (
                        <div className="submanuTitle" key={sindex}>
                          <div className="submanuBox">
                            {submanu.title}
                            {submanu.childSubmanu ? (
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                  openChildSubmenu.includes(sindex)
                                    ? setOpenChildSubmenu(
                                        openChildSubmenu.filter(
                                          (i) => i != sindex
                                        )
                                      )
                                    : setOpenChildSubmenu([
                                        ...openChildSubmenu,
                                        sindex,
                                      ]);
                                }}
                              >{`>`}</button>
                            ) : (
                              ""
                            )}
                          </div>

                          <div>
                            {openChildSubmenu.includes(sindex)
                              ? submanu.childSubmanu
                                ? submanu.childSubmanu.map(
                                    (childSubmanu, csindex) => {
                                      return (
                                        <div
                                          className="submanuTitle"
                                          key={csindex}
                                        >
                                          {childSubmanu.title}
                                        </div>
                                      );
                                    }
                                  )
                                : ""
                              : ""}
                          </div>
                        </div>
                      );
                    })
                  : ""
                : ""}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SideBar;
