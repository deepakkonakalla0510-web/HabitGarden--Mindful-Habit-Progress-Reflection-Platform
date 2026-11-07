const API_BASE = '/api';

/**
 * Custom fetch wrapper with friendly error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err.message);
    throw err;
  }
}

// Habits
export const getHabits = () => request('/habits');
export const getHabitById = (id) => request(`/habits/${id}`);
export const createHabit = (habitData) =>
  request('/habits', {
    method: 'POST',
    body: JSON.stringify(habitData),
  });
export const updateHabit = (id, habitData) =>
  request(`/habits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(habitData),
  });
export const archiveHabit = (id) =>
  request(`/habits/${id}`, {
    method: 'DELETE',
  });

// Logs & Interactions
export const checkinHabit = (id, date, status = 'completed') =>
  request(`/habits/${id}/checkin`, {
    method: 'POST',
    body: JSON.stringify({ date, status }),
  });

export const logReflection = (id, { date, reasonTag, reflectionNote, status = 'rest_day' }) =>
  request(`/habits/${id}/reflect`, {
    method: 'POST',
    body: JSON.stringify({ date, reasonTag, reflectionNote, status }),
  });

export const toggleHabitCheckin = (id, date) =>
  request(`/habits/${id}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  });

export const getHabitLogs = (id, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/habits/${id}/logs${query ? `?${query}` : ''}`);
};

// Analytics
export const getWeeklyPatterns = (habitId) => {
  const query = habitId ? `?habitId=${habitId}` : '';
  return request(`/analytics/weekly-patterns${query}`);
};

export const getGardenSummary = () => request('/analytics/summary');

// Sample Data Seed
export const seedDemoGarden = () =>
  request('/seed', {
    method: 'POST',
  });

// Health check
export const checkHealth = () => request('/health');

