import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  IndianRupee,
  TrendingUp,
  MapPin,
  Layers3,
  CalendarDays,
  Search,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { AppContext } from "../context/AppContext";

const Analytics = () => {
  const {
    companyData,
    companyJobs = [],
    applicants = [],
    companyToken,
    fetchCompanyJobs,
    fetchApplicants,
  } = useContext(AppContext);

  const [search, setSearch] = useState("");

  /* ===============================================
     FETCH LIVE DATA
  =============================================== */

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs(companyToken);
      fetchApplicants(companyToken);
    }
  }, [companyToken]);

  /* ===============================================
     FILTERED JOBS
  =============================================== */

  const filteredJobs = useMemo(() => {
    return companyJobs.filter((job) =>
      job.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [companyJobs, search]);

  /* ===============================================
     MAIN STATS
  =============================================== */

  const stats = useMemo(() => {
    const totalJobs = companyJobs.length;

    const activeJobs = companyJobs.filter(
      (job) => job.visible
    ).length;

    const hiddenJobs = companyJobs.filter(
      (job) => !job.visible
    ).length;

    const totalApplicants = applicants.length;

    const pending = applicants.filter(
      (a) =>
        a.status?.toLowerCase() === "pending"
    ).length;

    const accepted = applicants.filter(
      (a) =>
        a.status?.toLowerCase() === "accepted"
    ).length;

    const rejected = applicants.filter(
      (a) =>
        a.status?.toLowerCase() === "rejected"
    ).length;

    const totalSalary = companyJobs.reduce(
      (sum, item) =>
        sum + Number(item.salary || 0),
      0
    );

    const avgSalary = totalJobs
      ? Math.round(totalSalary / totalJobs)
      : 0;

    return {
      totalJobs,
      activeJobs,
      hiddenJobs,
      totalApplicants,
      pending,
      accepted,
      rejected,
      totalSalary,
      avgSalary,
    };
  }, [companyJobs, applicants]);

  /* ===============================================
     PIE CHART DATA
  =============================================== */

  const applicationStatusData = [
    {
      name: "Pending",
      value: stats.pending,
    },
    {
      name: "Accepted",
      value: stats.accepted,
    },
    {
      name: "Rejected",
      value: stats.rejected,
    },
  ];

  /* ===============================================
     JOB VISIBILITY DATA
  =============================================== */

  const visibilityData = [
    {
      name: "Active",
      value: stats.activeJobs,
    },
    {
      name: "Hidden",
      value: stats.hiddenJobs,
    },
  ];

  /* ===============================================
     CATEGORY CHART
  =============================================== */

  const categoryData = useMemo(() => {
    const map = {};

    companyJobs.forEach((job) => {
      const key =
        job.category || "Other";

      map[key] = (map[key] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      jobs: map[key],
    }));
  }, [companyJobs]);

  /* ===============================================
     LOCATION CHART
  =============================================== */

  const locationData = useMemo(() => {
    const map = {};

    companyJobs.forEach((job) => {
      const key =
        job.location || "Unknown";

      map[key] = (map[key] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      jobs: map[key],
    }));
  }, [companyJobs]);

  /* ===============================================
     MONTHLY POSTED JOBS
  =============================================== */

  const monthlyData = useMemo(() => {
    const map = {};

    companyJobs.forEach((job) => {
      const d = new Date(job.date);

      const key = d.toLocaleString(
        "default",
        {
          month: "short",
        }
      );

      map[key] = (map[key] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      month: key,
      jobs: map[key],
    }));
  }, [companyJobs]);

  /* ===============================================
     COLORS
  =============================================== */

  const colors = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <p className="text-sm opacity-90">
              Analytics Dashboard
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              {companyData?.name}
            </h1>

            <p className="mt-3 opacity-90">
              Complete hiring insights,
              applications and job
              performance overview.
            </p>
          </div>

          {companyData?.image && (
            <div className="w-28 h-20 bg-white rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={companyData.image}
                alt="company"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* TOP STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={<Briefcase />}
          color="blue"
        />

        <StatCard
          title="Applicants"
          value={stats.totalApplicants}
          icon={<Users />}
          color="green"
        />

        <StatCard
          title="Average Salary"
          value={`₹${stats.avgSalary}`}
          icon={<IndianRupee />}
          color="purple"
        />

        <StatCard
          title="Acceptance Rate"
          value={`${stats.totalApplicants
            ? Math.round(
                (stats.accepted /
                  stats.totalApplicants) *
                  100
              )
            : 0}%`}
          icon={<TrendingUp />}
          color="orange"
        />
      </div>

      {/* SECONDARY STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        <MiniCard
          title="Pending"
          value={stats.pending}
          icon={<Clock size={18} />}
          text="text-yellow-600"
        />

        <MiniCard
          title="Accepted"
          value={stats.accepted}
          icon={<CheckCircle size={18} />}
          text="text-green-600"
        />

        <MiniCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle size={18} />}
          text="text-red-600"
        />

        <MiniCard
          title="Hidden Jobs"
          value={stats.hiddenJobs}
          icon={<EyeOff size={18} />}
          text="text-slate-600"
        />
      </div>

      {/* CHARTS */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* APP STATUS PIE */}

        <Card title="Application Status">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={
                  applicationStatusData
                }
                dataKey="value"
                outerRadius={110}
                label
              >
                {applicationStatusData.map(
                  (
                    item,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        colors[index]
                      }
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* VISIBILITY */}

        <Card title="Job Visibility">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <BarChart
              data={visibilityData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                radius={[
                  8, 8, 0, 0,
                ]}
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* MORE CHARTS */}

      <div className="grid lg:grid-cols-2 gap-6">

        <Card title="Jobs by Category">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <BarChart
              data={categoryData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="jobs"
                radius={[
                  8, 8, 0, 0,
                ]}
                fill="#2563eb"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Jobs by Location">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={locationData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* MONTHLY */}

      <Card title="Monthly Job Posts">
        <ResponsiveContainer
          width="100%"
          height={340}
        >
          <AreaChart
            data={monthlyData}
          >
            <defs>
              <linearGradient
                id="colorJobs"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
            />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="jobs"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorJobs)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* JOB TABLE */}

      <div className="bg-white rounded-3xl shadow-md p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers3 size={20} />
            Job Analytics
          </h2>

          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3">
                  Job
                </th>
                <th>
                  Location
                </th>
                <th>
                  Category
                </th>
                <th>
                  Salary
                </th>
                <th>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map(
                (job) => (
                  <tr
                    key={
                      job._id
                    }
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 font-medium">
                      {job.title}
                    </td>

                    <td>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {
                          job.location
                        }
                      </span>
                    </td>

                    <td>
                      {
                        job.category
                      }
                    </td>

                    <td>
                      ₹
                      {job.salary}
                    </td>

                    <td>
                      {job.visible ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Eye size={15} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500">
                          <EyeOff size={15} />
                          Hidden
                        </span>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* RECENT APPLICATIONS */}

      <div className="bg-white rounded-3xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <Users size={20} />
          Recent Applicants
        </h2>

        <div className="space-y-4">

          {applicants
            .slice(0, 8)
            .map((item) => (
              <div
                key={
                  item._id
                }
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-2xl p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold">
                    {
                      item.name
                    }
                  </p>

                  <p className="text-sm text-gray-500">
                    {
                      item.email
                    }
                  </p>

                  <p className="text-sm mt-1">
                    Applied for{" "}
                    <span className="font-medium">
                      {
                        item
                          .jobId
                          ?.title
                      }
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarDays size={15} />
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </span>

                  <StatusBadge
                    status={
                      item.status
                    }
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Analytics;

/* =====================================================
   UI COMPONENTS
===================================================== */

const Card = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-3xl shadow-md p-6">
    <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
      <BarChart3 size={18} />
      {title}
    </h3>
    {children}
  </div>
);

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => {
  const map = {
    blue: "bg-blue-100 text-blue-600",
    green:
      "bg-green-100 text-green-600",
    purple:
      "bg-purple-100 text-purple-600",
    orange:
      "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${map[color]}`}
      >
        {icon}
      </div>

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
};

const MiniCard = ({
  title,
  value,
  icon,
  text,
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <div
      className={`mb-3 ${text}`}
    >
      {icon}
    </div>

    <p className="text-sm text-gray-500">
      {title}
    </p>

    <h4 className="text-2xl font-bold mt-1">
      {value}
    </h4>
  </div>
);

const StatusBadge = ({
  status,
}) => {
  const s =
    status?.toLowerCase();

  if (s === "accepted") {
    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
        Accepted
      </span>
    );
  }

  if (s === "rejected") {
    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
        Rejected
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
      Pending
    </span>
  );
};