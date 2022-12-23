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
            <div className="d-flex flex-column card p-3 text-light">
              <div className="mt-2 fs-1 card-title">{reservation.reservation_time}</div>
              <div className="card-text">Date: {reservation.reservation_date}</div>
              <div className="card-text">Name: {reservation.first_name} {reservation.last_name}</div>
              <div className="card-text">Mobile: {reservation.mobile_number}</div>
              <div className="card-text">People: {reservation.people}</div>
              <div data-reservation-id-status={reservation.reservation_id} className="card-text text-uppercase">Status: {reservation.status}</div>
            </div>
          </div>
          <hr/>
        </div>
      ))}
    </>
);
}

export default ReservationSection;