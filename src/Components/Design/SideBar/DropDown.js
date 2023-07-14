import React, { useState } from "react";
import { MenuItems as MenuItemsData } from "./ManuItem";
import "./DropDown.css";
const DropDown = () => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState([]);
  const [openChildSubmenu, setOpenChildSubmenu] = useState([]);
  const [MenuItems, setMenuItems] = useState(MenuItemsData);

  const test = () => {
    setOpenSubmenu(openSubmenu.filter((i) => i != 1));
  };

  const manageCheckStateForManu = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = MenuItems.map((item) => {
        return {
          ...item,
          isChecked: checked,
          submenu: item?.submenu?.map((subItem) => ({
            ...subItem,
            isChecked: checked,
          })),
        };
      });
      setMenuItems(tempUser);
    } else {
      let selectMenuArray = MenuItems.filter(
        (item) => item.title === name
      )[0]?.submenu?.map((item) => {
        return { ...item, isChecked: checked };
      });

      let tempUser = MenuItems.map((item) =>
        item.title === name
          ? { ...item, isChecked: checked, submenu: selectMenuArray }
          : item
      );

      setMenuItems(tempUser);
    }
  };

  const manageCheckStateForSubManu = (e) => {
    const { name, checked, id } = e.target;

    let tempSubManu = MenuItems[id].submenu.map((item) =>
      item.title === name ? { ...item, isChecked: checked } : item
    );

    let tempManu = MenuItems.map((item, index) =>
      index === Number(id) ? { ...item, submenu: tempSubManu } : item
    );

    setMenuItems(tempManu);

    // if (!tempManu[id]?.submenu?.some((item) => item?.isChecked !== true)) {
    let tempUser = tempManu.map((item, index) =>
      index === Number(id) ? { ...item, isChecked: checked } : item
    );
    setMenuItems(tempUser);
  };

  return (
    <>
      <div
        className="dropdownBody"
        onBlur={() => setOpenDropDown(!openDropDown)}
      >
        <div
          className="DropdownTitle"
          onClick={() => setOpenDropDown(!openDropDown)}
        >
          <span>Dropdown</span>
          <span className={`arrowIcon ${openDropDown ? "rotate" : ""}`}>
            ▶️
          </span>
        </div>
        <div className={`dropdownContent ${openDropDown ? "" : "hide"}`}>
          <div className="manuTitle">
            <div className="manuBox">
              <span>
                <input
                  type="checkbox"
                  className="form-check-input checkboxProperty"
                  name="allSelect"
                  checked={!MenuItems.some((item) => item?.isChecked !== true)}
                  onChange={manageCheckStateForManu}
                />
                {`All`}
              </span>
            </div>{" "}
          </div>

          {MenuItems.map((manu, index) => {
            return (
              <div className="manuTitle" key={index}>
                <div className="manuBox">
                  <span>
                    <input
                      type="checkbox"
                      className="checkboxProperty"
                      name={manu?.title}
                      id=""
                      onChange={manageCheckStateForManu}
                      checked={
                        manu?.submenu
                          ? !manu?.submenu?.some(
                              (item) => item?.isChecked !== true
                            )
                          : manu.isChecked
                      }
                    />
                    {manu?.title}
                  </span>

                  {manu.submenu ? (
                    <span
                      className={`arrowIcon  ${
                        openSubmenu.includes(index) ? "rotate" : ""
                      }`}
                      onClick={() => {
                        openSubmenu.includes(index)
                          ? setOpenSubmenu(
                              openSubmenu.filter((i) => i != index)
                            )
                          : setOpenSubmenu([...openSubmenu, index]);
                      }}
                    >
                      ▶️
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                {openSubmenu.includes(index) ? (
                  manu.submenu ? (
                    <>
                      {" "}
                      {manu.submenu.map((submanu, sindex) => {
                        return (
                          <div className="submanuTitle" key={sindex}>
                            <div className="submanuBox">
                              <span>
                                <input
                                  type="checkbox"
                                  className="checkboxProperty"
                                  name={submanu.title}
                                  id={index}
                                  onChange={manageCheckStateForSubManu}
                                  checked={submanu.isChecked}
                                />
                                {submanu.title}
                              </span>

                              {submanu.childSubmanu ? (
                                <span
                                  className={`arrowIcon  ${
                                    openChildSubmenu.includes(index)
                                      ? "rotateSubmanu"
                                      : ""
                                  }`}
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
                                >
                                  ▶️
                                </span>
                              ) : (
                                ""
                              )}
                            </div>

                            <div className="submanuChildBox">
                              {openChildSubmenu.includes(sindex)
                                ? submanu.childSubmanu
                                  ? submanu.childSubmanu.map(
                                      (childSubmanu, csindex) => {
                                        return (
                                          <div
                                            className="submanuChildTitle"
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
                      })}
                    </>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>{" "}
      </div>
    </>
  );
};

export default DropDown;
