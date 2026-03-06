import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Mail, Upload, CheckCircle } from "lucide-react";

const CompanyProfile = () => {

  const { companyData, backendUrl, companyToken } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const [profile, setProfile] = useState({
    address: "",
    founded: "",
    ceoName: "",
    ceoPhoto: null,
    existingCeoPhoto: "",
  });

  useEffect(() => {

    if (companyData) {

      setProfile({
        address: companyData.address || "",
        founded: companyData.founded || "",
        ceoName: companyData.ceoName || "",
        ceoPhoto: null,
        existingCeoPhoto: companyData.ceoPhoto || "",
      });

    }

  }, [companyData]);

  const submitProfile = async () => {

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("address", profile.address);
      formData.append("founded", profile.founded);
      formData.append("ceoName", profile.ceoName);

      if (profile.ceoPhoto) {
        formData.append("ceoPhoto", profile.ceoPhoto);
      } else {
        formData.append("existingCeoPhoto", profile.existingCeoPhoto);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/company/update-profile`,
        formData,
        { headers: { token: companyToken } }
      );

      if (data.success) {

        setSuccessPopup(true);
        setTimeout(() => setSuccessPopup(false), 2500);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error(error.response?.data?.message || error.message);

    } finally {

      setLoading(false);

    }

  };

  if (!companyData) return <div className="p-10 text-center">Loading...</div>;

  return (

    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">

      {successPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white px-10 py-10 rounded-2xl shadow-2xl text-center space-y-4">

            <CheckCircle size={70} className="mx-auto text-green-500 animate-bounce"/>

            <h2 className="text-2xl font-semibold text-gray-800">
              Profile Updated Successfully
            </h2>

            <p className="text-gray-500 text-sm">
              Your company profile has been saved.
            </p>

          </div>

        </div>
      )}

      {/* COMPANY HEADER */}

      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-lg">

        <img
          src={companyData.image}
          className="w-24 h-24 bg-white rounded-xl object-contain p-3 shadow-md"
        />

        <div className="text-center md:text-left">

          <h2 className="text-3xl font-bold">
            {companyData.name}
          </h2>

          <div className="flex items-center justify-center md:justify-start gap-2 mt-2 opacity-90">
            <Mail size={16}/>
            {companyData.email}
          </div>

        </div>

      </div>

      {/* COMPANY INFO */}

      <Card title="Company Information">

        <div className="grid md:grid-cols-2 gap-6">

          <Input label="Company Name" value={companyData.name} disabled/>

          <Input label="Email" value={companyData.email} disabled/>

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

      </Card>

      {/* COMPANY DETAILS */}

      <Card title="Company Details">

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="Company Address"
            value={profile.address}
            onChange={(e)=>setProfile({...profile,address:e.target.value})}
          />

          <Input
            label="Founded Year"
            value={profile.founded}
            onChange={(e)=>setProfile({...profile,founded:e.target.value})}
          />

        </div>

      </Card>

      {/* CEO */}

      <Card title="CEO Information">

        <div className="grid md:grid-cols-2 gap-6 items-center">

          <Input
            label="CEO Name"
            value={profile.ceoName}
            onChange={(e)=>setProfile({...profile,ceoName:e.target.value})}
          />

          <FileUpload
            label="CEO Photo"
            existingPhoto={profile.existingCeoPhoto}
            onChange={(file)=>{
              setProfile({
                ...profile,
                ceoPhoto:file,
                existingCeoPhoto:"",
              })
            }}
          />

        </div>

      </Card>

      {/* SAVE BUTTON */}

      <div className="flex justify-end">

        <button
          onClick={submitProfile}
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg shadow-lg hover:shadow-xl transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </div>

    </div>

  );

};

export default CompanyProfile;

/* CARD */

const Card = ({title,children}) => (

  <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition space-y-6">

    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
      {title}
    </h3>

    {children}

  </div>

);

/* INPUT */

const Input = ({label,value,onChange,disabled=false}) => (

  <div className="space-y-1">

    <label className="text-sm font-medium text-gray-600">
      {label}
    </label>

    <input
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-lg text-sm transition
      focus:outline-none focus:ring-2 focus:ring-indigo-500
      ${disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-indigo-400"}
      `}
    />

  </div>

);

/* FILE UPLOAD */

const FileUpload = ({label,existingPhoto,onChange}) => {

  const [preview,setPreview] = useState("");

  useEffect(()=>{

    if(existingPhoto){
      setPreview(existingPhoto);
    }

  },[existingPhoto]);

  const handleChange=(e)=>{

    const file = e.target.files[0];

    if(file){
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }

  };

  return(

    <div className="space-y-1">

      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      <div className="flex items-center gap-3 mt-2">

        {preview && (
          <img
            src={preview}
            className="w-12 h-12 rounded-full object-cover border shadow"
          />
        )}

        <label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-indigo-50 hover:border-indigo-400 transition">

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

  );

};