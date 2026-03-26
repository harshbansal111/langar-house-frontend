import apiClient from './client';

export const getAttendance = async (page = 0, size = 100) => {
  const response = await apiClient.get(`/attendance?page=${page}&size=${size}`);
  return response.data;
};

export const createAttendance = async (data) => {
  const response = await apiClient.post('/attendance', data);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await apiClient.put(`/attendance/${id}`, data);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await apiClient.delete(`/attendance/${id}`);
  return response.data;
};
