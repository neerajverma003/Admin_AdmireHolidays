import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Accept optional prop `editId` to enable edit mode when provided
const ResortForm = ({ editId }) => {
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
  const navigate = useNavigate();
  const id = editId; // use prop instead of route hook
  const [existingImages, setExistingImages] = useState([]); // URLs when editing
  const [removedImageIndexes, setRemovedImageIndexes] = useState([]); // track which images to remove

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
      // If creating and no images provided, require at least one
      if (!id && (!existingImages || existingImages.length === 0)) {
        return alert("Please select at least one image");
      }
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

    // Track which existing images to remove (editing mode)
    if (id && removedImageIndexes.length > 0) {
      payload.append("removedImageIndexes", JSON.stringify(removedImageIndexes));
    }

    payload.append("visibility", formData.visibility);
    payload.append("discount", formData.discount);
    payload.append("check_in_time", formData.check_in_time);
    payload.append("check_out_time", formData.check_out_time);
    payload.append("availability_status", formData.availability_status);
    payload.append("policies", formData.policies);
    payload.append("contact_email", formData.contact_email);
    payload.append("contact_phone", formData.contact_phone);
    payload.append("is_featured", formData.is_featured);

    // Append multiple images (only if new files selected)
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        payload.append("images", formData.images[i]);
      }
    }

    const url = id
      ? `http://localhost:5000/resort/update/${id}`
      : "http://localhost:5000/resort/resort";

    const method = id ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      body: payload,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Server response not OK:", text);
      return;
    }

    const data = await response.json();

    // After successful update/create, navigate back to resort list
    navigate("/resorts_list");
  } catch (error) {
    // console.error("Error uploading product:", error);
  }
};

  // If editing, fetch existing resort data and populate form
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:5000/resort/get/${id}`);
        if (!res.ok) throw new Error("Failed to fetch resort");
        const json = await res.json();
        // controller returns { success: true, data: ... }
        const resort = json.data || json;

        // helper to normalize array-like fields that may be stored as
        // arrays, JSON strings, comma-separated strings, or single value
        const parseArrayField = (field) => {
          const result = [];
          
          const processValue = (val) => {
            if (typeof val === "string") {
              // Skip if it looks like JSON array/object (starts with [ or {)
              if (val.trim().startsWith("[") || val.trim().startsWith("{")) {
                try {
                  const parsed = JSON.parse(val);
                  if (Array.isArray(parsed)) {
                    parsed.forEach((item) => processValue(item));
                  } else if (typeof parsed === "string") {
                    processValue(parsed);
                  }
                } catch (e) {
                  // Invalid JSON, skip it
                }
                return;
              }

              // Comma-separated values
              if (val.includes(",")) {
                val.split(",").forEach((s) => {
                  const trimmed = s.trim().replace(/^["']|["']$/g, ""); // remove quotes
                  if (trimmed && !trimmed.startsWith("[") && !trimmed.startsWith("{")) {
                    result.push(trimmed);
                  }
                });
                return;
              }

              // Single value string
              const trimmed = val.trim().replace(/^["']|["']$/g, "");
              if (trimmed && !trimmed.startsWith("[") && !trimmed.startsWith("{")) {
                result.push(trimmed);
              }
            }
          };

          if (Array.isArray(field)) {
            field.forEach((item) => processValue(item));
          } else if (typeof field === "string") {
            processValue(field);
          }

          // Remove duplicates
          return Array.from(new Set(result));
        };

        // Map fields into formData shape, normalizing the array fields
        setFormData((prev) => ({
          ...prev,
          title: resort.title || "",
          description: resort.description || "",
          price_per_night: resort.price_per_night || 0,
          is_active: resort.is_active ?? true,
          address: resort.address || "",
          city: resort.city || "",
          state: resort.state || "",
          country: resort.country || "",
          average_rating: resort.average_rating || 0,
          review_count: resort.review_count || 0,
          number_of_ratings: resort.number_of_ratings || 0,
          amenities: parseArrayField(resort.amenities),
          tags: parseArrayField(resort.tags),
          activities: parseArrayField(resort.activities),
          visibility: resort.visibility || "public",
          discount: resort.discount || 0,
          check_in_time: resort.check_in_time || "",
          check_out_time: resort.check_out_time || "",
          availability_status: resort.availability_status || "Available",
          policies: resort.policies || "",
          contact_email: resort.contact_email || "",
          contact_phone: resort.contact_phone || "",
          is_featured: resort.is_featured ?? false,
        }));

        // normalize images to array of URLs
        const imgs = resort.images;
        const normalizedImages = Array.isArray(imgs)
          ? imgs
          : typeof imgs === "string" && imgs.trim()
          ? [imgs.trim()]
          : [];
        setExistingImages(normalizedImages);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  // Same as before: options for checkboxes
  const amenityOptions = ["Pool", "Wi-Fi", "Gym", "Spa"];
  const tagOptions = ["Luxury", "Family", "Beachfront"];
  const activityOptions = ["Hiking", "Surfing", "Skiing"];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold">{id ? "Edit Resort" : "Create Resort"}</h1>

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
              ].map(([key, options]) => {
                // Merge hardcoded options with any stored values not in the hardcoded list
                const allOptions = Array.from(new Set([...options, ...formData[key]]));
                return (
                  <fieldset key={key}>
                    <legend className="font-medium capitalize mb-2">{key}</legend>
                    {allOptions.map((item) => (
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
                );
              })}
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
            {existingImages && existingImages.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {existingImages.map((src, idx) => (
                  <div key={idx} className="relative h-20 w-20 group">
                    <img
                      src={src}
                      alt={`existing-${idx}`}
                      className={`h-20 w-20 object-cover rounded border ${
                        removedImageIndexes.includes(idx) ? "opacity-30" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRemovedImageIndexes((prev) =>
                          prev.includes(idx)
                            ? prev.filter((i) => i !== idx)
                            : [...prev, idx]
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
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
