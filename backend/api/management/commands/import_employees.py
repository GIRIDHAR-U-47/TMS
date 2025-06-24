import csv
from django.core.management.base import BaseCommand
from api.models import Employee

class Command(BaseCommand):
    help = 'Import employees from CSV'

    def handle(self, *args, **kwargs):
        with open('path/to/your/employees.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                Employee.objects.update_or_create(
                    emp_no=row['emp_no'],
                    defaults={
                        'name': row['name'],
                        'gender': row['gender'],
                        # ... map all other fields ...
                    }
                )
        self.stdout.write(self.style.SUCCESS('Employees imported successfully!'))