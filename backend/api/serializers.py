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
    module_id = serializers.CharField(allow_null=True, allow_blank=True, write_only=True)
    
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
            'id', 'emp_no', 'name', 'gender', 'age', 'plant', 'area_of_work',
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
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Always include all training modules with status for this employee
        all_modules = TrainingModule.objects.all().order_by('s_no')
        module_map = {tm.module.id: tm for tm in instance.training_modules.all()}
        modules_list = []
        for module in all_modules:
            etm = next((tm for tm in instance.training_modules.all() if tm.module.id == module.id), None)
            modules_list.append({
                'id': etm.id if etm else None,
                'module': TrainingModuleSerializer(module).data,
                'status': etm.status if etm else 'pending',
                'completed_date': etm.completed_date if etm else None,
            })
        representation['training_modules'] = modules_list
        if instance.photo:
            request = self.context.get('request')
            if request:
                representation['photo'] = request.build_absolute_uri(instance.photo.url)
            else:
                representation['photo'] = instance.photo.url
        return representation


class EmployeeCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating employees"""
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def to_representation(self, instance):
        """Convert the instance to a representation that includes the full photo URL"""
        representation = super().to_representation(instance)
        if instance.photo:
            request = self.context.get('request')
            if request:
                representation['photo'] = request.build_absolute_uri(instance.photo.url)
            else:
                representation['photo'] = instance.photo.url
        return representation
    
    def validate(self, data):
        """Custom validation for employee data"""
        # Convert empty strings to None for optional fields
        for field in ['dol', 'batch_no', 'sl2_ojt', 'after_ojt_area_of_work', 'remarks']:
            if field in data and data[field] == '':
                data[field] = None
        
        return data


class TrainingModuleStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating training module status"""
    module_id = serializers.CharField(allow_null=True, allow_blank=True)
    status = serializers.CharField(allow_null=True, allow_blank=True)
    completed_date = serializers.CharField(allow_null=True, allow_blank=True)


class BulkTrainingModuleUpdateSerializer(serializers.Serializer):
    """Serializer for bulk updating training module statuses"""
    updates = TrainingModuleStatusUpdateSerializer(many=True)


class EmployeeSearchSerializer(serializers.Serializer):
    """Serializer for employee search"""
    emp_no = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    area_of_work = serializers.CharField(required=False)
    plant = serializers.CharField(required=False)
    skill_level = serializers.CharField(required=False)


class EmployeeStatsSerializer(serializers.Serializer):
    """Serializer for employee statistics"""
    total_employees = serializers.CharField(allow_null=True, allow_blank=True)
    employees_by_area_of_work = serializers.DictField()
    employees_by_skill_level = serializers.DictField()
    employees_by_plant = serializers.DictField()
    recent_additions = serializers.ListField() 