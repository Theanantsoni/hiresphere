import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Crown, BadgeCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

const AboutCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/company");
        const data = await res.json();
        setCompanies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12 px-4 2xl:px-20">
        <div className="max-w-7xl mx-auto">

          {/* Title */}

          <div className="text-center mb-14">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              HireSphere Companies
            </h1>

            <p className="text-gray-500 text-lg">
              Discover verified companies hiring on HireSphere
            </p>
          </div>

          {/* Grid */}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {companies.map((company) => (
              <div
                key={company._id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-500"
              >

                {/* Logo */}

                <div className="flex justify-center mb-5">
                  <div className="h-20 w-20 rounded-xl bg-gray-50 border flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={company.image}
                      alt={company.name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                </div>

                {/* Company Name */}

                <h2 className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800 text-center">
                  <Building2 size={18} />
                  {company.name}
                </h2>

                {/* Address */}

                <p className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-2 text-center">
                  <MapPin size={14} />
                  {company.address}
                </p>

                {/* CEO */}

                <p className="flex items-center justify-center gap-1 text-gray-400 text-sm mt-1 text-center">
                  <Crown size={14} />
                  CEO : {company.ceoName}
                </p>

                {/* Verified */}

                {company.isVerified && (
                  <div className="flex justify-center mt-3">
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      <BadgeCheck size={13} />
                      Verified
                    </span>
                  </div>
                )}

                {/* View More Button */}

                <div className="flex justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => navigate(`/company/${company._id}`)}
                    className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    View More
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutCompanies;