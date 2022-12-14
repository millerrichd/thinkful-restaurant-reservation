import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Search() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("")
  const [searchMobileNumber, setSearchMobileNumber] = useState("")

  useEffect(loadDashboard, [searchMobileNumber]);

  function loadDashboard() {
    if(searchMobileNumber !== "") {
      const abortController = new AbortController();
      setReservationsError(null);
      listReservations({ mobile_number: searchMobileNumber }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
      return () => abortController.abort();
    }
  }

  const handleChange = ({target}) => {
    setMobileNumber(String(target.value));
  }

  //why is this not being called?!?!?!?!?
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchMobileNumber(mobileNumber);
    setMobileNumber("");
  }

  return (
    <main>
      <h1>Search</h1>
      <div>
        <form onSubmit={handleSearch}>
          <label htmlFor="mobile_number">Search</label>
          <input 
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            defaultValue={mobileNumber} />
          <button type="submit">Find</button>
        </form>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length === 0 && (
        <h5>No reservations found.</h5>
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
    </main>
  );
}

export default Search;
