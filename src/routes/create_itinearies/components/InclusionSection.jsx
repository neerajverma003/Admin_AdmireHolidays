import { ListPlus } from "lucide-react";

const InclusionSection = ({ formData, handleInputChange, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4">Inclusions</h2>

      <label className={labelStyle}>
        <ListPlus className="inline mr-2" size={16} />
        Inclusions (comma separated)
      </label>

      <textarea
        name="inclusion"
        rows="4"
        value={formData.inclusion}
        onChange={handleInputChange}
        className={inputStyle}
        placeholder="Hotel stay, Meals, Airport transfer"
      />
    </div>
  );
};

export default InclusionSection;
