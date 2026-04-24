import React, {
  useContext,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import {
  Building2,
  Mail,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Save,
  CheckCircle2,
  Settings as SettingsIcon,
  Globe,
  Send,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Settings = () => {
  const {
    backendUrl,
    companyToken,
    companyData,
    setCompanyData,
    fetchCompanyData,
  } = useContext(AppContext);

  const [profile, setProfile] =
    useState({
      companyName:
        companyData?.name ||
        "",
      email:
        companyData?.email ||
        "",
      address:
        companyData?.address ||
        "",
      founded:
        companyData?.founded ||
        "",
    });

  const [passwordData, setPasswordData] =
    useState({
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showPassword, setShowPassword] =
    useState({
      next: false,
      confirm: false,
    });

  const [passwordStep, setPasswordStep] =
    useState(1);

  const companyInitial = useMemo(() => {
    return (
      companyData?.name
        ?.charAt(0)
        ?.toUpperCase() ||
      "C"
    );
  }, [companyData]);

  const handleProfileChange = (
    e
  ) => {
    const { name, value } =
      e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (
    e
  ) => {
    const { name, value } =
      e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile =
    async () => {
      try {
        const { data } =
          await axios.post(
            `${backendUrl}/api/company/update-profile`,
            {
              address:
                profile.address,
              founded:
                profile.founded,
            },
            {
              headers: {
                token:
                  companyToken,
              },
            }
          );

        if (
          data.success
        ) {
          setCompanyData(
            data.company
          );

          fetchCompanyData(
            companyToken
          );

          toast.success(
            "Profile updated successfully"
          );
        } else {
          toast.error(
            data.message
          );
        }
      } catch (error) {
        toast.error(
          error.response
            ?.data
            ?.message ||
            error.message
        );
      }
    };

  const sendOtp =
    async () => {
      try {
        const { data } =
          await axios.post(
            `${backendUrl}/api/company/forgot-password`,
            {
              email:
                companyData?.email,
            }
          );

        if (
          data.success
        ) {
          toast.success(
            "OTP sent to registered email"
          );
          setPasswordStep(
            2
          );
        } else {
          toast.error(
            data.message
          );
        }
      } catch (error) {
        toast.error(
          error.response
            ?.data
            ?.message ||
            error.message
        );
      }
    };

  const updatePassword =
    async () => {
      try {
        if (
          passwordData.newPassword.length <
          6
        ) {
          return toast.error(
            "Password must be at least 6 characters"
          );
        }

        if (
          passwordData.newPassword !==
          passwordData.confirmPassword
        ) {
          return toast.error(
            "Passwords do not match"
          );
        }

        const verify =
          await axios.post(
            `${backendUrl}/api/company/verify-reset-otp`,
            {
              email:
                companyData?.email,
              otp:
                passwordData.otp,
            }
          );

        if (
          !verify.data
            .success
        ) {
          return toast.error(
            verify.data
              .message
          );
        }

        const reset =
          await axios.post(
            `${backendUrl}/api/company/reset-password`,
            {
              email:
                companyData?.email,
              password:
                passwordData.newPassword,
            }
          );

        if (
          reset.data
            .success
        ) {
          toast.success(
            "Password changed successfully"
          );

          setPasswordData({
            otp: "",
            newPassword:
              "",
            confirmPassword:
              "",
          });

          setPasswordStep(
            1
          );
        } else {
          toast.error(
            reset.data
              .message
          );
        }
      } catch (error) {
        toast.error(
          error.response
            ?.data
            ?.message ||
            error.message
        );
      }
    };

  const socialLinks = [
    {
      name: "Instagram",
      icon: (
        <Instagram
          size={22}
        />
      ),
      link:
        "https://instagram.com",
    },
    {
      name: "Facebook",
      icon: (
        <Facebook
          size={22}
        />
      ),
      link:
        "https://facebook.com",
    },
    {
      name: "YouTube",
      icon: (
        <Youtube
          size={22}
        />
      ),
      link:
        "https://youtube.com",
    },
    {
      name: "LinkedIn",
      icon: (
        <Linkedin
          size={22}
        />
      ),
      link:
        "https://linkedin.com",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <p className="text-sm opacity-90">
              Company Dashboard
            </p>

            <h1 className="text-3xl font-bold mt-2 flex items-center gap-3">
              <SettingsIcon size={28} />
              Settings
            </h1>

            <p className="text-sm mt-3 opacity-90">
              Manage company profile,
              access and business
              information.
            </p>
          </div>

          <div className="w-20 h-20 rounded-3xl bg-white/20 border border-white/20 flex items-center justify-center">
            <SettingsIcon
              size={34}
            />
          </div>

        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="xl:col-span-2 space-y-8">

          <SectionCard
            title="Company Profile"
            icon={
              <Building2
                size={18}
              />
            }
          >
            <div className="grid md:grid-cols-2 gap-5">

              <InputField
                label="Company Name"
                value={
                  profile.companyName
                }
                disabled
                icon={
                  <Building2
                    size={16}
                  />
                }
              />

              <InputField
                label="Email"
                value={
                  profile.email
                }
                disabled
                icon={
                  <Mail
                    size={16}
                  />
                }
              />

              <InputField
                label="Founded"
                name="founded"
                value={
                  profile.founded
                }
                onChange={
                  handleProfileChange
                }
                icon={
                  <Globe
                    size={16}
                  />
                }
              />

              <InputField
                label="Address"
                name="address"
                value={
                  profile.address
                }
                onChange={
                  handleProfileChange
                }
                icon={
                  <MapPin
                    size={16}
                  />
                }
              />

            </div>

            <div className="mt-6 flex justify-end">
              <PrimaryButton
                text="Save Profile"
                icon={
                  <Save
                    size={16}
                  />
                }
                onClick={
                  saveProfile
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Password & Access"
            icon={
              <Shield
                size={18}
              />
            }
          >
            {passwordStep ===
            1 ? (
              <div className="space-y-5">

                <InputField
                  label="Registered Email"
                  value={
                    companyData?.email ||
                    ""
                  }
                  disabled
                  icon={
                    <Mail
                      size={16}
                    />
                  }
                />

                <PrimaryButton
                  text="Send OTP"
                  icon={
                    <Send
                      size={16}
                    />
                  }
                  onClick={
                    sendOtp
                  }
                />

              </div>
            ) : (
              <div className="space-y-5">

                <InputField
                  label="OTP Code"
                  name="otp"
                  value={
                    passwordData.otp
                  }
                  onChange={
                    handlePasswordChange
                  }
                  icon={
                    <CheckCircle2
                      size={16}
                    />
                  }
                />

                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  show={
                    showPassword.next
                  }
                  toggle={() =>
                    setShowPassword(
                      (
                        prev
                      ) => ({
                        ...prev,
                        next:
                          !prev.next,
                      })
                    )
                  }
                />

                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  show={
                    showPassword.confirm
                  }
                  toggle={() =>
                    setShowPassword(
                      (
                        prev
                      ) => ({
                        ...prev,
                        confirm:
                          !prev.confirm,
                      })
                    )
                  }
                />

                <div className="flex gap-3 flex-wrap">

                  <PrimaryButton
                    text="Update Password"
                    icon={
                      <Lock
                        size={16}
                      />
                    }
                    onClick={
                      updatePassword
                    }
                  />

                  <button
                    onClick={() =>
                      setPasswordStep(
                        1
                      )
                    }
                    className="px-5 py-3 rounded-2xl border hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}
          </SectionCard>

        </div>

        {/* RIGHT */}

        <div className="space-y-8">

          <SectionCard
            title="Overview"
            icon={
              <CheckCircle2
                size={18}
              />
            }
          >
            <div className="text-center">

              {companyData?.image ? (
                <div className="w-28 h-28 mx-auto rounded-3xl border bg-white p-3 shadow-sm overflow-hidden">
                  <img
                    src={
                      companyData.image
                    }
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 mx-auto rounded-3xl bg-slate-900 text-white flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {
                      companyInitial
                    }
                  </span>
                </div>
              )}

              <h3 className="mt-5 text-2xl font-bold">
                {
                  companyData?.name
                }
              </h3>

              <p className="text-gray-500 mt-2 break-all">
                {
                  companyData?.email
                }
              </p>

            </div>
          </SectionCard>

          <SectionCard
            title="Company Presence"
            icon={
              <Globe
                size={18}
              />
            }
          >
            <div className="grid grid-cols-2 gap-4">

              {socialLinks.map(
                (
                  item,
                  index
                ) => (
                  <a
                    key={index}
                    href={
                      item.link
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 hover:shadow-md transition"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      {
                        item.icon
                      }
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                      {
                        item.name
                      }
                    </span>
                  </a>
                )
              )}

            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default Settings;

/* COMPONENTS */

const SectionCard = ({
  title,
  icon,
  children,
}) => (
  <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h2 className="text-xl font-bold">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

const InputField = ({
  label,
  icon,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>

    <div className="relative">
      <span className="absolute left-4 top-3.5 text-gray-400">
        {icon}
      </span>

      <input
        {...props}
        className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
    </div>
  </div>
);

const PasswordField = ({
  label,
  show,
  toggle,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>

    <div className="relative">

      <input
        {...props}
        type={
          show
            ? "text"
            : "password"
        }
        className="w-full border border-gray-200 rounded-2xl px-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-3 text-gray-500"
      >
        {show ? (
          <EyeOff
            size={18}
          />
        ) : (
          <Eye
            size={18}
          />
        )}
      </button>

    </div>
  </div>
);

const PrimaryButton = ({
  text,
  icon,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-black transition"
  >
    {icon}
    {text}
  </button>
);