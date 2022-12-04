import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createNewReservation } from "../utils/api";

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
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  }

  const handleSubmit = async (event) => {
    console.log("FORMDATA", formData)
    event.preventDefault();
    const result = await createNewReservation(formData);
    console.log("RESULT", result)
    setDate(formData.reservation_date)
    setFormData(initialForm);
    history.push(`/dashboard`)
  }

  return (
    <>
      <FormReservation handleSubmit={handleSubmit} handleCancel={handleCancel} setFormData={setFormData} formData={formData} />
    </>
  )
}

export default NewReservation;