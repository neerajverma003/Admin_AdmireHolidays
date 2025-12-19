import { Ban } from "lucide-react";

const ExclusionSection = ({ formData, handleInputChange, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4">Exclusions</h2>

      <label className={labelStyle}>
        <Ban className="inline mr-2" size={16} />
        Exclusions (comma separated)
      </label>

      <textarea
        name="exclusion"
        rows="4"
        value={formData.exclusion}
        onChange={handleInputChange}
        className={inputStyle}
        placeholder="Personal expenses, Travel insurance"
        maxLength={50000}
      />
    </div>
  );
};

export default ExclusionSection;
