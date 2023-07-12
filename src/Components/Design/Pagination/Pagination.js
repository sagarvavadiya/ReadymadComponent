import React, { useState } from "react";
import "./pagination.css";
import { pageData as data } from "./pageData";
const itemsPerPage = 2; // Number of items to display per page

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range of items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change the current page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate the page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  let halfLength = (pageNumbers.length / 2) | 0;
  const dotElement =
    pageNumbers.indexOf(currentPage) <= halfLength
      ? currentPage + 2
      : currentPage - 2;
  return (
    <div>
      {/* Render the current items */}
      <div className="PageBox">
        <ul>
          {currentItems.map((item) => (
            <li className="pageElement" key={item.id}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="paginationDiv">
        <div className="pageSpotBox">
          {pageNumbers.map((pageNumber) => (
            <div
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              style={{
                fontWeight: pageNumber === currentPage ? "bold" : "normal",
                cursor: "pointer",
              }}
              className={`${
                [
                  1,
                  currentPage + 2,
                  currentPage - 2,
                  pageNumbers[pageNumbers.length - 1],
                  currentPage,
                  currentPage - 1,
                  currentPage + 1,
                ].includes(pageNumber)
                  ? ""
                  : "displayNone"
              } `}
            >
              {[currentPage + 2, currentPage - 2].includes(pageNumber) ? (
                <>
                  {[1, pageNumbers[pageNumbers.length - 1]].includes(
                    pageNumber
                  ) ? (
                    pageNumber
                  ) : (
                    <div>o o o</div>
                  )}
                </>
              ) : (
                pageNumber
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
