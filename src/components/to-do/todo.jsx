import axios from "axios";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from 'yup'
import './todo.css'
const port = 4000;
const getCurrentDate = () => {
    const currentDate = new Date();
     // Get the day, attach with a leading zero if it's a single digit
    const day = String(currentDate.getDate()).padStart(2, '0');
     // Get the month, add 1 cause months are zero base & attach with a leading zero if it's a single digit
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    //get the year
    const year = currentDate.getFullYear();
    return `${year}-${month}-${day}`;
  };

export function ToDoApp(){
    const [appointments, setAppointments] = useState([]);
    const [toggleAdd,setToggleAdd] = useState({display:'block'});
    const [toggleEdit,setToggleEdit] = useState({display:'none'});
    const [editAppoint,setEditAppointment] = useState([{Id:0,Title:'',Date:new Date(),Description:''}]);
    function LoadAppointments(){
        axios.get(`http://localhost:${port}/appointments`)
        .then(response=> {
            setAppointments(response.data);
            formik.values.Id= response.data.length+1;
        }).catch(error => {
            console.log(error.message);
        })
    }
    const formik = useFormik({
        initialValues:{
            Id:1,
            Title:'',
            Description:'',
            Date: getCurrentDate().toString()
        },
        validationSchema: yup.object({
            Id:yup.number().required("Id is Required"),
            Title:yup.string().required("Title is Required").min(2,'Title too short').max(25,'Title too long'),
            Date:yup.date().required("Date is Required").min(getCurrentDate(),"Date can't be past dates"),
            Description:yup.string().required("Description is required").max(150,"Description is too long")
        }),
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
            Description:editAppoint[0].Description
        },
        enableReinitialize:true, // to allow modifying in form we have to set it to true
        onSubmit:(appointment) => {
            axios.put(`http://localhost:${port}/edittask/${editAppoint[0].Id}`,appointment)//put method is expecting req.body  data
            alert("Updated Successfully..")
            window.location.reload();
        }

    })
    
    function handleDeleteClick(e){
        const id = parseInt(e.target.value);
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
        //eslint-disable-next-line
    },[]);
    return(
        <div className="container-fluid to-do">
            <nav className="nav bg-primary mb-4 text-white d-flex justify-content-center align-items-center p-2" style={{marginLeft:'-20px',marginRight:'-20px'}}><h1 className="text-center">To Do App</h1></nav>
            
            <div className="row gy-5">
            <header className="col-sm-12 col-md-3">

                <div aria-label="AddAppointment" style={toggleAdd}>
                <label htmlFor="" className="form-label fw-bold">Add New Appointments</label>
                   <div>
                    <form action="" onSubmit={formik.handleSubmit}>
                        <div className="d-flex mb-3">  
                            <input type="hidden" name="Id" onChange={formik.handleChange} value={formik.values.Id} {...formik.getFieldProps('Id')}  />
                            <div className="form-floating me-2 w-100">
                                <input type="text" className="form-control" id="floatingTitle" placeholder="Title" name="Title" onChange={formik.handleChange} {...formik.getFieldProps('Title')} />
                                <label htmlFor="floatingTitle">Title</label>
                                <p className="text-danger">{formik.errors.Title}</p>
                            </div>
                            <div className="form-floating w-100">
                                <input type="date" className="form-control" id="floatingDate" placeholder="Date" name="Date" onChange={formik.handleChange} {...formik.getFieldProps('Date')} value={formik.values.Date}/>
                                <label htmlFor="floatingDate">Date</label>
                                <p className="text-danger">{formik.errors.Date}</p>
                            </div>  
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputDescription" className="form-label fw-bold">Description</label>
                            <textarea className="form-control" id="inputDescription" rows="3" name="Description" onChange={formik.handleChange} {...formik.getFieldProps('Description')}></textarea>
                            <p className="text-danger">{formik.errors.Description}</p>
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
                                <input type="hidden" name="Id" onChange={editFormik.handleChange} value={editFormik.values.Id}       />
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
                        
                        {editFormik.dirty && <button className="btn btn-success p-2 me-2">Save</button>}
                        <button type="button" className="btn btn-danger p-2" onClick={handleCancelClick}>Cancel</button>
                    </form>
                   </div>
                </div>

            </header>
            <main className="col-sm-12 col-md-9">
                <div>
                    <label htmlFor="" className="form-label fw-bold">Your Appointments</label>
                    <div className="d-flex flex-wrap">
                        {
                            appointments.map(appointment => 
                                <div className="alert alert-dismissible alert-primary m-2" key={appointment.Id} id="taskMainContainer">
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
