import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createNewReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert"
import FormReservation from "./FormReservation";

function NewReservation({setDate}) {
  const initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1
  }
  const [formData, setFormData] = useState(initialForm);
  const [errorMessages, setErrorMessages] = useState([])
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  }
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await createNewReservation(formData);
    setDate(formData.reservation_date)
    setFormData(initialForm);
    history.push(`/dashboard`)
  }

  return (
    <>
      {errorMessages.map((errorMsg) => (
        <ErrorAlert error={errorMsg}/>
      ))}
      <FormReservation handleSubmit={handleSubmit} handleCancel={handleCancel} setFormData={setFormData} formData={formData} setErrorMessages={setErrorMessages} />
    </>
  )
}

export default NewReservation;