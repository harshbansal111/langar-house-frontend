import apiClient from './client';

/**
 * Fetches the daily aggregate metrics from the Spring Boot backend.
 * Uses the centralized `apiClient` mapping to interceptors (JWT injection + error handling).
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};

/**
 * MOCK DATA: Visitor Trends (Last 7 Days)
 * To be replaced with actual backend endpoint if not already present in DashboardController.
 */
export const getVisitorTrends = async () => {
  // Simulating network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { name: 'Mon', visitors: 120 },
    { name: 'Tue', visitors: 140 },
    { name: 'Wed', visitors: 110 },
    { name: 'Thu', visitors: 180 },
    { name: 'Fri', visitors: 220 },
    { name: 'Sat', visitors: 350 },
    { name: 'Sun', visitors: 400 },
  ];
};

/**
 * MOCK DATA: Food Distribution Chart
 */
export const getFoodDistribution = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { name: 'Dal', value: 400 },
    { name: 'Sabzi', value: 300 },
    { name: 'Rice', value: 300 },
    { name: 'Roti', value: 800 },
  ];
};
