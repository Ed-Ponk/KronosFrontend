import axiosInstance from './axiosConfig';

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/login', { email, password });
  return response.data;
};

// Otras funciones relacionadas con autenticación
