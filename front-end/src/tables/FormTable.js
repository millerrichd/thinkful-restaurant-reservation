import React from "react";

function FormTables({handleSubmit, handleCancel, setFormData, formData}) {
  const handleChange = ({target}) => {
    setFormData({...formData, [target.name]: target.value});
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            className="form-control searchbar"
            id="table_name"
            type="text"
            name="table_name"
            onChange={handleChange}
            defaultValue={formData.table_name}/>
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            className="form-control searchbar"
            id="capacity"
            type="number"
            name="capacity"
            onChange={handleChange}
            defaultValue={formData.capacity}/>
        </div>
        <button className="btn btn-secondary" type="reset" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-primary mx-2" type="submit">Submit</button>
      </form>
    </>
  )
}

export default FormTables;