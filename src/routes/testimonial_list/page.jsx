import { useState, useEffect } from "react";
import { Loader2, Play, Trash2, MapPin, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../../stores/authStore";

const TestimonialListPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsFetching(true);
      const response = await apiClient.get("/admin/testimonial-video");

      if (response.data.success) {
        setTestimonials(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch testimonials");
      }
    } catch (error) {
      console.error("Fetch testimonials error:", error);
      toast.error("Failed to fetch testimonials");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await apiClient.delete(`/admin/testimonial-video/${id}`);

      if (response.data.success) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      } else {
        toast.error(response.data.message || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete testimonial");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold mb-6 flex items-center border-b dark:text-white border-gray-200 dark:border-gray-700 pb-3">
          <Play className="inline mr-3 text-green-500 dark:text-green-400" size={28} />
          Testimonial Videos
        </h1>

        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading testimonials...</span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <Play size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No testimonials uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="bg-black relative group">
                  <video
                    src={testimonial.video_url}
                    className="w-full h-48 object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Play className="text-white" size={48} fill="white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-white dark:bg-gray-700">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate text-base">
                    {testimonial.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <MapPin size={16} />
                    <span className="truncate">{testimonial.location}</span>
                  </div>

                  {/* Visibility Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        testimonial.visibility === "Public"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                      }`}
                    >
                      <Eye size={12} />
                      {testimonial.visibility}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <p>
                      Uploaded: {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial._id)}
                    disabled={deletingId === testimonial._id}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === testimonial._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialListPage;
