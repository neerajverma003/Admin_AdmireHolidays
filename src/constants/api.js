const BASE_URI = import.meta.env.VITE_API_BASE_URL;

// console.log("Loaded BASE_URI from env:", BASE_URI); // ✅ Add message

export const ENV = {
  API_BASE_URL: BASE_URI,
};
