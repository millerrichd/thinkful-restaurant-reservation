import React from "react";
import { today } from "../utils/date-time"

function FormReservation({handleSubmit, handleCancel, setFormData, formData, setErrorMessages}) {
  const handleChange = ({target}) => {
    if(target.name === "reservation_date") {
      const errorMessages = []
      const reservationDate = new Date(target.value).toUTCString()
      if(target.value < today()) {
        const pastError = new Error(`Date in the past. Please select a day in the future.`);
        errorMessages.push(pastError)
      }
      if(reservationDate.includes("Tue")) {
        const tueError = new Error(`We are closed on Tuesdays. Please select another date.`);
        errorMessages.push(tueError)
      }
      if(errorMessages.length > 0) {
        setErrorMessages(errorMessages)
      } else {
        setErrorMessages([])
        setFormData({...formData, [target.name]: target.value})
      }
    } else {
      setFormData({...formData, [target.name]: target.value});
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            className="form-control"
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            defaultValue={formData.first_name}/>
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            className="form-control"
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            defaultValue={formData.last_name}/>
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            className="form-control"
            id="mobile_number"
            type="text"
            name="mobile_number"
            onChange={handleChange}
            defaultValue={formData.mobile_number}/>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            className="form-control"
            id="reservation_date"
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            name="reservation_date"
            onChange={handleChange}
            defaultValue={formData.reservation_date}/>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            className="form-control"
            id="reservation_time"
            type="time"
            placeholder="HH:MM"
            pattern="\d{2}:\d{2}"
            name="reservation_time"
            onChange={handleChange}
            defaultValue={formData.reservation_time}/>
        </div>
        <div className="form-group">
          <label htmlFor="people">People</label>
          <input
            className="form-control"
            id="people"
            type="text"
            name="people"
            onChange={handleChange}
            defaultValue={formData.people}/>
        </div>
        <button type="reset" onClick={handleCancel}>Cancel</button>
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default FormReservation;