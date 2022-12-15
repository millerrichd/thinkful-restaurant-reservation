import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios"
import { API_BASE_URL as url } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import FormReservation from "./FormReservation";

function EditReservation({setDate}) {
  const [formData, setFormData] = useState({});
  const [errorMessages, setErrorMessages] = useState([])
  const history = useHistory();
  const { reservationId } = useParams();

  const handleCancel = () => {
    history.goBack();
  }
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateNewReservation(formData);
  }

  async function updateNewReservation(data, signal) {
    data.people = Number(data.people);
    axios.put(`${url}/reservations/${reservationId}`, { data: data})
      .then((res) => {
        if(res.status === 200) {
          setDate(formData.reservation_date)
          history.push(`/dashboard`)
        }
      })
      .catch((err) => {
        setErrorMessages([{message: err.response.data.error}])
      })
  }

  useEffect(() => {
    const abortController = new AbortController();
    console.log("RESERVATION ID", reservationId)
    axios.get(`${url}/reservations/${reservationId}`)
      .then((res) => {
        setFormData(res.data.data);
      })
      .catch((err) => {
        setErrorMessages([{message: err.response.data.error}]);
      })
    return () => abortController.abort()
  }, []);

  console.log("FORMDATA", formData)

  return (
    <>
      {errorMessages.map((errorMsg, index) => (
        <ErrorAlert key={index} error={errorMsg}/>
      ))}
      <FormReservation handleSubmit={handleSubmit} handleCancel={handleCancel} setFormData={setFormData} formData={formData} setErrorMessages={setErrorMessages} />
    </>
  )
}

export default EditReservation;