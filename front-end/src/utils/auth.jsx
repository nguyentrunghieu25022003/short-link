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
          { withCredentials: true }
        );

        if (response.status === 200) {
          console.log("Token is valid", response.data.token);
          setUserToken(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Access token expired, attempting refresh", error);
        try {
          const refreshTokenResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            { withCredentials: true }
          );

          if (refreshTokenResponse.status === 200) {
            console.log("Refresh token successful");
            setUserToken(true);
            setIsLoading(false);
          }
        } catch (refreshError) {
          console.log("Refresh token failed, logging out", refreshError);
          setUserToken(false);
          setIsLoading(false);
        }
      }
    };

    checkAuthToken();
  }, []);

  return { userToken, isLoading };
};

export default useAuthToken;
