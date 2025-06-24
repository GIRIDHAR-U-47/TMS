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
    filterset_fields = ['emp_no', 'dept', 'plant', 'category', 'skill_level', 'gender']
    search_fields = ['emp_no', 'name', 'batch_no']
    ordering_fields = ['created_at', 'name', 'emp_no', 'overall_percent']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        elif self.action in ['retrieve', 'detail']:
            return EmployeeDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EmployeeCreateUpdateSerializer
        return EmployeeSerializer

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
            
            if serializer.validated_data.get('dept'):
                filters &= Q(dept__icontains=serializer.validated_data['dept'])
            
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

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get employee statistics"""
        total_employees = Employee.objects.count()
        
        employees_by_dept = Employee.objects.values('dept').annotate(
            count=Count('id')
        ).order_by('-count')
        
        employees_by_skill_level = Employee.objects.values('skill_level').annotate(
            count=Count('id')
        ).order_by('-count')
        
        employees_by_plant = Employee.objects.values('plant').annotate(
            count=Count('id')
        ).order_by('-count')
        
        recent_additions = Employee.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).values('id', 'name', 'emp_no', 'created_at')[:10]
        
        stats_data = {
            'total_employees': total_employees,
            'employees_by_dept': {item['dept']: item['count'] for item in employees_by_dept},
            'employees_by_skill_level': {item['skill_level']: item['count'] for item in employees_by_skill_level},
            'employees_by_plant': {item['plant']: item['count'] for item in employees_by_plant},
            'recent_additions': list(recent_additions),
        }
        
        serializer = EmployeeStatsSerializer(stats_data)
        return Response(serializer.data)

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
        serializer = EmployeeDetailSerializer(employee)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
