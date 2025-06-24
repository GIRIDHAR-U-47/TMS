from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Employee(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    SKILL_LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    SL_STATUS_CHOICES = [
        ('pass', 'Pass'),
        ('fail', 'Fail'),
        ('pending', 'Pending'),
    ]

    PLANT_CHOICES = [
        ('plant-a', 'Plant A'),
        ('plant-b', 'Plant B'),
        ('plant-c', 'Plant C'),
    ]

    DEPT_CHOICES = [
        ('production', 'Production'),
        ('quality', 'Quality'),
        ('maintenance', 'Maintenance'),
        ('logistics', 'Logistics'),
    ]

    CATEGORY_CHOICES = [
        ('operator', 'Operator'),
        ('technician', 'Technician'),
        ('supervisor', 'Supervisor'),
        ('engineer', 'Engineer'),
    ]
    
    # Basic Information
    emp_no = models.CharField(max_length=20, unique=True, verbose_name="Employee Number")
    name = models.CharField(max_length=100, verbose_name="Full Name")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name="Gender")
    dob = models.DateField(verbose_name="Date of Birth")
    age = models.IntegerField(verbose_name="Age")
    doj = models.DateField(verbose_name="Date of Joining")
    dol = models.DateField(null=True, blank=True, verbose_name="Date of Leaving")
    photo = models.ImageField(upload_to='employee_photos/', null=True, blank=True, verbose_name="Employee Photo")
    
    # Work Details
    plant = models.CharField(max_length=50, choices=PLANT_CHOICES, verbose_name="Plant")
    area_of_work = models.CharField(max_length=100, verbose_name="Area of Work")
    dept = models.CharField(max_length=50, choices=DEPT_CHOICES, verbose_name="Department")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Category")
    batch_no = models.CharField(max_length=20, blank=True, verbose_name="Batch Number")
    
    # Training Details
    training_days = models.IntegerField(default=0, verbose_name="Number of Training Days")
    sl1_marks = models.IntegerField(null=True, blank=True, verbose_name="SL1 Marks")
    sl2_marks = models.IntegerField(null=True, blank=True, verbose_name="SL2 Marks")
    sl2_ojt = models.CharField(max_length=50, blank=True, verbose_name="SL2 OJT Status")
    after_ojt_dept = models.CharField(max_length=50, blank=True, verbose_name="Department After OJT")
    overall_percent = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        verbose_name="Overall Percentage",
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    skill_level = models.CharField(max_length=20, choices=SKILL_LEVEL_CHOICES, default='beginner', verbose_name="Skill Level")
    remarks = models.TextField(blank=True, verbose_name="Remarks")
    
    # SL Assessment
    sl1_status = models.CharField(max_length=10, choices=SL_STATUS_CHOICES, default='pending', verbose_name="SL1 Status")
    sl2_status = models.CharField(max_length=10, choices=SL_STATUS_CHOICES, default='pending', verbose_name="SL2 Status")
    sl3_status = models.CharField(max_length=10, choices=SL_STATUS_CHOICES, default='pending', verbose_name="SL3 Status")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.emp_no} - {self.name}"


class TrainingModule(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
    ]
    
    s_no = models.IntegerField(verbose_name="Serial Number")
    title = models.CharField(max_length=200, verbose_name="Module Title")
    expert = models.CharField(max_length=100, blank=True, verbose_name="Expert")
    
    class Meta:
        verbose_name = "Training Module"
        verbose_name_plural = "Training Modules"
        ordering = ['s_no']
    
    def __str__(self):
        return f"{self.s_no}. {self.title}"


class EmployeeTrainingModule(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='training_modules')
    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=TrainingModule.STATUS_CHOICES, default='pending')
    completed_date = models.DateField(null=True, blank=True)
    
    class Meta:
        unique_together = ['employee', 'module']
        verbose_name = "Employee Training Module"
        verbose_name_plural = "Employee Training Modules"
    
    def __str__(self):
        return f"{self.employee.name} - {self.module.title}"


class TrainingRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='training_records')
    date = models.DateField(verbose_name="Training Date")
    training_program = models.CharField(max_length=200, verbose_name="Training Program")
    duration = models.CharField(max_length=50, verbose_name="Duration")
    
    class Meta:
        verbose_name = "Training Record"
        verbose_name_plural = "Training Records"
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.employee.name} - {self.training_program}"


class OnJobTraining(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='ojt_records')
    product_process = models.CharField(max_length=100, verbose_name="Product/Process")
    machine_operations = models.CharField(max_length=100, verbose_name="Machine Operations")
    quality_check_points = models.CharField(max_length=100, verbose_name="Quality Check Points")
    secondary_operations = models.CharField(max_length=100, verbose_name="Secondary Operations")
    handling = models.CharField(max_length=100, verbose_name="Handling")
    packing_labeling = models.CharField(max_length=100, verbose_name="Packing & Labeling")
    others = models.CharField(max_length=100, blank=True, verbose_name="Others")
    
    class Meta:
        verbose_name = "On Job Training"
        verbose_name_plural = "On Job Training Records"
    
    def __str__(self):
        return f"{self.employee.name} - {self.product_process}"


class DexterityAssessment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='dexterity_assessments')
    
    # Basic Skills
    test_1s_2s = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="1S & 2S test")
    test_1s_2s_ball = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="1S & 2S test (Ball)")
    memory_test = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="Memory test")
    mind_hand_coordination = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="Mind & hand co-ordination")
    nerve_stability = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="Nerve stability testing")
    material_identification = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="Material identification")
    pick_place_sequence = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)], verbose_name="Pick & Place material in sequence")
    pick_right_material = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="Pick right material with right quantity")
    visual_inspection = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name="Visual inspection")
    defect_identification = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(15)], verbose_name="Defect identification")
    written_test = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(20)], verbose_name="Written test")
    basic_skills_total = models.IntegerField(null=True, blank=True, verbose_name="Basic skill - Total score")
    
    # Advanced Skills
    insert_loading_1 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)], verbose_name="Insert loading - 1")
    insert_loading_2 = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)], verbose_name="Insert loading - 2")
    safety_test = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(15)], verbose_name="Safety test")
    painting = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(15)], verbose_name="Painting")
    screw_assembly = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)], verbose_name="Screw assembly")
    air_cleaner_assembly = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)], verbose_name="Air cleaner assembly")
    msa_test = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(15)], verbose_name="MSA TEST")
    deflashing = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(15)], verbose_name="Deflashing")
    advanced_skills_total = models.IntegerField(null=True, blank=True, verbose_name="Advanced skill - Total score")
    
    # Overall Assessment
    overall_score = models.IntegerField(null=True, blank=True, verbose_name="Overall Score")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Dexterity Assessment"
        verbose_name_plural = "Dexterity Assessments"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee.name} - Dexterity Assessment"
    
    def save(self, *args, **kwargs):
        # Calculate totals
        basic_scores = [
            self.test_1s_2s, self.test_1s_2s_ball, self.memory_test, self.mind_hand_coordination,
            self.nerve_stability, self.material_identification, self.pick_place_sequence,
            self.pick_right_material, self.visual_inspection, self.defect_identification, self.written_test
        ]
        self.basic_skills_total = sum(score for score in basic_scores if score is not None)
        
        advanced_scores = [
            self.insert_loading_1, self.insert_loading_2, self.safety_test, self.painting,
            self.screw_assembly, self.air_cleaner_assembly, self.msa_test, self.deflashing
        ]
        self.advanced_skills_total = sum(score for score in advanced_scores if score is not None)
        
        # Calculate overall score
        if self.basic_skills_total is not None and self.advanced_skills_total is not None:
            self.overall_score = self.basic_skills_total + self.advanced_skills_total
        
        super().save(*args, **kwargs)


class PerformanceRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performance_records')
    day = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(31)], verbose_name="Day")
    description = models.CharField(max_length=200, blank=True, verbose_name="Description")
    su_status = models.CharField(max_length=10, blank=True, verbose_name="S/U Status")  # S/U
    scope = models.CharField(max_length=100, blank=True, verbose_name="Scope")
    operation_name = models.CharField(max_length=100, blank=True, verbose_name="Operation Name")
    production = models.CharField(max_length=50, blank=True, verbose_name="Production")
    weight = models.CharField(max_length=20, blank=True, verbose_name="Weight")  # Wt
    quantity = models.CharField(max_length=20, blank=True, verbose_name="Quantity")  # Qty
    pro_n = models.CharField(max_length=20, blank=True, verbose_name="PRO-N")  # PRO-N
    perf_n = models.CharField(max_length=20, blank=True, verbose_name="Perf-N")  # Perf-N
    final_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="Final Score")
    
    # Approval
    supervisor_approved = models.BooleanField(default=False, verbose_name="Supervisor Approved")
    personnel_certified = models.BooleanField(default=False, verbose_name="Personnel Certified")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['employee', 'day']
        verbose_name = "Performance Record"
        verbose_name_plural = "Performance Records"
        ordering = ['day']
    
    def __str__(self):
        return f"{self.employee.name} - Day {self.day}"
