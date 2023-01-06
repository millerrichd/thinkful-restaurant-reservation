import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import axios from "axios"
import { API_BASE_URL as url } from "../utils/api"

import ErrorAlert from "../layout/ErrorAlert"
import FormReservation from "./FormReservation";

function NewReservation({setDate}) {
  const initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1"
  }
  const [formData, setFormData] = useState(initialForm);
  const [errorMessages, setErrorMessages] = useState([])
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  }
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    // All the submit validation goes here
    const tempErrorMessages = []
    //check the names
    if(!formData.first_name) {
      tempErrorMessages.push({message: `First Name must be provided.`})
    }
    if(!formData.last_name) {
      tempErrorMessages.push({message: `Last Name must be provided.`})
    }
    //check the mobile number
    const numRe = /\d{3}\-?\d{3}\-?\d{4}/
    if(!formData.mobile_number) {
      tempErrorMessages.push({message: `Mobile Number must be provided.`})
    }
    if(!formData.mobile_number.match(numRe)) {
      tempErrorMessages.push({message: `Mobile Number is required to be either format of ###-###-#### or ##########`})
    }
    //check reservation date/time
    console.log("RES-DATE:", formData.reservation_date)
    if(formData.reservation_date && formData.reservation_time) {
      const today = moment();
      const testDateTime = moment(`${formData.reservation_date}T${formData.reservation_time}`);
      if(testDateTime < today) {
        tempErrorMessages.push({message: `Date occurs in the past. Please select a date and time in the future.`})
      }
      if(testDateTime.format('dddd') === "Tuesday") {
        tempErrorMessages.push({message: `We are closed on Tuesday's, please select another day.`})
      }
      if(formData.reservation_time < "10:30" || formData.reservation_time > "21:30") {
        tempErrorMessages.push({message: `The restaurant does not accept reservations before 10:30 AM and after 9:30 PM.`})
      }
    } else {
      tempErrorMessages.push({message: `Date and Time needs to be supplied.`})
    }
    //check the people
    if(Number(formData.people) < 1) {
      tempErrorMessages.push({message: `'people' is required to be a number and positive.`})
    }
    if(tempErrorMessages.length > 0) {
      setErrorMessages(tempErrorMessages);
    } else {
      await createNewReservation(formData);
    }
  }

  async function createNewReservation(data, signal) {
    data.people = Number(data.people);
    const abortController = new AbortController();
    axios.post(`${url}/reservations`, { data: data, signal: abortController.signal})
      .then((res) => {
        if(res.status === 201) {
          setDate(formData.reservation_date)
          history.push(`/dashboard`)
        }
      })
      .catch((err) => {
        setErrorMessages([{message: err.response.data.error}])
      })
    return () => abortController.abort();
  }

  return (
    <>
      {errorMessages.map((errorMsg, index) => (
        <ErrorAlert key={`error-${index}`} error={errorMsg}/>
      ))}
      <FormReservation handleSubmit={handleSubmit} handleCancel={handleCancel} setFormData={setFormData} formData={formData} errorMessages={errorMessages} setErrorMessages={setErrorMessages}/>
    </>
  )
}

export default NewReservation;