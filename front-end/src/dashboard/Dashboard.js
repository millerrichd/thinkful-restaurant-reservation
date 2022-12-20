import React, { useEffect, useState } from "react";
import axios from "axios";

import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time";
import { API_BASE_URL as url } from "../utils/api";
import TableSection from "./TableSection";
import ReservationSection from "./ReservationSection";

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

  const cancelReservation = (reservationId) => {
    const response = window.confirm(
      'Do you want to cancel this reservation? This cannot be undone.'
    )
    console.log("RESPONSE OF CANCEL", response)
    console.log("RESERVATION ID", reservationId)
    if(response) {
      axios({method: 'put', url: `${url}/reservations/${reservationId}/status`, data: { data: {status: "cancelled" } } }).then((res) => {
        console.log("RES.STATUS", res.status)
        if(res.status === 200) {
          loadDashboard()
        }
      })
      .catch((err) => {
        console.log("ERROR", err)
      })
    }
  }

  return (
    <main className="container">
      <h1 className="text-center">Dashboard</h1>
      <div className="d-md-flex flex-row justify-content-around">
        <section>
          <div className="d-md-flex mb-3 text-center">
            <h4 className="text-center mb-0">Reservations for date {date}</h4>
          </div>
          <div className="text-center">
            <button className="btn btn-secondary m-2" onClick={() => setDate(prevDay)}>Previous</button>
            <button className="btn btn-primary m-2" onClick={() => setDate(day)}>Today</button>
            <button className="btn btn-secondary m-2" onClick={() => setDate(nextDay)}>Next</button>
          </div>
          <ErrorAlert error={reservationsError} />
          <ErrorAlert error={tablesError} />
          {reservations.length === 0 && (
            <h5 className="text-center my-3">There are no reservations</h5>
          )}
          <ReservationSection date={date} reservationsError={reservationsError} reservations={reservations} cancelReservation={cancelReservation}/>
        </section>
        <section>
          <TableSection tablesError={tablesError} tables={tables} finishTable={finishTable}/>
        </section>
      </div>

    </main>
  );
}

export default Dashboard;
