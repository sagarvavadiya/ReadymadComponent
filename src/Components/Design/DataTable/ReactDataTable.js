import React, { useEffect, useState, Fragment } from "react";
import { Tabledata as TabledataInfo } from "./tableData";
import toastr from "toastr";
import axios from "axios";
import { Link } from "react-router-dom";
import * as moment from "moment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Tooltip from "@material-ui/core/Tooltip";
import { map } from "lodash";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useBlockLayout,
  useRowSelect,
} from "react-table";
import { useSticky } from "react-table-sticky";
import {
  Row,
  Col,
  CardBody,
  Button,
  Badge,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import styled from "styled-components";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { format } from "date-fns";
import { Popper } from "@material-ui/core";
import Flatpickr from "react-flatpickr";
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    const [done, setDone] = React.useState(true);
    return (
      <>
        <input
          type="checkbox"
          value={done}
          onChange={(e) => setDone(e.target.value)}
          ref={resolvedRef}
          {...rest}
        />
      </>
    );
  }
);

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

const csvHeader = [
  "ID",
  "Reg/Law",
  "CFR Ref",
  "Reg Long Name",
  "Reg Description",
  "Reg URL",
  "Reg Compliance Guide URL",
  "Reg Related Law",
  "Reg Effective Date",
  "Reg Authoring Regulator",
  "Reg Primary Supervisor",
  "Status",
  "Created At",
  "Last Updated At",
];
const exportToExcel = (rowData) => {
  console.log(rowData, "selectedrows");

  const customizedData = rowData?.map((row) => {
    const updatedDate = moment(new Date(row.updatedDate)).format(
      "MMM DD Y HH:mm:ss"
    );
    const createdDate = moment(new Date(row.createdDate)).format(
      "MMM DD Y HH:mm:ss"
    );

    const EffectiveDate = moment(new Date(row.regEffectiveDate)).format(
      "MMM DD Y HH:mm:ss"
    );
    return {
      ...row,
      regDescription: row.regDescription.replace(/<[^>]+>/g, ""),
      status: row.status == true ? "Yes" : "No",
      createdDate: createdDate,
      updatedDate: row.updatedDate ? updatedDate : "-",
      regEffectiveDate: row.regEffectiveDate ? EffectiveDate : "-",
      regulator: row.regulator ? row.regulator.regulatorShortName : "NA",
    };
  });
  const filteredData = customizedData.map(({ id, status, ...rest }) => rest);
  const worksheet = XLSX.utils.json_to_sheet(filteredData, { csvHeader });
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [
        "Reg ID",
        "Reg/Law",
        "CFR Ref",
        "Reg Long Name",
        "Reg Description",
        "Reg URL",
        "Reg Compliance Guide URL",
        "Reg Related Law",
        "Reg Effective Date",
        "Reg Authoring Regulator",
        "Reg Primary Supervisor",
        "Created At",
        "Last Updated At",
      ],
    ],
    { origin: "A1" }
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  FileSaver.saveAs(blob, "Regulations.xlsx");
};

const Styles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  // padding: 1rem;

  .table {
    border: 1px solid #ddd;
    border-radius: 5px;
    .tr {
      min-width: 100%;
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #eff2f7;
      // border-bottom: 1px solid #ddd;
      // border-right: 1px solid #ddd;
      // background-color: #fff;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }

      :not([data-sticky-td]) {
        flex-grow: 1;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    .th {
      position: relative;
      height: 100px;
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
        min-width: 100%;
      }

      .header {
        top: 0;
        // box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        // box-shadow: 1px 0px 2px #ccc;
      }

      [data-sticky-first-right-td] {
        // box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;

const useStyles = makeStyles({
  root: {
    "& .MuiInputBase-root": {
      padding: "2px", // Adjust the padding value as per your requirement
    },
    "& input::placeholder": {
      fontSize: "12px",
      fontFamily: "poppins",
    },
  },
  option: {
    fontFamily: "poppins",
    fontSize: "13px",
  },
  datePickerInput: {
    backgroundColor: "#fff",
  },
});

const PopperMy = function (props) {
  return (
    <Popper
      {...props}
      style={{ width: 250, fontSize: 12 }}
      placement="bottom-start"
      id="popper-div"
    />
  );
};

const TableContainer = ({
  loader,
  columns,
  pageCount: customePageCount,
  data,
  handleRender,
  checkOrg,
  setCheckOrg,
  handleSort,
  setSortBy,
  setCurrentPage,
  regulationAccess,
  downloadAccess,
  customePageSize,
  setCustomePageSize,
  props,
  filterArray,
  fetchData,
  searchObject,
  setFilterArray,
  setSearchObject,
  customPageSize,
  Tabledata,
  setTabledata,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    rows,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            id: "id",
            desc: false,
          },
        ],
      },
      pageCount: customePageCount,
      manualSortBy: true,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useBlockLayout,
    useSticky,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          sticky: "left",
          width: 37,
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const [btnLoader, setBtnLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});
  const [autoEmpty, setAutoEmpty] = useState({});
  const [autoFill, setAutoFill] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEffDate, setSelectedEffDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedHeader, setSelectedHeader] = useState([]);
  const onChangeInSelect = (event) => {
    // setPageSize(Number(event.target.value))
    setCustomePageSize(Number(event.target.value));
  };

  const handleExport = (selectedFlatRowsData) => {
    exportToExcel(selectedFlatRowsData.map((i) => i.original));
    const authToken = JSON.parse(localStorage.getItem("authUser"));
    // setBtnLoader(true);
    const id_arr = map(selectedFlatRows, "original.id");
    const ids = id_arr.toString();

    const data = {
      ...filterArray,
      ...searchObject,
      regulationIds: ids,
      customerorgId: checkOrg !== 3 ? checkOrg && parseInt(checkOrg) : "",
    };
  };

  const handleSearchQueryChange = (columnKey, value) => {
    const authToken = JSON.parse(localStorage.getItem("authUser"));

    if (columnKey == "updatedDate") {
      const newDate = new Date(value);
      const formattedDate = format(newDate, "yyyy-MM-dd");
      console.log(formattedDate, "formattedDate");
      setSelectedDate(formattedDate);
      setSearchQuery((prev) => ({ ...prev, [columnKey]: formattedDate }));
    } else if (columnKey == "regEffectiveDate") {
      const newDate = new Date(value);
      const formattedDate = format(newDate, "yyyy-MM-dd");
      console.log(formattedDate, "formattedDate");
      setSelectedEffDate(formattedDate);

      setSearchQuery((prev) => ({ ...prev, [columnKey]: formattedDate }));
    } else if (value === null) {
      setSearchQuery((prev) => ({ ...prev, [columnKey]: "" }));
      // console.log('nulll')
    } else {
      setSearchQuery((prev) => ({ ...prev, [columnKey]: value }));
    }
    console.log(columnKey, "columnKey");
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}autosearch?limit=1000000&pageNo=1`,
        {
          tableName: "Regulations",
          feildName: columnKey,
          searchValue: value,
          customerorgId:
            checkOrg !== "" && checkOrg !== 3
              ? checkOrg !== "" && parseInt(checkOrg)
              : "",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken.data.authToken}`,
          },
        }
      )
      .then((response) => {
        if (columnKey != "updatedDate" && columnKey != "regEffectiveDate") {
          setAutoFill((prevAutoFill) => ({
            ...prevAutoFill,
            [columnKey]: response.data.data.map((item) => item[columnKey]),
          }));
        }

        setSearchQuery((prev) => ({ ...prev, [columnKey]: value }));
      })
      .catch((error) => {
        setAutoFill((prevAutoFill) => ({
          ...prevAutoFill,
          [columnKey]: [],
        }));
      });
  };

  const handleAutocompleteChange = (columnId, value) => {
    let updatedValue;
    if (value === "" || value == null) {
      updatedValue = ""; // Set the value to blank when selecting "All"
    } else if (columnId == "updatedDate" || columnId == "regEffectiveDate") {
      // Set the value to false when selecting "No"
      const newDate = new Date(value);
      const formattedDate = format(newDate, "yyyy-MM-dd");
      console.log(formattedDate, "formattedDate");
      updatedValue = formattedDate;
    } else {
      updatedValue = value; // Set the value to true when selecting "Yes"
    }

    const updatedSearchQuery = { ...searchQuery, [columnId]: updatedValue };
    handleSearchQueryChange(columnId, updatedValue);
    setAutoEmpty((prev) => ({ ...prev, [columnId]: updatedValue }));
    setSearchQuery(updatedSearchQuery);
    setSearchObject(updatedSearchQuery);

    console.log("API call triggered:", value);
  };

  const handleKeyDownDate = (columnId, e) => {
    if (e.keyCode === 27 || e.keyCode === 8) {
      setSelectedDate(null);
      const updatedSearchQuery = { ...searchQuery, [columnId]: "" };
      setSearchQuery(updatedSearchQuery);
      setSearchObject(updatedSearchQuery);
    }
  };

  const handleEffKeyDownDate = (columnId, e) => {
    if (e.keyCode === 27 || e.keyCode === 8) {
      setSelectedEffDate(null);
      const updatedSearchQuery = { ...searchQuery, [columnId]: "" };
      setSearchQuery(updatedSearchQuery);
      setSearchObject(updatedSearchQuery);
    }
  };

  const theme = createMuiTheme({
    overrides: {
      MuiFilledInput: {
        root: {
          backgroundColor: "#fff", // Set your desired background color here
          // height: "35px",
        },
      },
    },
  });

  const clearFilter = () => {
    setSearchQuery({});
    setAutoEmpty({});
    setAutoFill({});
    setFilterArray({});
    setSelectedHeader([]);
    setSelectedDate(null);
    setSelectedEffDate(null);
    setSearchObject({});
    setCurrentPage(1);
    setSortBy({
      tableName: "regulation",
      fieldName: "id",
      order: "DESC",
    });
    fetchData({});
    localStorage.removeItem("selectedFilterArray");
    localStorage.removeItem("idsArray");
    // dateQuery({})
    const textFields = document.querySelectorAll('input[type="text"]');
    textFields.forEach((textField) => {
      textField.value = "";
    });
  };
  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);

  const authToken = JSON.parse(localStorage.getItem("authUser"));
  const toggle = (data) => {
    setModal(!modal);
    setSelectedFile(!selectedFile);
  };
  const onFileChange = ({ target }) => {
    if (!selectedFile) {
      setErrors({});
      const value = target && target.files[0];
      setSelectedFile(value);
    }
  };
  const handleImportData = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    if (!selectedFile) {
      setErrors({ file: "File Required!" });
    } else {
      setErrors({});
      formdata.append("file", selectedFile);
      const authToken = JSON.parse(localStorage.getItem("authUser"));
      const result = axios
        .post(`${process.env.REACT_APP_BASE_URL}import-regulations`, formdata, {
          headers: { Authorization: `Bearer ${authToken.data.authToken}` },
        })
        .then((response) => {
          if (response.status >= 200 || response.status <= 299) {
            toastr.success(response.data.message);
            setSelectedFile();
            toggle();
            handleRender();
          }
        })
        .catch((err) => {
          var message;
          toggle();
          if (err.response && err.response.status) {
            switch (err.response.status) {
              case 400:
                toastr.error(err.response.data.message);
                break;
              case 404:
                message = "Sorry! Network Error(Status:404)";
                break;
              case 500:
                message =
                  "Sorry! something went wrong, please contact our support team, Status-500   ";
                break;
              case 401:
                message = "You are not authorized to view this data.";
                break;
              default:
                message = err[1];
                break;
            }
          }
          throw message;
        });
    }
  };

  const edit = () => {
    props.history.replace({
      pathname: "/regulations/regulation_update",
      state: { rowData: selectedFlatRows && selectedFlatRows[0].original },
    });
  };

  const onAllDelete = (e) => {
    e.preventDefault();
    const id_arr = map(selectedFlatRows, "original.id");
    const ids = id_arr.toString();
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}delete-data`,
        {
          tableName: "Regulations",
          ids: ids,
        },
        {
          headers: { Authorization: `Bearer ${authToken.data.authToken}` },
        }
      )
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) {
          toastr.success(response.data.message);
          toggleDelete();
          handleRender();
        }
      })
      .catch((err) => {
        console.log(err.response.data.message, "mesg");
        var message;
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 400:
              toastr.error(err.response.data.message);
              toggleDelete();
              break;
            case 404:
              message = "Sorry! Network Error(Status:404)";
              break;
            case 500:
              message =
                "Sorry! something went wrong, please contact our support team, Status-500   ";
              break;
            case 401:
              message = "You are not authorized to view this data.";
              break;
            default:
              message = err[1];
              break;
          }
          handleRender();
        }
        throw message;
      });
  };

  const toggleDelete = () => {
    setDeleteModal(!deleteModal);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const authToken = JSON.parse(localStorage.getItem("authUser"));

      const obj2 = JSON.parse(localStorage.getItem("orgID"));
      if (obj2) {
        setCheckOrg(obj2.orgId);
      } else if (!obj2 && authToken) {
        setCheckOrg(authToken.data.customerorg.id);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const initialOrgID = JSON.parse(localStorage.getItem("orgID"));
    const authToken = JSON.parse(localStorage.getItem("authUser"));
    if (initialOrgID) {
      setCheckOrg(initialOrgID && initialOrgID.orgId);
    } else if (authToken) {
      setCheckOrg(authToken.data.customerorg.id);
    }
  }, []);
  return (
    <Fragment>
      <Row className=" d-flex align-items-center">
        <Col md={4} className="py-3">
          <div className="d-flex flex-wrap align-items-center   justify-content-start">
            <h5 className="font-size-18 mb-0">List of Regulations</h5>
            <select
              className="form-select"
              value={customePageSize}
              onChange={onChangeInSelect}
              style={{ width: "150px", marginLeft: "10px" }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  No of Results {pageSize}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col md={8} className="py-3 justify-content-end">
          <div className="d-flex flex-wrap gap-2 justify-content-end">
            {selectedFlatRows.length == 1 ? (
              <>
                <Button
                  onClick={() => edit()}
                  style={{
                    backgroundColor: "#556EE6",
                    // marginLeft: 5,
                    color: "#fff",
                    textTransform: "none",
                  }}
                >
                  <i className="bx bx-edit-alt font-size-16 align-middle me-1"></i>
                  Edit
                </Button>
              </>
            ) : (
              ""
            )}

            {selectedFlatRows.length >= 1 ? (
              <>
                <Button
                  onClick={(e) => {
                    setTabledata(
                      Tabledata.filter(
                        (i) =>
                          !selectedFlatRows
                            .map((i) => i.original.id)
                            .includes(i.id)
                      )
                    );
                  }}
                  style={{
                    backgroundColor: "#556EE6",
                    color: "#fff",
                    textTransform: "none",
                  }}
                >
                  <i className="bx bx-trash font-size-16 align-middle me-1"></i>
                  Delete
                </Button>
              </>
            ) : (
              ""
            )}

            {/* <DeleteModal
              show={deleteModal}
              onDeleteClick={(e) => onAllDelete(e)}
              onCloseClick={() => setDeleteModal(false)}
            /> */}
            <button
              type="button"
              className="btn btn-primary "
              onClick={clearFilter}
            >
              <i className="mdi mdi-filter-remove-outline font-size-16 align-middle me-1"></i>{" "}
              Clear Filter
            </button>

            {regulationAccess &&
            regulationAccess.writeAccess == true &&
            checkOrg === 3 ? (
              <div
                className="btn btn-primary"
                to="/regulations/regulation_update"
              >
                <i className="bx bx-plus font-size-16 align-middle me-1"></i>
                Add Regulation
              </div>
            ) : (
              ""
            )}
            {/* {checkOrg === 3 ? ( */}
            <Button
              onClick={() => {
                setModal(!modal);
                setDesc("Import Data");
                setTitle("Import Data");
              }}
              style={{
                backgroundColor: "#556ee6",
                // marginLeft: 5,
                color: "#fff",
                textTransform: "none",
              }}
            >
              <i className="bx bx-upload font-size-16 align-middle me-1"></i>
              Upload
            </Button>
            {/* ) : (
              ""
            )} */}
            <Modal
              isOpen={modal}
              toggle={toggle}
              className="modal-dialog-centered"
              style={{ borderRadius: "50px" }}
            >
              <ModalHeader toggle={toggle}>{title}</ModalHeader>
              <ModalBody className="px-4 py-4 text-left">
                <h6>Import Data</h6>
                <div className="form-body mt-3">
                  <input
                    type="file"
                    id="csvFileInput"
                    accept=".csv"
                    name="file"
                    onChange={onFileChange}
                    className="form-control mb-2"
                  />
                  <div className="error">{errors.file}</div>
                </div>
                <div className="px-6 mt-3 mb-1 text-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    name="button"
                    onClick={(e) => handleImportData(e)}
                  >
                    Import Data
                  </button>
                </div>
              </ModalBody>
            </Modal>
            {selectedFlatRows.length >= 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => handleExport(selectedFlatRows)}
              >
                <i className="bx bx-download font-size-16 align-middle me-1"></i>{" "}
                Download
              </button>
            ) : (
              ""
            )}
          </div>
        </Col>
      </Row>

      <Styles>
        <div style={{ minHeight: "25rem" }}>
          <div
            className="sticky table"
            {...getTableProps()}
            style={{ height: 600 }}
          >
            <div className="table-light header" style={{ fontWeight: 600 }}>
              {headerGroups.map((headerGroup) => (
                <div
                  key={headerGroup.id}
                  {...headerGroup.getHeaderGroupProps()}
                  className="tr"
                >
                  {headerGroup.headers.map((column) => (
                    // <th className="table-light" key={column.id} {...column.getHeaderProps()}>
                    <div
                      key={column.id}
                      {...column.getHeaderProps()}
                      className="th"
                    >
                      {/* <div> */}
                      <div
                        className="mb-2 mt-0"
                        {...column.getSortByToggleProps()}
                        onClick={() => handleSort(column)}
                      >
                        {column.render("Header")}
                      </div>
                      {column.id != "selection" &&
                      column.id != "updatedDate" &&
                      column.id != "regEffectiveDate" &&
                      column.id != "updatedDate " &&
                      column.Header !== "Action" ? (
                        <div
                          style={{
                            width: "100%",
                            position: "absolute",
                            bottom: "10px",
                            display: "flex",
                          }}
                        >
                          <MuiThemeProvider theme={theme}>
                            <Autocomplete
                              style={{ width: "70%" }}
                              PopperComponent={PopperMy}
                              options={autoFill[column.id] || []}
                              value={autoEmpty[column.id] || ""}
                              classes={{
                                option: classes.option,
                              }}
                              freeSolo
                              onChange={(event, value) =>
                                handleAutocompleteChange(column.id, value)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Search..."
                                  variant="filled"
                                  size="small"
                                  className={classes.root}
                                  value={searchQuery[column.id] || ""}
                                  onChange={(e) =>
                                    handleSearchQueryChange(
                                      column.id,
                                      e.target.value
                                    )
                                  }
                                  InputLabelProps={{
                                    shrink: false,
                                    focused: false,
                                  }}
                                />
                              )}
                            />
                          </MuiThemeProvider>
                          <button
                            onClick={() => {
                              setShowModal(true);
                              setModalData(column);
                            }}
                            className={
                              selectedHeader.includes(column.Header)
                                ? "filter_button_selected"
                                : "filter_button"
                            }
                          >
                            <i className="bx bx-filter font-size-18"></i>
                          </button>
                        </div>
                      ) : column.id == "updatedDate" ? (
                        <div
                          style={{
                            width: "75%",
                            position: "absolute",
                            bottom: "10px",
                            display: "flex",
                          }}
                        >
                          <Flatpickr
                            className="form-control  d-block flatpickr-input"
                            placeholder="Select Date..."
                            style={{
                              fontSize: "12px",
                              paddingLeft: 4,
                              paddingBottom: 4,
                              paddingTop: 8,
                              borderBottom: "1px solid #000",
                            }}
                            onChange={(e) =>
                              handleAutocompleteChange(column.id, e)
                            }
                            value={selectedDate}
                            options={{
                              dateFormat: "Y-m-d",
                              defaultDate: "2023-05-15",
                            }}
                            onKeyDown={(e) => handleKeyDownDate(column.id, e)}
                          />

                          <div
                            className="icon-container"
                            style={{ position: "absolute", right: 6, top: 8 }}
                          >
                            <i className="fa fa-calendar" />
                          </div>
                        </div>
                      ) : column.id == "regEffectiveDate" ? (
                        <div
                          style={{
                            width: "75%",
                            position: "absolute",
                            bottom: "10px",
                            display: "flex",
                          }}
                        >
                          <Flatpickr
                            className="form-control  d-block flatpickr-input"
                            placeholder="Select Date..."
                            style={{
                              fontSize: "12px",
                              paddingLeft: 4,
                              paddingBottom: 4,
                              paddingTop: 8,
                              borderBottom: "1px solid #000",
                            }}
                            onChange={(e) =>
                              handleAutocompleteChange(column.id, e)
                            }
                            value={selectedEffDate}
                            options={{
                              dateFormat: "Y-m-d",
                              defaultDate: "2023-05-15",
                            }}
                            onKeyDown={(e) =>
                              handleEffKeyDownDate(column.id, e)
                            }
                          />

                          <div
                            className="icon-container"
                            style={{ position: "absolute", right: 6, top: 8 }}
                          >
                            <i className="fa fa-calendar" />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {1 != 1 ? (
              <div
                className="container-fluid mt-5 mb-5"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner className="ms-2" color="primary" />
              </div>
            ) : rows.length > 0 ? (
              <div {...getTableBodyProps()} className="body">
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <div {...row.getRowProps()} className="tr">
                        {row.cells.map((cell) => {
                          return (
                            <div
                              key={cell.id}
                              {...cell.getCellProps({
                                style: {
                                  backgroundColor: "#fff",
                                },
                              })}
                              className="td"
                            >
                              {cell.render("Cell")}
                            </div>
                          );
                        })}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            ) : (
              <Row className="mt-5">
                <Col
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    padding: "150px 0",
                    fontSize: "25px",
                  }}
                >
                  No Records found
                </Col>
              </Row>
            )}
          </div>
        </div>
        {/* <FilterModal
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setSelectedHeader={setSelectedHeader}
          setFilterArray={setFilterArray}
          isShowModal={showModal}
          filterData={modalData}
          setShowModal={setShowModal}
          tableName={"regulations"}
        /> */}
      </Styles>
    </Fragment>
  );
};

const AllRegulations = (props) => {
  const [fakeData, setFakeData] = useState([]);

  const [modal, setModal] = useState(false);
  const [desc, setDesc] = useState("");

  const toggle = () => {
    setModal(!modal);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [Tabledata, setTabledata] = useState(TabledataInfo);
  const [totalItems, setTotalItems] = useState(0);
  const [loader, setLoader] = useState(true);
  const [delRegulation, setDelRegulation] = useState(null);
  const [is_delete, setDelete] = useState(false);
  const [searchObject, setSearchObject] = useState({});
  const [filterArray, setFilterArray] = useState({});
  const [customePageSize, setCustomePageSize] = useState(10);
  const [regulationAccess, setRegulationAccess] = useState([`ok`]);
  const [checkOrg, setCheckOrg] = useState();
  const [downloadAccess, setDownloadAccess] = useState([`ok`]);
  const [sortBy, setSortBy] = useState({
    tableName: "regulation",
    fieldName: "id",
    order: "DESC",
  });

  const limit = 10;

  const handleSort = (column) => {
    console.log(column.id, "columns");
    const isAsc = sortBy.fieldName === column.id && sortBy.order === "ASC";
    const sortOrder = isAsc ? "DESC" : "ASC";
    if (column.id !== "selection" && column.id !== "Action") {
      setSortBy({
        tableName: "regulation",
        fieldName: column.id,
        order: sortOrder,
      });
    }
  };

  useEffect(() => {
    const authToken = JSON.parse(localStorage.getItem("authUser"));
    setRegulationAccess(`authToken && authToken.data.role.rolesPermission[1]`);
    setDownloadAccess(`authToken && authToken.data.role.rolesPermission[5]`);
  }, []);

  const customePageCount = Math.ceil(totalItems / limit);

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const DarkTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.black,
      color: "rgba(255, 255, 255, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const onClickDelete = (reg) => {
    // setOrder(order);
    setDelRegulation(reg);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    // console.log(delRegulator, 'reg for delete')
    // setDelete(!is_delete)
    if (delRegulation.id) {
      // dispatch(onDeleteRegulation(delRegulation.id, props.history))
      deleteRegulation(delRegulation.id);
      setDeleteModal(false);
    }
  };

  const deleteRegulation = (regulation) => {
    // console.log(regulation, 'for delete')
    const authToken = JSON.parse(localStorage.getItem("authUser"));
    return axios
      .get(
        `${process.env.REACT_APP_BASE_URL}delete-regulation?id=${regulation}`,
        {
          headers: {
            Authorization: `Bearer ${authToken.data.authToken}`,
          },
        }
      )
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) {
          toastr.success("Regulation Successfully Deleted.");
          setDelete(!is_delete);
        }
      })
      .catch((err) => {
        let message;
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 404:
              message =
                "Sorry! the page you are looking for could not be found";
              break;
            case 400:
              message = err.response.data.message;
              break;
            case 500:
              message =
                "Sorry! something went wrong, please contact our support team";
              break;
            case 401:
              message = "Invalid credentials";
              break;
            default:
              message = err[1];
              break;
          }
        }
        // return message
        toastr.error(message);
      });
  };

  const fetchData = (searchQuery) => {
    const authToken = JSON.parse(localStorage.getItem("authUser"));

    const finalData = Object.keys(filterArray).length
      ? filterArray
      : searchObject;
    // console.log(data,"re-renderd")
    setLoader(false);

    if (Object.keys(filterArray).length > 0) {
      console.log(finalData, "finalData");
      localStorage.setItem("selectedFilterArray", JSON.stringify(finalData));
    } else {
      localStorage.removeItem("selectedFilterArray");
    }

    const requestData = {
      ...finalData,
      customerorgId: checkOrg !== 3 ? checkOrg && parseInt(checkOrg) : "",
      orderBy: {
        ...sortBy,
      },
    };
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/get-regulations/?limit=${customePageSize}&pageNo=${currentPage}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken.data.authToken}`,
          },
        }
      )
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) {
          // return response.data;
          setTabledata(response.data.data);
          var ids = [];
          if (response.data.ids !== undefined && response.data.ids !== "") {
            ids = response.data.ids.split(",");
          }
          localStorage.setItem("idsArray", JSON.stringify(ids));
          setTotalItems(response.data.totalRecords);

          setLoader(false);
        }
        // throw response.data;
      })
      .catch((err) => {
        var message;
        setLoader(false);
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 404:
              message = "Sorry! Network Error(Status:404)";
              break;
            case 500:
              message =
                "Sorry! something went wrong, please contact our support team, Status-500   ";
              break;
            case 401:
              message = "You are not authorized to view this data.";
              break;
            default:
              message = err[1];
              break;
          }
        }
        throw message;
      });
  };

  const dateQuery = (searchQuery) => {
    const authToken = JSON.parse(localStorage.getItem("authUser"));

    // const data = JSON.stringify({searchQuery})
    console.log(searchQuery, "re-searchQuery");

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/get-regulations/?limit=${limit}&pageNo=${currentPage}`,
        { updatedDate: searchQuery },
        {
          headers: {
            Authorization: `Bearer ${authToken.data.authToken}`,
          },
        }
      )
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) {
          // return response.data;
          setTabledata(response.data.data);
          setTotalItems(response.data.totalRecords);

          setLoader(false);
        }
        // throw response.data;
      })
      .catch((err) => {
        var message;
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 404:
              message = "Sorry! Network Error(Status:404)";
              break;
            case 500:
              message =
                "Sorry! something went wrong, please contact our support team, Status-500   ";
              break;
            case 401:
              message = "You are not authorized to view this data.";
              break;
            default:
              message = err[1];
              break;
          }
        }
        throw message;
      });
  };

  const dateEffQuery = (searchQuery) => {
    const authToken = JSON.parse(localStorage.getItem("authUser"));

    // const data = JSON.stringify({searchQuery})
    console.log(searchQuery, "re-searchQuery");

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/get-regulations/?limit=${limit}&pageNo=${currentPage}`,
        { regEffectiveDate: searchQuery },
        {
          headers: {
            Authorization: `Bearer ${authToken.data.authToken}`,
          },
        }
      )
      .then((response) => {
        if (response.status >= 200 || response.status <= 299) {
          // return response.data;
          setTabledata(response.data.data);
          setTotalItems(response.data.totalRecords);

          setLoader(false);
        }
        // throw response.data;
      })
      .catch((err) => {
        var message;
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 404:
              message = "Sorry! Network Error(Status:404)";
              break;
            case 500:
              message =
                "Sorry! something went wrong, please contact our support team, Status-500   ";
              break;
            case 401:
              message = "You are not authorized to view this data.";
              break;
            default:
              message = err[1];
              break;
          }
        }
        throw message;
      });
  };

  useEffect(() => {
    if (checkOrg !== undefined) {
      fetchData(searchObject);
    }
  }, [
    currentPage,
    is_delete,
    searchObject,
    filterArray,
    customePageSize,
    sortBy,
    checkOrg,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchObject, filterArray, customePageSize]);

  const columns = [
    {
      Header: "Reg ID",
      width: 125,
      accessor: "regId",
      filterable: false,
      disableFilters: true,
      sticky: "left",
      Cell: (cellProps) => {
        const rowData = cellProps.row.original;
        return (
          <div
            to={{
              pathname: "/regulations/regulation_view",
              state: { rowData },
            }}
          >
            <span style={{ color: "#000" }}>{cellProps.value}</span>
          </div>
        );
      },
    },
    {
      Header: "Reg/Law",
      accessor: "regShortName",
      filterable: false,
      disableFilters: true,
      width: 135,
      Cell: (cellProps) => {
        const rowData = cellProps.row.original;
        return (
          <div
            to={{
              pathname: "/regulations/regulation_view",
              state: { rowData },
            }}
          >
            <span style={{ color: "#000" }}>
              {cellProps.value && cellProps.value.length > 15
                ? cellProps.value && cellProps.value.substr(0, 15) + " ..."
                : cellProps.value || "-"}
            </span>
          </div>
        );
      },
    },
    {
      Header: "CFR Ref",
      accessor: "cfrRef",
      width: 125,
      filterable: false,
      disableFilters: true,
      Cell: (cellProps) => {
        return cellProps.value && cellProps.value.length > 10
          ? cellProps.value.substr(0, 18) + " ..."
          : cellProps.value || "-";
      },
    },
    {
      Header: "Reg Long Name",
      accessor: "regLongName",
      width: 160,
      filterable: false,
      disableFilters: true,
      Cell: (cellProps) => {
        const rowData = cellProps.row.original;
        return (
          <div
            to={{
              pathname: "/regulations/regulation_view",
              state: { rowData },
            }}
          >
            <LightTooltip title={cellProps.value}>
              <span style={{ color: "#000" }}>
                {cellProps.value && cellProps.value.length > 20
                  ? cellProps.value.substr(0, 20) + " ..."
                  : cellProps.value || "-"}
              </span>
            </LightTooltip>
          </div>
        );
      },
    },
    {
      Header: "Reg Description",
      accessor: "regDescription",
      filterable: false,
      disableFilters: true,
      Cell: (cellProps) => {
        return cellProps.value ? (
          <DarkTooltip title="View Details">
            <div style={{ textAlign: "center" }}>
              <i
                onClick={() => {
                  setModal(!modal);
                  setDesc(cellProps.value);
                }}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  padding: "0 5px",
                  borderRadius: "20%",
                  color: "#556ee6",
                }}
                className="bx bxs-info-circle  font-size-24"
                id="descToolTip"
              ></i>
            </div>
          </DarkTooltip>
        ) : (
          "-"
        );
      },
    },
    {
      Header: "Reg URL",
      filterable: false,
      disableFilters: true,
      accessor: "regUrl",
      Cell: (cellProps) => {
        const rowData = cellProps.value;
        // console.log(rowData, 'celpops')
        return (
          <div>
            <div to={{ pathname: cellProps.value }} target="_blank">
              <LightTooltip title={rowData}>
                <div
                  style={{
                    textDecoration: "underline",
                    fontSize: "13px",
                    color: "blue",
                  }}
                >
                  {cellProps.value
                    .replaceAll("https://", "")
                    .replaceAll("http://", "")
                    .replaceAll("www.", "")
                    .substr(0, 15) + " ..." ||
                    cellProps.value ||
                    "-"}
                </div>
              </LightTooltip>
            </div>
          </div>
        );
      },
    },
    {
      Header: "Reg Compliance Guide URL",
      filterable: false,
      disableFilters: true,
      accessor: "regComplianceGuideUrl",
      Cell: (cellProps) => {
        const rowData = cellProps.value;
        // console.log(rowData, 'celpops')
        return (
          <div>
            {cellProps.value ? (
              <div to={{ pathname: cellProps.value }} target="_blank">
                <LightTooltip title={rowData}>
                  <div
                    style={{
                      textDecoration: "underline",
                      fontSize: "13px",
                      color: "blue",
                    }}
                  >
                    {cellProps.value
                      .replaceAll("https://", "")
                      .replaceAll("http://", "")
                      .replaceAll("www.", "")
                      .substr(0, 12) + " ..."}
                  </div>
                </LightTooltip>
              </div>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
    {
      Header: "Reg Related Law",
      accessor: "regRelatedLaw",
      filterable: false,
      disableFilters: true,
      // width: 120,
      Cell: (cellProps) => {
        return cellProps.value && cellProps.value.length > 10
          ? cellProps.value.substr(0, 18) + " ..."
          : cellProps.value || "-";
      },
    },
    {
      Header: "Reg Effective Date",
      accessor: "regEffectiveDate",
      filterable: false,
      // width:120,
      disableFilters: true,
      Cell: (cellProps) => {
        const date1 = moment(new Date(cellProps.value)).format("MMM DD Y");
        if (cellProps.value) {
          return date1;
        } else {
          return "-";
        }
      },
    },
    {
      Header: "Reg Last Update Date",
      accessor: "updatedDate",
      filterable: false,
      // width:120,
      disableFilters: true,
      Cell: (cellProps) => {
        const date1 = moment(new Date(cellProps.value)).format("MMM DD Y");
        if (cellProps.value) {
          return date1;
        } else {
          return "-";
        }
      },
    },
    {
      Header: "Reg Authoring Regulator",
      accessor: "regAuthoringRegulator",
      filterable: false,
      disableFilters: true,
      // width:120,
      Cell: (cellProps) => {
        // console.log(cellProps.value, "value")
        return cellProps.value && cellProps.value.length > 10
          ? cellProps.value.substr(0, 18) + " ..."
          : cellProps.value || "-";
      },
    },
    {
      Header: "Reg Primary Supervisor",
      accessor: "regPrimarySupervisor",
      // width:120,
      filterable: false,
      disableFilters: true,
      Cell: (cellProps) => {
        return cellProps.value && cellProps.value.length > 10
          ? cellProps.value.substr(0, 18) + " ..."
          : cellProps.value || "-";
      },
    },
    {
      Header: "Action",
      textAlign: "top",
      sticky: "right",
      filterable: false,
      disableFilters: true,
      Cell: (cellProps) => {
        const rowData = cellProps.row.original;
        return (
          <ul
            className="list-unstyled hstack gap-2"
            style={{ marginBottom: "1.2rem" }}
          >
            {/* <LightTooltip  */}

            <Badge className="font-size-15 badge-soft-success" pill>
              <DarkTooltip title="Edit">
                <div
                  to={{
                    pathname: "/regulations/regulation_update",
                    state: { rowData },
                  }}
                >
                  <div
                    style={{ color: "#34C38F", cursor: "pointer" }}
                    className="bx bx-edit-alt  font-size-18"
                  >
                    ✏️
                  </div>
                </div>
              </DarkTooltip>
            </Badge>

            <Badge className="font-size-15  badge-soft-primary" pill>
              <DarkTooltip title="View">
                <div
                  to={{
                    pathname: "/regulations/regulation_view",
                    state: { rowData },
                  }}
                  onClick={() => {
                    const orderData = cellProps.row.original;
                  }}
                >
                  <div
                    style={{ color: "blue", cursor: "pointer" }}
                    className="mdi mdi-eye-outline  font-size-18"
                    id="customerViewtooltip"
                  >
                    👁️
                  </div>
                </div>
              </DarkTooltip>
            </Badge>

            <Badge
              color="danger"
              className="font-size-15 badge-soft-danger"
              pill
            >
              <DarkTooltip title="Remove">
                <div
                  onClick={() => {
                    setTabledata(Tabledata.filter((i) => i.id != rowData.id));
                  }}
                  className="bx bx-trash font-size-18"
                  style={{
                    color: "red",
                    cursor: "pointer",
                  }}
                  id="removetooltip"
                >
                  🗑️
                </div>
              </DarkTooltip>
            </Badge>
          </ul>
        );
      },
    },
  ];

  document.title = "Regulations";
  const handleRender = () => {
    setDelete(!is_delete);
  };
  return (
    <React.Fragment>
      {/* <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} /> */}
      <div className="page-content">
        <div className="container-fluid">
          {/* <Breadcrumbs title="Regulations" breadcrumbItem="Regulations" /> */}
          {/* <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteOrder}
            onCloseClick={() => setDeleteModal(false)}
          /> */}
          <Modal
            isOpen={modal}
            toggle={toggle}
            className="modal-dialog-centered"
            style={{ borderRadius: "50px" }}
          >
            <ModalHeader toggle={toggle}>Regulation Description</ModalHeader>
            <ModalBody className="text-left">
              <div dangerouslySetInnerHTML={{ __html: desc && desc }}></div>
            </ModalBody>
            <ModalFooter className="mx-auto">
              <Button className="px-5" color="primary" onClick={toggle}>
                Ok
              </Button>{" "}
            </ModalFooter>
          </Modal>

          <Row>
            <Col xs="12">
              <Card>
                <CardBody className="table-class">
                  <TableContainer
                    columns={columns}
                    props={props}
                    data={Tabledata}
                    filterArray={filterArray}
                    checkOrg={checkOrg}
                    setCheckOrg={setCheckOrg}
                    handleSort={handleSort}
                    setSortBy={setSortBy}
                    regulationAccess={regulationAccess}
                    downloadAccess={downloadAccess}
                    searchObject={searchObject}
                    setCurrentPage={setCurrentPage}
                    fetchData={fetchData}
                    setSearchObject={setSearchObject}
                    customePageSize={customePageSize}
                    setCustomePageSize={setCustomePageSize}
                    setFilterArray={setFilterArray}
                    handleRender={handleRender}
                    dateQuery={dateQuery}
                    dateEffQuery={dateEffQuery}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    customPageSize={10}
                    loader={loader}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    setTabledata={setTabledata}
                    Tabledata={Tabledata}
                  />
                  <Row className="justify-content-center mt-3">
                    <Col className="col-auto">
                      {/* <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={totalItems}
                        pageSize={customePageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                      /> */}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AllRegulations;
