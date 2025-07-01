# Training Management System - Backend

This is the Django backend for the Training Management System, providing RESTful APIs for managing employee training records, assessments, and performance tracking.

## Features

- **Employee Management**: CRUD operations for employee records
- **Training Modules**: Manage training modules and their status
- **Training Records**: Track training sessions and programs
- **On-Job Training**: Record OJT activities and assessments
- **Dexterity Assessment**: Comprehensive skill evaluation system
- **Performance Records**: 31-day performance monitoring
- **Admin Interface**: Full Django admin interface for data management

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Populate initial data:**
   ```bash
   python manage.py populate_training_modules
   python manage.py populate_sample_data
   ```

8. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000/`

## API Endpoints

### Base URL: `http://localhost:8000/api/`

### Employee Endpoints

- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create a new employee
- `GET /api/employees/{id}/` - Get employee details
- `PUT /api/employees/{id}/` - Update employee
- `DELETE /api/employees/{id}/` - Delete employee
- `GET /api/employees/{id}/detail/` - Get detailed employee info with related data
- `POST /api/employees/search/` - Advanced employee search
- `GET /api/employees/stats/` - Get employee statistics
- `POST /api/employees/{id}/update_training_modules/` - Update training module statuses

### Training Module Endpoints

- `GET /api/training-modules/` - List all training modules
- `POST /api/training-modules/` - Create a new training module
- `GET /api/training-modules/{id}/` - Get training module details
- `PUT /api/training-modules/{id}/` - Update training module
- `DELETE /api/training-modules/{id}/` - Delete training module

### Training Record Endpoints

- `GET /api/training-records/` - List all training records
- `POST /api/training-records/` - Create a new training record
- `GET /api/training-records/{id}/` - Get training record details
- `PUT /api/training-records/{id}/` - Update training record
- `DELETE /api/training-records/{id}/` - Delete training record

### On-Job Training Endpoints

- `GET /api/ojt-records/` - List all OJT records
- `POST /api/ojt-records/` - Create a new OJT record
- `GET /api/ojt-records/{id}/` - Get OJT record details
- `PUT /api/ojt-records/{id}/` - Update OJT record
- `DELETE /api/ojt-records/{id}/` - Delete OJT record

### Dexterity Assessment Endpoints

- `GET /api/dexterity-assessments/` - List all dexterity assessments
- `POST /api/dexterity-assessments/` - Create a new dexterity assessment
- `GET /api/dexterity-assessments/{id}/` - Get dexterity assessment details
- `PUT /api/dexterity-assessments/{id}/` - Update dexterity assessment
- `DELETE /api/dexterity-assessments/{id}/` - Delete dexterity assessment

### Performance Record Endpoints

- `GET /api/performance-records/` - List all performance records
- `POST /api/performance-records/` - Create a new performance record
- `GET /api/performance-records/{id}/` - Get performance record details
- `PUT /api/performance-records/{id}/` - Update performance record
- `DELETE /api/performance-records/{id}/` - Delete performance record
- `POST /api/performance-records/{id}/approve_supervisor/` - Approve by supervisor
- `POST /api/performance-records/{id}/certify_personnel/` - Certify by personnel

## API Examples

### Create an Employee

```bash
curl -X POST http://localhost:8000/api/employees/ \
  -H "Content-Type: application/json" \
  -d '{
    "emp_no": "EMP004",
    "name": "Alice Johnson",
    "gender": "female",
    "dob": "1995-12-10",
    "age": 28,
    "doj": "2023-01-15",
    "plant": "central",
    "area_of_work": "Manufacturing",
    "dept": "Production",
    "category": "Operator",
    "batch_no": "B004",
    "training_days": 25,
    "skill_level": "beginner"
  }'
```

### Search Employees

```bash
curl -X POST http://localhost:8000/api/employees/search/ \
  -H "Content-Type: application/json" \
  -d '{
    "dept": "Production",
    "skill_level": "intermediate"
  }'
```

### Update Training Module Status

```bash
curl -X POST http://localhost:8000/api/employees/1/update_training_modules/ \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "module_id": 1,
        "status": "accepted",
        "completed_date": "2024-01-15"
      }
    ]
  }'
```

## Admin Interface

Access the Django admin interface at `http://localhost:8000/admin/` to manage all data through a web interface.

## Database Models

### Employee
- Basic information (name, gender, DOB, etc.)
- Work details (plant, department, category)
- Training details (marks, OJT status, skill level)
- SL assessment status

### TrainingModule
- Serial number, title, and expert information
- Predefined training modules

### EmployeeTrainingModule
- Links employees to training modules
- Status tracking (pending/accepted/denied)
- Completion dates

### TrainingRecord
- Training session records
- Date, program, and duration

### OnJobTraining
- OJT activity records
- Product/process, machine operations, quality checks

### DexterityAssessment
- Basic and advanced skill assessments
- Automatic score calculation
- Comprehensive evaluation metrics

### PerformanceRecord
- 31-day performance monitoring
- Daily performance metrics
- Supervisor and personnel approval

## Development

### Running Tests

```bash
python manage.py test
```

### Creating Migrations

```bash
python manage.py makemigrations api
```

### Applying Migrations

```bash
python manage.py migrate
```

### Shell Access

```bash
python manage.py shell
```

## Configuration

The main configuration is in `backend/settings.py`. Key settings include:

- Database configuration
- REST Framework settings
- CORS settings for frontend integration
- Media file handling

## Security Notes

- CORS is configured to allow all origins for development
- Authentication is set to AllowAny for development
- Change these settings for production deployment

## Production Deployment

For production deployment:

1. Set `DEBUG = False`
2. Configure proper database (PostgreSQL recommended)
3. Set up proper authentication
4. Configure CORS for specific domains
5. Set up static file serving
6. Use environment variables for sensitive settings 