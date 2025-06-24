"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def root_view(request):
    """Root view that provides API information"""
    return JsonResponse({
        "message": "Training Management System Backend API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api_root": "/api/",
            "employees": "/api/employees/",
            "training_modules": "/api/training-modules/",
            "training_records": "/api/training-records/",
            "ojt_records": "/api/ojt-records/",
            "dexterity_assessments": "/api/dexterity-assessments/",
            "performance_records": "/api/performance-records/",
        },
        "documentation": "Check the README.md file for detailed API documentation"
    })

urlpatterns = [
    path('', include('api.urls')),
    path('admin/', admin.site.urls),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
