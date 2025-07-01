from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import (
    Employee, TrainingModule, EmployeeTrainingModule, TrainingRecord,
    OnJobTraining, DexterityAssessment, PerformanceRecord
)
from .serializers import (
    EmployeeSerializer, EmployeeListSerializer, EmployeeDetailSerializer, EmployeeCreateUpdateSerializer,
    TrainingModuleSerializer, EmployeeTrainingModuleSerializer, TrainingRecordSerializer,
    OnJobTrainingSerializer, DexterityAssessmentSerializer, PerformanceRecordSerializer,
    TrainingModuleStatusUpdateSerializer, BulkTrainingModuleUpdateSerializer,
    EmployeeSearchSerializer, EmployeeStatsSerializer
)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['emp_no', 'area_of_work', 'plant', 'category', 'skill_level', 'gender']
    search_fields = ['emp_no', 'name', 'batch_no']
    ordering_fields = ['created_at', 'name', 'emp_no', 'overall_percent']
    ordering = ['-created_at']

    def get_serializer_context(self):
        """Add request to serializer context for building absolute URLs"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        elif self.action in ['retrieve', 'detail']:
            return EmployeeDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EmployeeCreateUpdateSerializer
        return EmployeeSerializer

    def create(self, request, *args, **kwargs):
        """Override create method to support batch creation and add debugging"""
        print("=== CREATE EMPLOYEE DEBUG ===")
        print("Request data:", request.data)
        print("Request FILES:", request.FILES)
        print("Content type:", request.content_type)

        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        print("Validated data:", serializer.validated_data)

        employees = serializer.save()
        # If batch, return list; if single, wrap in list for consistent handling
        if is_many:
            response_serializer = EmployeeDetailSerializer(employees, many=True, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            response_serializer = EmployeeDetailSerializer(employees, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Override update method to add debugging"""
        print("=== UPDATE EMPLOYEE DEBUG ===")
        print("Request data:", request.data)
        print("Request FILES:", request.FILES)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        print("Validated data:", serializer.validated_data)
        
        employee = serializer.save()
        response_serializer = EmployeeDetailSerializer(employee, context={'request': request})
        return Response(response_serializer.data)

    @action(detail=True, methods=['get'])
    def detail(self, request, pk=None):
        """Get detailed employee information with all related data"""
        employee = self.get_object()
        serializer = EmployeeDetailSerializer(employee)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def search(self, request):
        """Advanced search for employees"""
        serializer = EmployeeSearchSerializer(data=request.data)
        if serializer.is_valid():
            filters = Q()
            
            if serializer.validated_data.get('emp_no'):
                filters &= Q(emp_no__icontains=serializer.validated_data['emp_no'])
            
            if serializer.validated_data.get('name'):
                filters &= Q(name__icontains=serializer.validated_data['name'])
            
            if serializer.validated_data.get('area_of_work'):
                filters &= Q(area_of_work__icontains=serializer.validated_data['area_of_work'])
            
            if serializer.validated_data.get('plant'):
                filters &= Q(plant__icontains=serializer.validated_data['plant'])
            
            if serializer.validated_data.get('skill_level'):
                filters &= Q(skill_level=serializer.validated_data['skill_level'])
            
            employees = Employee.objects.filter(filters)
            page = self.paginate_queryset(employees)
            if page is not None:
                serializer = EmployeeListSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = EmployeeListSerializer(employees, many=True)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_training_modules(self, request, pk=None):
        """Update training module statuses for an employee"""
        employee = self.get_object()
        serializer = BulkTrainingModuleUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            for update in serializer.validated_data['updates']:
                module_id = update['module_id']
                status = update['status']
                completed_date = update.get('completed_date')
                # If status is accepted and completed_date is not provided, set to today
                if status == 'accepted' and not completed_date:
                    completed_date = timezone.now().date()
                
                employee_module, created = EmployeeTrainingModule.objects.get_or_create(
                    employee=employee,
                    module_id=module_id,
                    defaults={'status': status, 'completed_date': completed_date}
                )
                
                if not created:
                    employee_module.status = status
                    if completed_date:
                        employee_module.completed_date = completed_date
                    employee_module.save()
            
            return Response({'message': 'Training modules updated successfully'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_photo(self, request, pk=None):
        """Upload photo for an employee"""
        employee = self.get_object()
        
        if 'photo' not in request.FILES:
            return Response({'error': 'No photo file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        photo_file = request.FILES['photo']
        
        # Validate file type
        if not photo_file.content_type.startswith('image/'):
            return Response({'error': 'File must be an image'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file size (max 5MB)
        if photo_file.size > 5 * 1024 * 1024:
            return Response({'error': 'File size must be less than 5MB'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the photo
        employee.photo = photo_file
        employee.save()
        
        serializer = EmployeeDetailSerializer(employee, context={'request': request})
        return Response({
            'message': 'Photo uploaded successfully',
            'employee': serializer.data
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get employee statistics"""
        total_employees = Employee.objects.count()
        employees_by_area_of_work = Employee.objects.values('area_of_work').annotate(count=Count('id'))
        employees_by_skill = Employee.objects.values('skill_level').annotate(count=Count('id'))
        
        data = {
            'total_employees': total_employees,
            'by_area_of_work': list(employees_by_area_of_work),
            'by_skill_level': list(employees_by_skill),
        }
        
        serializer = EmployeeStatsSerializer(data)
        return Response(serializer.data)


class TrainingModuleViewSet(viewsets.ModelViewSet):
    queryset = TrainingModule.objects.all()
    serializer_class = TrainingModuleSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    ordering = ['s_no']


class TrainingRecordViewSet(viewsets.ModelViewSet):
    queryset = TrainingRecord.objects.all()
    serializer_class = TrainingRecordSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']
    ordering = ['-date']


class OnJobTrainingViewSet(viewsets.ModelViewSet):
    queryset = OnJobTraining.objects.all()
    serializer_class = OnJobTrainingSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']


class DexterityAssessmentViewSet(viewsets.ModelViewSet):
    queryset = DexterityAssessment.objects.all()
    serializer_class = DexterityAssessmentSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']
    ordering = ['-created_at']


class PerformanceRecordViewSet(viewsets.ModelViewSet):
    queryset = PerformanceRecord.objects.all()
    serializer_class = PerformanceRecordSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']
    ordering = ['day']

    @action(detail=True, methods=['post'])
    def approve_supervisor(self, request, pk=None):
        """Approve performance record by supervisor"""
        performance_record = self.get_object()
        performance_record.supervisor_approved = True
        performance_record.save()
        return Response({'message': 'Approved by supervisor'})

    @action(detail=True, methods=['post'])
    def certify_personnel(self, request, pk=None):
        """Certify performance record by personnel"""
        performance_record = self.get_object()
        performance_record.personnel_certified = True
        performance_record.save()
        return Response({'message': 'Certified by personnel'})


class EmployeeTrainingModuleViewSet(viewsets.ModelViewSet):
    queryset = EmployeeTrainingModule.objects.all()
    serializer_class = EmployeeTrainingModuleSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'module', 'status']


@api_view(['GET'])
def employee_search(request):
    emp_no = request.GET.get('emp_no')
    if not emp_no:
        return Response({'error': 'emp_no parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        employee = Employee.objects.get(emp_no=emp_no)
        serializer = EmployeeDetailSerializer(employee, context={'request': request})
        return Response(serializer.data)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def test_employee_create(request):
    """Test endpoint to debug employee creation"""
    print("=== TEST EMPLOYEE CREATE ===")
    print("Request data:", request.data)
    print("Request FILES:", request.FILES)
    print("Content type:", request.content_type)
    
    # Try to create a simple employee with minimal data
    test_data = {
        'emp_no': 'TEST001',
        'name': 'Test Employee',
        'gender': 'male',
        'dob': '1990-01-01',
        'age': 33,
        'doj': '2023-01-01',
        'plant': 'plant-a',
        'area_of_work': 'special_painter',
        'category': 'operator',
        'training_days': 0,
        'sl1_marks': 0,
        'sl2_marks': 0,
        'overall_percent': 0.0,
        'skill_level': 'beginner',
        'sl1_status': 'pending',
        'sl2_status': 'pending',
        'sl3_status': 'pending',
    }
    
    serializer = EmployeeCreateUpdateSerializer(data=test_data, context={'request': request})
    if serializer.is_valid():
        employee = serializer.save()
        return Response({'message': 'Test employee created successfully', 'id': employee.id})
    else:
        print("Validation errors:", serializer.errors)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def home(request):
    return render(request, 'home.html')
