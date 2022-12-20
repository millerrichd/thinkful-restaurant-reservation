import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables } from "../utils/api";
import axios from "axios";
import { API_BASE_URL as url } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
  const {reservationId} = useParams();
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [selected, setSelected] = useState("0");
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables)
    return () => abortController.abort()
  }, []);

  const handleChange = ({target}) => {
    if(target.value !== 0) {
      setSelected(target.value);
    }
  }

  const handleCancel = () => {
    history.goBack();
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    await seatReservation(selected);
  }

  async function seatReservation(data, signal) {
    console.log(`${url}/tables/${Number(data)}/seat`)
    axios.put(`${url}/tables/${Number(data)}/seat`, { data: {reservation_id: Number(reservationId)}})
      .then((res) => {
        console.log(res)
        if(res.status === 200) {
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
      {tablesError.map((errorMsg, index) => (
        <ErrorAlert key={index} error={errorMsg}/>
      ))}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_id">Select Table</label>
          <select
            className="form-control"
            id="table_id"
            name="table_id"
            placeholder="Select a Table"
            onChange={handleChange}
          >
            <option key="0" value="0">Select a Table</option>
            {tables.map((table, index) => (
              <option key={index} value={table.table_id}>{table.table_name} - {table.capacity}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-secondary" type="reset" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-primary mx-2" type="submit">Submit</button>
      </form>
    </>
  )
}

export default SeatReservation;