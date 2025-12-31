import Axios, { AxiosError } from "axios";
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




// ─── Response Interceptor ───
netClient.interceptors.response.use(
  // Success: just return the response
  (response) => response,

  // Error handling
  (error: AxiosError) => {
    // ── Detailed error logging ──
    console.groupCollapsed('🚨 Axios Error Details');
    
    console.error('Message:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No Response Received');
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Setup Error:', error.message);
    }

    console.error('Full Error Object:', error);
    console.error('Config:', error.config);
    
    console.groupEnd();

    // Important: still reject the promise so .catch() works
    return Promise.reject(error);
  }
);