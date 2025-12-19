import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../../../stores/authStore";
import { toast } from "react-toastify";

const TermsSection = ({ formData, setFormData, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;
  const [loading, setLoading] = useState(false);

  const fetchTerms = async () => {
    if (!formData.selected_destination_id) return;

    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/tnc/${formData.selected_destination_id}`);

      setFormData(prev => ({
        ...prev,
        terms_and_conditions: res?.data?.tnc?.terms_And_condition || "",
      }));
    } catch {
      toast.error("Failed to load Terms & Conditions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
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
