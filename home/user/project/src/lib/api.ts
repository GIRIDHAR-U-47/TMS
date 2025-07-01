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
  const response = await fetch(`${API_BASE_URL}employees/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
    body: employeeData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to add employee' }));
    throw new Error(errorData.error || 'Failed to add employee');
  }

  return response.json();
};

export const updateEmployee = async (id: number, employeeData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}employees/${id}/`, {
    method: 'PUT',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
    body: employeeData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update employee' }));
    throw new Error(errorData.error || 'Failed to update employee');
  }

  return response.json();
};

// Training Modules API
export const getTrainingModules = async () => {
  const response = await fetch(`${API_BASE_URL}training-modules/`);
  if (!response.ok) {
    throw new Error('Failed to fetch training modules');
  }
  return response.json();
};

export const getTrainingModule = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}training-modules/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch training module');
  }
  return response.json();
};

export const createTrainingModule = async (moduleData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}training-modules/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(moduleData),
  });
  if (!response.ok) {
    throw new Error('Failed to create training module');
  }
  return response.json();
};

export const updateTrainingModule = async (id: number, moduleData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}training-modules/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(moduleData),
  });
  if (!response.ok) {
    throw new Error('Failed to update training module');
  }
  return response.json();
};

export const deleteTrainingModule = async (id: number) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}training-modules/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete training module');
  }
  return response.ok;
};

// Employee Training Modules API
export const getEmployeeTrainingModules = async () => {
  const response = await fetch(`${API_BASE_URL}employee-training-modules/`);
  if (!response.ok) {
    throw new Error('Failed to fetch employee training modules');
  }
  return response.json();
};

export const getEmployeeTrainingModule = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}employee-training-modules/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch employee training module');
  }
  return response.json();
};

export const createEmployeeTrainingModule = async (moduleData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}employee-training-modules/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(moduleData),
  });
  if (!response.ok) {
    throw new Error('Failed to create employee training module');
  }
  return response.json();
};

export const updateEmployeeTrainingModule = async (id: number, moduleData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}employee-training-modules/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(moduleData),
  });
  if (!response.ok) {
    throw new Error('Failed to update employee training module');
  }
  return response.json();
};

export const deleteEmployeeTrainingModule = async (id: number) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}employee-training-modules/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee training module');
  }
  return response.ok;
};

// Training Records API
export const getTrainingRecords = async () => {
  const response = await fetch(`${API_BASE_URL}training-records/`);
  if (!response.ok) {
    throw new Error('Failed to fetch training records');
  }
  return response.json();
};

export const getTrainingRecord = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}training-records/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch training record');
  }
  return response.json();
};

export const createTrainingRecord = async (recordData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}training-records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(recordData),
  });
  if (!response.ok) {
    throw new Error('Failed to create training record');
  }
  return response.json();
};

export const updateTrainingRecord = async (id: number, recordData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}training-records/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(recordData),
  });
  if (!response.ok) {
    throw new Error('Failed to update training record');
  }
  return response.json();
};

export const deleteTrainingRecord = async (id: number) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}training-records/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete training record');
  }
  return response.ok;
};

// OJT Records API
export const getOjtRecords = async () => {
  const response = await fetch(`${API_BASE_URL}ojt-records/`);
  if (!response.ok) {
    throw new Error('Failed to fetch OJT records');
  }
  return response.json();
};

export const getOjtRecord = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}ojt-records/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch OJT record');
  }
  return response.json();
};

export const createOjtRecord = async (recordData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}ojt-records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(recordData),
  });
  if (!response.ok) {
    throw new Error('Failed to create OJT record');
  }
  return response.json();
};

export const updateOjtRecord = async (id: number, recordData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}ojt-records/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(recordData),
  });
  if (!response.ok) {
    throw new Error('Failed to update OJT record');
  }
  return response.json();
};

export const deleteOjtRecord = async (id: number) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}ojt-records/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete OJT record');
  }
  return response.ok;
};

// Dexterity Assessments API
export const getDexterityAssessments = async () => {
  const response = await fetch(`${API_BASE_URL}dexterity-assessments/`);
  if (!response.ok) {
    throw new Error('Failed to fetch dexterity assessments');
  }
  return response.json();
};

export const getDexterityAssessment = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}dexterity-assessments/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch dexterity assessment');
  }
  return response.json();
};

export const createDexterityAssessment = async (assessmentData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}dexterity-assessments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(assessmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to create dexterity assessment');
  }
  return response.json();
};

export const updateDexterityAssessment = async (id: number, assessmentData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}dexterity-assessments/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(assessmentData),
  });
  if (!response.ok) {
    throw new Error('Failed to update dexterity assessment');
  }
  return response.json();
};

export const deleteDexterityAssessment = async (id: number) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}dexterity-assessments/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete dexterity assessment');
  }
  return response.ok;
};

// Performance Records API
export const getPerformanceRecords = async () => {
  const response = await fetch(`${API_BASE_URL}performance-records/`);
  if (!response.ok) {
    throw new Error('Failed to fetch performance records');
  }
  return response.json();
};

export const getPerformanceRecord = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}performance-records/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch performance record');
  }
  return response.json();
};

export const createPerformanceRecord = async (recordData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}performance-records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(recordData),
  });
  if (!response.ok) {
    throw new Error('Failed to create performance record');
  }
  return response.json();
};

export const updatePerformanceRecord = async (id: number, recordData: any) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}performance-records/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken || '',
    },
    body: JSON.stringify(recordData),
  });
  if (!response.ok) {
    throw new Error('Failed to update performance record');
  }
  return response.json();
};

export const deletePerformanceRecord = async (id: number) => {
  const csrftoken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE_URL}performance-records/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete performance record');
  }
  return response.ok;
};

// File Upload API
export const uploadEmployeePhoto = async (employeeId: number, file: File) => {
  const csrftoken = getCookie('csrftoken');
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await fetch(`${API_BASE_URL}employees/${employeeId}/upload-photo/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }

  return response.json();
};

export async function addEmployeeWithPhoto(form, photo) {
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (photo) {
    formData.append('photo', photo);
  }
  const res = await fetch('/api/employees/', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export const updateEmployeeWithPhoto = async (id: number, employeeData: any, photoFile?: File) => {
  const csrftoken = getCookie('csrftoken');
  const formData = new FormData();
  
  // Convert and add all employee data to FormData with proper types
  Object.keys(employeeData).forEach(key => {
    if (employeeData[key] !== null && employeeData[key] !== undefined && employeeData[key] !== '') {
      let value = employeeData[key];
      
      // Convert numeric fields
      if (['age', 'training_days', 'sl1_marks', 'sl2_marks'].includes(key)) {
        value = parseInt(value) || 0;
      }
      
      // Convert float fields
      if (['overall_percent'].includes(key)) {
        value = parseFloat(value) || 0.0;
      }
      
      formData.append(key, value.toString());
    }
  });
  
  // Add photo file if provided
  if (photoFile) {
    formData.append('photo', photoFile);
  }

  const response = await fetch(`${API_BASE_URL}employees/${id}/`, {
    method: 'PATCH',
    headers: {
      'X-CSRFToken': csrftoken || '',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update employee' }));
    throw new Error(errorData.error || 'Failed to update employee');
  }

  return response.json();
}; 