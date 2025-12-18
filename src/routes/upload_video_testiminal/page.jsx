import { useRef, useState, useEffect } from "react";
import { Loader2, Video, X, Replace, UploadCloud, Film, MapPin, Eye, Text, Trash2, Play } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../../stores/authStore";

const styleProps = {
  inputStyle:
    "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500",
  labelStyle: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
  cardStyle:
    "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700",
  buttonStyle:
    "flex items-center cursor-pointer gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500",
  removeButtonStyle:
    "flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500",
};

const UploadVideoTestimonial = () => {
  const { cardStyle, labelStyle, inputStyle, buttonStyle } = styleProps;

  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Refs for input fields
  const nameRef = useRef();
  const locationRef = useRef();
  const visibilityRef = useRef();

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

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else if (file) {
      toast.error("Invalid file type. Please select a video.");
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    const videoInput = document.getElementById("videoUpload");
    if (videoInput) videoInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video file.");
      return;
    }

    const name = nameRef.current?.value.trim();
    const location = locationRef.current?.value.trim();
    const visibility = visibilityRef.current?.value;

    if (!name || !location) {
      toast.error("Please fill out the video name and location fields.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("image", videoFile);
    submissionData.append("title", name);
    submissionData.append("location", location);
    submissionData.append("visibility", visibility);

    try {
      setIsLoading(true);
      const response = await apiClient.post("/admin/testimonial-video", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Upload successful!");
        setVideoFile(null);
        // Reset form fields
        if (nameRef.current) nameRef.current.value = "";
        if (locationRef.current) locationRef.current.value = "";
        if (visibilityRef.current) visibilityRef.current.value = "public";
        const videoInput = document.getElementById("videoUpload");
        if (videoInput) videoInput.value = "";
        // Refresh testimonials list
        fetchTestimonials();
      } else {
        toast.error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Video Upload Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during the upload.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Upload Form */}
      <form onSubmit={handleSubmit} className={cardStyle}>
        <h1 className="text-xl font-semibold mb-6 flex items-center border-b dark:text-white border-gray-200 dark:border-gray-700 pb-3">
          <Film className="inline mr-3 text-blue-500 dark:text-white" size={22} />
          Upload Video Testimonial
        </h1>

        <div className="space-y-6">
          {/* Video Upload & Preview */}
          <div>
            <label className={labelStyle}>
              <UploadCloud className="mr-2" size={16} /> Video File
            </label>
            {videoFile ? (
              <div className="mt-2 relative rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden group bg-black">
                <video
                  src={URL.createObjectURL(videoFile)}
                  controls
                  muted
                  className="w-full h-auto max-h-72 object-contain"
                  onLoadedData={(e) => URL.revokeObjectURL(e.target.src)}
                />
                <div className="absolute top-2 right-2 flex gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                  <label
                    htmlFor="videoUpload"
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 cursor-pointer"
                    title="Change video"
                  >
                    <Replace size={18} />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                    title="Remove video"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="videoUpload"
                className="mt-2 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-10 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                <Video size={36} className="text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  Click to upload or drag & drop
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  A single video file (MP4, WebM)
                </span>
              </label>
            )}
            <input id="videoUpload" type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
          </div>

          {/* Text Fields */}
          <div>
            <label htmlFor="name" className={labelStyle}>
              <Text className="mr-2" size={16} /> Title
            </label>
            <input
              type="text"
              name="name"
              id="name"
              ref={nameRef}
              className={inputStyle}
              placeholder="e.g., Summer Highlights"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className={labelStyle}>
              <MapPin className="mr-2" size={16} /> Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              ref={locationRef}
              className={inputStyle}
              placeholder="e.g., California, USA"
              required
            />
          </div>
          <div>
            <label htmlFor="visibility" className={labelStyle}>
              <Eye className="mr-2" size={16} /> Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              ref={visibilityRef}
              defaultValue="public"
              className={inputStyle}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="submit" disabled={!videoFile || isLoading} className={buttonStyle}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload Testimonial</span>
            )}
          </button>
        </div>
      </form>

      {/* Testimonial List Section */}
      <div className={cardStyle}>
        <h2 className="text-xl font-semibold mb-6 flex items-center border-b dark:text-white border-gray-200 dark:border-gray-700 pb-3">
          <Play className="inline mr-3 text-green-500 dark:text-green-400" size={22} />
          Testimonial List
        </h2>

        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading testimonials...</span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No testimonials uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        testimonial.visibility === "Public"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                      }`}
                    >
                      {testimonial.visibility}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex justify-between">
                    <span>
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial._id)}
                    disabled={deletingId === testimonial._id}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
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

export default UploadVideoTestimonial;
