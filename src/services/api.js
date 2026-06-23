import axios from 'axios';

export const iamApi = axios.create({ baseURL: 'http://localhost:8001' });
export const bookingApi = axios.create({ baseURL: 'http://localhost:8003' });
export const notificationApi = axios.create({ baseURL: 'http://localhost:8002' }); 

const authInterceptor = (req) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  
 
  req.headers['X-Internal-Key'] = 'a3f8c2e1b7d4e9f0c6a2b8d3e7f1c4a9b2d6e0f3c8a1b5d9e2f7c0a4b8d1e6';
  
  return req;
};

iamApi.interceptors.request.use(authInterceptor);
bookingApi.interceptors.request.use(authInterceptor);
notificationApi.interceptors.request.use(authInterceptor); 