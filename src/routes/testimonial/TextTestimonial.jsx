import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TextTestimonialForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 1,
    travelDate: "",
    destination: "",
    profileImage: null,
    trip_image: [],
    message: "",
    toShow: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      if (name === "profileImage") {
        setFormData({ ...formData, profileImage: files[0] });
      } else {
        setFormData({ ...formData, [name]: Array.from(files) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "trip_image") {
          formData[key].forEach((file) => data.append("trip_image", file));
        } else if (key === "profileImage") {
          if (formData.profileImage) {
            data.append("profileImage", formData.profileImage);
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      console.log("Submitting testimonial...");
      const res = await axios.post("/api/v1/text-testimonials/submit", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Testimonial response:", res);
      alert("Testimonial submitted successfully!");
      setFormData({
        name: "",
        location: "",
        rating: 1,
        travelDate: "",
        destination: "",
        profileImage: null,
        trip_image: [],
        message: "",
        toShow: false,
      });
      // Redirect to testimonials list page
      navigate("/text_testimonial");
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error submitting testimonial";
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Testimonial</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="flex items-center gap-2">
            <span>Rating:</span>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min={1}
              max={5}
              required
              className="w-20 p-2 border border-gray-300 rounded"
            />
          </label>
          <label className="flex items-center gap-2">
            <span>Show publicly:</span>
            <input
              type="checkbox"
              name="toShow"
              checked={formData.toShow}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </label>
        </div>

        <div>
          <label className="block mb-1">Profile Image:</label>
          <input
            type="file"
            name="profileImage"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Trip Images:</label>
          <input
            type="file"
            name="trip_image"
            onChange={handleChange}
            multiple
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share your experience..."
            minLength={10}
            maxLength={500}
            required
            className="w-full p-2 border border-gray-300 rounded resize-none h-32"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Testimonial
        </button>
      </form>
    </div>
  );
};

export default TextTestimonialForm;