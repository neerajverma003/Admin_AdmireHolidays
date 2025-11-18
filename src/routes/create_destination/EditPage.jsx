import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../stores/authStore";

const EditDestination = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({
        type: "",
        destination_name: "",
        image: [],
        existingImages: [],
        destination_type: [],
        show_image: [], // ✅ new field
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await apiClient.get(`/admin/destination/edit/${id}`);
                if (res.data.success) {
                    setData({
                        type: res.data.destination.domestic_or_international?.toLowerCase().trim(),
                        destination_name: res.data.destination.destination_name || "",
                        image: [],
                        existingImages: res.data.destination.title_image || [],
                        destination_type: res.data.destination.destination_type || [],
                        show_image: res.data.destination.show_image || [], // ✅ preload checked images
                    });
                } else {
                    toast.error("Failed to load destination data.");
                }
            } catch {
                toast.error("Server error while fetching destination.");
            }
        }
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files, checked } = e.target;

        if (name === "image") {
            setData({ ...data, image: Array.from(files) });
        } else if (name === "destination_type") {
            setData({
                ...data,
                destination_type: checked
                    ? [...data.destination_type, value]
                    : data.destination_type.filter((t) => t !== value),
            });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    // ✅ Handle tick/untick for show_image
    const handleShowImageToggle = (img) => {
        setData((prev) => ({
            ...prev,
            show_image: prev.show_image.includes(img)
                ? prev.show_image.filter((i) => i !== img) // untick → remove
                : [...prev.show_image, img], // tick → add
        }));
    };

    // ✅ Delete image handler
    const handleDeleteImage = async (img) => {
        try {
            const res = await apiClient.patch(`/admin/destination/${id}/delete-image`, {
                imagePath: img,
            });

            if (res.data.success) {
                setData((prev) => ({
                    ...prev,
                    existingImages: prev.existingImages.filter((i) => i !== img),
                    show_image: prev.show_image.filter((i) => i !== img), // also remove from show_image
                }));
                toast.success("Image deleted successfully");
            } else {
                toast.error(res.data.msg || "Failed to delete image");
            }
        } catch {
            toast.error("Server error while deleting image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("type", data.type);
        formData.append("destination_name", data.destination_name);

        data.destination_type.forEach((t) => formData.append("destination_type", t));
        data.image.forEach((file) => formData.append("image", file));

        // ✅ send selected show_image images
        data.show_image.forEach((img) => formData.append("show_image", img));

        try {
            const response = await apiClient.patch(`/admin/destination/${id}`, formData);
            if (response.data.success) {
                toast.success("Destination updated successfully.");
                navigate("/create_destination");
            } else {
                toast.error(response.data.message || "Update failed.");
            }
        } catch {
            toast.error("Server error while updating destination.");
        }
        setIsLoading(false);
    };

    return (
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Edit Destination</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Destination Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination Type</label>
                    <select
                        name="type"
                        value={data.type}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                        <option value="">Select Type</option>
                        <option value="domestic">Domestic</option>
                        <option value="international">International</option>
                    </select>
                </div>

                {/* Destination Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination Name</label>
                    <input
                        type="text"
                        name="destination_name"
                        value={data.destination_name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                </div>

                {/* Destination Categories */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categories</label>
                    <div className="flex flex-wrap gap-4">
                        {["trending", "exclusive", "weekend", "home"].map((opt) => (
                            <label key={opt} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="destination_type"
                                    value={opt}
                                    checked={data.destination_type.includes(opt)}
                                    onChange={handleChange}
                                />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Upload New Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload New Images</label>
                    <input
                        type="file"
                        name="image"
                        multiple
                        onChange={handleChange}
                        className="mt-1 block w-full text-gray-900 dark:text-gray-200"
                    />
                </div>

                {/* Existing Images with show_image checkboxes */}
                {data.existingImages.length > 0 && (
                    <div>
                        <h2 className="mb-2 mt-4 font-medium text-gray-700 dark:text-gray-300">Existing Images</h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {data.existingImages.map((img, idx) => (
                                <div key={idx} className="group relative rounded-md border p-1">
                                    <img src={img} alt={`Existing ${idx}`} className="h-28 w-full object-cover rounded-md" />
                                    
                                    {/* Show Image Checkbox */}
                                    <label className="absolute left-1 top-1 bg-white/80 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            checked={data.show_image.includes(img)}
                                            onChange={() => handleShowImageToggle(img)}
                                        /> 
                                    </label>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(img)}
                                        className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? "Updating..." : "Update Destination"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDestination;
