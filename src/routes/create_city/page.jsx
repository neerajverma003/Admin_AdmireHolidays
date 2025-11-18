// import { useEffect, useState } from "react";
// import { usePlaceStore } from "../../stores/usePlaceStore";
// import { AppleIcon, UploadCloud, X } from "lucide-react";
// import { apiClient } from "../../stores/authStore";
// import { toast } from "react-toastify";

// // An array of available categories. This could also be fetched from an API.
// const AVAILABLE_CATEGORIES = ["Trending", "Exclusive", "Popular", "New"];

// // --- Mock API Functions ---
// // NOTE: These are for demonstration. Replace with your actual API calls.

// const fetchCitiesByState = async (stateId) => {
//     // console.log(`Fetching cities for state ID: ${stateId}`);
//     if (stateId === "state-1-id") {
//         return [
//             { _id: "city-1-id", city_name: "Los Angeles" },
//             { _id: "city-2-id", city_name: "San Francisco" },
//         ];
//     }
//     return [];
// };

// const fetchCityDetails = async (cityId) => {
//     // console.log(`Fetching details for city ID: ${cityId}`);
//     if (cityId === "city-1-id") {
//         return {
//             _id: "city-1-id",
//             cityName: "Los Angeles",
//             categories: ["Popular", "Exclusive"],
//             visibility: "public",
//             // Add mock image URLs for an existing city
//             images: [
//                 "https://images.unsplash.com/photo-1542300058-e093a2399985?w=400",
//                 "https://images.unsplash.com/photo-1572171552954-4e372e9dc7a7?w=400",
//             ],
//         };
//     }
//     return null;
// };

// const CreateCity = () => {
//     // --- Component State Management ---
//     const [travelType, setTravelType] = useState("domestic");
//     const [selectedState, setSelectedState] = useState("");
//     const [cityList, setCityList] = useState([]);
//     const [isCityListLoading, setIsCityListLoading] = useState(false);
//     const [selectedCityId, setSelectedCityId] = useState("");

//     // --- Form Input States ---
//     const [cityName, setCityName] = useState("");
//     const [categories, setCategories] = useState([]);
//     const [visibility, setVisibility] = useState("public");
//     const [deleteImage, setDeleteImage] = useState([]);

//     // console.log("Selected City category:", categories);

//     // State for new image files to be uploaded
//     const [newImageFiles, setNewImageFiles] = useState([]);
//     // State for existing image URLs from a fetched city
//     const [existingImages, setExistingImages] = useState([]);

//     // Determine if the form is in "update" mode
//     const isUpdateMode = !!selectedCityId;

//     // Zustand store integration
//     const { destinationList: stateList, isListLoading: isStateListLoading, fetchDestinationList: fetchStateList } = usePlaceStore();

//     // --- Helper function to reset form fields ---
//     const resetFormFields = () => {
//         setCityName("");
//         setCategories([]);
//         setVisibility("public");
//         setNewImageFiles([]); // Clear new images
//         setExistingImages([]); // Clear existing image URLs
//     };

//     // --- Event Handlers ---
//     const handleTypeChange = (e) => {
//         setTravelType(e.target.value);
//         setSelectedState("");
//         setSelectedCityId("");
//         setCityList([]);
//         resetFormFields();
//     };

//     const handleStateChange = (e) => {
//         setSelectedState(e.target.value);
//         setSelectedCityId("");
//         setCityList([]);
//         resetFormFields();
//     };

//     const handleCityChange = (e) => {
//         const cityId = e.target.value;
//         setSelectedCityId(cityId);
//         if (!cityId) {
//             resetFormFields();
//         }
//     };

//     const handleCategoryChange = (e) => {
//         const { value, checked } = e.target;
//         setCategories((prev) => (checked ? [...prev, value] : prev.filter((c) => c !== value)));
//     };

//     // Handles selection of new image files
//     const handleImageChange = (e) => {
//         if (e.target.files) {
//             const files = Array.from(e.target.files);
//             setNewImageFiles((prev) => [...prev, ...files]);
//             e.target.value = null; // Reset input to allow re-selecting same file
//         }
//     };

//     // Removes a newly selected image from the preview
//     const handleRemoveNewImage = (index) => {
//         setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     // Removes an existing image (marks it for deletion on update)
//     const handleRemoveExistingImage = (url) => {
//         setExistingImages((prev) => prev.filter((imgUrl) => imgUrl !== url));
//     };

//     // --- Data Fetching Effects ---
//     useEffect(() => {
//         fetchStateList(travelType);
//     }, [travelType, fetchStateList]);

//     useEffect(() => {
//         if (!selectedState) {
//             setCityList([]);
//             return;
//         }
//         const getCities = async () => {
//             setIsCityListLoading(true);
//             try {
//                 const cities = await apiClient.get(`/admin/state/${selectedState}`);
//                 // console.log("Fetched cities:", cities);
//                 setCityList(cities.data.citiesData || []);
//             } catch (error) {
//                 console.error("Failed to fetch cities:", error);
//                 setCityList([]);
//             } finally {
//                 setIsCityListLoading(false);
//             }
//         };
//         getCities();
//     }, [selectedState]);

//     useEffect(() => {
//         if (!selectedCityId) {
//             resetFormFields();
//             return;
//         }
//         const getCityDetails = async () => {
//             const details = await apiClient.get(`/admin/city/${selectedCityId}`);
//             console.log("Fetched city details:", details);
//             if (details.data.cityData) {
//                 setCityName(details.data.cityData.city_name);
//                 setCategories(details.data.cityData.city_category);
//                 setVisibility(details.data.cityData.visibility);
//                 setExistingImages(details.data.cityData.city_image || []); // Populate existing images
//                 setNewImageFiles([]); // Clear any staged new images
//             }
//         };
//         getCityDetails();
//     }, [selectedCityId]);

//     // --- API Integration (Create/Update Logic) ---
//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         if (!cityName) {
//             alert("Please enter a city name.");
//             return;
//         }

//         // Use FormData for multipart/form-data, required for file uploads
//         const formData = new FormData();
//         formData.append("city_name", cityName);
//         formData.append("visibility", visibility);
//         formData.append("city_category", JSON.stringify(categories)); // Send array as JSON string

//         // Append new image files to the form data
//         newImageFiles.forEach((file) => {
//             formData.append("image", file);
//         });

//         if (isUpdateMode) {
//             // --- UPDATE LOGIC ---
//             formData.append("cityId", selectedCityId);
//             // Send the remaining existing image URLs
//             formData.append("existingImages", JSON.stringify(existingImages));

//             // console.log("UPDATING city with FormData...");
//             // Example: await fetch(`/api/cities/${selectedCityId}`, { method: 'PUT', body: formData });
//             const res = await apiClient.patch(`/admin/city/${selectedCityId}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             if (res) {
//                 toast.success(` ${res.data.msg}` || `City updated successfully!`);
//             } else {
//                 toast.error("Failed to create city. Please try again.");
//             }
//         } else {
//             // --- CREATE LOGIC ---
//             formData.append("id", selectedState);

//             // console.log("form data in ceate city:-->", formData);

//             const res = await apiClient.post("/admin/city", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             if (res) {
//                 toast.success(`${res.data.msg}` || `City created successfully!`);
//             } else {
//                 toast.error("Failed to create city. Please try again.");
//             }

//             resetFormFields();
//         }
//     };
//     const handleDeleteCity = async () => {
//         if (!selectedCityId) return;
//         const confirmed = window.confirm("Are you sure you want to delete this city?");
//         if (!confirmed) return;

//         try {
//             const res = await apiClient.delete(`/admin/city/${selectedCityId}`);
//             toast.success(`${res.data.msg}` || `City deleted successfully!`);
//             // Reset state and form
//             setSelectedCityId("");
//             resetFormFields();
//             setCityList((prev) => prev.filter((c) => c._id !== selectedCityId));
//         } catch (error) {
//             // console.error("City deletion failed:", error);
//             toast.error("Failed to delete city. Please try again.");
//         }
//     };

//     // --- Render Helper for Image Preview ---
//     const renderImagePreviews = () => (
//         <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
//             {/* Show existing images for the selected city */}
//             {existingImages.map((url) => (
//                 <div
//                     key={url}
//                     className="group relative"
//                 >
//                     <img
//                         src={url}
//                         alt="Existing city view"
//                         className="h-28 w-full rounded-lg object-cover"
//                     />
//                     <button
//                         type="button"
//                         onClick={() => handleRemoveExistingImage(url)}
//                         className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
//                     >
//                         <X size={16} />
//                     </button>
//                 </div>
//             ))}
//             {/* Show newly selected image previews */}
//             {newImageFiles.map((file, index) => (
//                 <div
//                     key={file.name + index}
//                     className="group relative"
//                 >
//                     <img
//                         src={URL.createObjectURL(file)}
//                         alt="New upload preview"
//                         className="h-28 w-full rounded-lg object-cover"
//                     />
//                     <button
//                         type="button"
//                         onClick={() => handleRemoveNewImage(index)}
//                         className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
//                     >
//                         <X size={16} />
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );

//     return (
//         <div className="flex flex-col gap-y-8 p-4 md:p-8">
//             {/* Page Header */}
//             <div>
//                 <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">City Management</h1>
//                 <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//                     {isUpdateMode ? `Editing city: ${cityName}` : "Create a new city by selecting a state."}
//                 </p>
//             </div>

//             {/* Selection Card */}
//             <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//                 <div>{isUpdateMode ? <button>Delete</button> : ""}</div>
//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Travel Type</label>
//                         <div className="flex gap-6">
//                             {["domestic", "international"].map((type) => (
//                                 <label
//                                     key={type}
//                                     className="flex cursor-pointer items-center gap-2"
//                                 >
//                                     <input
//                                         type="radio"
//                                         value={type}
//                                         checked={travelType === type}
//                                         onChange={handleTypeChange}
//                                         className="h-4 w-4 border-slate-300 bg-transparent text-blue-600 focus:ring-blue-500 dark:border-slate-600"
//                                     />
//                                     <span className="capitalize text-slate-800 dark:text-slate-200">{type}</span>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>
//                     <div>
//                         <label
//                             htmlFor="stateSelect"
//                             className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
//                         >
//                             Select State
//                         </label>
//                         <select
//                             id="stateSelect"
//                             value={selectedState}
//                             onChange={handleStateChange}
//                             className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
//                             disabled={isStateListLoading}
//                         >
//                             <option value="">{isStateListLoading ? "Loading..." : "-- Select a State --"}</option>
//                             {stateList.map((state) => (
//                                 <option
//                                     key={state._id}
//                                     value={state._id}
//                                 >
//                                     {state.destination_name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div>
//                         <label
//                             htmlFor="citySelect"
//                             className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
//                         >
//                             Select City (Optional)
//                         </label>
//                         <select
//                             id="citySelect"
//                             value={selectedCityId}
//                             onChange={handleCityChange}
//                             className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
//                             disabled={!selectedState || isCityListLoading}
//                         >
//                             <option value="">{isCityListLoading ? "Loading..." : "-- Select to Edit --"}</option>
//                             {cityList?.map((city) => (
//                                 <option
//                                     key={city._id}
//                                     value={city._id}
//                                 >
//                                     {city.city_name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Form Card */}
//             <form onSubmit={handleFormSubmit}>
//                 <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
//                     {isUpdateMode && (
//                         <button
//                             type="button"
//                             onClick={handleDeleteCity}
//                             className="absolute right-4 top-4 rounded-md border border-red-600 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                         >
//                             Delete
//                         </button>
//                     )}
//                 </div>
//                 <div
//                     className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${!selectedState ? "pointer-events-none opacity-50" : ""}`}
//                 >
//                     <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
//                         <div className="flex flex-col gap-y-6">
//                             <div>
//                                 <label
//                                     htmlFor="cityName"
//                                     className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
//                                 >
//                                     City Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="cityName"
//                                     value={cityName}
//                                     onChange={(e) => setCityName(e.target.value)}
//                                     placeholder="e.g., Los Angeles"
//                                     className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
//                                 />
//                             </div>
//                             <div>
//                                 <label
//                                     htmlFor="visibilitySelect"
//                                     className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
//                                 >
//                                     Visibility
//                                 </label>
//                                 <select
//                                     id="visibilitySelect"
//                                     value={visibility}
//                                     onChange={(e) => setVisibility(e.target.value)}
//                                     className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
//                                 >
//                                     <option value="public">Public</option>
//                                     <option value="private">Private</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div>
//                             <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Categories</label>
//                             <div className="flex flex-col space-y-3">
//                                 {AVAILABLE_CATEGORIES.map((category) => (
//                                     <label
//                                         key={category}
//                                         className="flex cursor-pointer items-center gap-2"
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             value={category}
//                                             checked={categories.includes(category)}
//                                             onChange={handleCategoryChange}
//                                             className="h-4 w-4 rounded border-slate-300 bg-transparent text-blue-600 focus:ring-blue-500 dark:border-slate-600"
//                                         />
//                                         <span className="text-slate-800 dark:text-slate-200">{category}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* ----- NEW: Image Uploader Section ----- */}
//                     <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
//                         <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">City Images</label>
//                         <div className="mt-2">{(existingImages.length > 0 || newImageFiles.length > 0) && renderImagePreviews()}</div>
//                         <label
//                             htmlFor="image-upload"
//                             className="mt-4 flex w-full cursor-pointer justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 transition-colors hover:border-blue-500 dark:border-slate-700 dark:hover:border-blue-600"
//                         >
//                             <div className="text-center">
//                                 <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
//                                 <p className="mt-2 text-sm font-semibold text-blue-600">Click to upload or drag and drop</p>
//                                 <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF up to 10MB</p>
//                                 <input
//                                     id="image-upload"
//                                     type="file"
//                                     multiple
//                                     accept="image/*"
//                                     className="sr-only"
//                                     onChange={handleImageChange}
//                                 />
//                             </div>
//                         </label>
//                     </div>

//                     {/* Form Submission Button */}
//                     <div className="mt-8 flex justify-end border-t border-slate-200 pt-6 dark:border-slate-700">
//                         <button
//                             type="submit"
//                             className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//                             disabled={!selectedState || !cityName}
//                         >
//                             {isUpdateMode ? "Update City" : "Create City"}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreateCity;
import { useEffect, useState } from "react";
import { usePlaceStore } from "../../stores/usePlaceStore";
import { UploadCloud, X } from "lucide-react";
import { apiClient } from "../../stores/authStore";
import { toast } from "react-toastify";

// An array of available categories. This could also be fetched from an API.
const AVAILABLE_CATEGORIES = ["Trending", "Exclusive", "Popular", "New"];

const CreateCity = () => {
  // --- Component State Management ---
  const [travelType, setTravelType] = useState("domestic");
  const [selectedState, setSelectedState] = useState("");
  const [cityList, setCityList] = useState([]);
  const [isCityListLoading, setIsCityListLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("");

  // --- Form Input States ---
  const [cityName, setCityName] = useState("");
  const [categories, setCategories] = useState([]);
  const [visibility, setVisibility] = useState("public");
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const isUpdateMode = Boolean(selectedCityId);

  const {
    destinationList: stateList,
    isListLoading: isStateListLoading,
    fetchDestinationList: fetchStateList,
  } = usePlaceStore();

  // --- Helpers ---
  const resetFormFields = () => {
    setCityName("");
    setCategories([]);
    setVisibility("public");
    setNewImageFiles([]);
    setExistingImages([]);
  };

  // --- Event Handlers ---
  const handleTypeChange = (e) => {
    setTravelType(e.target.value);
    setSelectedState("");
    setSelectedCityId("");
    setCityList([]);
    resetFormFields();
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setSelectedState(val);
    setSelectedCityId("");
    setCityList([]);
    resetFormFields();
  };

  const handleCityChange = (e) => {
    const cid = e.target.value;
    setSelectedCityId(cid);
    if (!cid) {
      resetFormFields();
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategories((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles((prev) => [...prev, ...files]);
      e.target.value = null;
    }
  };

  const handleRemoveNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((imgUrl) => imgUrl !== url));
  };

  // --- Effects ---

  // Fetch states when travelType changes
  useEffect(() => {
    fetchStateList(travelType);
  }, [travelType, fetchStateList]);

  // Fetch cities when a state is selected and valid
//   useEffect(() => {
//     if (!selectedState) {
//       setCityList([]);
//       return;
//     }

//     // Only proceed if selectedState is a valid ID (non-empty)
//     const getCities = async () => {
//       setIsCityListLoading(true);
//       try {
//         console.log("Fetching cities for state:", selectedState);
//         const resp = await apiClient.get(`/admin/state/${selectedState}`);
//         const cities = resp.data?.citiesData || [];
//         setCityList(cities);
//       } catch (error) {
//         console.error("Failed to fetch cities:", error);
//         setCityList([]);
//       } finally {
//         setIsCityListLoading(false);
//       }
//     };

//     getCities();
//   }, [selectedState]);
useEffect(() => {
  if (!selectedState) {
    setCityList([]);
    return;
  }
  const getCities = async () => {
    setIsCityListLoading(true);
    try {
    //   console.log("Fetching cities for:", selectedState);
      const resp = await apiClient.get(`/admin/state/${selectedState}`);
      const cities = resp.data?.citiesData || [];
      setCityList(cities);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      toast.error("Failed to fetch cities");
      setCityList([]);
    } finally {
      setIsCityListLoading(false);
    }
  };
  getCities();
}, [selectedState]);


  // Fetch city details when editing
  useEffect(() => {
    if (!selectedCityId) {
      resetFormFields();
      return;
    }

    const getCityDetails = async () => {
      console.log("Fetching city details for:", selectedCityId);
      try {
        const resp = await apiClient.get(`/admin/city/${selectedCityId}`);
        const data = resp.data?.cityData;
        if (data) {
          setCityName(data.city_name || "");
          setCategories(data.city_category || []);
          setVisibility(data.visibility || "public");
          setExistingImages(data.city_image || []);
          setNewImageFiles([]);
        }
      } catch (error) {
        console.error("Error fetching city details:", error);
      }
    };

    getCityDetails();
  }, [selectedCityId]);

  // --- Submission ---

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!cityName) {
      toast.error("Please enter a city name.");
      return;
    }
    if (!selectedState) {
      toast.error("Please select a state.");
      return;
    }

    const formData = new FormData();
    formData.append("city_name", cityName);
    formData.append("visibility", visibility);
    formData.append("city_category", JSON.stringify(categories));

    newImageFiles.forEach((file) => {
      formData.append("image", file);
    });

    if (isUpdateMode) {
      formData.append("cityId", selectedCityId);
      formData.append("existingImages", JSON.stringify(existingImages));

      try {
        const res = await apiClient.patch(
          `/admin/city/${selectedCityId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(res.data.msg || "City updated successfully!");
      } catch (err) {
        console.error("Update error:", err);
        toast.error("Failed to update city.");
      }
    } else {
      formData.append("id", selectedState);

      try {
        const res = await apiClient.post("/admin/city", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(res.data.msg || "City created successfully!");
      } catch (err) {
        console.error("Create error:", err);
        toast.error("Failed to create city.");
      }

      resetFormFields();
    }
  };

  const handleDeleteCity = async () => {
    if (!selectedCityId) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this city?"
    );
    if (!confirmed) return;

    try {
      const res = await apiClient.delete(`/admin/city/${selectedCityId}`);
      toast.success(res.data.msg || "City deleted successfully!");
      setSelectedCityId("");
      resetFormFields();
      setCityList((prev) => prev.filter((c) => c._id !== selectedCityId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete city.");
    }
  };

  const renderImagePreviews = () => (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {existingImages.map((url) => (
        <div key={url} className="group relative">
          <img
            src={url}
            alt="Existing city view"
            className="h-28 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => handleRemoveExistingImage(url)}
            className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      {newImageFiles.map((file, idx) => (
        <div key={file.name + idx} className="group relative">
          <img
            src={URL.createObjectURL(file)}
            alt="New upload preview"
            className="h-28 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => handleRemoveNewImage(idx)}
            className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          City Management
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {isUpdateMode
            ? `Editing city: ${cityName}`
            : "Create a new city by selecting a state."}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Travel Type
            </label>
            <div className="flex gap-6">
              {["domestic", "international"].map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value={type}
                    checked={travelType === type}
                    onChange={handleTypeChange}
                    className="h-4 w-4 border-slate-300 bg-transparent text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                  />
                  <span className="capitalize text-slate-800 dark:text-slate-200">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Select State
            </label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              disabled={isStateListLoading}
            >
              <option value="">{isStateListLoading ? "Loading..." : "-- Select a State --"}</option>
              {stateList.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.destination_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Select City (Optional)
            </label>
            <select
              value={selectedCityId}
              onChange={handleCityChange}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              disabled={!selectedState || isCityListLoading}
            >
              <option value="">{isCityListLoading ? "Loading..." : "-- Select to Edit --"}</option>
              {cityList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.city_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {isUpdateMode && (
            <button
              type="button"
              onClick={handleDeleteCity}
              className="absolute right-4 top-4 rounded-md border border-red-600 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          )}
        </div>

        <div
          className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${
            !selectedState ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                City Name
              </label>
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="e.g., Los Angeles"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Categories
            </label>
            <div className="flex flex-col space-y-3">
              {AVAILABLE_CATEGORIES.map((cat) => (
                <label key={cat} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={categories.includes(cat)}
                    onChange={handleCategoryChange}
                    className="h-4 w-4 rounded border-slate-300 bg-transparent text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                  />
                  <span className="text-slate-800 dark:text-slate-200">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              City Images
            </label>
            <div className="mt-2">
              {(existingImages.length > 0 || newImageFiles.length > 0) && renderImagePreviews()}
            </div>
            <label
              htmlFor="image-upload"
              className="mt-4 flex w-full cursor-pointer justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 transition-colors hover:border-blue-500 dark:border-slate-700 dark:hover:border-blue-600"
            >
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-2 text-sm font-semibold text-blue-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </div>
            </label>
          </div>

          <div className="mt-8 flex justify-end border‑t border-slate-200 pt-6 dark:border-slate-700">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedState || !cityName}
            >
              {isUpdateMode ? "Update City" : "Create City"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCity;
