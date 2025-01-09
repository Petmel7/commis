
// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// api.interceptors.request.use(config => {
//     const accessToken = localStorage.getItem('accessToken');
//     console.log('api->accessToken', accessToken);
//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

// api.interceptors.response.use(response => {
//     return response;
// }, async error => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         const refreshToken = localStorage.getItem('refreshToken');

//         if (refreshToken) {
//             try {
//                 const response = await api.post('/users/refresh-token', { token: refreshToken });
//                 localStorage.setItem('accessToken', response.data.accessToken);
//                 localStorage.setItem('refreshToken', response.data.refreshToken);
//                 originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken;
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 console.error('Token refresh error:', refreshError);
//                 return Promise.reject(refreshError);
//             }
//         }
//     }
//     return Promise.reject(error);
// });

// export default api;

