// import { ShieldX } from "lucide-react";
// import { useEffect } from "react";
// import { apiClient } from "../../../stores/authStore";
// import { toast } from "react-toastify";

// const CancellationPolicySection = ({ formData, setFormData, styles }) => {
//   const { cardStyle, labelStyle, inputStyle } = styles;

//   const fetchCancellation = async () => {
//     try {
//       const res = await apiClient.get("/admin/cancellation-policy");

//       setFormData(prev => ({
//         ...prev,
//         cancellation_policy: res?.data?.data?.cancellation_policy || "",
//       }));
//     } catch {
//       toast.error("Failed to load cancellation policy");
//     }
//   };

//   useEffect(() => {
//     fetchCancellation();
//   }, []);

//   return (
//     <div className={cardStyle}>
//       <h2 className="text-xl font-semibold mb-4">Cancellation Policy</h2>

//       <label className={labelStyle}>
//         <ShieldX className="inline mr-2" size={16} />
//         Cancellation Policy
//       </label>

//       <textarea
//         name="cancellation_policy"
//         rows="4"
//         value={formData.cancellation_policy}
//         readOnly
//         className={inputStyle}
//         placeholder="Auto-filled"
//       />
//     </div>
//   );
// };

// export default CancellationPolicySection;



import { useEffect } from "react";
import { ShieldX } from "lucide-react";
import { apiClient } from "../../../stores/authStore";
import { toast } from "react-toastify";

const CancellationPolicySection = ({ formData, handleInputChange, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  useEffect(() => {
    const fetchCancellationPolicy = async () => {
      try {
        const res = await apiClient.get("/admin/cancellation-policy");
        const policy = res?.data?.data?.cancellation_policy || "No available cancellation policy.";
        handleInputChange({ target: { name: "cancellation_policy", value: policy } });
      } catch {
        toast.error("Failed to load Cancellation Policy");
      }
    };
    fetchCancellationPolicy();
  }, []);

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4">Cancellation Policy</h2>
      <label className={labelStyle}>
        <ShieldX className="inline mr-2" size={16} />
        Cancellation Policy
      </label>
      <textarea
        name="cancellation_policy"
        rows="3"
        value={formData.cancellation_policy}
        onChange={handleInputChange}
        className={inputStyle}
        placeholder="Auto-filled from API, you can edit..."
        maxLength={50000}
      />
    </div>
  );
};

export default CancellationPolicySection;
