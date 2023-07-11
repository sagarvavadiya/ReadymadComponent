import "./DropDown.css";

import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect() {
  const [option, setOption] = React.useState(false);
  let dropdownContent = option === true ? "block" : "none";
  return (
    <div style={{ margin: "4vw 0" }}>
      <div class="dropdown">
        <button
          class="dropbtn"
          onClick={() => {
            setOption(option === true ? false : true);
          }}
        >
          Select
          <img
            className="downArrow"
            src="https://www.iconpacks.net/icons/2/free-arrow-down-icon-3101-thumb.png"
            alt=""
          />
        </button>
        <div class={"dropdown-content"} style={{ display: dropdownContent }}>
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
          <a href="#">Link 3</a>
        </div>
      </div>
    </div>
  );
}
