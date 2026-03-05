import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Mail, CheckCircle, Calendar, MapPin, Users, Upload } from "lucide-react";

const CompanyProfile = () => {
  const { companyData } = useContext(AppContext);

  const [profile, setProfile] = useState({
    address: "",
    founded: "",
    ceoName: "",
    ceoPhoto: null,
  });

  const [employees, setEmployees] = useState([]);

  const addEmployee = () => {
    setEmployees([
      ...employees,
      { name: "", position: "", photo: null },
    ]);
  };

  const updateEmployee = (index, field, value) => {
    const updated = [...employees];
    updated[index][field] = value;
    setEmployees(updated);
  };

  const isEmployeeComplete = (emp) =>
    emp.name && emp.position && emp.photo;

  if (!companyData) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg flex items-center gap-6">

        <div className="w-28 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={companyData.image}
            alt="company"
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <h2 className="text-3xl font-bold">{companyData.name}</h2>

          <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
            <Mail size={16} />
            {companyData.email}
          </div>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

        <h3 className="text-xl font-semibold">
          Company Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <Input label="Company Name" value={companyData.name} disabled />
          <Input label="Email" value={companyData.email} disabled />

          <Input
            label="Verification"
            value={companyData.isVerified ? "Verified" : "Not Verified"}
            disabled
          />

          <Input
            label="Account Created"
            value={new Date(companyData.createdAt).toLocaleDateString()}
            disabled
          />

        </div>
      </div>

      {/* COMPANY DETAILS */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MapPin size={18}/> Company Details
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="Company Address"
            value={profile.address}
            onChange={(e)=>setProfile({...profile,address:e.target.value})}
          />

          <Input
            label="Founded Year"
            type="number"
            value={profile.founded}
            onChange={(e)=>setProfile({...profile,founded:e.target.value})}
          />

        </div>
      </div>

      {/* CEO SECTION */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

        <h3 className="text-xl font-semibold">
          CEO Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="CEO Name"
            value={profile.ceoName}
            onChange={(e)=>setProfile({...profile,ceoName:e.target.value})}
          />

          <FileUpload
            label="CEO Photo"
            onChange={(file)=>setProfile({...profile,ceoPhoto:file})}
          />

        </div>
      </div>

      {/* EMPLOYEES */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Users size={18}/> Employees
        </h3>

        {employees.map((emp,index)=>(
          <div
            key={index}
            className="grid md:grid-cols-3 gap-6 border p-6 rounded-xl bg-gray-50"
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

            <FileUpload
              label="Photo"
              onChange={(file)=>updateEmployee(index,"photo",file)}
            />

          </div>
        ))}

        {/* ADD EMPLOYEE BUTTON */}
        {(employees.length === 0 ||
          isEmployeeComplete(employees[employees.length-1])) && (

          <button
            onClick={addEmployee}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            + Add Employee
          </button>

        )}

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-4">

        <button className="px-6 py-3 border rounded-lg hover:bg-gray-100">
          Cancel
        </button>

        <button
          onClick={()=>window.location.reload()}
          className="px-6 py-3 border rounded-lg hover:bg-gray-100"
        >
          Reset
        </button>

        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Submit
        </button>

      </div>

    </div>
  );
};

export default CompanyProfile;



/* INPUT COMPONENT */

const Input = ({label,value,onChange,disabled=false,type="text"}) => (
  <div>
    <label className="text-gray-500 text-sm">{label}</label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={`w-full mt-1 p-3 border rounded-lg ${
        disabled ? "bg-gray-100" : ""
      }`}
    />
  </div>
);


/* FILE UPLOAD COMPONENT */

const FileUpload = ({label,onChange}) => (
  <div>
    <label className="text-gray-500 text-sm">{label}</label>

    <label className="mt-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition">

      <Upload size={18}/>
      <span>Choose File</span>

      <input
        type="file"
        className="hidden"
        onChange={(e)=>onChange(e.target.files[0])}
      />

    </label>

  </div>
);