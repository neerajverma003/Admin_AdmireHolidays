import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
// import EditPage from "./EditPage.jsx" // not needed
const Subscribe = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigate = useNavigate()
  // Fetch all resorts
  const fetchResorts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/resort/all");
      if (!res.ok) throw new Error("Failed to fetch resorts");
      const json = await res.json();
      setData(json);
      // don't navigate here; we only fetch and set data
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Get single resort
  const handleEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/resort/get/${id}`);
      if (!res.ok) throw new Error("Failed to get resort");
      const resortData = await res.json();
      // console.log("Edit Resort Data:", resortData);
        navigate(`/create_resort/${id}`);
      // TODO: Open modal or redirect to edit page
    } catch (err) {
      // console.error(err);
      alert("Failed to load resort for editing");
    }
  };

  // Delete resort
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this resort?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/resort/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      alert("Resort deleted successfully");
      fetchResorts(); // refresh
    } catch (err) {
      // console.error(err);
      alert("Failed to delete resort");
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-50">
        Resort Listings
      </h1>

      {isLoading && (
        <p className="text-center text-slate-600 dark:text-slate-400">Loading resorts...</p>
      )}

      {error && (
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
      )}

      {!isLoading && !error && data.length === 0 && (
        <p className="text-center text-slate-600 dark:text-slate-400">
          No resorts found.
        </p>
      )}

      {/* Grid with 3 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((resort) => {
          const { _id, title, contact_email, contact_phone, images } = resort;

          const imageUrl =
            images && images.length > 0
              ? images[0]
              : "https://via.placeholder.com/300?text=No+Image";

          return (
            <div
              key={_id}
              className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
              style={{ aspectRatio: "1 / 1" }}
            >
              {/* Image */}
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {title}
                </h2>

                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex flex-col gap-1 flex-grow">
                  {contact_email && (
                    <p className="truncate">
                      <strong>Email: </strong>
                      <a
                        href={`mailto:${contact_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact_email}
                      </a>
                    </p>
                  )}

                  {contact_phone && (
                    <p className="truncate">
                      <strong>Phone: </strong> {contact_phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Icons */}
              <div className="p-4 mt-auto flex justify-end gap-4">
                {/* Edit Icon */}
                <button
                  onClick={() => handleEdit(_id)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(_id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscribe;
