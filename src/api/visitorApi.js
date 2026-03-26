import apiClient from './client';

/**
 * 6.1 — API Layer for Visitors
 * We abstract this so UI components never see the raw URLs.
 * Pagination (page, size) is crucial because a 10-year database 
 * could have 3,650 visitor records. Loading them all at once 
 * would crash the browser JVM.
 */

export const getVisitors = async (page = 0, size = 100) => {
  // Assuming the backend uses Spring Data JPA Pageable
  const response = await apiClient.get(`/visitors?page=${page}&size=${size}`);
  return response.data;
};

export const getVisitorById = async (id) => {
  const response = await apiClient.get(`/visitors/${id}`);
  return response.data;
};

export const createVisitor = async (data) => {
  const response = await apiClient.post('/visitors', data);
  return response.data;
};

export const updateVisitor = async (id, data) => {
  const response = await apiClient.put(`/visitors/${id}`, data);
  return response.data;
};

export const deleteVisitor = async (id) => {
  const response = await apiClient.delete(`/visitors/${id}`);
  return response.data;
};
