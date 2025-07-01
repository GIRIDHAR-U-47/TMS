from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Employee(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    SKILL_LEVEL_CHOICES = [
        ('sl0', 'SL 0'),
        ('sl1', 'SL 1'),
        ('sl2', 'SL 2'),
        ('sl3', 'SL 3'),
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
        ('central', 'Central'),
    ]

    AREA_OF_WORK_CHOICES = [
        ('special_painter', 'Special Painter'),
        ('standard_room', 'standard room'),
        ('stores', 'Stores'),
        ('sub_contract_area', 'Sub contract area'),
        ('tool_room', 'TOOL ROOM'),
        ('tqc', 'TQC'),
        ('tvsm_qre', 'TVSM QRE'),
        ('unit_1', 'Unit-1'),
        ('plant_2', 'Plant-2'),
        ('plant_3', 'Plant-3'),
        ('product_audit', 'Product audit'),
        ('purchase', 'Purchase'),
        ('quality', 'Quality'),
        ('r_and_d', 'R & D'),
        ('safety', 'SAFETY'),
        ('sap', 'SAP'),
        ('security', 'Security'),
        ('material_loader', 'Material loader'),
        ('mold_change', 'Mold change'),
        ('molding', 'Molding'),
        ('mould_development', 'Mould development'),
        ('npd', 'NPD'),
        ('paint_plant', 'Paint Plant'),
        ('ped', 'PED'),
        ('personnel', 'Personnel'),
        ('plant_1', 'Plant-1'),
        ('despatch', 'Despatch'),
        ('dock_audit', 'Dock audit'),
        ('finance', 'Finance'),
        ('get', 'GET'),
        ('hrd', 'HRD'),
        ('incoming_inspection', 'Incoming inspection'),
        ('line_inspector', 'Line inspector'),
        ('maintenance', 'Maintenance'),
        ('marketing', 'MARKETING'),
        ('assy', 'Assy'),
        ('bmw_area', 'BMW Area'),
        ('bmw_inspection', 'BMW Inspection'),
        ('bop', 'BOP'),
        ('civil', 'Civil'),
        ('cnc_operator', 'CNC Operator'),
        ('conti_fi', 'Conti FI'),
        ('data_entry', 'Data entry'),
    ]

    CATEGORY_CHOICES = [
        ('1l', '1L'),
        ('2l', '2L'),
        ('3l', '3L'),
        ('ge', 'GE'),
        ('sw', 'SW'),
        ('ta', 'TA'),
    ]
    
    # Basic Information
    emp_no = models.CharField(max_length=100, unique=True, verbose_name="Employee Number", null=True, blank=True)
    name = models.CharField(max_length=255, verbose_name="Full Name", null=True, blank=True)
    gender = models.CharField(max_length=255, null=True, blank=True)
    dob = models.CharField(max_length=255, null=True, blank=True)
    age = models.CharField(max_length=255, null=True, blank=True)
    doj = models.CharField(max_length=255, null=True, blank=True)
    dol = models.CharField(max_length=255, null=True, blank=True)
    photo = models.ImageField(upload_to='employee_photos/', null=True, blank=True, verbose_name="Employee Photo")
    
    # Work Details
    plant = models.CharField(max_length=255, null=True, blank=True)
    area_of_work = models.CharField(max_length=255, null=True, blank=True)
    dept = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=255, null=True, blank=True)
    batch_no = models.CharField(max_length=100, blank=True, null=True, verbose_name="Batch Number")
    supervisor_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Supervisor Name")
    
    # Training Details
    training_days = models.CharField(max_length=255, null=True, blank=True)
    sl1_marks = models.CharField(max_length=255, null=True, blank=True)
    sl2_marks = models.CharField(max_length=255, null=True, blank=True)
    sl2_ojt = models.CharField(max_length=255, blank=True, null=True, verbose_name="SL2 OJT Status")
    after_ojt_area_of_work = models.CharField(max_length=255, blank=True, null=True, verbose_name="Area of Work After OJT")
    overall_percent = models.CharField(max_length=255, null=True, blank=True)
    skill_level = models.CharField(max_length=255, null=True, blank=True)
    remarks = models.TextField(blank=True, null=True, verbose_name="Remarks")
    
    # SL Assessment
    sl1_status = models.CharField(max_length=255, null=True, blank=True)
    sl2_status = models.CharField(max_length=255, null=True, blank=True)
    sl3_status = models.CharField(max_length=255, null=True, blank=True)
    
    # Timestamps
    created_at = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.CharField(max_length=255, null=True, blank=True)
    
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
    
    s_no = models.CharField(max_length=255, null=True, blank=True)
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
    completed_date = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        unique_together = ['employee', 'module']
        verbose_name = "Employee Training Module"
        verbose_name_plural = "Employee Training Modules"
    
    def __str__(self):
        return f"{self.employee.name} - {self.module.title}"


class TrainingRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='training_records')
    date = models.CharField(max_length=255, verbose_name="Training Date")
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
    test_1s_2s = models.CharField(max_length=255, null=True, blank=True)
    test_1s_2s_ball = models.CharField(max_length=255, null=True, blank=True)
    memory_test = models.CharField(max_length=255, null=True, blank=True)
    mind_hand_coordination = models.CharField(max_length=255, null=True, blank=True)
    nerve_stability = models.CharField(max_length=255, null=True, blank=True)
    material_identification = models.CharField(max_length=255, null=True, blank=True)
    pick_place_sequence = models.CharField(max_length=255, null=True, blank=True)
    pick_right_material = models.CharField(max_length=255, null=True, blank=True)
    visual_inspection = models.CharField(max_length=255, null=True, blank=True)
    defect_identification = models.CharField(max_length=255, null=True, blank=True)
    written_test = models.CharField(max_length=255, null=True, blank=True)
    basic_skills_total = models.CharField(max_length=255, null=True, blank=True)
    
    # Advanced Skills
    insert_loading_1 = models.CharField(max_length=255, null=True, blank=True)
    insert_loading_2 = models.CharField(max_length=255, null=True, blank=True)
    safety_test = models.CharField(max_length=255, null=True, blank=True)
    painting = models.CharField(max_length=255, null=True, blank=True)
    screw_assembly = models.CharField(max_length=255, null=True, blank=True)
    air_cleaner_assembly = models.CharField(max_length=255, null=True, blank=True)
    msa_test = models.CharField(max_length=255, null=True, blank=True)
    deflashing = models.CharField(max_length=255, null=True, blank=True)
    advanced_skills_total = models.CharField(max_length=255, null=True, blank=True)
    
    # Overall Assessment
    overall_score = models.CharField(max_length=255, null=True, blank=True)
    
    created_at = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        verbose_name = "Dexterity Assessment"
        verbose_name_plural = "Dexterity Assessments"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee.name} - Dexterity Assessment"
    
    def save(self, *args, **kwargs):
        # Calculate totals
        def to_number(val):
            try:
                return float(val)
            except (TypeError, ValueError):
                return 0
        basic_scores = [
            self.test_1s_2s, self.test_1s_2s_ball, self.memory_test, self.mind_hand_coordination,
            self.nerve_stability, self.material_identification, self.pick_place_sequence,
            self.pick_right_material, self.visual_inspection, self.defect_identification, self.written_test
        ]
        self.basic_skills_total = sum(to_number(score) for score in basic_scores if score not in (None, ""))
        
        advanced_scores = [
            self.insert_loading_1, self.insert_loading_2, self.safety_test, self.painting,
            self.screw_assembly, self.air_cleaner_assembly, self.msa_test, self.deflashing
        ]
        self.advanced_skills_total = sum(to_number(score) for score in advanced_scores if score not in (None, ""))
        
        # Calculate overall score
        if self.basic_skills_total is not None and self.advanced_skills_total is not None:
            self.overall_score = self.basic_skills_total + self.advanced_skills_total
        
        super().save(*args, **kwargs)


class PerformanceRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performance_records')
    day = models.CharField(max_length=255, null=True, blank=True)
    description = models.CharField(max_length=200, blank=True, verbose_name="Description")
    su_status = models.CharField(max_length=10, blank=True, verbose_name="S/U Status")  # S/U
    scope = models.CharField(max_length=100, blank=True, verbose_name="Scope")
    operation_name = models.CharField(max_length=100, blank=True, verbose_name="Operation Name")
    production = models.CharField(max_length=50, blank=True, verbose_name="Production")
    weight = models.CharField(max_length=20, blank=True, verbose_name="Weight")  # Wt
    quantity = models.CharField(max_length=20, blank=True, verbose_name="Quantity")  # Qty
    pro_n = models.CharField(max_length=20, blank=True, verbose_name="PRO-N")  # PRO-N
    perf_n = models.CharField(max_length=20, blank=True, verbose_name="Perf-N")  # Perf-N
    final_score = models.CharField(max_length=255, null=True, blank=True)
    
    # Approval
    supervisor_approved = models.BooleanField(default=False, verbose_name="Supervisor Approved")
    personnel_certified = models.BooleanField(default=False, verbose_name="Personnel Certified")
    
    created_at = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        unique_together = ['employee', 'day']
        verbose_name = "Performance Record"
        verbose_name_plural = "Performance Records"
        ordering = ['day']
    
    def __str__(self):
        return f"{self.employee.name} - Day {self.day}"
