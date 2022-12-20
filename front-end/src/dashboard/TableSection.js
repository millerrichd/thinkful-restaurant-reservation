import React from "react";
import ErrorAlert from "../layout/ErrorAlert";

function TableSection({tablesError, tables, finishTable}) {

  return (
    <>
      <div className="d-md-flex mt-4 mb-3">
        <h3 className="text-center mb-0">Tables</h3>
      </div>
      <ErrorAlert error={tablesError} />
      {tables.map((table) => (
        <div key={table.table_id}>
        <div className="d-flex flex-row">
          {table.reservation_id ? (
            <button data-table-id-finish={table.table_id} className="btn btn-danger mx-2" onClick={() => finishTable(table.table_id)}>Finish</button>
          ) : (
            <></>
          )}
          <div className="d-flex flex-column">
            <div className="text-start fs-3">Table: {table.table_name}</div>
            <div className="text-start fs-5">Capacity: {table.capacity}</div>
            <div data-table-id-status={table.table_id} className="text-start fs-5 text-uppercase">Status: {table.reservation_id ? "Occupied" : "Free"}</div>
          </div>
        </div>
        <hr/>
        </div>
      ))}

    </>
  )
}

export default TableSection;