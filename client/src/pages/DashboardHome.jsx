import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";

const DashboardHome = () => {
  const { companyData } = useContext(AppContext);

  const stats = {
    totalJobs: 12,
    activeJobs: 9,
    hiddenJobs: 3,
    totalApplicants: 48,
    pending: 14,
    accepted: 20,
    rejected: 14,
  };

  return (
    <div className="space-y-8">

      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg">

        <div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {companyData?.name}
          </h2>
          <p className="opacity-90 text-sm">
            Manage your jobs and applicants easily.
          </p>
        </div>

        {companyData?.image && (
          <div className="w-24 h-16 flex items-center justify-center bg-white rounded-lg overflow-hidden mt-4 md:mt-0">
            <img
              src={companyData.image}
              alt="company"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          icon={<Briefcase size={22} />}
          title="Total Jobs"
          value={stats.totalJobs}
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <StatCard
          icon={<Users size={22} />}
          title="Applicants"
          value={stats.totalApplicants}
          bg="bg-green-100"
          text="text-green-600"
        />

        <StatCard
          icon={<Clock size={22} />}
          title="Pending"
          value={stats.pending}
          bg="bg-yellow-100"
          text="text-yellow-600"
        />

        <StatCard
          icon={<CheckCircle size={22} />}
          title="Accepted"
          value={stats.accepted}
          bg="bg-emerald-100"
          text="text-emerald-600"
        />
      </div>

      {/* JOB STATUS */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Job Visibility */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 size={20} /> Job Visibility
          </h3>

          <ProgressBar
            label="Active Jobs"
            value={stats.activeJobs}
            total={stats.totalJobs}
            color="bg-green-500"
          />

          <ProgressBar
            label="Hidden Jobs"
            value={stats.hiddenJobs}
            total={stats.totalJobs}
            color="bg-red-500"
          />
        </div>

        {/* Applications */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users size={20} /> Applications
          </h3>

          <StatusItem
            icon={<Clock size={18} />}
            label="Pending"
            count={stats.pending}
            color="text-yellow-500"
          />

          <StatusItem
            icon={<CheckCircle size={18} />}
            label="Accepted"
            count={stats.accepted}
            color="text-green-600"
          />

          <StatusItem
            icon={<XCircle size={18} />}
            label="Rejected"
            count={stats.rejected}
            color="text-red-500"
          />
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;


/* COMPONENTS */

const StatCard = ({ icon, title, value, bg, text }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${bg} ${text} mb-4`}>
      {icon}
    </div>
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-3xl font-bold mt-2">{value}</h3>
  </div>
);

const ProgressBar = ({ label, value, total, color }) => {
  const percentage = total ? (value / total) * 100 : 0;

  return (
    <div className="mb-5">
      <div className="flex justify-between mb-1 text-sm">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const StatusItem = ({ icon, label, count, color }) => (
  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-3">
    <div className={`flex items-center gap-2 ${color}`}>
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-semibold">{count}</span>
  </div>
);