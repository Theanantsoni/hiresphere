import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Upload, Trash2, CheckCircle } from "lucide-react";

const CompanyEmployees = () => {

  const { companyData, backendUrl, companyToken } = useContext(AppContext);

  const [employees,setEmployees] = useState([]);
  const [loading,setLoading] = useState(false);
  const [successPopup,setSuccessPopup] = useState(false);
  const [deleteIndex,setDeleteIndex] = useState(null);

  useEffect(()=>{

    if(companyData){

      const mapped = (companyData.employees || []).map((emp)=>({

        name:emp.name || "",
        position:emp.position || "",
        experience:emp.experience || "",
        photo:null,
        existingPhoto:emp.photo || ""

      }))

      setEmployees(mapped)

    }

  },[companyData])

  const addEmployee = ()=>{

    setEmployees(prev=>[
      ...prev,
      {
        name:"",
        position:"",
        experience:"",
        photo:null,
        existingPhoto:""
      }
    ])

  }

  const updateEmployee=(index,field,value)=>{

    setEmployees(prev=>{

      const updated=[...prev]
      updated[index][field]=value
      return updated

    })

  }

  const deleteEmployee=(index)=>{

    setDeleteIndex(index)

  }

  const confirmDeleteEmployee=()=>{

    setEmployees(prev=>prev.filter((_,i)=>i!==deleteIndex))
    setDeleteIndex(null)

  }

  const saveEmployees = async ()=>{

    try{

      setLoading(true)

      const formData = new FormData()

      const employeeData = employees.map(emp=>({

        name:emp.name,
        position:emp.position,
        experience:emp.experience,
        photo:emp.existingPhoto || ""

      }))

      formData.append("employees",JSON.stringify(employeeData))

      employees.forEach(emp=>{

        if(emp.photo){
          formData.append("employeePhotos",emp.photo)
        }

      })

      const {data} = await axios.post(
        `${backendUrl}/api/company/update-employees`,
        formData,
        {
          headers:{
            token:companyToken,
            "Content-Type":"multipart/form-data"
          }
        }
      )

      if(data.success){

        setSuccessPopup(true)

        setTimeout(()=>{
          setSuccessPopup(false)
        },2000)

      }
      else{

        toast.error(data.message)

      }

    }
    catch(error){

      toast.error(error.response?.data?.message || error.message)

    }
    finally{

      setLoading(false)

    }

  }

  if(!companyData){
    return <div className="p-10 text-center">Loading...</div>
  }

  return(

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* SUCCESS POPUP */}

      {successPopup && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white px-10 py-10 rounded-2xl shadow-2xl text-center space-y-4">

            <CheckCircle size={70} className="mx-auto text-green-500 animate-bounce"/>

            <h2 className="text-2xl font-semibold text-gray-800">
              Employees Updated
            </h2>

          </div>

        </div>

      )}

      {/* DELETE CONFIRM */}

      {deleteIndex !== null && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-8 text-center space-y-6">

            <Trash2 className="mx-auto text-red-500" size={50}/>

            <h2 className="text-xl font-semibold">
              Delete Employee?
            </h2>

            <p className="text-gray-500 text-sm">
              Are you sure you want to delete this employee?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={()=>setDeleteIndex(null)}
                className="px-5 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteEmployee}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

      <h1 className="text-2xl font-semibold">
        Company Employees
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">

        {employees.map((emp,index)=>(

          <div
            key={index}
            className="grid md:grid-cols-5 gap-6 border border-gray-200 p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition items-end"
          >

            <Input
              label="Employee Name"
              value={emp.name}
              onChange={(e)=>updateEmployee(index,"name",e.target.value)}
            />

            <Input
              label="Position"
              value={emp.position}
              onChange={(e)=>updateEmployee(index,"position",e.target.value)}
            />

            <Input
              label="Experience"
              value={emp.experience}
              onChange={(e)=>updateEmployee(index,"experience",e.target.value)}
            />

            <FileUpload
              label="Photo"
              existingPhoto={emp.existingPhoto}
              onChange={(file)=>{

                updateEmployee(index,"photo",file)
                updateEmployee(index,"existingPhoto","")

              }}
            />

            <button
              onClick={()=>deleteEmployee(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >

              <Trash2 size={16}/>
              Delete

            </button>

          </div>

        ))}

        <button
          onClick={addEmployee}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          + Add Employee
        </button>

      </div>

      <div className="flex justify-end">

        <button
          onClick={saveEmployees}
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg"
        >
          {loading ? "Saving..." : "Save Employees"}
        </button>

      </div>

    </div>

  )

}

export default CompanyEmployees


/* INPUT COMPONENT */

const Input = ({label,value,onChange}) => (

  <div className="space-y-1">

    <label className="text-sm font-medium text-gray-600">
      {label}
    </label>

    <input
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
    />

  </div>

)


/* FILE UPLOAD */

const FileUpload = ({label,existingPhoto,onChange}) => {

  const [preview,setPreview] = useState("")
  const [fileName,setFileName] = useState("")
  const [isNew,setIsNew] = useState(false)

  useEffect(()=>{

    if(existingPhoto){

      setPreview(existingPhoto)
      setIsNew(false)

    }

  },[existingPhoto])

  const handleChange=(e)=>{

    const file=e.target.files[0]

    if(file){

      setPreview(URL.createObjectURL(file))
      setFileName(file.name)
      setIsNew(true)
      onChange(file)

    }

  }

  return(

    <div className="space-y-1">

      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      {isNew && (
        <div className="text-xs text-indigo-500 truncate">
          {fileName}
        </div>
      )}

      <div className="flex items-center gap-3 mt-2">

        {preview && (
          <img
            src={preview}
            className="w-12 h-12 rounded-full object-cover border shadow"
          />
        )}

        <label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-indigo-50">

          <Upload size={16}/>
          Upload

          <input
            type="file"
            hidden
            onChange={handleChange}
          />

        </label>

      </div>

    </div>

  )

}