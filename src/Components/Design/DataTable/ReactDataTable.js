import React, { useEffect, useState, Fragment } from "react";
import "./tableData.css";
import { Tabledata as TabledataInfo } from "./tableData";
import * as moment from "moment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Tooltip from "@material-ui/core/Tooltip";
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
import { Row, Col, CardBody, Button, Badge, Card, Spinner } from "reactstrap";
import styled from "styled-components";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Popper } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

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
  columns,
  pageCount: customePageCount,
  data,
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEffDate, setSelectedEffDate] = useState(null);
  const [loader, setLoader] = useState(false);
  const [filters, setFilters] = useState({
    regId: "",
    regShortName: "",
    cfrRef: "",
    regLongName: "",
    regDescription: "",
    regUrl: "",
    regComplianceGuideUrl: "",
    regRelatedLaw: "",
    regAuthoringRegulator: "",
  });

  const setFilterData = (e) => {
    console.log(e.target.name, e.target.value);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  console.log(filters);
  const handleExport = (selectedFlatRowsData) => {
    exportToExcel(selectedFlatRowsData.map((i) => i.original));
  };

  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, []);

  //   useEffect(() => {
  //     let filterData = data;
  //     setTabledata(
  //       data?.filter((i) => {
  //         i.regId.includes(filters?.regId);
  //       })
  //     );

  //     setTabledata();
  //   }, [filters]);
  const theme = createMuiTheme({
    overrides: {
      MuiFilledInput: {
        root: {
          backgroundColor: "#fff", // Set your desired background color here
        },
      },
    },
  });

  const classes = useStyles();

  return (
    <Fragment>
      <Row className=" d-flex align-items-center">
        <Col md={4} className="py-3">
          <div className="d-flex flex-wrap align-items-center   justify-content-start">
            <h5 className="font-size-18 mb-0">List of Regulations</h5>
            <select
              className="form-select"
              value={`10`}
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

            <button type="button" className="btn btn-primary ">
              <i className="mdi mdi-filter-remove-outline font-size-16 align-middle me-1"></i>{" "}
              Clear Filter
            </button>

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
                    <div
                      key={column.id}
                      {...column.getHeaderProps()}
                      className="th"
                    >
                      <div
                        className="mb-2 mt-0"
                        {...column.getSortByToggleProps()}
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
                              options={[]}
                              value={""}
                              classes={{
                                option: classes.option,
                              }}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Search..."
                                  onChange={setFilterData}
                                  name={column.id}
                                  variant="filled"
                                  size="small"
                                  className={classes.root}
                                  value={""}
                                  InputLabelProps={{
                                    shrink: false,
                                    focused: false,
                                  }}
                                />
                              )}
                            />
                          </MuiThemeProvider>
                          <button>
                            <div className="bx bx-filter font-size-18 filterIcon">
                              🌪️
                            </div>
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
                          <DatePicker
                            selected={selectedDate}
                            placeholder={`Start Date`}
                            onSelect={(handleDateSelect) =>
                              setSelectedDate(handleDateSelect)
                            }
                            onChange={(handleDateChange) =>
                              console.log(handleDateChange)
                            }
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
                          <DatePicker
                            selected={selectedEffDate}
                            placeholder={`End Date`}
                            onSelect={(handleDateSelect) =>
                              setSelectedEffDate(handleDateSelect)
                            }
                            onChange={(handleDateChange) =>
                              setSelectedEffDate(handleDateChange)
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
            {loader ? (
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
      </Styles>
    </Fragment>
  );
};

const AllRegulations = (props) => {
  const [Tabledata, setTabledata] = useState(TabledataInfo);

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

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col xs="12">
              <Card>
                <CardBody className="table-class">
                  <TableContainer
                    columns={columns}
                    data={Tabledata}
                    Tabledata={Tabledata}
                    customPageSize={10}
                    setTabledata={setTabledata}
                    props={props}
                  />
                  <Row className="justify-content-center mt-3">
                    <Col className="col-auto">
                      {/* <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={totalItems} 
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
