import React, { useEffect, useState } from "react";
import { IndianRupee, Percent } from "lucide-react";

const PricingSection = ({ formData, handleInputChange, styles }) => {
  const { labelStyle, inputStyle, cardStyle } = styles;

  const [isBestQuote, setIsBestQuote] = useState(formData.pricing === "As per the destination");
  const [standardPrice, setStandardPrice] = useState(
    typeof formData.pricing === "object" ? formData.pricing.standard_price || "" : ""
  );
  const [discountedPrice, setDiscountedPrice] = useState(
    typeof formData.pricing === "object" ? formData.pricing.discounted_price || "" : ""
  );

  // Sync state when formData changes externally
  useEffect(() => {
    if (formData.pricing === "As per the destination") {
      setIsBestQuote(true);
    } else if (typeof formData.pricing === "object") {
      setIsBestQuote(false);
      setStandardPrice(formData.pricing.standard_price || "");
      setDiscountedPrice(formData.pricing.discounted_price || "");
    }
  }, [formData.pricing]);

  const handleBestQuoteToggle = (e) => {
    const checked = e.target.checked;
    setIsBestQuote(checked);

    handleInputChange({
      target: {
        name: "pricing",
        value: checked
          ? "As per the destination"
          : {
              standard_price: Number(standardPrice) || 0,
              discounted_price: Number(discountedPrice) || 0,
            },
      },
    });
  };

  const handleStandardPriceChange = (e) => {
    const value = e.target.value;
    setStandardPrice(value);
    handleInputChange({
      target: {
        name: "pricing",
        value: {
          standard_price: Number(value) || 0,
          discounted_price: Number(discountedPrice) || 0,
        },
      },
    });
  };

  const handleDiscountedPriceChange = (e) => {
    const value = e.target.value;
    setDiscountedPrice(value);
    handleInputChange({
      target: {
        name: "pricing",
        value: {
          standard_price: Number(standardPrice) || 0,
          discounted_price: Number(value) || 0,
        },
      },
    });
  };

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Pricing
      </h2>

      <div className="mb-4">
        <label htmlFor="best_quote_toggle" className={labelStyle}>
          <input
            type="checkbox"
            id="best_quote_toggle"
            checked={isBestQuote}
            onChange={handleBestQuoteToggle}
            className="mr-2"
          />
          <IndianRupee className="inline mr-1 text-muted-foreground" size={16} />
          As per best quote
        </label>
      </div>

      {!isBestQuote && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="standard_price" className={labelStyle}>
              <IndianRupee className="inline mr-1 text-muted-foreground" size={16} />
              Standard Price
            </label>
            <input
              type="number"
              id="standard_price"
              value={standardPrice}
              onChange={handleStandardPriceChange}
              className={inputStyle}
              placeholder="Enter standard price"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="discounted_price" className={labelStyle}>
              <Percent className="inline mr-1 text-muted-foreground" size={16} />
              Discounted Price
            </label>
            <input
              type="number"
              id="discounted_price"
              value={discountedPrice}
              onChange={handleDiscountedPriceChange}
              className={inputStyle}
              placeholder="Enter discounted price"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSection;
