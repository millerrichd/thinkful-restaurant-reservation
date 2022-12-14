import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time"
import axios from "axios";
import { API_BASE_URL as url } from "../utils/api"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch([setTablesError]);
    return () => abortController.abort();
  }

  const day = today();
  const prevDay = previous(date);
  const nextDay = next(date);

  const finishTable = (tableId) => {
    const response = window.confirm(
      'Is this table ready to seat new guests? This cannot be undone.'
    )
    console.log("RESPONSE OF DELETE", response)
    if(response) {
      axios.delete(`${url}/tables/${tableId}/seat`).then((res) => {
        console.log("RES.STATUS", res.status)
        if(res.status === 200) {
          loadDashboard()
        }
      })
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <div>
        <button onClick={() => setDate(prevDay)}>Previous</button>
        <button onClick={() => setDate(day)}>Today</button>
        <button onClick={() => setDate(nextDay)}>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      {reservations.length === 0 && (
        <h5>There are no reservations for {date}</h5>
      )}
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id}>
          <div>{reservation.reservation_time} {reservation.reservation_date}</div>
          <div>{reservation.first_name} {reservation.last_name}</div>
          <div>{reservation.mobile_number}</div>
          <div>{reservation.people}</div>
          <div data-reservation-id-status={reservation.reservation_id}>{reservation.status}</div>
          {reservation.status === "booked" ? (
            <div><Link to={`reservations/${reservation.reservation_id}/seat`}>Seat</Link></div>
          ) : (
            <></>
          )}
        </div>
      ))}
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      {tables.map((table) => (
        <div key={table.table_id}>
          <div>{table.table_name}</div>
          <div>{table.capacity}</div>
          <div data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</div>
          {table.reservation_id ? (
            <button data-table-id-finish={table.table_id} onClick={() => finishTable(table.table_id)}>Finish</button>
          ) : (
            <></>
          )}
        </div>
      ))}
    </main>
  );
}

export default Dashboard;
