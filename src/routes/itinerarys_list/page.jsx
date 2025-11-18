// // import React, { useState, useEffect, useMemo } from "react";
// // import { MapPin, Calendar, Plus, List, ArrowRight, Search, Pencil, Trash2 } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import { apiClient } from "../../stores/authStore";
// // import { toast } from "react-toastify";

// // // --- ItineraryCard COMPONENT ---
// // const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
// //     const { title, duration, selected_destination, destination_thumbnails, itinerary_visibility } = itinerary;
// //     const destination = selected_destination?.destination_name || "N/A";
// //     const thumbnail = destination_thumbnails?.[0] || "https://via.placeholder.com/400x300";
// //     const status = itinerary_visibility === "public" ? "public" : "private";
// //     const navigate = useNavigate();
// //     return (
// //         <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
// //             <div className="relative overflow-hidden">
// //                 <div className="absolute right-3 top-3 z-10 flex gap-2">
// //                     <button
// //                         onClick={(e) => {
// //                             navigate(`itinerary_details/${itinerary._id}`);
// //                         }}
// //                         className="rounded-full bg-white/80 p-1.5 text-blue-600 transition hover:bg-white dark:bg-slate-900/80"
// //                         title="Edit"
// //                     >
// //                         <Pencil size={16} />
// //                     </button>
// //                     <button
// //                         onClick={(e) => {
// //                             e.stopPropagation();
// //                             onDelete(itinerary._id);
// //                         }}
// //                         className="rounded-full bg-white/80 p-1.5 text-red-600 transition hover:bg-white dark:bg-slate-900/80"
// //                         title="Delete"
// //                     >
// //                         <Trash2 size={16} />
// //                     </button>
// //                 </div>
// //                 <img
// //                     src={thumbnail}
// //                     alt={`Thumbnail for ${title}`}
// //                     className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
// //                 />
// //             </div>
// //             <div className="p-4">
// //                 <h3 className="mb-2 truncate text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
// //                 <div className="space-y-2.5 text-sm">
// //                     <p className="flex items-center text-slate-600 dark:text-slate-400">
// //                         <MapPin
// //                             size={14}
// //                             className="mr-2 text-slate-500"
// //                         />
// //                         <span className="font-medium">{destination}</span>
// //                     </p>
// //                     <p className="flex items-center text-slate-600 dark:text-slate-400">
// //                         <Calendar
// //                             size={14}
// //                             className="mr-2 text-slate-500"
// //                         />
// //                         <span className="font-medium">{duration}</span>
// //                     </p>
// //                 </div>
// //                 <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
// //                     <span
// //                         className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
// //                             status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
// //                         }`}
// //                     >
// //                         {status}
// //                     </span>
// //                     <a
// //                         onClick={(e) => navigate(`itinerary_details/${itinerary._id}`)}
// //                         className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
// //                     >
// //                         View Details
// //                         <ArrowRight
// //                             size={14}
// //                             className="ml-1 group-hover:translate-x-1"
// //                         />
// //                     </a>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // // --- ItinerariesListPage COMPONENT ---
// // const ItinerariesListPage = () => {
// //     const navigate = useNavigate();
// //     const [itineraries, setItineraries] = useState([]);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [searchQuery, setSearchQuery] = useState("");
// //     const [filters, setFilters] = useState({ type: "all", status: "all", destination: "all" });

// //     useEffect(() => {
// //         const fetchItineraries = async () => {
// //             try {
// //                 const { data } = await apiClient.get("/admin/itinerary");
// //                 setItineraries(data?.data || []);
// //             } catch (error) {
// //                 // console.error("Error fetching itineraries:", error);
// //                 toast.error("Failed to load itineraries.");
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         fetchItineraries();
// //     }, []);

// //     const handleFilterChange = (e) => {
// //         const { name, value } = e.target;
// //         setFilters((prev) => ({ ...prev, [name]: value }));
// //     };

// //     const filteredItineraries = useMemo(() => {
// //         return itineraries
// //             .filter((it) => {
// //                 const query = searchQuery.toLowerCase();
// //                 return it.title.toLowerCase().includes(query) || it?.selected_destination?.destination_name?.toLowerCase()?.includes(query);
// //             })
// //             .filter((it) => {
// //                 if (filters.type === "all") return true;
// //                 return it.selected_destination.domestic_or_international.toLowerCase() === filters.type.toLocaleLowerCase();
// //             })
// //             .filter((it) => {
// //                 if (filters.status === "all") return true;
// //                 return it.itinerary_visibility === (filters.status === "published" ? "public" : "private");
// //             })
// //             .filter((it) => {
// //                 if (filters.destination === "all") return true;
// //                 return it?.selected_destination?.destination_name?.toLowerCase() === filters.destination;
// //             });
// //     }, [searchQuery, filters, itineraries]);

// //     const handleEdit = (id) => navigate(`/edit_itinerary/${id}`);
// //     const handleDelete = async (id) => {
// //         try {
// //             await apiClient.delete(`/admin/itinerary/${id}`);
// //             setItineraries((prev) => prev.filter((it) => it._id !== id));
// //             toast.success("Itinerary deleted.");
// //         } catch {
// //             toast.error("Failed to delete itinerary.");
// //         }
// //     };


// //     const inputStyle = "block w-full rounded-md border bg-white dark:bg-gray-700 p-2";

// //     return (
// //         <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
// //             <div className="mx-auto max-w-7xl">
// //                 {/* Header */}
// //                 <div className="mb-6 flex items-center justify-between">
// //                     <div>
// //                         <h1 className="flex items-center text-3xl font-bold">
// //                             <List className="mr-2 text-blue-500" /> All Itineraries
// //                         </h1>
// //                         <p className="text-slate-500 dark:text-slate-400">Browse or manage travel plans</p>
// //                     </div>
// //                     <button
// //                         onClick={() => navigate("/create_itinerary")}
// //                         className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
// //                     >
// //                         <Plus
// //                             size={16}
// //                             className="mr-1 inline"
// //                         />
// //                         Create New
// //                     </button>
// //                 </div>

// //                 {/* Filters */}
// //                 <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-white p-4 dark:bg-slate-800">
// //                     <input
// //                         type="search"
// //                         placeholder="Search by title or destination..."
// //                         value={searchQuery}
// //                         onChange={(e) => setSearchQuery(e.target.value)}
// //                         className="w-full rounded-md border px-3 py-2 md:w-1/3"
// //                     />
// //                     <select
// //                         name="type"
// //                         value={filters.type}
// //                         onChange={handleFilterChange}
// //                         className={inputStyle}
// //                     >
// //                         <option value="all">-- Type --</option>
// //                         <option onChange={()=>{setFilters(types=='domestic')}}  value="Domestic">Domestic</option>
// //                         <option onChange={()=>{setFilters(types=='International')}} value="International">International</option>
// //                     </select>
// //                     <select
// //                         name="status"
// //                         value={filters.status}
// //                         onChange={handleFilterChange}
// //                         className={inputStyle}
// //                     >
// //                         <option value="all">-- Status --</option>
// //                         <option value="published">Published</option>
// //                         <option value="private">Private</option>
// //                     </select>
// //                     <select
// //                         name="destination"
// //                         value={filters.destination}
// //                         onChange={handleFilterChange}
// //                         className={inputStyle}
// //                     >
// //                         <option value="all">-- Destination --</option>
// //                         {Array.from(new Set(itineraries.map((it) => it?.selected_destination?.destination)))
// //                             .filter(Boolean)
// //                             .map((dest) => (
// //                                 <option
// //                                     key={dest}
// //                                     value={dest.toLowerCase()}
// //                                 >
// //                                     {dest}
// //                                 </option>
// //                             ))}
// //                     </select>
// //                 </div>

// //                 {/* List */}
// //                 {isLoading ? (
// //                     <div className="text-center text-gray-500">Loading itineraries...</div>
// //                 ) : filteredItineraries.length === 0 ? (
// //                     <div className="py-10 text-center text-gray-400">No itineraries found.</div>
// //                 ) : (
// //                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
// //                         {filteredItineraries.map((item) => (
// //                             <ItineraryCard
// //                                 key={item._id}
// //                                 itinerary={item}
// //                                 onEdit={handleEdit}
// //                                 onDelete={handleDelete}
// //                             />
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default ItinerariesListPage;
// import React, { useState, useEffect, useMemo } from "react";
// import { MapPin, Calendar, Plus, List, ArrowRight, Search, Pencil, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { apiClient } from "../../stores/authStore";
// import { toast } from "react-toastify";

// // --- ItineraryCard COMPONENT ---
// const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
//   const {
//     title,
//     duration,
//     selected_destination,
//     destination_thumbnails,
//     itinerary_visibility,
//   } = itinerary;
//   const destination =
//     selected_destination?.destination_name || "N/A";
//   const thumbnail =
//     destination_thumbnails?.[0] || "https://via.placeholder.com/400x300";
//   const status = itinerary_visibility === "public" ? "public" : "private";
//   const navigate = useNavigate();

//   return (
//     <div
//       className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
//     >
//       <div className="relative overflow-hidden">
//         <div className="absolute right-3 top-3 z-10 flex gap-2">
//           <button
//             onClick={() => {
//               navigate(`itinerary_details/${itinerary._id}`);
//             }}
//             className="rounded-full bg-white/80 p-1.5 text-blue-600 transition hover:bg-white dark:bg-slate-900/80"
//             title="Edit"
//           >
//             <Pencil size={16} />
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete(itinerary._id);
//             }}
//             className="rounded-full bg-white/80 p-1.5 text-red-600 transition hover:bg-white dark:bg-slate-900/80"
//             title="Delete"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//         <img
//           src={thumbnail}
//           alt={`Thumbnail for ${title}`}
//           className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="mb-2 truncate text-lg font-bold text-slate-900 dark:text-white">
//           {title}
//         </h3>
//         <div className="space-y-2.5 text-sm">
//           <p className="flex items-center text-slate-600 dark:text-slate-400">
//             <MapPin size={14} className="mr-2 text-slate-500" />
//             <span className="font-medium">{destination}</span>
//           </p>
//           <p className="flex items-center text-slate-600 dark:text-slate-400">
//             <Calendar size={14} className="mr-2 text-slate-500" />
//             <span className="font-medium">{duration}</span>
//           </p>
//         </div>
//         <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
//           <span
//             className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
//               status === "public"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-amber-100 text-amber-800"
//             }`}
//           >
//             {status}
//           </span>
//           <a
//             onClick={() => navigate(`itinerary_details/${itinerary._id}`)}
//             className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
//           >
//             View Details
//             <ArrowRight size={14} className="ml-1 group-hover:translate-x-1" />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- ItinerariesListPage COMPONENT ---
// const ItinerariesListPage = () => {
//   const navigate = useNavigate();
//   const [itineraries, setItineraries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({
//     type: "all",
//     status: "all",
//     destination: "all",
//   });

//   useEffect(() => {
//     const fetchItineraries = async () => {
//       try {
//         const { data } = await apiClient.get("/admin/itinerary");
//         setItineraries(data?.data || []);
//       } catch (error) {
//         toast.error("Failed to load itineraries.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchItineraries();
//   }, []);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredItineraries = useMemo(() => {
//     return itineraries
//       .filter((it) => {
//         const query = searchQuery.toLowerCase();
//         const titleMatch = it.title.toLowerCase().includes(query);
//         const destName = it.selected_destination?.destination_name || "";
//         const destMatch = destName.toLowerCase().includes(query);
//         return titleMatch || destMatch;
//       })
//       .filter((it) => {
//         if (filters.type === "all") return true;
//         // Normalize comparison: lowercase both sides
//         const itType = it.selected_destination?.domestic_or_international?.toLowerCase();
//         return itType === filters.type.toLowerCase();
//       })
//       .filter((it) => {
//         if (filters.status === "all") return true;
//         const vis = it.itinerary_visibility;
//         if (filters.status === "published") {
//           return vis === "public";
//         }
//         if (filters.status === "private") {
//           return vis === "private";
//         }
//         return true;
//       })
//       .filter((it) => {
//         if (filters.destination === "all") return true;
//         const destName = it.selected_destination?.destination_name || "";
//         return destName.toLowerCase() === filters.destination.toLowerCase();
//       });
//   }, [searchQuery, filters, itineraries]);

//   const handleEdit = (id) => navigate(`/edit_itinerary/${id}`);
//   const handleDelete = async (id) => {
//     try {
//       await apiClient.delete(`/admin/itinerary/${id}`);
//       setItineraries((prev) => prev.filter((it) => it._id !== id));
//       toast.success("Itinerary deleted.");
//     } catch {
//       toast.error("Failed to delete itinerary.");
//     }
//   };

//   const inputStyle = "block w-full rounded-md border bg-white dark:bg-gray-700 p-2";

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h1 className="flex items-center text-3xl font-bold">
//               <List className="mr-2 text-blue-500" /> All Itineraries
//             </h1>
//             <p className="text-slate-500 dark:text-slate-400">
//               Browse or manage travel plans
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/create_itinerary")}
//             className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
//           >
//             <Plus size={16} className="mr-1 inline" />
//             Create New
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-white p-4 dark:bg-slate-800">
//           <input
//             type="search"
//             placeholder="Search by title or destination..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-md border px-3 py-2 md:w-1/3"
//           />
//           <select
//             name="type"
//             value={filters.type}
//             onChange={handleFilterChange}
//             className={inputStyle}
//           >
//             <option value="all">-- Type --</option>
//             <option value="domestic">Domestic</option>
//             <option value="international">International</option>
//           </select>
//           <select
//             name="status"
//             value={filters.status}
//             onChange={handleFilterChange}
//             className={inputStyle}
//           >
//             <option value="all">-- Status --</option>
//             <option value="published">Published</option>
//             <option value="private">Private</option>
//           </select>
//           <select
//             name="destination"
//             value={filters.destination}
//             onChange={handleFilterChange}
//             className={inputStyle}
//           >
//             <option value="all">-- Destination --</option>
//             {Array.from(
//               new Set(
//                 itineraries.map(
//                   (it) => it.selected_destination?.destination_name || ""
//                 )
//               )
//             )
//               .filter(Boolean)
//               .map((dest) => (
//                 <option key={dest} value={dest.toLowerCase()}>
//                   {dest}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* List */}
//         {isLoading ? (
//           <div className="text-center text-gray-500">Loading itineraries...</div>
//         ) : filteredItineraries.length === 0 ? (
//           <div className="py-10 text-center text-gray-400">No itineraries found.</div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filteredItineraries.map((item) => (
//               <ItineraryCard
//                 key={item._id}
//                 itinerary={item}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ItinerariesListPage;

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Calendar,
  Plus,
  List,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../stores/authStore";
import { toast } from "react-toastify";

// --- ItineraryCard COMPONENT ---
const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
  const {
    title,
    duration,
    selected_destination,
    destination_thumbnails,
    itinerary_visibility,
  } = itinerary;

  const destinationName = selected_destination?.destination_name || "N/A";
  const thumbnail =
    destination_thumbnails?.[0] || "https://via.placeholder.com/400x300";
  const status = itinerary_visibility === "public" ? "public" : "private";
  const navigate = useNavigate();

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="relative overflow-hidden">
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            onClick={() => {
              navigate(`itinerary_details/${itinerary._id}`);
            }}
            className="rounded-full bg-white/80 p-1.5 text-blue-600 transition hover:bg-white dark:bg-slate-900/80"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(itinerary._id);
            }}
            className="rounded-full bg-white/80 p-1.5 text-red-600 transition hover:bg-white dark:bg-slate-900/80"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <img
          src={thumbnail}
          alt={`Thumbnail for ${title}`}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 truncate text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <div className="space-y-2.5 text-sm">
          <p className="flex items-center text-slate-600 dark:text-slate-400">
            <MapPin size={14} className="mr-2 text-slate-500" />
            <span className="font-medium">{destinationName}</span>
          </p>
          <p className="flex items-center text-slate-600 dark:text-slate-400">
            <Calendar size={14} className="mr-2 text-slate-500" />
            <span className="font-medium">{duration}</span>
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              status === "public"
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {status}
          </span>
          <button
            onClick={() => navigate(`itinerary_details/${itinerary._id}`)}
            className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View Details
            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ItinerariesListPage COMPONENT ---
const ItinerariesListPage = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",           // corresponds to itinerary_type
    status: "all",         // corresponds to itinerary_visibility
    destination: "all",
  });

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const resp = await apiClient.get("/admin/itinerary");
        setItineraries(resp.data?.data || []);
        console.log(itineraries);
      } catch (error) {
        toast.error("Failed to load itineraries.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredItineraries = useMemo(() => {
    return itineraries
      // Search filter
      .filter((it) => {
        const q = searchQuery.toLowerCase();
        const titleMatch = it.title?.toLowerCase().includes(q);
        const destName = it.selected_destination?.destination_name || "";
        const destMatch = destName.toLowerCase().includes(q);
        return titleMatch || destMatch;
      })
      // Type filter (based on itinerary_type)
      .filter((it) => {
        if (filters.type === "all") return true;
        const itType = it.itinerary_type; // use itinerary_type
        if (!itType) return false;
        return itType.toLowerCase() === filters.type.toLowerCase();
      })
      // Status filter
      .filter((it) => {
        if (filters.status === "all") return true;
        if (filters.status === "published") {
          return it.itinerary_visibility === "public";
        }
        if (filters.status === "private") {
          return it.itinerary_visibility === "private";
        }
        return true;
      })
      // Destination name filter
      .filter((it) => {
        if (filters.destination === "all") return true;
        const destName = it.selected_destination?.destination_name || "";
        return destName.toLowerCase() === filters.destination.toLowerCase();
      });
  }, [searchQuery, filters, itineraries]);

  const handleEdit = (id) => navigate(`/edit_itinerary/${id}`);
  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/admin/itinerary/${id}`);
      setItineraries((prev) => prev.filter((it) => it._id !== id));
      toast.success("Itinerary deleted.");
    } catch {
      toast.error("Failed to delete itinerary.");
    }
  };

  const inputStyle = "block w-full rounded-md border bg-white dark:bg-gray-700 p-2";

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-3xl font-bold">
              <List className="mr-2 text-blue-500" /> All Itineraries
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Browse or manage travel plans
            </p>
          </div>
          <button
            onClick={() => navigate("/create_itinerary")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
          >
            <Plus size={16} className="mr-1 inline" />
            Create New
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-white p-4 dark:bg-slate-800">
          <input
            type="search"
            placeholder="Search by title or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border px-3 py-2 md:w-1/3"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className={inputStyle}
          >
            <option value="all">-- Type --</option>
            <option value="flexible">Flexible</option>
            <option value="fixed">Fixed</option>
            {/* Add other types if available */}
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className={inputStyle}
          >
            <option value="all">-- Status --</option>
            <option value="published">Published</option>
            <option value="private">Private</option>
          </select>
          <select
            name="destination"
            value={filters.destination}
            onChange={handleFilterChange}
            className={inputStyle}
          >
            <option value="all">-- Destination --</option>
            {Array.from(
              new Set(
                itineraries.map((it) =>
                  it.selected_destination?.destination_name || ""
                )
              )
            )
              .filter(Boolean)
              .map((destName) => (
                <option key={destName} value={destName.toLowerCase()}>
                  {destName}
                </option>
              ))}
          </select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading itineraries...</div>
        ) : filteredItineraries.length === 0 ? (
          <div className="py-10 text-center text-gray-400">No itineraries found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItineraries.map((it) => (
              <ItineraryCard
                key={it._id}
                itinerary={it}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItinerariesListPage;
