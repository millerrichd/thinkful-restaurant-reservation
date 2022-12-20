import React from "react";
import { Link } from "react-router-dom";

function ReservationSection({date, reservationsError, reservations, cancelReservation}) {
  return (
    <>
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id}>
          <div className="d-flex flex-row">
            {reservation.status === "booked" ? (
              <div className="d-flex flex-column justify-content-around">
                <Link className="btn btn-primary mx-4" to={`reservations/${reservation.reservation_id}/seat`}>Seat</Link>
                <Link className="btn btn-warning mx-4" to={`reservations/${reservation.reservation_id}/edit`}>Edit</Link>
                {cancelReservation && (
                  <button className="btn btn-danger mx-4" data-reservation-id-cancel={reservation.reservation_id} onClick={() => cancelReservation(reservation.reservation_id) }>Cancel</button>
                )}
              </div>
            ) : (
              <></>
            )}
            <div className="d-flex flex-column">
              <div className="text-start mt-2 fs-1">{reservation.reservation_time}</div>
              <div className="text-start fs-5">Date: {reservation.reservation_date}</div>
              <div className="text-start fs-5">Name: {reservation.first_name} {reservation.last_name}</div>
              <div className="text-start fs-5">Mobile: {reservation.mobile_number}</div>
              <div className="text-start fs-5">People: {reservation.people}</div>
              <div data-reservation-id-status={reservation.reservation_id} className="fs-5 text-uppercase">Status: {reservation.status}</div>
            </div>
          </div>
          <hr/>
        </div>
      ))}
    </>
);
}

export default ReservationSection;