import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationSection from "./ReservationSection";
import axios from "axios";
import { API_BASE_URL as url } from "../utils/api";

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

  function cancelReservationCall(reservationId) {
    const abortController = new AbortController();
    axios.put(`${url}/reservations/${reservationId}/status`, { data: { status: "cancelled" }, signal: abortController.signal }).then((res) => {
      console.log("RES.STATUS", res.status)
      if(res.status === 200) {
        loadDashboard()
      }
    })
    .catch((err) => {
      console.log("ERROR", err)
    })
    return () => abortController.abort();
  }

  const cancelReservation = (reservationId) => {
    const response = window.confirm(
      'Do you want to cancel this reservation? This cannot be undone.'
    )
    console.log("RESPONSE OF CANCEL", response)
    console.log("RESERVATION ID", reservationId)
    if(response) {
      cancelReservationCall(reservationId);
    }
  }

  return (
    <main>
      <h1>Search</h1>
      <div>
        <form onSubmit={handleSearch}>
          <label htmlFor="mobile_number">Search</label>
          <input 
            className="form-control searchbar"
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            defaultValue={mobileNumber} />
          <button className="btn btn-secondary" type="submit">Find</button>
        </form>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length === 0 && (
        <h5 className="text-center my-3">No reservations found.</h5>
      )}
      <ReservationSection reservationsError={reservationsError} reservations={reservations} cancelReservation={cancelReservation}/>
    </main>
  );
}

export default Search;
