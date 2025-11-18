import { PlusCircle, Trash2 } from "lucide-react";

const HotelDetailsSection = ({
  formData,
  handleArrayChange,
  handleAddItem,
  handleRemoveItem,
  styles,
  handleInputChange,
}) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  // Convert the string to a boolean for checkbox checked state
  const isChecked = formData.hotel_as_per_category === "As per category";

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Hotel Details
      </h2>

      {/* Checkbox input */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="hotel_as_per_category"
          name="hotel_as_per_category"
          checked={isChecked}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "hotel_as_per_category",
                value: e.target.checked ? "As per category" : "",
              },
            })
          }
          className="mr-2"
        />
        <label htmlFor="hotel_as_per_category" className={labelStyle}>
          As per category
        </label>
      </div>

      {/* Example hotel info fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hotel_name" className={labelStyle}>
            Hotel Name
          </label>
          <input
            type="text"
            id="hotel_name"
            name="hotel_name"
            value={formData.hotel_name || ""}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="Enter hotel name"
          />
        </div>

        <div>
          <label htmlFor="hotel_category" className={labelStyle}>
            Hotel Category
          </label>
          <input
            type="text"
            id="hotel_category"
            name="hotel_category"
            value={formData.hotel_category || ""}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="e.g., 3 Star, 5 Star"
          />
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsSection;
