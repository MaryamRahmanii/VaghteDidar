import axios from 'axios';


export const iamApi = axios.create({
  baseURL: 'http://localhost:8001',
});


export const bookingApi = axios.create({
  baseURL: 'http://localhost:8003',
});


const authInterceptor = (req) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
};


iamApi.interceptors.request.use(authInterceptor);
bookingApi.interceptors.request.use(authInterceptor);