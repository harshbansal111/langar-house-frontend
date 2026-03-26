import apiClient from './client';

export const getInventory = async (page = 0, size = 100) => {
  const response = await apiClient.get(`/inventory?page=${page}&size=${size}`);
  return response.data;
};

export const createItem = async (data) => {
  const response = await apiClient.post('/inventory', data);
  return response.data;
};

export const updateItem = async (id, data) => {
  const response = await apiClient.put(`/inventory/${id}`, data);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await apiClient.delete(`/inventory/${id}`);
  return response.data;
};
