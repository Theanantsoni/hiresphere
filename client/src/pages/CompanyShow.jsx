import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Mail,
  BadgeCheck,
  Crown,
  Calendar,
  Building2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CompanyShow = () => {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/company/${id}`);
        const data = await res.json();

        const companyData = data.company || data;

        setCompany(companyData);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-gray-400 text-lg">
            Loading company details...
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* ================= COMPANY HEADER ================= */}

          <section className="relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-lg p-10">

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">

              {/* Company Logo */}

              <div className="w-36 h-36 rounded-full border bg-white shadow-md flex items-center justify-center p-5 transition hover:scale-105">
                <img
                  src={company?.image}
                  alt={company?.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Company Info */}

              <div className="flex-1 text-center md:text-left space-y-4">

                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                  {company?.name}
                </h1>

                <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-gray-500 text-sm justify-center md:justify-start">

                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {company?.address || "Location not specified"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Mail size={16} />
                    {company?.email}
                  </p>

                </div>

                {company?.isVerified && (
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                    <BadgeCheck size={14} />
                    Verified Company
                  </span>
                )}

                {/* META */}

                <div className="flex flex-wrap gap-6 text-sm text-gray-400 pt-4 justify-center md:justify-start">

                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Created :{" "}
                    {company?.createdAt
                      ? new Date(company.createdAt).toLocaleDateString()
                      : "-"}
                  </span>

                  <span className="flex items-center gap-2">
                    <Building2 size={16} />
                    Founded : {company?.founded || "-"}
                  </span>

                </div>

              </div>
            </div>
          </section>

          {/* ================= CEO SECTION ================= */}

          <section>

            <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
              <Crown size={22} />
              Leadership
            </h2>

            <div className="bg-white border rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition">

              <img
                src={company?.ceoPhoto}
                alt={company?.ceoName}
                className="w-32 h-32 rounded-full object-cover border shadow"
              />

              <div className="text-center md:text-left">

                <h3 className="text-2xl font-semibold text-gray-800">
                  {company?.ceoName || "Not specified"}
                </h3>

                <p className="text-gray-500">Chief Executive Officer</p>

                <p className="text-gray-400 text-sm mt-2">
                  Leading the strategic direction and vision of the company.
                </p>

              </div>

            </div>

          </section>

          {/* ================= EMPLOYEES ================= */}

          <section>

            <h2 className="text-2xl font-semibold text-gray-800 mb-10">
              Team Members
            </h2>

            {company?.employees?.length === 0 ? (

              <div className="bg-white border rounded-xl p-10 text-center text-gray-500 shadow-sm">
                No employees added yet.
              </div>

            ) : (

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {company?.employees?.map((emp, index) => (

                  <div
                    key={index}
                    className="group bg-white border rounded-xl shadow-sm p-6 text-center transition hover:shadow-xl hover:-translate-y-1"
                  >

                    <div className="relative w-24 h-24 mx-auto mb-4">

                      <img
                        src={emp?.photo}
                        alt={emp?.name}
                        className="w-full h-full rounded-full object-cover border"
                      />

                      <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-indigo-400 transition"></div>

                    </div>

                    <h3 className="text-lg font-semibold text-gray-800">
                      {emp?.name}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {emp?.position}
                    </p>

                    <div className="mt-3 text-sm text-gray-400">
                      Experience :{" "}
                      <span className="font-semibold text-gray-600">
                        {parseInt(emp?.experience || 0)}+ Years
                      </span>
                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default CompanyShow;