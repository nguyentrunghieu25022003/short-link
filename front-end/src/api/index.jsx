import axios from "axios";

const getUserIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org/?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Error getting IP address:", error);
      return null;
    }
  };

export const createShortenedLink = async (formData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/url/shorten`,
      formData
    );
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log("Error" + err.message);
  }
};

export const getLocation = async (formData) => {
  try {
    const ip = await getUserIP();
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/url/location`,
      formData,
      {
        headers: {
          "x-forwarded-for": ip || "127.0.0.1",
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log("Error" + err.message);
  }
};