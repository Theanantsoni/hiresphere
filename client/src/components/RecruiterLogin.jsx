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

  /* ================= AUTH STATES ================= */

  const [state, setstate] = useState("Login");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);

  /* ================= REGISTER OTP ================= */

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState(null);
  const [tempCompany, setTempCompany] = useState(null);

  /* ================= FORGOT PASSWORD ================= */

  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState("email");
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });

        if (!data.success) return toast.error(data.message);

        setCompanyData(data.company);
        setCompanyToken(data.token);

        localStorage.setItem("companytoken", data.token);

        setShowRecruiterLogin(false);
        navigate("/dashboard");
      } catch (error) {
        toast.error(
          error.response?.data?.message || error.message || "Login failed",
        );
      }
      return;
    }

    /* ================= REGISTER ================= */

    if (!image) return toast.error("Please upload company logo");

    setShowOtpBox(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/register",
        formData,
      );

      if (!data.success) {
        setShowOtpBox(false);
        return toast.error(data.message);
      }

      toast.success("OTP sent");
      setServerOtp(data.otp);
      setTempCompany(data.tempCompany);
    } catch (error) {
      setShowOtpBox(false);
      toast.error("Registration failed");
    }
  };

  /* ================= VERIFY REGISTER OTP ================= */

  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/verify-otp",
        {
          otp: serverOtp,
          userOtp: otp,
          tempCompany,
        },
      );

      if (!data.success) return toast.error(data.message);

      toast.success("Verified");

      setCompanyToken(data.token);
      setCompanyData(data.company);
      localStorage.setItem("companytoken", data.token);

      setShowRecruiterLogin(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error("OTP failed");
    }
  };

  /* ================= FORGOT PASSWORD HANDLERS ================= */

  const sendForgotOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/forgot-password",
        { email: fpEmail },
      );

      if (!data.success) return toast.error(data.message);

      toast.success("OTP sent");
      setStep("otp");
    } catch {
      toast.error("Error sending OTP");
    }
  };

  const verifyForgotOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/verify-reset-otp",
        { email: fpEmail, otp: fpOtp },
      );

      if (!data.success) return toast.error(data.message);

      toast.success("OTP verified");
      setStep("reset");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  const resetPasswordHandler = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/reset-password",
        {
          email: fpEmail,
          password: newPassword,
        },
      );

      if (!data.success) return toast.error(data.message);

      toast.success("Password updated");

      setIsForgot(false);
      setStep("email");
    } catch {
      toast.error("Reset failed");
    }
  };

  /* ================= PREVENT SCROLL ================= */

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  /* ================= UI ================= */

  return (
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl w-[380px]"
      >
        <h1 className="text-center text-2xl font-semibold">
          Recruiter {state}
        </h1>

        {/* ================= FORGOT PASSWORD ================= */}

        {isForgot ? (
          <div className="mt-6 flex flex-col gap-4">
            {step === "email" && (
              <>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  className="border px-4 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={sendForgotOtp}
                  className="bg-blue-600 text-white py-2 rounded"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={fpOtp}
                  onChange={(e) => setFpOtp(e.target.value)}
                  className="border px-4 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={verifyForgotOtp}
                  className="bg-blue-600 text-white py-2 rounded"
                >
                  Verify OTP
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border px-4 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border px-4 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={resetPasswordHandler}
                  className="bg-green-600 text-white py-2 rounded"
                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        ) : showOtpBox ? (
          /* ================= REGISTER OTP ================= */

          <div className="mt-6 flex flex-col gap-4">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border px-4 py-2 rounded text-center"
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
          /* ================= IMAGE ================= */

          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image">
              <img
                className="w-16 rounded-full"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=""
              />
              <input
                type="file"
                id="image"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <p>Upload Company Logo</p>
          </div>
        ) : (
          /* ================= LOGIN / SIGNUP ================= */

          <>
            {state !== "Login" && (
              <input
                className="border px-4 py-2 rounded-full mt-4 w-full"
                placeholder="Company Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              className="border px-4 py-2 rounded-full mt-4 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="border px-4 py-2 rounded-full mt-4 w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {state === "Login" && (
              <p className="text-sm text-right mt-2">
                <span
                  onClick={() => {
                    setIsForgot(true);
                    setStep("email");
                  }}
                  className="text-blue-600 cursor-pointer"
                >
                  Forgot Password?
                </span>
              </p>
            )}
          </>
        )}

        {/* ================= BUTTON ================= */}

        {!showOtpBox && !isForgot && (
          <button className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
            {state === "Login" ? "Login" : "Continue"}
          </button>
        )}

        {/* ================= SWITCH ================= */}

        {!isForgot && !showOtpBox && (
          <p className="mt-4 text-center text-sm">
            {state === "Login" ? (
              <>
                Don't have an account?{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setstate("Sign Up")}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setstate("Login")}
                >
                  Login
                </span>
              </>
            )}
          </p>
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
