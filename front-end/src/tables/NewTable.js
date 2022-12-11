import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios"
import { API_BASE_URL as url } from "../utils/api"

import ErrorAlert from "../layout/ErrorAlert"
import FormTable from "./FormTable";

function NewReservation() {
  const initialForm = {
    table_name: "",
    capacity: 0
  }
  const [formData, setFormData] = useState(initialForm);
  const [errorMessages, setErrorMessages] = useState([])
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  }
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    await createNewTable(formData);
  }

  async function createNewTable(data, signal) {
    console.log(data.capacity)
    data.capacity = Number(data.capacity);
    axios.post(`${url}/tables`, { data: data})
      .then((res) => {
        if(res.status === 201) {
          history.push(`/dashboard`)
        }
      })
      .catch((err) => {
        setErrorMessages([{message: err.response.data.error}])
      })
  }

  return (
    <>
      {errorMessages.map((errorMsg, index) => (
        <ErrorAlert key={index} error={errorMsg}/>
      ))}
      <FormTable handleSubmit={handleSubmit} handleCancel={handleCancel} setFormData={setFormData} formData={formData} />
    </>
  )
}

export default NewReservation;