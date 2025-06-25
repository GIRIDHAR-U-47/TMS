from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'employees', views.EmployeeViewSet)
router.register(r'training-modules', views.TrainingModuleViewSet)
router.register(r'employee-training-modules', views.EmployeeTrainingModuleViewSet)
router.register(r'training-records', views.TrainingRecordViewSet)
router.register(r'ojt-records', views.OnJobTrainingViewSet)
router.register(r'dexterity-assessments', views.DexterityAssessmentViewSet)
router.register(r'performance-records', views.PerformanceRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('employee_search/', views.employee_search, name='employee_search'),
] 