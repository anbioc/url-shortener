import Axios from "axios";
import { getRefreshToken, getToken, setToken } from "./cookie.lib";

const netClient = Axios.create({
    baseURL: `${process.env.API_ENDPOINT}`,
    withCredentials: true
});

export default netClient;

netClient.interceptors.request.use(async request => {
  const accessToken = await getToken();
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
}, error => {
  return Promise.reject(error);
});


netClient.interceptors.response.use(
  response => response, // Directly return successful responses.
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        console.log(`Refreshing token`)
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const refreshToken = await getRefreshToken(); // Retrieve the stored refresh token.
        // Make a request to your auth server to refresh the token.
        const url = `${process.env.API_ENDPOINT}/api/auth/verify-refresh`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            refreshtoken: refreshToken,
            }),
         });
        const accessToken = (await response.json()).data.accessToken;
        // Store the new access and refresh tokens.
        setToken(accessToken)
        // Update the authorization header with the new access token.
        netClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return netClient(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
       
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);