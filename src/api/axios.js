
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Your Laravel URL
    withCredentials: true, // Must be true to send/receive cookies
    withXSRFToken: true,   // Automatically sends the CSRF token in headers
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-API-KEY': 'my-secret-key-123',
    }
});

export default axiosClient;