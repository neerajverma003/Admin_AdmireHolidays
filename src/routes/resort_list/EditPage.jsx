import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxnzkzlu2/image/upload"; // ✅ Use `/image/upload`
  const UPLOAD_PRESET = "resort";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_per_night: "",
    check_in_time: "",
    check_out_time: "",
    address: "",
    city: "",
    state: "",
    country: "",
    contact_email: "",
    contact_phone: "",
    visibility: "public",
    availability_status: "Available",
    discount: 0,
    is_active: false,
    is_featured: false,
    tags: "",
    activities: "",
    amenities: "",
    policies: "",
    images: "", // will store File or URL
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // Show current or uploaded image

  // Fetch existing resort data
  useEffect(() => {
    const fetchResort = async () => {
      try {
        const res = await fetch(`http://localhost:5000/resort/get/${id}`);
        if (!res.ok) throw new Error("Failed to fetch resort data");
        const { data } = await res.json();

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price_per_night: data.price_per_night || "",
          check_in_time: data.check_in_time || "",
          check_out_time: data.check_out_time || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          visibility: data.visibility || "public",
          availability_status: data.availability_status || "Available",
          discount: data.discount || 0,
          is_active: data.is_active || false,
          is_featured: data.is_featured || false,
          tags: JSON.parse(data.tags?.[0] || "[]").join(", "),
          activities: JSON.parse(data.activities?.[0] || "[]").join(", "),
          amenities: JSON.parse(data.amenities?.[0] || "[]").join(", "),
          policies: data.policies || "",
          images: "", // Reset to accept new file
        });

        setImagePreview(data.images?.[0] || "");
      } catch (err) {
        console.error(err);
        setError("Error loading resort");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResort();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, images: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     let uploadedImageUrl = imagePreview; // fallback to existing image

//     // If a new image file is selected, upload it to Cloudinary
//     if (formData.images instanceof File) {
//       const imageData = new FormData();
//       imageData.append("file", formData.images);
//       imageData.append("upload_preset", UPLOAD_PRESET);

//       try {
//         const res = await fetch(CLOUDINARY_URL, {
//           method: "POST",
//           body: imageData,
//         });

//         if (!res.ok) throw new Error("Image upload failed");

//         const data = await res.json();
//         uploadedImageUrl = data.secure_url;
//       } catch (uploadErr) {
//         console.error(uploadErr);
//         alert("Image upload failed");
//         return;
//       }
//     }

//     // Prepare full payload
//     const payload = {
//       ...formData,
//       tags: formData.tags.split(",").map((t) => t.trim()),
//       activities: formData.activities.split(",").map((a) => a.trim()),
//       amenities: formData.amenities.split(",").map((a) => a.trim()),
//       images: [uploadedImageUrl],
//     };

//     try {
//       const res = await fetch(`http://localhost:5000/resort/update/${id}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Update failed");

//       alert("Resort updated successfully");
//       navigate("/resorts_list");
//     } catch (err) {
//       console.error(err);
//       alert("Error updating resort");
//     }
//   };
    const handleSave = async (e) => {
  e.preventDefault();
  try {
    const form = new FormData();

    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price_per_night", formData.price_per_night);
    form.append("is_active", formData.is_active);
    form.append("address", formData.address);
    form.append("city", formData.city);
    form.append("state", formData.state);
    form.append("country", formData.country);
    form.append("average_rating", formData.average_rating || 0);
    form.append("review_count", formData.review_count || 0);
    form.append("number_of_ratings", formData.number_of_ratings || 0);
    form.append("amenities", JSON.stringify(formData.amenities.split(",").map(a => a.trim())));
    form.append("tags", JSON.stringify(formData.tags.split(",").map(t => t.trim())));
    form.append("visibility", formData.visibility);
    form.append("discount", formData.discount);
    form.append("check_in_time", formData.check_in_time);
    form.append("check_out_time", formData.check_out_time);
    form.append("availability_status", formData.availability_status);
    form.append("activities", JSON.stringify(formData.activities.split(",").map(a => a.trim())));
    form.append("policies", formData.policies);
    form.append("contact_email", formData.contact_email);
    form.append("contact_phone", formData.contact_phone);
    form.append("is_featured", formData.is_featured);

    // Append image file if present
    if (formData.images instanceof File) {
      form.append("images", formData.images);
    }

    const response = await fetch(`http://localhost:5000/resort/update/${id}`, {
      method: "PATCH",
      body: form,
    });

    const data = await response.json();
    // console.log(data);

    if (response.ok) {
      alert("Resort updated successfully");
      navigate("/resorts_list");
    } else {
      alert(data.message || "Failed to update resort");
    }
  } catch (error) {
    // console.error(error);
    alert("An error occurred while updating the resort");
  }
};

  if (isLoading) return <p className="p-4">Loading resort data...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Resort</h1>
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "title",
          "description",
          "price_per_night",
          "check_in_time",
          "check_out_time",
          "address",
          "city",
          "state",
          "country",
          "contact_email",
          "contact_phone",
          "policies",
          "discount",
        ].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">{field.replace(/_/g, " ")}</label>
            <input
              type={field === "price_per_night" || field === "discount" ? "number" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
            />
          </div>
        ))}

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium capitalize mb-1">Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 max-h-48 object-contain rounded border"
            />
          )}
        </div>

        {/* Dropdowns */}
        <div>
          <label className="block text-sm font-medium">Availability Status</label>
          <select
            name="availability_status"
            value={formData.availability_status}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label className="text-sm font-medium">Is Active</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleChange}
          />
          <label className="text-sm font-medium">Is Featured</label>
        </div>

        {/* Comma-separated array fields */}
        {["tags", "activities", "amenities"].map((field) => (
          <div key={field} className="md:col-span-2">
            <label className="block text-sm font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
              placeholder="Separate with commas, e.g. Pool, Gym, Spa"
            />
          </div>
        ))}

        {/* Submit / Cancel */}
        <div className="md:col-span-2 flex gap-4 mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/resorts_list")}
            className="px-4 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPage;
