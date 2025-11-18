import {
  Landmark,
  ListPlus,
  Ban,
  FileText,
  CreditCard,
  ShieldX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../../../stores/authStore";
import { toast } from "react-toastify";

const DescriptionsSection = ({ formData, handleInputChange, styles, setFormData }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;
  const [termsLoading, setTermsLoading] = useState(false);

  // ✅ Fetch Terms & Conditions
  const fetchTermsContent = async () => {
    const destinationId = formData.selected_destination_id;
    if (!destinationId) return; // skip if no destination selected

    try {
      setTermsLoading(true);
      const res = await apiClient.get(`/admin/tnc/${destinationId}`);

      if (res.data?.tnc?.terms_And_condition) {
        setFormData((prev) => ({
          ...prev,
          terms_and_conditions: res.data.tnc.terms_And_condition,
        }));
      } else {
        setFormData((prev) => ({ ...prev, terms_and_conditions: "" }));
        toast.warning("No Terms & Conditions found for this destination.");
      }
    } catch (error) {
      // console.error("Failed to fetch terms:", error);
      toast.error("Failed to load Terms & Conditions");
    } finally {
      setTermsLoading(false);
    }
  };

  // ✅ Fetch Payment Mode
  const fetchPaymentMode = async (travelType) => {
    if (!travelType) return;
    try {
      setTermsLoading(true);
      const res = await apiClient.get(`/admin/payment-mode/${travelType}`);
      if (res?.data?.destinationPaymentModeData?.payment_mode) {
        setFormData((prev) => ({
          ...prev,
          payment_mode: res?.data?.destinationPaymentModeData?.payment_mode,
        }));
      } else {
        toast.warning("No Payment Mode found for this destination.");
      }
    } catch (error) {
      // console.error("Failed to fetch payment mode:", error);
      toast.error("Failed to load Payment Mode");
    } finally {
      setTermsLoading(false);
    }
  };

  // ✅ Fetch Cancellation Policy on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiClient.get("/admin/cancellation-policy");
        if (res?.data?.data?.cancellation_policy) {
          setFormData((prev) => ({
            ...prev,
            cancellation_policy: res?.data?.data?.cancellation_policy,
          }));
        }
      } catch (error) {
        // console.error("Error fetching cancellation policy:", error);
        toast.error("Failed to load cancellation policy.");
      }
    };
    fetchContent();
  }, []);

  // ✅ Auto-fetch T&C when destination changes
  useEffect(() => {
    if (formData.selected_destination_id) {
      fetchTermsContent();
    } else {
      setFormData((prev) => ({ ...prev, terms_and_conditions: "" }));
    }
  }, [formData.selected_destination_id]);

  // ✅ Auto-fetch Payment Mode when travel_type changes
  useEffect(() => {
    if (formData.travel_type) {
      fetchPaymentMode(formData.travel_type);
    }
  }, [formData.travel_type]);

  return (
    <div className={`${cardStyle} space-y-4`}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
        <FileText className="inline mr-2 text-primary" size={20} />
        Descriptions
      </h2>

      {/* Destination Detail */}
      <div>
        <label htmlFor="destination_detail" className={labelStyle}>
          <Landmark className="inline mr-2 text-muted-foreground" size={16} />
          Destination Detail
        </label>
        <textarea
          name="destination_detail"
          id="destination_detail"
          rows="4"
          value={formData.destination_detail || ""}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="Write a short description about the destination..."
        />
      </div>

      {/* Inclusions */}
      <div>
        <label htmlFor="inclusion" className={labelStyle}>
          <ListPlus className="inline mr-2 text-muted-foreground" size={16} />
          Inclusions{" "}
          <span className="text-xs text-muted-foreground">(comma separated)</span>
        </label>
        <textarea
          name="inclusion"
          id="inclusion"
          rows="4"
          value={formData.inclusion || ""}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="e.g., Hotel stay, Meals, Airport transfer"
        />
      </div>

      {/* Exclusions */}
      <div>
        <label htmlFor="exclusion" className={labelStyle}>
          <Ban className="inline mr-2 text-muted-foreground" size={16} />
          Exclusions{" "}
          <span className="text-xs text-muted-foreground">(comma separated)</span>
        </label>
        <textarea
          name="exclusion"
          id="exclusion"
          rows="4"
          value={formData.exclusion || ""}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="e.g., Personal expenses, Travel insurance"
        />
      </div>

      {/* Terms & Conditions */}
      <div>
        <label htmlFor="terms_and_conditions" className={labelStyle}>
          <FileText className="inline mr-2 text-muted-foreground" size={16} />
          Terms & Conditions
        </label>
        <textarea
          name="terms_and_conditions"
          id="terms_and_conditions"
          rows="4"
          value={formData.terms_and_conditions || ""}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder={
            termsLoading
              ? "Loading T&C..."
              : "Terms and conditions will be auto-filled here."
          }
          readOnly
        />
      </div>

      {/* Payment Mode */}
      <div>
        <label htmlFor="payment_mode" className={labelStyle}>
          <CreditCard className="inline mr-2 text-muted-foreground" size={16} />
          Payment Mode
        </label>
        <textarea
          name="payment_mode"
          id="payment_mode"
          rows="4"
          value={formData.payment_mode || ""}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="Payment mode will be auto-filled here."
          readOnly
        />
      </div>

      {/* Cancellation Policy */}
      <div>
        <label htmlFor="cancellation_policy" className={labelStyle}>
          <ShieldX className="inline mr-2 text-muted-foreground" size={16} />
          Cancellation Policy
        </label>
        <textarea
          name="cancellation_policy"
          id="cancellation_policy"
          rows="4"
          value={formData.cancellation_policy || "No available cancellation policy."}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="Cancellation policy will be auto-filled here."
          readOnly
        />
      </div>
    </div>
  );
};

export default DescriptionsSection;
