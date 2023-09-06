import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
//i18n

import html2canvas from "html2canvas";
import axios from "axios";
import { useEffect } from "react";
import ScreenShotModel from "./ScreenshotModel";

let coort = {
  x: 0,
  y: 0,
};

const ScreenShotPage = (props) => {
  const [screnshot, setScreenShot] = useState();
  const ScreenData = ![undefined, "undefined", null].includes(
    localStorage.getItem("ScreenshotGallary")
  )
    ? JSON.parse(localStorage.getItem("ScreenshotGallary"))
    : [];
  const [screnshotGallary, setScreenShotGallary] = useState(ScreenData);
  const [screen, setScreen] = useState(
    localStorage.getItem("screen") ? localStorage.getItem("screen") : "all"
  );
  const [show, setShow] = useState(false);
  const [memo, setMemo] = useState(
    localStorage.getItem("memo") ? localStorage.getItem("memo") : ""
  );
  const [timestamp, setTimestamp] = useState();
  const [start, setStart] = useState(localStorage.getItem("start"));
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [activeScreen, setActiveScreen] = useState("");

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      coort.x = event.clientX;
      coort.y = event.clientY;

      setCoords(event.clientX);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, [coords, show, coort.x]);

  // console.log(coords)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function captureScreen() {
    html2canvas(document.body).then(function (canvas) {
      // Convert the canvas to an image and open it in a new tab
      var screenshot = canvas.toDataURL();
      var link = document.createElement("a");
      link.href = screenshot;
      link.target = "_blank";
      link.download = "screenshot.png";
      link.click();
    });
  }

  const canIRun = navigator.mediaDevices.getDisplayMedia;

  // const takeDesktopScreenShotFromFrontEnd = async () => {
  //   const stream = await navigator.mediaDevices.getDisplayMedia({
  //     video: {
  //       mediaSource: "screen",
  //       cursor: "never", // Hide cursor to avoid user interaction
  //     },
  //     // preferCurrentTab: true,
  //   });
  //   console.log("stream==>", stream);
  //   const track = stream.getVideoTracks()[0];
  //   const imageCapture = new ImageCapture(track);
  //   const bitmap = await imageCapture.grabFrame();
  //   track.stop();

  //   const canvas = document.createElement("canvas");
  //   canvas.width = bitmap.width;
  //   canvas.height = bitmap.height;
  //   const context = canvas.getContext("2d");
  //   context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
  //   const image = canvas.toDataURL("image/jpeg");

  //   const res = await fetch(image);
  //   const buff = await res.arrayBuffer();
  //   const file = [
  //     new File([buff], `photo_${new Date()}.jpg`, {
  //       type: "image/jpeg",
  //     }),
  //   ];
  //   console.log("file", file);
  //   setScreenShot(file[0]);
  //   return file;
  // };

  // Call the function to start recording
  const TakeScreenShot = async (event) => {
    console.log(123);
    await axios
      .get("http://localhost:5020")
      .then((response) => {
        localStorage.setItem("bufferImg", response.data.image);
        setTimestamp(new Date().getTime());

        if (screen == "all") {
          setScreenShot(response.data.image);
          console.log(screen);
        } else if (screen == "active") {
          console.log("response.data.image", response.data.image);
          const ActiveScreenIndex = axios.get(
            "http://127.0.0.1:8000/ActiveScreenIndex",
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
          ActiveScreenIndex.then((data) => {
            console.log(
              "activeScreen+++++++++++++++++++",
              response.data.image[+data.data.Active_Screen_Index || 0]
            );
            setScreenShot([
              response.data.image[+data.data.Active_Screen_Index || 0],
            ]);
          });
        }

        localStorage.setItem("image", JSON.stringify(response.data.image));
        setShow(true);
      })
      .catch((error) => console.log(error));
  };

  const StartScreenshot = () => {
    if (start == "off") {
      setStart("on");
      localStorage.setItem("start", "on");
    } else {
      setStart("off");
      localStorage.removeItem("screen");
      localStorage.setItem("start", "off");
    }
  };

  useEffect(() => {
    let StartFunction;
    if (localStorage.getItem("start") == "on") {
      StartFunction = setInterval(() => {
        TakeScreenShot();
      }, 5000);
    }

    return () => {
      clearInterval(StartFunction);
    };
  }, [start]);

  if (show) {
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }
  const handleChange = (e) => {
    setScreen(e.target.name);
    localStorage.setItem("screen", e.target.name);
  };

  const MemoStore = (e) => {
    setMemo(e.target.value);
    localStorage.setItem("memo", e.target.value);
  };

  // ------------------------------------------------------------------===============================---------------------
  useEffect(() => {
    if (
      ![undefined, "undefined", null].includes(
        localStorage.getItem("ScreenshotGallary")
      )
    ) {
      setScreenShotGallary(
        JSON.parse(localStorage.getItem("ScreenshotGallary"))
      );
    }
  }, [show]);
  return (
    <React.Fragment>
      <div className="vertical-menu ">
        {/* <div className="navbar-brand-box">
          <div className={`${start == "on" ? "displayNone" : ""}`}>
            <div className="flexEvenly mt-2" onClick={handleChange}>
              <div className="flexCenter">
                <input
                  type="radio"
                  checked={screen == "active"}
                  name="active"
                  id=""
                  onChange={handleChange}
                />{" "}
                <span className="text-light">&nbsp;Active</span>
              </div>
              <div className="flexCenter">
                <input
                  type="radio"
                  checked={screen == "all"}
                  name="all"
                  id=""
                  onChange={handleChange}
                />{" "}
                <span className="text-light">&nbsp;Both</span>
              </div>
            </div>
          </div>
        </div> */}

        <div className="sidebar-background"></div>
      </div>
      <div className="p-4">
        <div className="form-group row">
          <label
            for="inputEmail3"
            className="col-sm-2 col-form-label"
            onDoubleClick={() => localStorage.removeItem("ScreenshotGallary")}
          >
            Memo
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputEmail3"
              value={memo}
              placeholder="Write memo here..."
              onChange={MemoStore}
              maxLength={20}
            />
          </div>
        </div>
        <br />

        <fieldset className={`${start == "on" ? "displayNone" : "form-group"}`}>
          <div className="row">
            <legend className="col-form-label col-sm-2 pt-0">
              Choose preferance for Screenshot
            </legend>
            <div className="col-sm-10">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="gridRadios1"
                  value="option1"
                  checked={screen == "active"}
                  name="active"
                  onChange={handleChange}
                />
                <label className="form-check-label" for="gridRadios1">
                  Active
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="gridRadios2"
                  value="option2"
                  checked={screen == "all"}
                  name="all"
                  onChange={handleChange}
                />
                <label className="form-check-label" for="gridRadios2">
                  Both
                </label>
              </div>
            </div>
          </div>
        </fieldset>
        <br />

        <div className="form-group row">
          <div className="col-sm-10">
            <button
              className={`btn ${start == "on" ? "btn-dark" : "btn-success"}`}
              onClick={StartScreenshot}
              // onClick={takeDesktopScreenShotFromFrontEnd}
            >
              {`${start == "on" ? "Stop" : "Start"}`}
            </button>
          </div>
        </div>
      </div>

      <div className="screenshotGridBox">
        {screnshotGallary?.map((i) => {
          return (
            <>
              <div className="screenshotGridBox2 FlexCol">
                <div className="Flex">
                  {i?.screenshot?.map((p) => {
                    return (
                      <div className="card" style={{ width: "18rem" }}>
                        <img
                          className="card-img-top"
                          src={p}
                          alt="Card image cap"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="card-body">
                  <p className="card-text FlexBetween">
                    <div>{i?.description}</div>
                    <div>{`${new Date(i?.time).toDateString()}`}</div>
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <ScreenShotModel
        image={screnshot}
        handleShow={handleShow}
        handleClose={handleClose}
        show={show}
        memo={memo}
        timestamp={timestamp}
      />
    </React.Fragment>
  );
};

export default ScreenShotPage;
