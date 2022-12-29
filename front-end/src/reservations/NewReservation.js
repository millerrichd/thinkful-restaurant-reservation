import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
    await createNewReservation(formData);
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
      <FormReservation handleSubmit={handleSubmit} handleCancel={handleCancel} setFormData={setFormData} formData={formData} setErrorMessages={setErrorMessages} />
    </>
  )
}

export default NewReservation;