import { useEffect, useState } from "react";
import axios from "axios";

const useAuthToken = () => {
  const [userToken, setUserToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
  
        if (accessToken) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/check-token`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            console.log("Token is valid", response.data.token);
            setUserToken(true);
            return;
          }
        }

        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshTokenResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
              withCredentials: true,
            }
          );

          if (refreshTokenResponse.status === 200 && refreshTokenResponse.data.accessToken) {
            console.log("Refresh token successful");
            localStorage.setItem("accessToken", refreshTokenResponse.data.accessToken);
            setUserToken(true);
          } else {
            console.log("Refresh token failed");
            setUserToken(false);
          }
        } else {
          console.log("No refresh token found");
          setUserToken(false);
        }
      } catch (error) {
        console.error("Error checking tokens", error);
        setUserToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  return { userToken, isLoading };
};

export default useAuthToken;
