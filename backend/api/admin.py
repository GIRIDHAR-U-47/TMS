from django.contrib import admin
from .models import (
    Employee, TrainingModule, EmployeeTrainingModule, TrainingRecord,
    OnJobTraining, DexterityAssessment, PerformanceRecord
)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['emp_no', 'name', 'dept', 'plant', 'category', 'skill_level', 'overall_percent', 'created_at']
    list_filter = ['dept', 'plant', 'category', 'skill_level', 'gender', 'created_at']
    search_fields = ['emp_no', 'name', 'batch_no']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('emp_no', 'name', 'gender', 'dob', 'age', 'doj', 'dol', 'photo')
        }),
        ('Work Details', {
            'fields': ('plant', 'area_of_work', 'dept', 'category', 'batch_no')
        }),
        ('Training Details', {
            'fields': ('training_days', 'sl1_marks', 'sl2_marks', 'sl2_ojt', 'after_ojt_dept', 'overall_percent', 'skill_level')
        }),
        ('SL Assessment', {
            'fields': ('sl1_status', 'sl2_status', 'sl3_status')
        }),
        ('Additional Information', {
            'fields': ('remarks', 'created_at', 'updated_at')
        }),
    )


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    list_display = ['s_no', 'title', 'expert']
    list_filter = ['expert']
    search_fields = ['title', 'expert']
    ordering = ['s_no']


@admin.register(EmployeeTrainingModule)
class EmployeeTrainingModuleAdmin(admin.ModelAdmin):
    list_display = ['employee', 'module', 'status', 'completed_date']
    list_filter = ['status', 'completed_date', 'module']
    search_fields = ['employee__name', 'employee__emp_no', 'module__title']
    date_hierarchy = 'completed_date'


@admin.register(TrainingRecord)
class TrainingRecordAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'training_program', 'duration']
    list_filter = ['date', 'employee__dept']
    search_fields = ['employee__name', 'training_program']
    date_hierarchy = 'date'


@admin.register(OnJobTraining)
class OnJobTrainingAdmin(admin.ModelAdmin):
    list_display = ['employee', 'product_process', 'machine_operations', 'quality_check_points']
    list_filter = ['employee__dept', 'employee__plant']
    search_fields = ['employee__name', 'product_process', 'machine_operations']


@admin.register(DexterityAssessment)
class DexterityAssessmentAdmin(admin.ModelAdmin):
    list_display = ['employee', 'basic_skills_total', 'advanced_skills_total', 'overall_score', 'created_at']
    list_filter = ['created_at', 'employee__dept']
    search_fields = ['employee__name', 'employee__emp_no']
    readonly_fields = ['basic_skills_total', 'advanced_skills_total', 'overall_score', 'created_at', 'updated_at']
    fieldsets = (
        ('Employee', {
            'fields': ('employee',)
        }),
        ('Basic Skills', {
            'fields': ('test_1s_2s', 'test_1s_2s_ball', 'memory_test', 'mind_hand_coordination', 
                      'nerve_stability', 'material_identification', 'pick_place_sequence', 
                      'pick_right_material', 'visual_inspection', 'defect_identification', 'written_test')
        }),
        ('Advanced Skills', {
            'fields': ('insert_loading_1', 'insert_loading_2', 'safety_test', 'painting',
                      'screw_assembly', 'air_cleaner_assembly', 'msa_test', 'deflashing')
        }),
        ('Totals', {
            'fields': ('basic_skills_total', 'advanced_skills_total', 'overall_score')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(PerformanceRecord)
class PerformanceRecordAdmin(admin.ModelAdmin):
    list_display = ['employee', 'day', 'operation_name', 'final_score', 'supervisor_approved', 'personnel_certified']
    list_filter = ['day', 'supervisor_approved', 'personnel_certified', 'employee__dept']
    search_fields = ['employee__name', 'operation_name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Employee Information', {
            'fields': ('employee', 'day')
        }),
        ('Performance Details', {
            'fields': ('description', 'su_status', 'scope', 'operation_name', 'production', 
                      'weight', 'quantity', 'pro_n', 'perf_n', 'final_score')
        }),
        ('Approval', {
            'fields': ('supervisor_approved', 'personnel_certified')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
