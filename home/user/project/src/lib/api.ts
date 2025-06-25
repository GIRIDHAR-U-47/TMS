import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';

// Helper function to get CSRF token from cookies
function getCookie(name: string) {
  let cookieValue = null;
  if (typeof document !== 'undefined' && document.cookie) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

function isJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.includes('application/json');
}

export const searchEmployee = async (empNo: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employee_search/?emp_no=${empNo}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errText = await response.text(); // for debugging
      throw new Error(`Failed to fetch: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const addEmployee = async (employeeData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch('http://127.0.0.1:8000/api/employees/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(employeeData),
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type');
  const responseBody = contentType && contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    console.error('Add employee error:', responseBody);
    throw new Error(typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody));
  }

  return responseBody;
};

export const updateEmployee = async (employeeId: number, employeeData: any) => {
  try {
    const response = await api.put(`/employees/${employeeId}/`, employeeData);
    // After updating, get the detailed data
    const detailResponse = await api.get(`/employees/${employeeId}/detail/`);
    return detailResponse.data;
  } catch (err: any) {
    if (err.response && typeof err.response.data === 'string' && err.response.data.startsWith('<!DOCTYPE')) {
      throw new Error('Server returned HTML instead of JSON. Check your API endpoint and server logs.');
    }
    console.error('Error updating employee:', err);
    throw err;
  }
};

// Add more API functions as needed for other endpoints