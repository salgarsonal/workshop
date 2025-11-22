import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add admin password to requests
export const setAdminPassword = (password: string) => {
  api.defaults.headers.common['X-Admin-Password'] = password;
};

export const clearAdminPassword = () => {
  delete api.defaults.headers.common['X-Admin-Password'];
};

// Public API
export const getSessions = () => api.get('/sessions');
export const getSpeakers = () => api.get('/speakers');
export const getAttendeeCount = () => api.get('/attendees/count');
export const registerAttendee = (data: { name: string; email: string; designation: string }) =>
  api.post('/attendees', data);

// Admin API
export const getAllAttendees = () => api.get('/admin/attendees');
export const getAttendee = (id: string) => api.get(`/admin/attendees/${id}`);
export const deleteAttendee = (id: string) => api.delete(`/admin/attendees/${id}`);

export const getAllSpeakers = () => api.get('/admin/speakers');
export const createSpeaker = (data: any) => api.post('/admin/speakers', data);
export const updateSpeaker = (id: string, data: any) => api.put(`/admin/speakers/${id}`, data);
export const deleteSpeaker = (id: string) => api.delete(`/admin/speakers/${id}`);

export const createSession = (data: any) => api.post('/admin/sessions', data);
export const updateSession = (id: string, data: any) => api.put(`/admin/sessions/${id}`, data);
export const deleteSession = (id: string) => api.delete(`/admin/sessions/${id}`);

export const getDesignationBreakdown = () => api.get('/admin/analytics/designation');

export default api;

