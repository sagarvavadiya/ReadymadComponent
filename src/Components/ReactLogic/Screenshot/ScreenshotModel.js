import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ScreenShotModel({
  show,
  handleClose,
  handleShow,
  image,
  timestamp,
  memo,
}) {
  const ApiResponse = {
    id: 1,
    screenshot: image,
    description: memo,
    time: timestamp,
  };

  const SaveDataInStorage = (data) => { 
    if (image) {
      if (
        ![undefined, "undefined", null].includes(
          localStorage.getItem("ScreenshotGallary")
        )
      ) {
        console.log("ScreenshotGallary");
        const tempArray = JSON.parse(localStorage.getItem("ScreenshotGallary"));

        tempArray.push(data);
        tempArray?.length > 5
          ? console.log("")
          : data[0]?.screenshot ||
            data?.screenshot ||
            data?.screenshot != "undefined"
          ? localStorage.setItem("ScreenshotGallary", JSON.stringify(tempArray))
          : console.log("");
      } else {
        console.log("not ScreenshotGallary");
        const tempArray = [];
        tempArray.push(data);
        localStorage.setItem("ScreenshotGallary", JSON.stringify(tempArray));
      }
    }
  };
  useEffect(() => {
    if (show) {
      console.log(ApiResponse);
      SaveDataInStorage(ApiResponse);
    }
  }, [show]);
  return (
    <>
      {image ? (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>ScreenShot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <div>
             
              <img
                style={{ width: `100%` }}
                src={image[0] ?? image[0]}
                alt=""
              />{" "}
              <br />
              <img
                style={{ width: `100%` }}
                src={image[1] ?? image[1]}
                alt=""
              />
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}

export default ScreenShotModel;
