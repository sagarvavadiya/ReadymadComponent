import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { Data } from "./Data";
import { Link } from "react-router-dom";
import GridStyle from "./Grid";
const Index = () => {
  let columns = [
    {
      field: "image",
      headerName: "Name",
      width: 130,
      renderCell: (params) => (
        <>
          <Avatar src={params.row.image} />{" "}
          <p className="uname" style={{ margin: "auto" }}>
            {params.row.name}
          </p>
        </>
      ),
    },
    { field: "username", headerName: "Username", width: 130 },
    { field: "email", headerName: "Email", width: 100 },
    { field: "phoneNumber", headerName: "Phone number", width: 160 },
    { field: "bio", headerName: "Bio", width: 130 },
    { field: "country", headerName: "Country", width: 90 },
    {
      field: "verification",
      headerName: "Verification",
      width: 110,
      renderCell: (params) => (
        <>
          {params.row.verification == "approved" ? (
            <Chip
              label="Approved"
              variant="outlined"
              color="success"
              size="medium"
              className="approve"
            />
          ) : params.row.verification == "pending" ? (
            <Chip
              label="Pending"
              variant="outlined"
              color="warning"
              size="medium"
              className="pending"
            />
          ) : (
            <Chip
              label="Rejected"
              variant="outlined"
              color="error"
              size="medium"
              className="reject"
            />
          )}
        </>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <>
          {params.row.status === "Active" ? (
            <Chip
              label="Active"
              variant="outlined"
              color="success"
              size="medium"
              className="approve active-type"
            />
          ) : (
            <Chip
              label="Inactive"
              variant="outlined"
              color="error"
              size="medium"
              className="reject"
            />
          )}
        </>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 90,
      getSelection(row) {
        console.log("row ", row);
      },
      renderCell: (params) => (
        <>
          <button
            onClick={() => console.log(params.id)}
            style={{
              background: "transparent",
              border: "none",
              margin: "auto",
              cursor: "pointer",
            }}
          >
            <DeleteIcon />
          </button>
          <button
            onClick={() => console.log(params.id)}
            style={{
              background: "transparent",
              border: "none",
              margin: "auto",
              cursor: "pointer",
            }}
          >
            <BlockIcon />
          </button>
        </>
      ),
    },
  ];

  let rows = Data.map((currElem) => {
    return {
      id: currElem._id,
      image: currElem.profilePic,
      name: currElem.name,
      username: currElem.userName,
      email: currElem.email,
      phoneNumber: currElem.phoneNumber,
      bio: currElem.bio,
      country: currElem.country,
      status: currElem.block ? "Inactive" : "Active",
      verification: currElem.verification,
    };
  });

  return (
    <>
      <h3
        className="heading"
        onClick={() => {
          console.log(Data);
        }}
      >
        Star Table{" "}
      </h3>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          getRowId={(r) => r.id}
          rows={rows}
          columns={columns}
          pageSize={10}
        />
      </div>

      <GridStyle />
    </>
  );
};

export default Index;
