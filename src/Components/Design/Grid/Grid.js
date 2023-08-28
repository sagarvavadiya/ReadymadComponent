import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "./Grid.css";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const data = [
  "cannot",
  "valid",
  "provide",
  "Learn",
  "accessible.",
  "button",
  "cannot",
  "cannot",
  "valid",
  "provide",
  "Learn",
];

const data2 = ["cannot", "valid", "provide", "Learn"];

var today = new Date();

var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

export default function GridStyle() {
  const [time, setTime] = React.useState();
  const d = new Date();
  let seconds = d.getSeconds();
  const [counter, setcounter] = React.useState(seconds);

  React.useEffect(() => {
    setTimeout(() => {
      const d = new Date();
      let seconds = d.getSeconds();
      setcounter(seconds);
    }, 1000);
  }, [counter]);

  return (
    <div style={{ display: "flex" }}>
      <div
        className="elementBox"
        style={{ margin: "4vw 0", width: "50%", border: "red solid" }}
      >
        {data.map((i) => {
          return <div className="element">{i}</div>;
        })}
      </div>

      <div
        className="elementBox"
        style={{ margin: "4vw 0", width: "50%", border: "red solid" }}
      >
        {data2.map((i) => {
          return <div className="element2">{counter}</div>;
        })}
      </div>
    </div>
  );
}
