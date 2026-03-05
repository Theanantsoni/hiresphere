import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {

  const navigate = useNavigate();

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const [state, setstate] = useState("Login");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  const [serverOtp, setServerOtp] = useState(null);
  const [tempCompany, setTempCompany] = useState(null);

  /* ================= FORM SUBMIT ================= */

  const onSubmitHandler = async (e) => {

    e.preventDefault();

    if (state === "Sign Up" && !isTextDataSubmited) {
      setIsTextDataSubmited(true);
      return;
    }

    /* ================= LOGIN ================= */

    if (state === "Login") {

      try {

        const { data } = await axios.post(
          backendUrl + "/api/company/login",
          { email, password }
        );

        if (!data.success) {
          return toast.error(data.message);
        }

        setCompanyData(data.company);
        setCompanyToken(data.token);

        localStorage.setItem("companytoken", data.token);

        setShowRecruiterLogin(false);

        navigate("/dashboard");

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Login failed"
        );

      }

      return;
    }


    /* ================= REGISTER ================= */

    if (!image) {
      return toast.error("Please upload company logo");
    }

    // show OTP popup immediately
    setShowOtpBox(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    axios
      .post(backendUrl + "/api/company/register", formData)
      .then(({ data }) => {

        if (!data.success) {
          setShowOtpBox(false);
          return toast.error(data.message);
        }

        toast.success("OTP sent to your email");

        setServerOtp(data.otp);
        setTempCompany(data.tempCompany);

      })
      .catch((error) => {

        setShowOtpBox(false);

        toast.error(
          error.response?.data?.message ||
          error.message ||
          "Registration failed"
        );

      });

  };


  /* ================= VERIFY OTP ================= */

  const verifyOtp = async () => {

    if (!otp) {
      return toast.error("Please enter OTP");
    }

    try {

      const { data } = await axios.post(
        backendUrl + "/api/company/verify-otp",
        {
          otp: serverOtp,
          userOtp: otp,
          tempCompany
        }
      );

      if (!data.success) {
        return toast.error(data.message);
      }

      toast.success("Email verified successfully");

      setCompanyToken(data.token);
      setCompanyData(data.company);

      localStorage.setItem("companytoken", data.token);

      setShowRecruiterLogin(false);

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed"
      );

    }

  };


  /* ================= PREVENT PAGE SCROLL ================= */

  useEffect(() => {

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };

  }, []);



  return (

    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">

      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-[380px]"
      >

        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>

        <p className="text-sm text-center">
          Welcome back! Please sign in to continue
        </p>


        {/* ================= OTP UI ================= */}

        {showOtpBox ? (

          <div className="mt-6 flex flex-col gap-4">

            <p className="text-center text-sm text-gray-600">
              Enter OTP sent to your email
            </p>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border px-4 py-2 rounded outline-none text-center tracking-widest"
            />

            <button
              type="button"
              onClick={verifyOtp}
              className="bg-blue-600 text-white py-2 rounded"
            >
              Verify OTP
            </button>

          </div>

        ) : state === "Sign Up" && isTextDataSubmited ? (

          <div className="flex items-center gap-4 my-10">

            <label htmlFor="image">

              <img
                className="w-16 rounded-full"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=""
              />

              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />

            </label>

            <p>
              Upload Company <br />
              Logo
            </p>

          </div>

        ) : (

          <>

            {state !== "Login" && (

              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">

                <img src={assets.person_icon} alt="" />

                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />

              </div>

            )}


            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">

              <img src={assets.email_icon} alt="" />

              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
              />

            </div>


            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">

              <img src={assets.lock_icon} alt="" />

              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />

            </div>

          </>

        )}



        {/* ================= BUTTON ================= */}

        {!showOtpBox && (

          <button
            type="submit"
            className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
          >

            {state === "Login"
              ? "Login"
              : isTextDataSubmited
                ? "Create Account"
                : "Next"}

          </button>

        )}



        {/* ================= SWITCH LOGIN / SIGNUP ================= */}

        {!showOtpBox && (

          state === "Login" ? (

            <p className="mt-5 text-center">

              Don't have an account?{" "}

              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setstate("Sign Up")}
              >
                Sign Up
              </span>

            </p>

          ) : (

            <p className="mt-5 text-center">

              Already have an account?{" "}

              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setstate("Login")}
              >
                Login
              </span>

            </p>

          )

        )}


        <img
          onClick={() => setShowRecruiterLogin(false)}
          src={assets.cross_icon}
          className="absolute top-5 right-5 cursor-pointer"
          alt=""
        />

      </form>

    </div>

  );

};

export default RecruiterLogin;