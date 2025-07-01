from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from api.models import Employee, TrainingModule, EmployeeTrainingModule, TrainingRecord, OnJobTraining, DexterityAssessment, PerformanceRecord
import random


class Command(BaseCommand):
    help = 'Populate the database with sample data for testing'

    def handle(self, *args, **options):
        # Create sample employees
        employees_data = [
            {
                'emp_no': 'EMP001',
                'name': 'John Doe',
                'gender': 'male',
                'dob': date(1990, 5, 15),
                'age': 33,
                'doj': date(2020, 1, 15),
                'dol': None,
                'plant': 'plant-a',
                'area_of_work': 'Manufacturing',
                'dept': 'Production',
                'category': 'Operator',
                'batch_no': 'B001',
                'training_days': 30,
                'sl1_marks': 85,
                'sl2_marks': 90,
                'sl2_ojt': 'Completed',
                'after_ojt_area_of_work': 'Quality Control',
                'overall_percent': 87.5,
                'skill_level': 'intermediate',
                'remarks': 'Good performance in training modules',
                'sl1_status': 'pass',
                'sl2_status': 'pass',
                'sl3_status': 'pending',
            },
            {
                'emp_no': 'EMP002',
                'name': 'Jane Smith',
                'gender': 'female',
                'dob': date(1988, 8, 22),
                'age': 35,
                'doj': date(2019, 6, 10),
                'dol': None,
                'plant': 'plant-b',
                'area_of_work': 'Quality Control',
                'dept': 'Quality',
                'category': 'Technician',
                'batch_no': 'B002',
                'training_days': 25,
                'sl1_marks': 92,
                'sl2_marks': 88,
                'sl2_ojt': 'In Progress',
                'after_ojt_area_of_work': 'Production',
                'overall_percent': 90.0,
                'skill_level': 'advanced',
                'remarks': 'Excellent technical skills',
                'sl1_status': 'pass',
                'sl2_status': 'pass',
                'sl3_status': 'pass',
            },
            {
                'emp_no': 'EMP003',
                'name': 'Mike Johnson',
                'gender': 'male',
                'dob': date(1992, 3, 8),
                'age': 31,
                'doj': date(2021, 3, 1),
                'dol': None,
                'plant': 'plant-a',
                'area_of_work': 'Maintenance',
                'dept': 'Maintenance',
                'category': 'Engineer',
                'batch_no': 'B003',
                'training_days': 20,
                'sl1_marks': 78,
                'sl2_marks': 82,
                'sl2_ojt': 'Completed',
                'after_ojt_area_of_work': 'Maintenance',
                'overall_percent': 80.0,
                'skill_level': 'intermediate',
                'remarks': 'Good mechanical aptitude',
                'sl1_status': 'pass',
                'sl2_status': 'pending',
                'sl3_status': 'pending',
            },
        ]

        created_employees = []
        for emp_data in employees_data:
            employee, created = Employee.objects.get_or_create(
                emp_no=emp_data['emp_no'],
                defaults=emp_data
            )
            created_employees.append(employee)
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created employee: {employee.name} ({employee.emp_no})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Employee already exists: {employee.name} ({employee.emp_no})')
                )

        # Create training modules for employees
        training_modules = TrainingModule.objects.all()
        statuses = ['pending', 'accepted', 'denied']
        
        for employee in created_employees:
            for module in training_modules:
                EmployeeTrainingModule.objects.get_or_create(
                    employee=employee,
                    module=module,
                    defaults={
                        'status': random.choice(statuses),
                        'completed_date': date.today() - timedelta(days=random.randint(1, 30)) if random.choice([True, False]) else None
                    }
                )

        # Create sample training records
        training_programs = [
            'Safety Training', 'Machine Operation', 'Quality Control', 
            '5S Implementation', 'Process Improvement', 'Team Building'
        ]
        
        for employee in created_employees:
            for i in range(random.randint(2, 4)):
                TrainingRecord.objects.get_or_create(
                    employee=employee,
                    date=date.today() - timedelta(days=random.randint(1, 90)),
                    training_program=random.choice(training_programs),
                    duration=f"{random.randint(1, 5)} days"
                )

        # Create sample OJT records
        for employee in created_employees:
            OnJobTraining.objects.get_or_create(
                employee=employee,
                product_process=f"Product {random.choice(['A', 'B', 'C'])}",
                machine_operations=f"Machine {random.randint(1, 10)}",
                quality_check_points="Dimension Check",
                secondary_operations="Deburring",
                handling="Manual Handling",
                packing_labeling="Box Packing",
                others="Documentation"
            )

        # Create sample dexterity assessments
        for employee in created_employees:
            DexterityAssessment.objects.get_or_create(
                employee=employee,
                defaults={
                    'test_1s_2s': random.randint(3, 5),
                    'test_1s_2s_ball': random.randint(3, 5),
                    'memory_test': random.randint(3, 5),
                    'mind_hand_coordination': random.randint(3, 5),
                    'nerve_stability': random.randint(3, 5),
                    'material_identification': random.randint(3, 5),
                    'pick_place_sequence': random.randint(7, 10),
                    'pick_right_material': random.randint(3, 5),
                    'visual_inspection': random.randint(3, 5),
                    'defect_identification': random.randint(10, 15),
                    'written_test': random.randint(15, 20),
                    'insert_loading_1': random.randint(7, 10),
                    'insert_loading_2': random.randint(7, 10),
                    'safety_test': random.randint(10, 15),
                    'painting': random.randint(10, 15),
                    'screw_assembly': random.randint(7, 10),
                    'air_cleaner_assembly': random.randint(7, 10),
                    'msa_test': random.randint(10, 15),
                    'deflashing': random.randint(10, 15),
                }
            )

        # Create sample performance records (first 10 days)
        for employee in created_employees:
            for day in range(1, 11):
                PerformanceRecord.objects.get_or_create(
                    employee=employee,
                    day=day,
                    defaults={
                        'description': f'Day {day} performance',
                        'su_status': random.choice(['S', 'U']),
                        'scope': 'Production Line',
                        'operation_name': f'Operation {random.randint(1, 5)}',
                        'production': f'{random.randint(80, 120)} units',
                        'weight': f'{random.randint(1, 10)} kg',
                        'quantity': f'{random.randint(50, 100)}',
                        'pro_n': f'{random.randint(1, 10)}',
                        'perf_n': f'{random.randint(1, 10)}',
                        'final_score': round(random.uniform(70, 95), 2),
                        'supervisor_approved': random.choice([True, False]),
                        'personnel_certified': random.choice([True, False])
                    }
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created sample data:\n'
                f'- {len(created_employees)} employees\n'
                f'- Training modules assigned\n'
                f'- Training records created\n'
                f'- OJT records created\n'
                f'- Dexterity assessments created\n'
                f'- Performance records created'
            )
        ) 