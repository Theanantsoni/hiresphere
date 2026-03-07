import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Upload, Trash2, CheckCircle, Plus } from "lucide-react";

const CompanyEmployees = () => {

  const { companyData, backendUrl, companyToken } = useContext(AppContext);

  const [employees,setEmployees] = useState([]);
  const [loading,setLoading] = useState(false);
  const [successPopup,setSuccessPopup] = useState(false);
  const [deleteIndex,setDeleteIndex] = useState(null);
  const [search,setSearch] = useState("");
  const [showAddModal,setShowAddModal] = useState(false);

  const [newEmployee,setNewEmployee] = useState({
    name:"",
    position:"",
    experience:"",
    photo:null,
    preview:""
  });

  useEffect(()=>{

    if(companyData){

      const mapped = (companyData.employees || []).map(emp=>({

        name:emp.name || "",
        position:emp.position || "",
        experience:emp.experience || "",
        photo:null,
        existingPhoto:emp.photo || ""

      }));

      setEmployees(mapped);

    }

  },[companyData]);


  const updateEmployee=(index,field,value)=>{

    setEmployees(prev=>{

      const updated=[...prev];
      updated[index][field]=value;
      return updated;

    });

  };


  const deleteEmployee=(index)=>{

    setDeleteIndex(index);

  };


  const confirmDeleteEmployee=()=>{

    setEmployees(prev=>prev.filter((_,i)=>i!==deleteIndex));
    setDeleteIndex(null);

  };


  const handleNewPhoto=(file)=>{

    if(file){

      setNewEmployee(prev=>({

        ...prev,
        photo:file,
        preview:URL.createObjectURL(file)

      }));

    }

  };


  const addEmployeeSubmit=()=>{

    if(!newEmployee.name || !newEmployee.position || !newEmployee.experience || !newEmployee.photo){

      toast.error("All fields required");
      return;

    }

    const employee = {

      name:newEmployee.name,
      position:newEmployee.position,
      experience:newEmployee.experience,
      photo:newEmployee.photo,
      existingPhoto:""

    };

    setEmployees(prev=>[employee,...prev]);

    setNewEmployee({
      name:"",
      position:"",
      experience:"",
      photo:null,
      preview:""
    });

    setShowAddModal(false);

  };


  const validateEmployees = () => {

    for(let emp of employees){

      if(!emp.name || !emp.position || !emp.experience){

        toast.error("Employee fields cannot be empty");
        return false;

      }

    }

    return true;

  };


  const saveEmployees = async ()=>{

    if(!validateEmployees()) return;

    try{

      setLoading(true);

      const formData = new FormData();

      const employeeData = employees.map(emp=>({

        name:emp.name,
        position:emp.position,
        experience:emp.experience,
        photo:emp.existingPhoto || ""

      }));

      formData.append("employees",JSON.stringify(employeeData));

      employees.forEach(emp=>{

        if(emp.photo){
          formData.append("employeePhotos",emp.photo);
        }

      });

      const {data} = await axios.post(
        `${backendUrl}/api/company/update-employees`,
        formData,
        {
          headers:{
            token:companyToken,
            "Content-Type":"multipart/form-data"
          }
        }
      );

      if(data.success){

        setSuccessPopup(true);

        setTimeout(()=>{

          setSuccessPopup(false);

        },2000);

      }
      else{

        toast.error(data.message);

      }

    }
    catch(error){

      toast.error(error.response?.data?.message || error.message);

    }
    finally{

      setLoading(false);

    }

  };


  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.position.toLowerCase().includes(search.toLowerCase()) ||
    emp.experience.toLowerCase().includes(search.toLowerCase())
  );


  if(!companyData){
    return <div className="p-10 text-center">Loading...</div>;
  }


  return(

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">


      {successPopup && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white px-10 py-10 rounded-2xl shadow-xl text-center">

            <CheckCircle size={70} className="mx-auto text-green-500 mb-4"/>

            <h2 className="text-2xl font-semibold">
              Employees Updated
            </h2>

          </div>

        </div>

      )}


      {deleteIndex !== null && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl p-8 text-center space-y-6">

            <Trash2 className="mx-auto text-red-500" size={50}/>

            <h2 className="text-xl font-semibold">
              Delete Employee?
            </h2>

            <div className="flex justify-center gap-4">

              <button
                onClick={()=>setDeleteIndex(null)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteEmployee}
                className="px-5 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}


      {showAddModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[420px] rounded-xl shadow-xl p-8 space-y-4">

            <h2 className="text-xl font-semibold text-center">
              Add Employee
            </h2>

            <Input
              label="Employee Name"
              value={newEmployee.name}
              onChange={(e)=>setNewEmployee({...newEmployee,name:e.target.value})}
            />

            <Input
              label="Position"
              value={newEmployee.position}
              onChange={(e)=>setNewEmployee({...newEmployee,position:e.target.value})}
            />

            <Input
              label="Experience"
              value={newEmployee.experience}
              onChange={(e)=>setNewEmployee({...newEmployee,experience:e.target.value})}
            />

            <UploadField
              preview={newEmployee.preview}
              onChange={handleNewPhoto}
            />

            <div className="flex justify-end gap-3 pt-4">

              <button
                onClick={()=>setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={addEmployeeSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Add Employee
              </button>

            </div>

          </div>

        </div>

      )}


      <div className="flex flex-wrap justify-between items-center gap-4">

        <h1 className="text-2xl font-semibold">
          Company Employees
        </h1>

        <div className="flex gap-3">

          <button
            onClick={()=>setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
          >
            <Plus size={16}/>
            Add Employee
          </button>

          <button
            onClick={saveEmployees}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>


      <input
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="w-full md:w-80 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />


      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Employee Name</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Experience</th>
              <th className="p-4 text-left">Photo</th>
              <th className="p-4 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredEmployees.map((emp,index)=>(

              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="p-4">

                  <input
                    value={emp.name}
                    onChange={(e)=>updateEmployee(index,"name",e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                </td>

                <td className="p-4">

                  <input
                    value={emp.position}
                    onChange={(e)=>updateEmployee(index,"position",e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                </td>

                <td className="p-4">

                  <input
                    value={emp.experience}
                    onChange={(e)=>updateEmployee(index,"experience",e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                </td>

                <td className="p-4">

                  <UploadField
                    preview={emp.photo ? URL.createObjectURL(emp.photo) : emp.existingPhoto}
                    onChange={(file)=>{

                      updateEmployee(index,"photo",file);
                      updateEmployee(index,"existingPhoto","");

                    }}
                  />

                </td>

                <td className="p-4">

                  <button
                    onClick={()=>deleteEmployee(index)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    <Trash2 size={16}/>
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default CompanyEmployees;



const Input = ({label,value,onChange}) => (

  <div className="space-y-1">

    <label className="text-sm text-gray-600">
      {label}
    </label>

    <input
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
    />

  </div>

);



const UploadField = ({preview,onChange}) => (

  <div className="flex items-center gap-3">

    {preview && (
      <img
        src={preview}
        className="w-10 h-10 rounded-full object-cover border"
      />
    )}

    <label className="flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer hover:bg-indigo-50 text-sm">

      <Upload size={16}/>
      Upload

      <input
        type="file"
        hidden
        onChange={(e)=>onChange(e.target.files[0])}
      />

    </label>

  </div>

);