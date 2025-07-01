import requests
import json

# Test data for employee creation
test_data = {
    'emp_no': 'TEST001',
    'name': 'Test Employee',
    'gender': 'male',
    'dob': '1990-01-01',
    'age': '33',
    'doj': '2023-01-01',
    'plant': 'central',
    'area_of_work': 'production',
    'dept': 'production',
    'category': 'operator',
    'training_days': '0',
    'sl1_marks': '0',
    'sl2_marks': '0',
    'overall_percent': '0.0',
    'skill_level': 'beginner',
    'sl1_status': 'pending',
    'sl2_status': 'pending',
    'sl3_status': 'pending',
}

# Test the regular employee creation endpoint
print("Testing regular employee creation endpoint...")
response = requests.post('http://127.0.0.1:8000/employees/', data=test_data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")

# Test the test endpoint
print("\nTesting test endpoint...")
response2 = requests.post('http://127.0.0.1:8000/test_employee_create/', data=test_data)
print(f"Status Code: {response2.status_code}")
print(f"Response: {response2.text}") 