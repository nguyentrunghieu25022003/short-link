import { useEffect, useState } from "react";
import axios from "axios";

const useAuthToken = () => {
  const [userToken, setUserToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/check-token`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          console.log("Check token successfully");
          setUserToken(true);
          setIsLoading(false);
        } else {
          throw new Error("Token validation failed");
        }
      } catch (error) {
        setUserToken(false);
        setIsLoading(false);
        console.error(error);
      }
    };

    checkAuthToken();
  }, []);

  return { userToken, isLoading };
};

export default useAuthToken;