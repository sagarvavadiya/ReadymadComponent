import React, { useState } from "react";
import { MenuItems as MenuItemsData } from "./ManuItem";
import "./sidbar.css";
const SideBar = () => {
  const [submanu, setSubmanu] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState([]);
  const [openChildSubmenu, setOpenChildSubmenu] = useState([]);
  const [MenuItems, setMenuItems] = useState(MenuItemsData);

  console.log(openSubmenu, openChildSubmenu);
  const test = () => {
    setOpenSubmenu(openSubmenu.filter((i) => i != 1));
  };

  const manageCheckStateForManu = (e) => {
    const { name, checked } = e.target;
    console.log(name, checked);
    if (name === "allSelect") {
      let tempUser = MenuItems.map((item) => {
        return { ...item, isChecked: checked };
      });
      setMenuItems(tempUser);
    } else {
      let tempUser = MenuItems.map((item) =>
        item.title === name ? { ...item, isChecked: checked } : item
      );
      setMenuItems(tempUser);
      console.log("tempUser", tempUser);
    }
  };

  const manageCheckStateForSubManu = (e) => {
    const { name, checked, data } = e.target;
    console.log(name, checked, data);
    // if (name === "allSelect") {
    //   let tempUser = MenuItems.map((item) => {
    //     return { ...item, isChecked: checked };
    //   });
    //   setMenuItems(tempUser);
    // } else {
    //   let tempUser = MenuItems[index].submenu.map((item) =>
    //     item.title === name ? { ...item, isChecked: checked } : item
    //   );
    //   console.log("tempUser", tempUser);
    //   // setMenuItems(tempUser);
    // }
  };

  console.log(MenuItems);
  return (
    <>
      <div>
        <div className="manuTitle">
          <div className="manuBox">
            <span>
              <input
                type="checkbox"
                className="form-check-input"
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
                    name={manu.title}
                    id=""
                    onChange={manageCheckStateForManu}
                    checked={manu.isChecked}
                    onClick={() => console.log(manu)}
                  />
                  {manu.title}
                </span>

                {manu.submenu ? (
                  <button
                    className={`btn btn-outline-success ${
                      openSubmenu.includes(index) ? "rotate" : ""
                    }`}
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
                                name={submanu.title}
                                data={{
                                  name: submanu.title,
                                  checked: submanu.isChecked,
                                  index: index,
                                }}
                                id=""
                                onChange={manageCheckStateForSubManu}
                                checked={submanu.isChecked}
                                onClick={() => console.log(submanu)}
                              />
                              {submanu.title}
                            </span>

                            {submanu.childSubmanu ? (
                              <button
                                className={`btn btn-outline-danger ${
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
      </div>
    </>
  );
};

export default SideBar;
