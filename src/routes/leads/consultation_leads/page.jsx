import { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/stores/authStore";
import { Trash2, MessageSquare, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

const ConsultationLeads = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = useMemo(() => Math.ceil(totalLeads / ITEMS_PER_PAGE), [totalLeads]);

  // Fetch consultation leads
  useEffect(() => {
    const loadLeads = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/admin/consultation-leads");
        if (response.data.Data) {
          setLeads(response.data.Data);
          setTotalLeads(response.data.Data.length);
        }
      } catch (err) {
        console.error("Error fetching consultation leads:", err);
        setError("Failed to fetch consultation leads");
        toast.error("Failed to fetch consultation leads");
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  // Filter leads based on search term
  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  // Paginate filtered leads
  const paginatedLeads = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  // Handle delete
  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this consultation lead?")) {
      return;
    }

    try {
      const response = await apiClient.delete(`/admin/consultation-leads/${leadId}`);
      if (response.data.success) {
        setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));
        setTotalLeads((prev) => prev - 1);
        toast.success("Consultation lead deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting consultation lead:", err);
      toast.error("Failed to delete consultation lead");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consultation leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <MessageSquare className="inline-block mr-2 text-orange-600" />
          Consultation Requests
        </h1>
        <p className="text-gray-600">Manage all consultation requests from customers</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, phone, city, or state..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Leads</p>
          <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-green-600">
            {leads.filter((lead) => {
              const leadDate = new Date(lead.createdAt);
              const now = new Date();
              return (
                leadDate.getMonth() === now.getMonth() &&
                leadDate.getFullYear() === now.getFullYear()
              );
            }).length}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Filtered Results</p>
          <p className="text-2xl font-bold text-orange-600">{filteredLeads.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {paginatedLeads.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No consultation leads found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Itinerary</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{lead.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-gray-900">{lead.city}</p>
                        <p className="text-gray-500">{lead.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      {lead.itineraryTitle || "General Inquiry"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="inline-flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({paginatedLeads.length} items shown)
          </p>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-orange-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationLeads;
