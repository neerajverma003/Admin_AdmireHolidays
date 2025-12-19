import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../../../stores/authStore";
import { toast } from "react-toastify";

const TermsSection = ({ formData, handleInputChange, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const fetchTerms = async (destinationId) => {
    if (!destinationId) return;

    // Capture the id used for this call to avoid race conditions
    const callDestId = destinationId;
    setLoading(true);
    try {
      // Primary attempt: fetch by destination _id
      const res = await apiClient.get(`/admin/tnc/${callDestId}`);

      if (res?.data?.success && res?.data?.tnc) {
        // Only update if selected destination hasn't changed
        if (formData.selected_destination_id === callDestId) {
          handleInputChange({ target: { name: "terms_and_conditions", value: res.data.tnc.terms_And_condition || "" } });
          setLoadError("");
          return;
        }
      }

      // If not found, attempt fallback by selected destination name (if available)
      if (formData.selected_destination_name) {
        const resByName = await apiClient.get(`/admin/tnc/${formData.selected_destination_name}`);
        if (resByName?.data?.success && resByName?.data?.tnc) {
          if (formData.selected_destination_id === callDestId) {
            handleInputChange({ target: { name: "terms_and_conditions", value: resByName.data.tnc.terms_And_condition || "" } });
            setLoadError("");
            return;
          }
        }
      }

      // If we reach here, treat as not found — only notify if there's no existing terms
      const msg = "No Terms & Conditions found for this destination.";
      setLoadError(msg);
      if (!formData.terms_and_conditions) toast.warning(msg);
    } catch (err) {
      const serverMsg = err?.response?.data?.msg || err?.response?.data?.message;
      const message = serverMsg || err.message || "Failed to load Terms & Conditions";
      setLoadError(message);
      // Only show toast when there isn't already T&C populated
      if (!formData.terms_and_conditions) toast.error(message);
      console.error("TermsSection.fetchTerms error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms(formData.selected_destination_id);
  }, [formData.selected_destination_id]);

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>

      <label className={labelStyle}>
        <FileText className="inline mr-2" size={16} />
        Terms & Conditions
      </label>

      <textarea
        name="terms_and_conditions"
        rows="4"
        value={formData.terms_and_conditions}
        readOnly
        className={inputStyle}
        placeholder={loading ? "Loading terms..." : "Auto-filled"}
        maxLength={50000}
      />
      {loadError && (
        <div className="mt-2">
          <p className="text-red-500 text-sm">{loadError}</p>
          <button
            type="button"
            onClick={() => fetchTerms(formData.selected_destination_id)}
            className="mt-2 inline-block rounded bg-blue-600 px-3 py-1 text-white text-sm"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default TermsSection;



// import { FileText } from "lucide-react";

// const TermsSection = ({ formData, handleInputChange, styles }) => {
//   const { cardStyle, labelStyle, inputStyle } = styles;

//   return (
//     <div className={cardStyle}>
//       <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
//       <label className={labelStyle}>
//         <FileText className="inline mr-2" size={16} />
//         Terms & Conditions
//       </label>
//       <textarea
//         name="terms_and_conditions"
//         rows="4"
//         value={formData.terms_and_conditions}
//         onChange={handleInputChange} // Now editable
//         className={inputStyle}
//         placeholder="Auto-filled from API, you can edit..."
//       />
//     </div>
//   );
// };

// export default TermsSection;
