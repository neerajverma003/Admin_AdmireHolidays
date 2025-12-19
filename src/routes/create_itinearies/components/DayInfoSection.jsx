const DayInfoSection = ({
  formData,
  handleArrayChange,
  handleAddItem,
  handleRemoveItem,
  styles,
}) => {
  return (
    // <div className={styles.cardStyle}>
    //   <h2 className="text-xl font-semibold mb-4">Day-wise Plan</h2>
    //   {formData.days_information.map((item, index) => (
    //     <div
    //       key={index}
    //       className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
    //     >
    //       <div>
    //         <label className={styles.labelStyle}>Day</label>
    //         <input
    //           type="text"
    //           name="day"
    //           value={item.day}
    //           onChange={(e) => handleArrayChange(e, index, "days_information")}
    //           className={styles.inputStyle}
    //           placeholder="e.g. 1"
    //         />
    //       </div>
    //       <div>
    //         <label className={styles.labelStyle}>Location Name</label>
    //         <input
    //           type="text"
    //           name="locationName"
    //           value={item.locationName}
    //           onChange={(e) => handleArrayChange(e, index, "days_information")}
    //           className={styles.inputStyle}
    //           placeholder="Enter location name"
    //         />
    //       </div>
    //       <div>
    //         <label className={styles.labelStyle}>Location Detail</label>
    //         <textarea
    //           name="locationDetail"
    //           value={item.locationDetail}
    //           onChange={(e) => handleArrayChange(e, index, "days_information")}
    //           className={styles.inputStyle}
    //           placeholder="Enter location details"
    //           rows={2}
    //         ></textarea>
    //       </div>
    //       <div className="md:col-span-3 flex justify-end mt-2">
    //         {formData.days_information.length > 1 && (
    //           <button
    //             type="button"
    //             onClick={() => handleRemoveItem(index, "days_information")}
    //             className={styles.removeButtonStyle}
    //           >
    //             Remove
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //   ))}
    //   <div className="flex justify-end">
    //     <button
    //       type="button"
    //       onClick={() =>
    //         handleAddItem("days_information", {
    //           day: `${formData.days_information.length + 1}`,
    //           locationName: "",
    //           locationDetail: "",
    //         })
    //       }
    //       className={styles.buttonStyle}
    //     >
    //       Add Day
    //     </button>
    //   </div>
    // </div>
  
  <div className={styles.cardStyle}>
      <h2 className="text-xl font-semibold mb-4">Day-wise Plan</h2>
      {formData.days_information.map((item, index) => (
        <div
          key={index}
          className="mb-4 flex flex-col gap-4"
        >
          <div className="flex items-center gap-4">
          
            {/* <div className="flex-1">
              <h3 className="text-lg font-medium">
                {item.locationName || "Enter location name"}
              </h3>
            </div> */}
          </div>
          
          <div>
            <label className={styles.labelStyle}>Title</label>
            <input
              type="text"
              name="locationName"
              value={item.locationName}
              onChange={(e) => handleArrayChange(e, index, "days_information")}
              className={styles.inputStyle}
              placeholder="Enter location name"
              maxLength={50000}
            />
          </div>
            <div>
              <label className={styles.labelStyle}>Day</label>
              <input
                type="text"
                name="day"
                value={item.day}
                onChange={(e) => handleArrayChange(e, index, "days_information")}
                className={styles.inputStyle}
                placeholder="e.g. 1"
                maxLength={50000}
              />
            </div>
          <div>
            <label className={styles.labelStyle}>Location Detail</label>
            <textarea
              name="locationDetail"
              value={item.locationDetail}
              onChange={(e) => {
                handleArrayChange(e, index, "days_information");
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className={styles.inputStyle}
              placeholder="Enter location details"
              style={{ minHeight: '60px', overflow: 'hidden', resize: 'none' }}
              maxLength={50000}
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            {formData.days_information.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index, "days_information")}
                className={styles.removeButtonStyle}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            handleAddItem("days_information", {
              day: `${formData.days_information.length + 1}`,
              locationName: "",
              locationDetail: "",
            })
          }
          className={styles.buttonStyle}
        >
          Add Day
        </button>
      </div>
    </div>
  );
};

export default DayInfoSection;
