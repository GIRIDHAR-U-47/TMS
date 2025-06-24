from rest_framework import serializers
from .models import (
    Employee, TrainingModule, EmployeeTrainingModule, TrainingRecord,
    OnJobTraining, DexterityAssessment, PerformanceRecord
)


class TrainingModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingModule
        fields = '__all__'


class EmployeeTrainingModuleSerializer(serializers.ModelSerializer):
    module = TrainingModuleSerializer(read_only=True)
    module_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = EmployeeTrainingModule
        fields = ['id', 'module', 'module_id', 'status', 'completed_date']


class TrainingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingRecord
        fields = '__all__'


class OnJobTrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnJobTraining
        fields = '__all__'


class DexterityAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DexterityAssessment
        fields = '__all__'


class PerformanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceRecord
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    training_modules = EmployeeTrainingModuleSerializer(many=True, read_only=True)
    training_records = TrainingRecordSerializer(many=True, read_only=True)
    ojt_records = OnJobTrainingSerializer(many=True, read_only=True)
    dexterity_assessments = DexterityAssessmentSerializer(many=True, read_only=True)
    performance_records = PerformanceRecordSerializer(many=True, read_only=True)
    
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class EmployeeListSerializer(serializers.ModelSerializer):
    """Simplified serializer for employee list view"""
    class Meta:
        model = Employee
        fields = [
            'id', 'emp_no', 'name', 'gender', 'age', 'plant', 'dept', 
            'category', 'skill_level', 'overall_percent', 'created_at'
        ]


class EmployeeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for employee detail view"""
    training_modules = EmployeeTrainingModuleSerializer(many=True, read_only=True)
    training_records = TrainingRecordSerializer(many=True, read_only=True)
    ojt_records = OnJobTrainingSerializer(many=True, read_only=True)
    dexterity_assessments = DexterityAssessmentSerializer(many=True, read_only=True)
    performance_records = PerformanceRecordSerializer(many=True, read_only=True)
    
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class EmployeeCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating employees"""
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class TrainingModuleStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating training module status"""
    module_id = serializers.IntegerField()
    status = serializers.ChoiceField(choices=['pending', 'accepted', 'denied'])
    completed_date = serializers.DateField(required=False, allow_null=True)


class BulkTrainingModuleUpdateSerializer(serializers.Serializer):
    """Serializer for bulk updating training module statuses"""
    updates = TrainingModuleStatusUpdateSerializer(many=True)


class EmployeeSearchSerializer(serializers.Serializer):
    """Serializer for employee search"""
    emp_no = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    dept = serializers.CharField(required=False)
    plant = serializers.CharField(required=False)
    skill_level = serializers.CharField(required=False)


class EmployeeStatsSerializer(serializers.Serializer):
    """Serializer for employee statistics"""
    total_employees = serializers.IntegerField()
    employees_by_dept = serializers.DictField()
    employees_by_skill_level = serializers.DictField()
    employees_by_plant = serializers.DictField()
    recent_additions = serializers.ListField() 