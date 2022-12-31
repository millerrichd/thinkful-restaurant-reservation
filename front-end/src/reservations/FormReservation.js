import React from "react";
import moment from "moment";

function FormReservation({handleSubmit, handleCancel, setFormData, formData, errorMessages, setErrorMessages}) {
  const handleChange = ({target}) => {
    const today = moment();
    if(target.name === "reservation_date") {
      let testDateTime = moment();
      if(formData.reservation_time) {
        testDateTime = moment(`${target.value}T${formData.reservation_time}`);
      } else {
        testDateTime = moment(`${target.value}T00:00:00`);
      }
      if(testDateTime < today) {
        let found = false
        const tempErrorMessages = errorMessages
        tempErrorMessages.forEach((err, index) => {
          if(err.message === `Date occurs in the past. Please select a date and time in the future.`) {
            found = true
          }
          if(err.message === `We are closed on Tuesday's, please select another day.`) {
            if(testDateTime.format('dddd') !== "Tuesday") {
              tempErrorMessages[index] = ''
            }
          }
        })
        if(!found) {
          setErrorMessages([...tempErrorMessages, {message: `Date occurs in the past. Please select a date and time in the future.`}])
        }
      } else if(testDateTime.format('dddd') === "Tuesday") {
        let found = false
        const tempErrorMessages = errorMessages
        tempErrorMessages.forEach((err, index) => {
          if(err.message === `We are closed on Tuesday's, please select another day.`) {
            found = true
          }
          if(err.message === `Date occurs in the past. Please select a date and time in the future.`) {
            if(testDateTime >= today) {
              tempErrorMessages[index] = ''
            }
          }
        })
        if(!found) {
          setErrorMessages([...tempErrorMessages, {message: `We are closed on Tuesday's, please select another day.`}])
        }
      } else {
        const tempError = [...errorMessages]
        const set = new Set(tempError)
        set.forEach((entry) => {
          if(entry.message === `Date occurs in the past. Please select a date and time in the future.`) {
            set.delete(entry);
          }
          if(entry.message === `We are closed on Tuesday's, please select another day.`) {
            set.delete(entry);
          }
        })
        setErrorMessages(Array.from(set))
      }
    } else if(target.name === "reservation_time") {
      console.log("target.value < '10:30' || target.value > '21:30'", target.value < "10:30" || target.value > "21:30")
      if(target.value < "10:30" || target.value > "21:30") {
        let found = false
        const tempErrorMessages = errorMessages
        tempErrorMessages.forEach((err, index) => {
          if(err.message === `The restaurant does not accept reservations before 10:30 AM and after 9:30 PM.`) {
            found = true
          }
        })
        if(!found) {
          setErrorMessages([...tempErrorMessages, {message: `The restaurant does not accept reservations before 10:30 AM and after 9:30 PM.`}])
        }
      } else {
        const tempError = [...errorMessages] 
        const set = new Set(tempError)
        set.forEach((entry) => {
          if(entry.message === `The restaurant does not accept reservations before 10:30 AM and after 9:30 PM.`) {
            set.delete(entry)
          }
        })
        setErrorMessages(Array.from(set))
      }
    }
    setFormData({...formData, [target.name]: target.value});
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            className="form-control searchbar"
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            defaultValue={formData.first_name}/>
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            className="form-control searchbar"
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            defaultValue={formData.last_name}/>
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            className="form-control searchbar"
            id="mobile_number"
            type="text"
            name="mobile_number"
            onChange={handleChange}
            defaultValue={formData.mobile_number}/>
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            className="form-control searchbar"
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
            className="form-control searchbar"
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
            className="form-control searchbar"
            id="people"
            type="number"
            name="people"
            onChange={handleChange}
            defaultValue={formData.people}/>
        </div>
        <button className="btn btn-secondary" type="reset" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-primary mx-2" type="submit">Submit</button>
      </form>
    </>
  )
}

export default FormReservation;