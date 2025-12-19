// import { CreditCard } from "lucide-react";
// import { useEffect, useState } from "react";
// import { apiClient } from "../../../stores/authStore";
// import { toast } from "react-toastify";

// const PaymentModeSection = ({ formData, setFormData, styles }) => {
//   const { cardStyle, labelStyle, inputStyle } = styles;
//   const [loading, setLoading] = useState(false);

//   const fetchPaymentMode = async () => {
//     if (!formData.travel_type) return;

//     try {
//       setLoading(true);
//       const res = await apiClient.get(`/admin/payment-mode/${formData.travel_type}`);

//       setFormData(prev => ({
//         ...prev,
//         payment_mode:
//           res?.data?.destinationPaymentModeData?.payment_mode || "",
//       }));
//     } catch {
//       toast.error("Failed to load payment mode");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPaymentMode();
//   }, [formData.travel_type]);

//   return (
//     <div className={cardStyle}>
//       <h2 className="text-xl font-semibold mb-4">Payment Mode</h2>

//       <label className={labelStyle}>
//         <CreditCard className="inline mr-2" size={16} />
//         Payment Mode
//       </label>

//       <textarea
//         name="payment_mode"
//         rows="4"
//         value={formData.payment_mode}
//         readOnly
//         className={inputStyle}
//         placeholder={loading ? "Loading..." : "Auto-filled"}
//       />
//     </div>
//   );
// };

// export default PaymentModeSection;


import { useEffect } from "react";
import { CreditCard } from "lucide-react";
import { apiClient } from "../../../stores/authStore";
import { toast } from "react-toastify";

const PaymentModeSection = ({ formData, handleInputChange, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  useEffect(() => {
    const fetchPaymentMode = async () => {
      if (!formData.travel_type) return;
      try {
        const res = await apiClient.get(`/admin/payment-mode/${formData.travel_type}`);
        const payment_mode = res?.data?.destinationPaymentModeData?.payment_mode || "";
        if (payment_mode) {
          handleInputChange({ target: { name: "payment_mode", value: payment_mode } });
        } else {
          toast.warning("No Payment Mode found for this travel type.");
        }
      } catch {
        toast.error("Failed to load Payment Mode");
      }
    };
    fetchPaymentMode();
  }, [formData.travel_type]);

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4">Payment Mode</h2>
      <label className={labelStyle}>
        <CreditCard className="inline mr-2" size={16} />
        Payment Mode
      </label>
      <textarea
        name="payment_mode"
        rows="2"
        value={formData.payment_mode}
        onChange={handleInputChange}
        className={inputStyle}
        placeholder="Auto-filled from API, you can edit..."
        maxLength={50000}
      />
    </div>
  );
};

export default PaymentModeSection;
