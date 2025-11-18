import React, { useState } from "react";

const ResortForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // We'll store the actual File objects here, not just names
    images: null,
    is_active: true,
    price_per_night: 0,
    address: "",
    city: "",
    state: "",
    country: "",
    average_rating: 0,
    review_count: 0,
    number_of_ratings: 0,
    amenities: [],
    tags: [],
    visibility: "public",
    discount: 0,
    check_in_time: "",
    check_out_time: "",
    availability_status: "Available",
    activities: [],
    policies: "",
    contact_email: "",
    contact_phone: "",
    is_featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const styleProps = {
    inputStyle:
      "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500",
    labelStyle:
      "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
    cardStyle:
      "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700",
    buttonStyle:
      "flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50",
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox" && Array.isArray(formData[name])) {
      setFormData((prev) => {
        const updated = checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value);
        return { ...prev, [name]: updated };
      });
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      // Store actual files (you can limit to 1 if backend expects single)
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
     if (!formData.images || formData.images.length === 0) {
    return alert("Please select at least one image");
  }

  try {
    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("price_per_night", formData.price_per_night);
    payload.append("is_active", formData.is_active);
    payload.append("address", formData.address);
    payload.append("city", formData.city);
    payload.append("state", formData.state);
    payload.append("country", formData.country);
    payload.append("average_rating", formData.average_rating);
    payload.append("review_count", formData.review_count);
    payload.append("number_of_ratings", formData.number_of_ratings);

    // Append arrays like amenities, tags, activities as JSON strings
    payload.append("amenities", JSON.stringify(formData.amenities));
    payload.append("tags", JSON.stringify(formData.tags));
    payload.append("activities", JSON.stringify(formData.activities));

    payload.append("visibility", formData.visibility);
    payload.append("discount", formData.discount);
    payload.append("check_in_time", formData.check_in_time);
    payload.append("check_out_time", formData.check_out_time);
    payload.append("availability_status", formData.availability_status);
    payload.append("policies", formData.policies);
    payload.append("contact_email", formData.contact_email);
    payload.append("contact_phone", formData.contact_phone);
    payload.append("is_featured", formData.is_featured);

    // Append multiple images
    for (let i = 0; i < formData.images.length; i++) {
      payload.append("images", formData.images[i]);
    }

    const response = await fetch("http://localhost:5000/resort/resort", {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      const text = await response.text();
      // console.error("Server response not OK:", text);
      return;
    }

    const data = await response.json();
    // console.log("Product added:", data);

    // Reset form or do whatever you want after success
  } catch (error) {
    // console.error("Error uploading product:", error);
  }
};

  // Same as before: options for checkboxes
  const amenityOptions = ["Pool", "Wi-Fi", "Gym", "Spa"];
  const tagOptions = ["Luxury", "Family", "Beachfront"];
  const activityOptions = ["Hiking", "Surfing", "Skiing"];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Create Resort</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
          {/* Core Details */}
          <div className={styleProps.cardStyle}>
            <h2 className="text-xl font-semibold mb-4">Core Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["title", "Title", "text"],
                ["description", "Description", "text"],
                ["price_per_night", "Price per Night", "number"],
                ["discount", "Discount (%)", "number"],
                ["address", "Address", "text"],
                ["city", "City", "text"],
                ["state", "State", "text"],
                ["country", "Country", "text"],
                ["contact_email", "Contact Email", "email"],
                ["contact_phone", "Contact Phone", "text"],
                ["check_in_time", "Check-in Time", "time"],
                ["check_out_time", "Check-out Time", "time"],
              ].map(([name, label, type]) => (
                <div key={name}>
                  <label className={styleProps.labelStyle}>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={styleProps.inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Selects */}
          <div className={styleProps.cardStyle}>
            <h2 className="text-xl font-semibold mb-4">Visibility & Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={styleProps.labelStyle}>Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className={styleProps.inputStyle}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className={styleProps.labelStyle}>Availability Status</label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  className={styleProps.inputStyle}
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Booked">Booked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Checkbox Groups */}
          <div className={styleProps.cardStyle}>
            <h2 className="text-xl font-semibold mb-4">Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                ["amenities", amenityOptions],
                ["tags", tagOptions],
                ["activities", activityOptions],
              ].map(([key, options]) => (
                <fieldset key={key}>
                  <legend className="font-medium capitalize mb-2">{key}</legend>
                  {options.map((item) => (
                    <label key={item} className="block text-sm mb-1">
                      <input
                        type="checkbox"
                        name={key}
                        value={item}
                        checked={formData[key].includes(item)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {item}
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className={styleProps.cardStyle}>
            <label className={styleProps.labelStyle}>Images</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleChange}
              className={styleProps.inputStyle}
            />
            <p className="text-sm text-gray-500 mt-1">
              * Upload images which will be sent to the server
            </p>
          </div>

          {/* Policies */}
          <div className={styleProps.cardStyle}>
            <label className={styleProps.labelStyle}>Policies</label>
            <textarea
              name="policies"
              value={formData.policies}
              onChange={handleChange}
              className={`${styleProps.inputStyle} h-24 resize-none`}
            />
          </div>

          {/* Toggles */}
          <div className={styleProps.cardStyle}>
            <h2 className="text-xl font-semibold mb-4">Toggles</h2>
            <div className="flex space-x-6">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="mr-2"
                />
                Active
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                Featured
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className={styleProps.buttonStyle} disabled={loading}>
              {loading ? "Submitting..." : "Submit Resort"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResortForm;
