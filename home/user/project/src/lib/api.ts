import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchEmployee = async (empNo: string) => {
  try {
    // First find the employee ID
    const searchResponse = await api.get(`/employees/?emp_no=${empNo}`);
    if (!searchResponse.data.length) {
      throw new Error('NOT FOUND');
    }
    
    // Then get the detailed data
    const employeeId = searchResponse.data[0].id;
    const detailResponse = await api.get(`/employees/${employeeId}/detail/`);
    return detailResponse.data;
  } catch (error) {
    console.error('Error searching employee:', error);
    throw error;
  }
};

export const addEmployee = async (employeeData: any) => {
  try {
    const response = await api.post('/employees/', employeeData);
    return response.data;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

export const updateEmployee = async (employeeId: number, employeeData: any) => {
  try {
    const response = await api.put(`/employees/${employeeId}/`, employeeData);
    // After updating, get the detailed data
    const detailResponse = await api.get(`/employees/${employeeId}/detail/`);
    return detailResponse.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Add more API functions as needed for other endpoints