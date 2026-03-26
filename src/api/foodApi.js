import apiClient from './client';

export const getFoodLogs = async (page = 0, size = 100) => {
  const response = await apiClient.get(`/food?page=${page}&size=${size}`);
  return response.data;
};

export const createFoodLog = async (data) => {
  const response = await apiClient.post('/food', data);
  return response.data;
};

export const updateFoodLog = async (id, data) => {
  const response = await apiClient.put(`/food/${id}`, data);
  return response.data;
};

export const deleteFoodLog = async (id) => {
  const response = await apiClient.delete(`/food/${id}`);
  return response.data;
};
