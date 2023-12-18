import axios from "axios";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
const port = 4000;


export function ToDoApp(){
    const [appointments, setAppointments] = useState([]);
    const [toggleAdd,setToggleAdd] = useState({display:'block'});
    const [toggleEdit,setToggleEdit] = useState({display:'none'});
    const [editAppoint,setEditAppointment] = useState([{Id:0,Title:'',Date:new Date(),Description:''}]);
    const formik = useFormik({
        initialValues:{
            Id:0,
            Title:'',
            Description:'',
            Date: new Date()
        },
        onSubmit: (appointment) => {
            axios.post(`http://localhost:${port}/addtask`,appointment);
            alert('Appointment Added Successfully...');
            window.location.reload()
        }
    })

    const editFormik = useFormik({
        initialValues: {
            Id:editAppoint[0].Id,
            Title:editAppoint[0].Title,
              Date: `${editAppoint[0].Date.toString().slice(0,editAppoint[0].Date.toString().indexOf("T"))}`,
            // Date:editAppoint[0].Date,
            Description:editAppoint[0].Description
        },
        enableReinitialize:true, // to allow modifying in form we have to set it to true
        onSubmit:(appointment) => {
            axios.put(`http://localhost:${port}/edittask/${editAppoint[0].Id}`,appointment)//put method is expecting req.body  data
            alert("Updated Successfully..")
            window.location.reload();
        }

    })

    function LoadAppointments(){
        axios.get(`http://localhost:${port}/appointments`)
        .then(response=> {
            setAppointments(response.data);
        })
    }
    function handleDeleteClick(e){
        const id = parseInt(e.target.value);
        console.log(id)
        const flag = window.confirm(`Are you sure \n Want to Delete`);
        if(flag){
            axios.delete(`http://localhost:${port}/deletetask/${id}`)
            window.location.reload();
        }

    }

    function handleEditClick(id){
        setToggleAdd({display:'none'});
        setToggleEdit({display:'block'})
       axios.get(`http://localhost:${port}/appointments/${id}`)
       .then(res => {
        setEditAppointment(res.data)
       })         
    }

    function handleCancelClick(){
        setToggleAdd({display:'block'});
        setToggleEdit({display:'none'});
    }

    useEffect(()=>{
        LoadAppointments();
    },[]);
    return(
        <div className="container-fluid mt-4">
            <h1 className="text-center">To Do List App</h1>
            <div className="row gy-5">
            <header className="col-3">

                <div aria-label="AddAppointment" style={toggleAdd}>
                <label htmlFor="" className="form-label fw-bold">Add New Appointments</label>
                   <div>
                    <form action="" onSubmit={formik.handleSubmit}>
                        <div className="d-flex mb-3">  
                            <div className="form-floating me-2 w-50">
                                <input type="number" className="form-control" id="floatingInputID" placeholder="Id" name="Id" onChange={formik.handleChange} value={formik.values.Id}   />
                                <label htmlFor="floatingInputID">ID</label>
                            </div>
                            
                            {/* <input type="number" name="Id" onChange={formik.handleChange} value={Math.floor(Math.random() * 10)}   /> */}


                            <div className="form-floating me-2 w-100">
                                <input type="text" className="form-control" id="floatingTitle" placeholder="Title" name="Title" onChange={formik.handleChange} />
                                <label htmlFor="floatingTitle">Title</label>
                            </div>
                            <div className="form-floating w-100">
                                <input type="date" className="form-control" id="floatingDate" placeholder="Date" name="Date" onChange={formik.handleChange} />
                                <label htmlFor="floatingDate">Date</label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputDescription" className="form-label fw-bold">Description</label>
                            <textarea className="form-control" id="inputDescription" rows="3" name="Description" onChange={formik.handleChange}></textarea>
                        </div>
                        <button className="btn btn-primary p-2 w-25">Add +</button>
                    </form>
                   </div>
                </div>


                <div aria-label="EditAppointment" style={toggleEdit}>
                <label htmlFor="" className="form-label fw-bold">Edit Appointments</label>
                   <div>
                    <form action="" onSubmit={editFormik.handleSubmit}>
                        <div className="d-flex mb-3">  
                            <div className="form-floating me-2 w-50">
                                <input type="number" className="form-control" id="floatingInputID" placeholder="Id" name="Id" onChange={editFormik.handleChange} value={editFormik.values.Id}       />
                                <label htmlFor="floatingInputID">ID</label>
                            </div>
                            <div className="form-floating me-2 w-100">
                                <input type="text" className="form-control" id="floatingTitle" placeholder="Title" name="Title" onChange={editFormik.handleChange} value={editFormik.values.Title}/>
                                <label htmlFor="floatingTitle">Title</label>
                            </div>
                            <div className="form-floating w-100">
                                <input type="date" className="form-control" id="floatingDate" placeholder="Date" name="Date" onChange={editFormik.handleChange} value={editFormik.values.Date} />
                                <label htmlFor="floatingDate">Date</label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputDescription" className="form-label fw-bold">Description</label>
                            <textarea className="form-control" id="inputDescription" rows="3" name="Description" onChange={editFormik.handleChange} value={editFormik.values.Description}></textarea>
                        </div>
                        <button className="btn btn-success p-2 me-2">Save</button>
                        <button type="button" className="btn btn-danger p-2" onClick={handleCancelClick}>Cancel</button>
                    </form>
                   </div>
                </div>

            </header>
            <main className="col-9">
                <div>
                    <label htmlFor="" className="form-label fw-bold">Your Appointments</label>
                    <div className="d-flex flex-wrap">
                        {
                            appointments.map(appointment => 
                                <div className="alert alert-dismissible alert-primary m-2 w-25" key={appointment.Id}>
                                    <button className="btn btn-close" onClick={handleDeleteClick} value={appointment.Id}></button>
                                    <div className="h5 alert-title">{appointment.Title}</div>
                                    <p>{appointment.Description}</p>
                                    <span className="bi bi-calendar me-1"></span>{appointment.Date.slice(0,appointment.Date.indexOf('T'))}
                                    <div className="mt-2">
                                        <button className="btn btn-outline-primary bi bi-pen-fill" onClick={() => {handleEditClick(appointment.Id)}}></button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </main>
            </div>
        </div>
    )
}
