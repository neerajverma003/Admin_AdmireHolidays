import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all testimonials from backend
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/api/v1/testimonials"); // replace with your API
      setTestimonials(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Toggle verification status
  const toggleVerify = async (testimonialId, currentStatus) => {
    try {
      await axios.patch(`/api/v1/testimonials/${testimonialId}/verify`, {
        toShow: !currentStatus,
      });
      // Update UI
      setTestimonials((prev) =>
        prev.map((t) =>
          t._id === testimonialId ? { ...t, toShow: !currentStatus } : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Verify Testimonials
      </h2>

      {testimonials.length === 0 ? (
        <div className="text-center text-gray-500">No testimonials found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-white p-4 rounded shadow flex flex-col"
            >
              <div className="flex items-center mb-2 gap-3">
                <img
                  src={testimonial.profileImage || "/default-profile.png"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-2">{testimonial.message}</p>
              <p className="text-sm text-gray-400 mb-2">
                Travel Date: {new Date(testimonial.travelDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400 mb-2">
                Destination: {testimonial.destination}
              </p>
              <p className="text-sm text-yellow-500 mb-2">Rating: {testimonial.rating}⭐</p>

              <button
                onClick={() => toggleVerify(testimonial._id, testimonial.toShow)}
                className={`mt-auto py-2 px-4 rounded ${
                  testimonial.toShow
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } transition`}
              >
                {testimonial.toShow ? "Unverify" : "Verify"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyTestimonialsPage;