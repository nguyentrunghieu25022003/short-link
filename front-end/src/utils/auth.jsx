import { useEffect, useState } from "react";
import axios from "axios";

const useAuthToken = () => {
  const [userToken, setUserToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/check-token`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true
          }
        );

        if (response.status === 200 && response.data.token.accessToken && response.data.token.refreshToken) {
          console.log("Token is valid", response.data.token);
          setUserToken(true);
        } else {
          console.log("Token is invalid or not found");
          setUserToken(false);
        }
      } catch (error) {
        console.log("Access token expired, attempting refresh", error);

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshTokenResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
              withCredentials: true
            }
          );

          if (refreshTokenResponse.status === 200 && refreshTokenResponse.data.token) {
            console.log("Refresh token successful");
            setUserToken(true);
          } else {
            console.log("Refresh token failed");
            setUserToken(false);
          }
        } catch (refreshError) {
          console.log("Refresh token failed, logging out", refreshError);
          setUserToken(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthToken();
  }, [userToken, isLoading]);

  return { userToken, isLoading };
};

export default useAuthToken;
