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
  try {
    // First find the employee by emp_no
    const searchResponse = await fetch(`${API_BASE_URL}employees/?emp_no=${empNo}&format=json`);
    if (!searchResponse.ok) {
      throw new Error('Failed to search employee');
    }
    const searchData = await searchResponse.json();
    if (!searchData.length) {
      throw new Error('Employee not found');
    }

    // Then get the detailed data
    const employeeId = searchData[0].id;
    const detailResponse = await fetch(`${API_BASE_URL}/employees/${employeeId}/detail/`);
    if (!detailResponse.ok) {
      throw new Error('Failed to get employee details');
    }

    return detailResponse.json();
  } catch (error) {
    console.error('Error searching employee:', error);
    throw error;
  }
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