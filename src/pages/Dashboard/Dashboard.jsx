import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstances";
import { API_PATHS } from "../../utils/apiPaths";
import {
  Loader2,
  FileText,
  DollarSign,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );

        const invoices = response.data.invoices || [];

        const totalInvoices = invoices.length;

        const totalPaid = invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + inv.grandTotal, 0);

        const totalUnpaid = invoices
          .filter((inv) => inv.status === "Unpaid")
          .reduce((acc, inv) => acc + inv.grandTotal, 0);

        setStats({
          totalInvoices,
          totalPaid,
          totalUnpaid,
        });

        setRecentInvoices(
          [...invoices]
            .sort(
              (a, b) =>
                new Date(b.invoiceDate) -
                new Date(a.invoiceDate)
            )
            .slice(0, 5)
        );
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      icon: DollarSign,
      label: "Total Paid",
      value: stats.totalPaid.toFixed(2),
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: stats.totalUnpaid.toFixed(2),
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#12D6C3]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          A quick overview of your business finances.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>

                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {stat.label === "Total Invoices"
                    ? stat.value
                    : `₹${stat.value}`}
                </h3>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
              >
                <stat.icon
                  className={`w-6 h-6 ${stat.text}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />

          <h2 className="text-xl font-semibold text-slate-900">
            AI Insights
          </h2>
        </div>

        <ul className="space-y-3 text-sm text-slate-600">
          <li>
            • You currently have{" "}
            <strong>{stats.totalInvoices}</strong>{" "}
            invoice(s) in your system.
          </li>

          <li>
            • Outstanding revenue worth{" "}
            <strong>
              ₹{stats.totalUnpaid.toFixed(2)}
            </strong>{" "}
            is awaiting collection.
          </li>

          <li>
            • Sending payment reminders can improve
            collection rates and maintain healthy
            cash flow.
          </li>
        </ul>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Invoices
          </h2>

          <button
            onClick={() => navigate("/invoices")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            View All
          </button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                    Due Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    onClick={() =>
                      navigate(
                        `/invoices/${invoice._id}`
                      )
                    }
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {invoice.billTo?.clientName ||
                          "Unknown Client"}
                      </div>

                      <div className="text-sm text-slate-500">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      ₹
                      {invoice.grandTotal?.toFixed(2) ||
                        "0.00"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {invoice.dueDate
                        ? moment(
                            invoice.dueDate
                          ).format("MMM D, YYYY")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mt-4">
              No invoices yet
            </h3>

            <p className="text-slate-500 mt-2">
              Create your first invoice from the
              sidebar to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;