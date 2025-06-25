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

export const searchEmployee = async (empNo: string) => {
  const searchResponse = await fetch(`${API_BASE_URL}employee_search/?emp_no=${empNo}`);
  const result = await searchResponse.json();
  if (!searchResponse.ok) {
    throw new Error(result.error || 'Unknown error');
  }
  console.log("Search result:", result);
  return result;
};

export const addEmployee = async (employeeData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}/employees/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    throw new Error('Failed to add employee');
  }

  return response.json();
};

export const updateEmployee = async (id: number, employeeData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}/employees/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    throw new Error('Failed to update employee');
  }

  return response.json();
}; 