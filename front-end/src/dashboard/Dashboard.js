import React, { useEffect, useState } from "react";
import { Link , useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const day = today();
  const prevDay = previous(date);
  const nextDay = next(date);
  
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
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id}>
          <div>{reservation.reservation_time} {reservation.reservation_date}</div>
          <div>{reservation.first_name} {reservation.last_name}</div>
          <div>{reservation.mobile_number}</div>
          <div>{reservation.people}</div>
        </div>
      ))}
    </main>
  );
}

export default Dashboard;
