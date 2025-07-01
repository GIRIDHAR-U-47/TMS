"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Plus, Search, Upload, Camera, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchEmployee, addEmployeeWithPhoto, updateEmployeeWithPhoto, updateEmployeeTrainingModulesBulk, createDexterityAssessment, updateDexterityAssessment, createTrainingRecord, updateTrainingRecord, createOjtRecord, updateOjtRecord } from "../lib/api"
import React from "react"

// Define the Employee type to match your backend response
interface Employee {
  id: number;
  emp_no: string;
  name: string;
  gender: string;
  dob: string;
  age: number;
  doj: string;
  dol: string | null;
  plant: string;
  area_of_work: string;
  dept: string;
  category: string;
  batch_no: string;
  training_days: number;
  sl1_marks: number;
  sl2_marks: number;
  sl2_ojt: string;
  after_ojt_area_of_work: string;
  overall_percent: number;
  skill_level: string;
  remarks: string;
  photo: string | null;
  sl1_status: string;
  sl2_status: string;
  sl3_status: string;
  created_at: string;
  updated_at: string;
  training_modules: Array<{
    id: number;
    module: {
      id: number;
      s_no: number;
      title: string;
      expert: string;
    };
    status: string;
    completed_date: string | null;
  }>;
  training_records: Array<{
    id: number;
    date: string;
    training_program: string;
    duration: string;
    employee: number;
  }>;
  ojt_records: Array<{
    id: number;
    product_process: string;
    machine_operations: string;
    quality_check_points: string;
    secondary_operations: string;
    handling: string;
    packing_labeling: string;
    others: string;
    employee: number;
  }>;
  dexterity_assessments: Array<{
    id: number;
    employee: number;
    test_1s_2s: number | null;
    test_1s_2s_ball: number | null;
    memory_test: number | null;
    mind_hand_coordination: number | null;
    nerve_stability: number | null;
    material_identification: number | null;
    pick_place_sequence: number | null;
    pick_right_material: number | null;
    visual_inspection: number | null;
    defect_identification: number | null;
    written_test: number | null;
    basic_skills_total: number | null;
    insert_loading_1: number | null;
    insert_loading_2: number | null;
    safety_test: number | null;
    painting: number | null;
    screw_assembly: number | null;
    air_cleaner_assembly: number | null;
    msa_test: number | null;
    deflashing: number | null;
  }>;
  performance_records: Array<{
    id: number;
    day: number;
    description: string;
    su_status: string;
    scope: string;
    operation_name: string;
    production: string;
    weight: string;
    quantity: string;
    pro_n: string;
    perf_n: string;
    final_score: string;
    supervisor_approved: boolean;
    personnel_certified: boolean;
    created_at: string;
    updated_at: string;
    employee: number;
  }>;
  supervisor_name: string;
}

const trainingModules = [
  {
    sNo: 1,
    title: "Pricol culture & Values, Time office & Briefing on statutory requirements",
    expert: "Mr.Harish Kumar Y / Mr.Sivakumar G",
  },
  {
    sNo: 2,
    title: "Behavioural safety & Environment",
    expert: "Mr. Jagadeesan M/ Mr. Sridhar R",
  },
  {
    sNo: 3,
    title: "IR - OHC (Medical centre)",
    expert: "Medical Officers",
  },
  {
    sNo: 4,
    title: "IR - Security Office",
    expert: "Security Officers",
  },
  {
    sNo: 5,
    title: "Workplace maintenance - 5S & Suggestion scheme",
    expert: "Mr. Balamurugan P",
  },
  {
    sNo: 6,
    title: "POSH Awareness",
    expert: "Ms. Aarthi R",
  },
  {
    sNo: 7,
    title: "Product / Process knowledge",
    expert: "",
  },
  {
    sNo: 8,
    title: "Usage of tools / Machines / Instruments & Calibration / Gauges & Abnormality Handling",
    expert: "Mr. Madhalaimuthu",
  },
  {
    sNo: 9,
    title: "Defect identification & Quality alerts",
    expert: "",
  },
  {
    sNo: 10,
    title: "Videos on process, Safety,EHS, Discipline, 5S",
    expert: "Ms. Vinitha V",
  },
  {
    sNo: 11,
    title: "Basic dexterity training & Assessment",
    expert: "",
  },
  {
    sNo: 12,
    title: "Gemba & Skill evaluation (Post test)",
    expert: "Operations / Other",
  },
]

type DexterityFormType = {
  [key: string]: string;
  test_1s_2s: string;
  test_1s_2s_ball: string;
  memory_test: string;
  mind_hand_coordination: string;
  nerve_stability: string;
  material_identification: string;
  pick_place_sequence: string;
  pick_right_material: string;
  visual_inspection: string;
  defect_identification: string;
  written_test: string;
  insert_loading_1: string;
  insert_loading_2: string;
  safety_test: string;
  painting: string;
  screw_assembly: string;
  air_cleaner_assembly: string;
  msa_test: string;
  deflashing: string;
};

type EmployeeFormProps = {
  isEdit?: boolean;
  onClose: () => void;
  initialForm: Record<string, string>;
  initialDexterityForm: DexterityFormType;
  initialModuleStatuses: Record<string, string>;
  searchResult: Employee | null;
  initialPhotoPreview: string | null;
  initialSelectedPhoto: File | null;
  onSave: () => void;
  setEditEmployeeOpen: (open: boolean) => void;
  setAddEmployeeOpen: (open: boolean) => void;
  setSearchResult: (result: Employee | null) => void;
};

// Memoized EmployeeForm with internal state
const EmployeeForm = React.memo(function EmployeeForm({
  isEdit = false,
  onClose,
  initialForm,
  initialDexterityForm,
  initialModuleStatuses,
  searchResult,
  initialPhotoPreview,
  initialSelectedPhoto,
  onSave,
  setEditEmployeeOpen,
  setAddEmployeeOpen,
  setSearchResult
}: EmployeeFormProps) {
  const [form, setForm] = useState<Record<string, string>>(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dexterityForm, setDexterityForm] = useState<DexterityFormType>(initialDexterityForm);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(initialSelectedPhoto || null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhotoPreview || null);
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, string>>(initialModuleStatuses);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");
  const [trainingRecords, setTrainingRecords] = useState<Array<{id?: number, date: string, training_program: string, duration: string}>>(
    isEdit && searchResult && searchResult.training_records && searchResult.training_records.length > 0
      ? [...searchResult.training_records.slice(0, 5).map(tr => ({ id: tr.id, date: tr.date, training_program: tr.training_program, duration: tr.duration })), ...Array.from({ length: Math.max(0, 5 - searchResult.training_records.length) }, () => ({ date: '', training_program: '', duration: '' }))]
      : Array.from({ length: 5 }, () => ({ date: '', training_program: '', duration: '' }))
  );
  const [ojtRecords, setOjtRecords] = useState<Array<{id?: number, product_process: string, machine_operations: string, quality_check_points: string, secondary_operations: string, handling: string, packing_labeling: string, others: string}>>(
    isEdit && searchResult && searchResult.ojt_records && searchResult.ojt_records.length > 0
      ? [...searchResult.ojt_records.slice(0, 4).map(ojt => ({ id: ojt.id, product_process: ojt.product_process, machine_operations: ojt.machine_operations, quality_check_points: ojt.quality_check_points, secondary_operations: ojt.secondary_operations, handling: ojt.handling, packing_labeling: ojt.packing_labeling, others: ojt.others })), ...Array.from({ length: Math.max(1, 4 - searchResult.ojt_records.length) }, () => ({ product_process: '', machine_operations: '', quality_check_points: '', secondary_operations: '', handling: '', packing_labeling: '', others: '' }))]
      : Array.from({ length: 1 }, () => ({ product_process: '', machine_operations: '', quality_check_points: '', secondary_operations: '', handling: '', packing_labeling: '', others: '' }))
  );

  // Pre-fill dexterityForm with latest assessment when editing
  useEffect(() => {
    if (isEdit && searchResult && searchResult.dexterity_assessments && searchResult.dexterity_assessments.length > 0) {
      const latest = searchResult.dexterity_assessments[0];
      setDexterityForm({
        test_1s_2s: latest.test_1s_2s?.toString() ?? '',
        test_1s_2s_ball: latest.test_1s_2s_ball?.toString() ?? '',
        memory_test: latest.memory_test?.toString() ?? '',
        mind_hand_coordination: latest.mind_hand_coordination?.toString() ?? '',
        nerve_stability: latest.nerve_stability?.toString() ?? '',
        material_identification: latest.material_identification?.toString() ?? '',
        pick_place_sequence: latest.pick_place_sequence?.toString() ?? '',
        pick_right_material: latest.pick_right_material?.toString() ?? '',
        visual_inspection: latest.visual_inspection?.toString() ?? '',
        defect_identification: latest.defect_identification?.toString() ?? '',
        written_test: latest.written_test?.toString() ?? '',
        insert_loading_1: latest.insert_loading_1?.toString() ?? '',
        insert_loading_2: latest.insert_loading_2?.toString() ?? '',
        safety_test: latest.safety_test?.toString() ?? '',
        painting: latest.painting?.toString() ?? '',
        screw_assembly: latest.screw_assembly?.toString() ?? '',
        air_cleaner_assembly: latest.air_cleaner_assembly?.toString() ?? '',
        msa_test: latest.msa_test?.toString() ?? '',
        deflashing: latest.deflashing?.toString() ?? '',
      });
    } else {
      setDexterityForm(initialDexterityForm);
    }
  }, [isEdit, searchResult]);

  useEffect(() => {
    setForm(initialForm);
    setDexterityForm(initialDexterityForm);
    setModuleStatuses(initialModuleStatuses);
    setSelectedPhoto(initialSelectedPhoto || null);
    setPhotoPreview(initialPhotoPreview || null);
    setFormErrors({});
    setTrainingRecords(Array.from({ length: 5 }, () => ({ date: '', training_program: '', duration: '' })));
    setOjtRecords(Array.from({ length: 1 }, () => ({ product_process: '', machine_operations: '', quality_check_points: '', secondary_operations: '', handling: '', packing_labeling: '', others: '' })));
  }, [initialForm, initialDexterityForm, initialModuleStatuses, initialPhotoPreview, initialSelectedPhoto]);

  // Update trainingRecords when editing a new employee
  useEffect(() => {
    if (isEdit && searchResult && searchResult.training_records) {
      setTrainingRecords([
        ...searchResult.training_records.slice(0, 5).map(tr => ({ id: tr.id, date: tr.date, training_program: tr.training_program, duration: tr.duration })),
        ...Array.from({ length: Math.max(0, 5 - searchResult.training_records.length) }, () => ({ date: '', training_program: '', duration: '' }))
      ]);
    } else {
      setTrainingRecords(Array.from({ length: 5 }, () => ({ date: '', training_program: '', duration: '' })));
    }
  }, [isEdit, searchResult]);

  useEffect(() => {
    if (isEdit && searchResult && searchResult.ojt_records) {
      setOjtRecords([
        ...searchResult.ojt_records.slice(0, 4).map(ojt => ({ id: ojt.id, product_process: ojt.product_process, machine_operations: ojt.machine_operations, quality_check_points: ojt.quality_check_points, secondary_operations: ojt.secondary_operations, handling: ojt.handling, packing_labeling: ojt.packing_labeling, others: ojt.others })),
        ...Array.from({ length: Math.max(1, 4 - searchResult.ojt_records.length) }, () => ({ product_process: '', machine_operations: '', quality_check_points: '', secondary_operations: '', handling: '', packing_labeling: '', others: '' }))
      ]);
    } else {
      setOjtRecords(Array.from({ length: 1 }, () => ({ product_process: '', machine_operations: '', quality_check_points: '', secondary_operations: '', handling: '', packing_labeling: '', others: '' })));
    }
  }, [isEdit, searchResult]);

  const requiredFields = [
    "emp_no",
    "name",
    "gender",
    "dob",
    "doj",
    "plant",
    "area_of_work",
    "dept",
    "category",
  ]

  const validateForm = (isEditing: boolean) => {
    const errors: Record<string, string> = {}
    // Only validate required fields for new employees, not updates
    if (!isEditing) {
      requiredFields.forEach((field) => {
        if (!form[field as keyof typeof form]) {
          errors[field] = ""  // Empty string instead of validation message
        }
      })
    }
    return errors
  }

  const handleFormChange = useCallback((field: string, value: string) => {
    // Auto-calculate age when DOB changes
    if (field === 'dob' && value) {
      const today = new Date()
      const birthDate = new Date(value)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      const calculatedAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
        ? (age - 1).toString() 
        : age.toString()
      
      // Update both DOB and age in a single setForm call
      setForm((prev) => ({ 
        ...prev, 
        [field]: value,
        age: calculatedAge
      }))
    } else {
      // Regular field update
      setForm((prev) => ({ ...prev, [field]: value }))
    }
    
    setFormErrors((prev) => ({ ...prev, [field]: "" }))
  }, [])

  const handlePhotoSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      
      setSelectedPhoto(file)
      setError('')
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleSaveEmployee = async (isEdit: boolean) => {
    const errors = validateForm(isEdit)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }
    
    try {
      let employeeId;
      let empNoToSearch;
      if (isEdit && searchResult) {
        await updateEmployeeWithPhoto(searchResult.id, form, selectedPhoto || undefined);
        employeeId = searchResult.id;
        empNoToSearch = searchResult.emp_no;
      } else {
        const newEmp = await addEmployeeWithPhoto(form, selectedPhoto || undefined);
        employeeId = newEmp.id;
        empNoToSearch = newEmp.emp_no;
        // Auto-create dexterity assessment for new employee
        try {
          const assessmentData = {
            employee: employeeId,
            ...Object.fromEntries(
              Object.entries(dexterityForm).map(([k, v]) => {
                if (v === '' || v === null || v === undefined) return [k, null];
                const num = Number(v);
                return [k, isNaN(num) ? null : num];
              })
            ),
          };
          await createDexterityAssessment(assessmentData);
        } catch (err) {
          setError('Failed to save dexterity assessment');
          console.error(err);
        }
        // Auto-create OJT records for new employee
        for (const rec of ojtRecords) {
          if (rec.product_process) {
            try {
              await createOjtRecord({ ...rec, employee: employeeId });
            } catch (err) {
              setError('Failed to save OJT record');
              console.error(err);
            }
          }
        }
        // Auto-create training records for new employee
        for (const rec of trainingRecords) {
          if (rec.date && rec.training_program && rec.duration) {
            try {
              await createTrainingRecord({ ...rec, employee: employeeId });
            } catch (err) {
              setError('Failed to save training record');
              console.error(err);
            }
          }
        }
      }

      // Save dexterity assessment
      try {
        const assessmentData = {
          employee: employeeId,
          ...Object.fromEntries(
            Object.entries(dexterityForm).map(([k, v]) => {
              if (v === '' || v === null || v === undefined) return [k, null];
              const num = Number(v);
              return [k, isNaN(num) ? null : num];
            })
          ),
        };
        if (
          isEdit &&
          searchResult &&
          Array.isArray(searchResult.dexterity_assessments) &&
          searchResult.dexterity_assessments.length > 0
        ) {
          const latestAssessment = searchResult.dexterity_assessments[0];
          await updateDexterityAssessment(latestAssessment.id, assessmentData);
        } else {
          await createDexterityAssessment(assessmentData);
        }
      } catch (err) {
        setError('Failed to save dexterity assessment');
        console.error(err);
      }

      // Upsert OJT records
      for (const rec of ojtRecords) {
        if (rec.product_process) { // Only save if Product/Process is filled
          if (rec.id) {
            await updateOjtRecord(rec.id, { ...rec, employee: employeeId });
          } else {
            await createOjtRecord({ ...rec, employee: employeeId });
          }
        }
      }

      // Upsert training records
      for (const rec of trainingRecords) {
        if (rec.date && rec.training_program && rec.duration) { // Only save if filled
          if (rec.id) {
            await updateTrainingRecord(rec.id, { ...rec, employee: employeeId });
          } else {
            await createTrainingRecord({ ...rec, employee: employeeId });
          }
        }
      }

      // Refresh main view
      setDexterityForm(initialDexterityForm);
      if (isEdit) {
        setEditEmployeeOpen(false);
      } else {
        setAddEmployeeOpen(false);
      }
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setForm({
        emp_no: "",
        name: "",
        gender: "",
        dob: "",
        age: "",
        doj: "",
        dol: "",
        plant: "",
        area_of_work: "",
        dept: "",
        category: "",
        batch_no: "",
        training_days: "0",
        sl1_marks: "0",
        sl2_marks: "0",
        sl2_ojt: "",
        after_ojt_area_of_work: "",
        overall_percent: "0.0",
        skill_level: "beginner",
        remarks: "",
        sl1_status: "pending",
        sl2_status: "pending",
        sl3_status: "pending",
        supervisor_name: "",
      });
      setFormErrors({});

      if (empNoToSearch) {
        const updatedEmployee = await searchEmployee(empNoToSearch);
        setSearchResult(updatedEmployee);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save employee');
    }
  };

  const handleModuleAction = async (moduleTitle: string, action: "accept" | "deny") => {
    setModuleStatuses((prev) => ({
      ...prev,
      [moduleTitle]: action === "accept" ? "accepted" : "denied",
    }));

    if (!searchResult) return;
    // Find the module object in searchResult.training_modules by title
    const tm = searchResult.training_modules.find((m) => m.module.title === moduleTitle);
    if (!tm) return;
    const module_id = tm.module.id;
    const status = action === "accept" ? "accepted" : "denied";
    let completed_date: string | null = null;
    if (status === "accepted") {
      // Format today's date as YYYY-MM-DD
      const today = new Date();
      completed_date = today.toISOString().slice(0, 10);
    }
    try {
      await updateEmployeeTrainingModulesBulk(searchResult.id, [
        { module_id, status, completed_date },
      ]);
      // Refresh employee data
      const updated = await searchEmployee(searchResult.emp_no);
      onSave();
    } catch (err) {
      setError('Failed to update training module status');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "denied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const handleDexterityChange = (field: string, value: string) => {
    setDexterityForm((prev: DexterityFormType) => ({ ...prev, [field]: value }));
  };

  const handleSaveDexterityAssessment = async () => {
    if (!searchResult) return;
    try {
      const assessmentData = Object.fromEntries(
        Object.entries(dexterityForm).map(([k, v]) => {
          if (v === '' || v === null || v === undefined) return [k, null];
          const num = Number(v);
          return [k, isNaN(num) ? null : num];
        })
      );
      if (searchResult.dexterity_assessments && searchResult.dexterity_assessments.length > 0) {
        // Update existing assessment
        const latestAssessment = searchResult.dexterity_assessments[0];
        try {
          await updateDexterityAssessment(latestAssessment.id, {
            employee: searchResult.id,
            ...assessmentData,
          });
        } catch (apiErr: any) {
          let msg = 'Failed to update dexterity assessment';
          if (apiErr && apiErr.response) {
            msg += ': ' + (await apiErr.response.text());
          }
          setError(msg);
          console.error(msg, apiErr);
          return;
        }
      } else {
        // Create new assessment
        try {
          await createDexterityAssessment({
            employee: searchResult.id,
            ...assessmentData,
          });
        } catch (apiErr: any) {
          let msg = 'Failed to create dexterity assessment';
          if (apiErr && apiErr.response) {
            msg += ': ' + (await apiErr.response.text());
          }
          setError(msg);
          console.error(msg, apiErr);
          return;
        }
      }
      setDexterityForm(initialDexterityForm);
      setError('');
      // Refresh employee data
      const updatedEmployee = await searchEmployee(searchResult.emp_no);
      setSearchResult(updatedEmployee);
    } catch (err) {
      setError('Failed to save dexterity assessment');
      console.error(err);
    }
  };

    return (
      <div className="space-y-6">
        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="photo">Upload or Scan Photo</Label>
                <div className="mt-2 flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Scan
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
                {selectedPhoto && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {selectedPhoto.name}
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-600 mt-1">
                    {error}
                  </p>
                )}
              </div>
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={photoPreview || (isEdit ? searchResult?.photo || undefined : "/placeholder.svg?height=80&width=80")} 
                />
                <AvatarFallback>
                  {(searchResult?.name ?? "")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("") || "NA"}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="empNo">EMP NO *</Label>
            <Input id="empNo" placeholder="Enter employee number" value={form.emp_no ?? ""} onChange={e => handleFormChange('emp_no', e.target.value)} />
              {formErrors.emp_no && <span className="text-red-500 text-xs">{formErrors.emp_no}</span>}
            </div>
            <div>
              <Label htmlFor="name">NAME *</Label>
            <Input id="name" placeholder="Enter full name" value={form.name ?? ""} onChange={e => handleFormChange('name', e.target.value)} />
              {formErrors.name && <span className="text-red-500 text-xs">{formErrors.name}</span>}
            </div>
            <div>
              <Label htmlFor="gender">GENDER *</Label>
            <Select value={form.gender ?? ""} onValueChange={val => handleFormChange('gender', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.gender && <span className="text-red-500 text-xs">{formErrors.gender}</span>}
            </div>
            <div>
              <Label htmlFor="dob">DOB *</Label>
            <Input id="dob" type="date" value={form.dob ?? ""} onChange={e => handleFormChange('dob', e.target.value)} />
              {formErrors.dob && <span className="text-red-500 text-xs">{formErrors.dob}</span>}
            </div>
            <div>
              <Label htmlFor="age">AGE</Label>
            <Input id="age" type="number" placeholder="Age" value={form.age ?? ""} onChange={e => handleFormChange('age', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="doj">DOJ *</Label>
            <Input id="doj" type="date" value={form.doj ?? ""} onChange={e => handleFormChange('doj', e.target.value)} />
              {formErrors.doj && <span className="text-red-500 text-xs">{formErrors.doj}</span>}
            </div>
            <div>
              <Label htmlFor="dol">DOL</Label>
            <Input id="dol" type="date" value={form.dol ?? ""} onChange={e => handleFormChange('dol', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* SL Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skill Level Assessment</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sl1">SL1 Assessment</Label>
            <Select value={form.sl1_status ?? ""} onValueChange={val => handleFormChange('sl1_status', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select SL1 status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass">Pass</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sl2">SL2 Assessment</Label>
            <Select value={form.sl2_status ?? ""} onValueChange={val => handleFormChange('sl2_status', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select SL2 status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass">Pass</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sl3">SL3 Assessment</Label>
            <Select value={form.sl3_status ?? ""} onValueChange={val => handleFormChange('sl3_status', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select SL3 status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass">Pass</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Work Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="plant">PLANT *</Label>
            <Select value={form.plant ?? ""} onValueChange={val => handleFormChange('plant', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plant-a">Plant A</SelectItem>
                  <SelectItem value="plant-b">Plant B</SelectItem>
                  <SelectItem value="plant-c">Plant C</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.plant && <span className="text-red-500 text-xs">{formErrors.plant}</span>}
            </div>
            <div>
              <Label htmlFor="areaOfWork">AREA OF WORK *</Label>
            <Input id="areaOfWork" placeholder="Enter area of work" value={form.area_of_work ?? ""} onChange={e => handleFormChange('area_of_work', e.target.value)} />
              {formErrors.area_of_work && <span className="text-red-500 text-xs">{formErrors.area_of_work}</span>}
            </div>
            <div>
              <Label htmlFor="dept">DEPT *</Label>
            <Select value={form.dept ?? ""} onValueChange={val => handleFormChange('dept', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="special_painter">Special Painter</SelectItem>
                  <SelectItem value="standard_room">standard room</SelectItem>
                  <SelectItem value="stores">Stores</SelectItem>
                  <SelectItem value="sub_contract_area">Sub contract area</SelectItem>
                  <SelectItem value="tool_room">TOOL ROOM</SelectItem>
                  <SelectItem value="tqc">TQC</SelectItem>
                  <SelectItem value="tvsm_qre">TVSM QRE</SelectItem>
                  <SelectItem value="unit_1">Unit-1</SelectItem>
                  <SelectItem value="plant_2">Plant-2</SelectItem>
                  <SelectItem value="plant_3">Plant-3</SelectItem>
                  <SelectItem value="product_audit">Product audit</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="r_and_d">R & D</SelectItem>
                  <SelectItem value="safety">SAFETY</SelectItem>
                  <SelectItem value="sap">SAP</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="material_loader">Material loader</SelectItem>
                  <SelectItem value="mold_change">Mold change</SelectItem>
                  <SelectItem value="molding">Molding</SelectItem>
                  <SelectItem value="mould_development">Mould development</SelectItem>
                  <SelectItem value="npd">NPD</SelectItem>
                  <SelectItem value="paint_plant">Paint Plant</SelectItem>
                  <SelectItem value="ped">PED</SelectItem>
                  <SelectItem value="personnel">Personnel</SelectItem>
                  <SelectItem value="plant_1">Plant-1</SelectItem>
                  <SelectItem value="despatch">Despatch</SelectItem>
                  <SelectItem value="dock_audit">Dock audit</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="get">GET</SelectItem>
                  <SelectItem value="hrd">HRD</SelectItem>
                  <SelectItem value="incoming_inspection">Incoming inspection</SelectItem>
                  <SelectItem value="line_inspector">Line inspector</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="marketing">MARKETING</SelectItem>
                  <SelectItem value="assy">Assy</SelectItem>
                  <SelectItem value="bmw_area">BMW Area</SelectItem>
                  <SelectItem value="bmw_inspection">BMW Inspection</SelectItem>
                  <SelectItem value="bop">BOP</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                  <SelectItem value="cnc_operator">CNC Operator</SelectItem>
                  <SelectItem value="conti_fi">Conti FI</SelectItem>
                  <SelectItem value="data_entry">Data entry</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.dept && <span className="text-red-500 text-xs">{formErrors.dept}</span>}
            </div>
            <div>
              <Label htmlFor="category">CATEGORY *</Label>
            <Select value={form.category ?? ""} onValueChange={val => handleFormChange('category', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1l">1L</SelectItem>
                  <SelectItem value="2l">2L</SelectItem>
                  <SelectItem value="3l">3L</SelectItem>
                  <SelectItem value="ge">GE</SelectItem>
                  <SelectItem value="sw">SW</SelectItem>
                  <SelectItem value="ta">TA</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.category && <span className="text-red-500 text-xs">{formErrors.category}</span>}
            </div>
            <div>
              <Label htmlFor="batchNo">BATCH NO</Label>
            <Input id="batchNo" placeholder="Enter batch number" value={form.batch_no ?? ""} onChange={e => handleFormChange('batch_no', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="supervisorName">SUPERVISOR NAME</Label>
            <Input id="supervisorName" placeholder="Enter supervisor name" value={form.supervisor_name ?? ""} onChange={e => handleFormChange('supervisor_name', e.target.value)} />
              {formErrors.supervisor_name && <span className="text-red-500 text-xs">{formErrors.supervisor_name}</span>}
            </div>
          </CardContent>
        </Card>

        {/* Training Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Training Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="trainingDays">NO. OF DAYS TRAINING</Label>
              <Input
                id="trainingDays"
                type="number"
                placeholder="Training days"
              value={form.training_days ?? ""}
                onChange={e => handleFormChange('training_days', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sl1Marks">SL1 MARKS</Label>
              <Input
                id="sl1Marks"
                type="number"
                placeholder="SL1 marks"
              value={form.sl1_marks ?? ""}
                onChange={e => handleFormChange('sl1_marks', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sl2Marks">SL2 MARKS</Label>
              <Input
                id="sl2Marks"
                type="number"
                placeholder="SL2 marks"
              value={form.sl2_marks ?? ""}
                onChange={e => handleFormChange('sl2_marks', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sl2Ojt">SL2 OJT</Label>
              <Input 
                id="sl2Ojt" 
                placeholder="SL2 OJT status" 
              value={form.sl2_ojt ?? ""}
                onChange={e => handleFormChange('sl2_ojt', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="afterOjtAreaOfWork">AFTER OJT AREA OF WORK</Label>
              <Input
                id="afterOjtAreaOfWork"
                placeholder="Area of Work after OJT"
              value={form.after_ojt_area_of_work ?? ""}
                onChange={e => handleFormChange('after_ojt_area_of_work', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="overallPercent">OVERALL %</Label>
              <Input
                id="overallPercent"
                type="number"
                step="0.1"
                placeholder="Overall percentage"
              value={form.overall_percent ?? "0.0"}
                onChange={e => handleFormChange('overall_percent', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="skillLevel">SKILL LEVEL</Label>
            <Select value={form.skill_level ?? ""} onValueChange={val => handleFormChange('skill_level', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sl0">SL 0</SelectItem>
                  <SelectItem value="sl1">SL 1</SelectItem>
                  <SelectItem value="sl2">SL 2</SelectItem>
                  <SelectItem value="sl3">SL 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Training Records */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Training Records</CardTitle>
            <CardDescription>Record of training sessions attended</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Date</th>
                    <th className="border border-gray-300 p-2 text-left">Training Program</th>
                    <th className="border border-gray-300 p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                {trainingRecords.map((rec, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                      <Input type="date" className="h-8" value={rec.date} onChange={e => {
                        const newRecords = [...trainingRecords];
                        newRecords[index].date = e.target.value;
                        setTrainingRecords(newRecords);
                      }} />
                      </td>
                      <td className="border border-gray-300 p-2">
                      <Input placeholder="Training program name" className="h-8" value={rec.training_program} onChange={e => {
                        const newRecords = [...trainingRecords];
                        newRecords[index].training_program = e.target.value;
                        setTrainingRecords(newRecords);
                      }} />
                      </td>
                      <td className="border border-gray-300 p-2">
                      <Input placeholder="Duration" className="h-8" value={rec.duration} onChange={e => {
                        const newRecords = [...trainingRecords];
                        newRecords[index].duration = e.target.value;
                        setTrainingRecords(newRecords);
                      }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* On Job Training */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">On Job Training</CardTitle>
            <CardDescription>On-the-job training activities and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Product/Process</th>
                    <th className="border border-gray-300 p-2 text-left">Machine operations</th>
                    <th className="border border-gray-300 p-2 text-left">Quality check points</th>
                    <th className="border border-gray-300 p-2 text-left">Secondary operations</th>
                    <th className="border border-gray-300 p-2 text-left">Handling</th>
                    <th className="border border-gray-300 p-2 text-left">Packing & Labeling</th>
                    <th className="border border-gray-300 p-2 text-left">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {ojtRecords.map((rec, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder="Product/Process"
                          className="h-8"
                          value={rec.product_process}
                          onChange={e => {
                            const newRecords = [...ojtRecords];
                            newRecords[index].product_process = e.target.value;
                            setOjtRecords(newRecords);
                          }}
                        />
                      </td>
                      {["machine_operations", "quality_check_points", "secondary_operations", "handling", "packing_labeling", "others"].map(field => (
                        <td className="border border-gray-300 p-2" key={field}>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={String(rec[field as keyof typeof rec]) === "signed"}
                              onChange={e => {
                                const newRecords = [...ojtRecords];
                                newRecords[index][field as keyof typeof rec] = e.target.checked ? "signed" : "";
                                setOjtRecords(newRecords);
                              }}
                            />
                            <span>{String(rec[field as keyof typeof rec]) === "signed" ? "signed" : "sign"}</span>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Remarks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any remarks or additional notes"
              rows={3}
            value={form.remarks ?? ""}
              onChange={e => handleFormChange('remarks', e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Training Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Training Modules</CardTitle>
            <CardDescription>Accept or deny each training module for this employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainingModules.map((module) => (
                <div key={module.sNo} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-1">
                        {module.sNo}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{module.title}</p>
                        {module.expert && <p className="text-xs text-gray-500">Expert: {module.expert}</p>}
                        <Badge className={`mt-2 ${getStatusColor(moduleStatuses[module.title] || "pending")}`}>
                          {moduleStatuses[module.title] || "pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant={moduleStatuses[module.title] === "accepted" ? "default" : "outline"}
                      onClick={() => handleModuleAction(module.title, "accept")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant={moduleStatuses[module.title] === "denied" ? "destructive" : "outline"}
                      onClick={() => handleModuleAction(module.title, "deny")}
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dexterity Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dexterity Assessment</CardTitle>
            <CardDescription>Enter scores for basic and advanced skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Skills */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">Basic Skills</h4>
                <div className="space-y-2">
                  {[
                    { field: 'test_1s_2s', label: '1S & 2S test', max: 5 },
                    { field: 'test_1s_2s_ball', label: '1S & 2S test (Ball)', max: 5 },
                    { field: 'memory_test', label: 'Memory test', max: 5 },
                    { field: 'mind_hand_coordination', label: 'Mind & hand co-ordination', max: 5 },
                    { field: 'nerve_stability', label: 'Nerve stability testing', max: 5 },
                    { field: 'material_identification', label: 'Material identification', max: 5 },
                    { field: 'pick_place_sequence', label: 'Pick & Place material in sequence', max: 10 },
                    { field: 'pick_right_material', label: 'Pick right material with right quantity', max: 5 },
                    { field: 'visual_inspection', label: 'Visual inspection', max: 5 },
                    { field: 'defect_identification', label: 'Defect identification', max: 15 },
                    { field: 'written_test', label: 'Written test', max: 20 },
                  ].map(item => (
                    <div key={item.field} className="flex items-center space-x-2 mb-2">
                      <Label className="w-64">{item.label} (Max {item.max})</Label>
                      <Input
                        type="number"
                        min={0}
                        max={item.max}
                      value={dexterityForm[item.field] ?? ""}
                        onChange={e => handleDexterityChange(item.field, e.target.value)}
                        className="w-24"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Skills */}
              <div>
                <h4 className="font-semibold mb-3 text-green-600">Advanced Skills</h4>
                <div className="space-y-2">
                  {[
                    { field: 'insert_loading_1', label: 'Insert loading - 1', max: 10 },
                    { field: 'insert_loading_2', label: 'Insert loading - 2', max: 10 },
                    { field: 'safety_test', label: 'Safety test', max: 15 },
                    { field: 'painting', label: 'Painting', max: 15 },
                    { field: 'screw_assembly', label: 'Screw assembly', max: 10 },
                    { field: 'air_cleaner_assembly', label: 'Air cleaner assembly', max: 10 },
                    { field: 'msa_test', label: 'MSA TEST', max: 15 },
                    { field: 'deflashing', label: 'Deflashing', max: 15 },
                  ].map(item => (
                    <div key={item.field} className="flex items-center space-x-2 mb-2">
                      <Label className="w-64">{item.label} (Max {item.max})</Label>
                      <Input
                        type="number"
                        min={0}
                        max={item.max}
                      value={dexterityForm[item.field] ?? ""}
                        onChange={e => handleDexterityChange(item.field, e.target.value)}
                        className="w-24"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 pt-4">
          {/* Show error if required fields are missing */}
          {Object.keys(formErrors).length > 0 && (
            <div className="w-full text-red-600 text-sm mb-2 text-right">
              Please fill all required fields.
            </div>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSaveEmployee(isEdit)}>
            {isEdit ? "Update Employee" : "Save Employee"}
          </Button>
        </div>
      </div>
    )
})

export default function TrainingDashboard() {
  const [searchEmpNo, setSearchEmpNo] = useState("")
  const [searchResult, setSearchResult] = useState<Employee | null>(null)
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false)
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false)
  const [moduleStatuses, setModuleStatuses] = useState(
    trainingModules.reduce((acc, module) => ({ ...acc, [module.title]: "pending" }), {}) as Record<string, string>,
  )
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [trainingRecords, setTrainingRecords] = useState<Array<{id?: number, date: string, training_program: string, duration: string}>>(
    Array.from({ length: 5 }, () => ({ date: '', training_program: '', duration: '' }))
  );
  const [ojtRecords, setOjtRecords] = useState<Array<{id?: number, product_process: string, machine_operations: string, quality_check_points: string, secondary_operations: string, handling: string, packing_labeling: string, others: string}>>(
    Array.from({ length: 1 }, () => ({ product_process: '', machine_operations: '', quality_check_points: '', secondary_operations: '', handling: '', packing_labeling: '', others: '' }))
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [form, setForm] = useState<Record<string, string>>({
    emp_no: "",
    name: "",
    gender: "",
    dob: "",
    age: "",
    doj: "",
    dol: "",
    plant: "",
    area_of_work: "",
    dept: "",
    category: "",
    batch_no: "",
    training_days: "0",
    sl1_marks: "0",
    sl2_marks: "0",
    sl2_ojt: "",
    after_ojt_area_of_work: "",
    overall_percent: "0.0",
    skill_level: "beginner",
    remarks: "",
    sl1_status: "pending",
    sl2_status: "pending",
    sl3_status: "pending",
    supervisor_name: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string>("");

  // Dexterity Assessment form state
  const initialDexterityForm: DexterityFormType = {
    test_1s_2s: '',
    test_1s_2s_ball: '',
    memory_test: '',
    mind_hand_coordination: '',
    nerve_stability: '',
    material_identification: '',
    pick_place_sequence: '',
    pick_right_material: '',
    visual_inspection: '',
    defect_identification: '',
    written_test: '',
    insert_loading_1: '',
    insert_loading_2: '',
    safety_test: '',
    painting: '',
    screw_assembly: '',
    air_cleaner_assembly: '',
    msa_test: '',
    deflashing: '',
  };
  const [dexterityForm, setDexterityForm] = useState<DexterityFormType>(initialDexterityForm);
  const [dexterityError, setDexterityError] = useState('');

  const requiredFields = [
    "emp_no",
    "name",
    "gender",
    "dob",
    "doj",
    "plant",
    "area_of_work",
    "dept",
    "category",
  ]

  const validateForm = (isEditing: boolean) => {
    const errors: Record<string, string> = {}
    // Only validate required fields for new employees, not updates
    if (!isEditing) {
      requiredFields.forEach((field) => {
        if (!form[field as keyof typeof form]) {
          errors[field] = ""  // Empty string instead of validation message
        }
      })
    }
    return errors
  }

  const handleFormChange = useCallback((field: string, value: string) => {
    // Auto-calculate age when DOB changes
    if (field === 'dob' && value) {
      const today = new Date()
      const birthDate = new Date(value)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      const calculatedAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
        ? (age - 1).toString() 
        : age.toString()
      
      // Update both DOB and age in a single setForm call
      setForm((prev) => ({ 
        ...prev, 
        [field]: value,
        age: calculatedAge
      }))
    } else {
      // Regular field update
      setForm((prev) => ({ ...prev, [field]: value }))
    }
    
    setFormErrors((prev) => ({ ...prev, [field]: "" }))
  }, [])

  const handlePhotoSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      
      setSelectedPhoto(file)
      setError('')
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const populateFormForEdit = useCallback((employee: Employee) => {
    setForm({
      emp_no: employee.emp_no ?? '',
      name: employee.name ?? '',
      gender: employee.gender ?? '',
      dob: employee.dob ?? '',
      age: employee.age != null ? employee.age.toString() : '',
      doj: employee.doj ?? '',
      dol: employee.dol ?? '',
      plant: employee.plant ?? '',
      area_of_work: employee.area_of_work ?? '',
      dept: employee.dept ?? '',
      category: employee.category ?? '',
      batch_no: employee.batch_no ?? '',
      training_days: employee.training_days != null ? employee.training_days.toString() : '',
      sl1_marks: employee.sl1_marks != null ? employee.sl1_marks.toString() : '',
      sl2_marks: employee.sl2_marks != null ? employee.sl2_marks.toString() : '',
      sl2_ojt: employee.sl2_ojt ?? '',
      after_ojt_area_of_work: employee.after_ojt_area_of_work ?? '',
      overall_percent: employee.overall_percent != null ? employee.overall_percent.toString() : '',
      skill_level: employee.skill_level ?? '',
      remarks: employee.remarks ?? '',
      sl1_status: employee.sl1_status ?? '',
      sl2_status: employee.sl2_status ?? '',
      sl3_status: employee.sl3_status ?? '',
      supervisor_name: employee.supervisor_name ?? '',
    });
    if (employee.training_modules) {
      setModuleStatuses(
        employee.training_modules.reduce((acc, tm) => {
          acc[tm.module.title] = tm.status;
          return acc;
        }, {} as Record<string, string>)
      );
    }
    setFormErrors({});
  }, []);

  const handleSaveEmployee = async (isEdit: boolean) => {
    const errors = validateForm(isEdit)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }
    
    try {
      let employeeId;
      let empNoToSearch;
      if (isEdit && searchResult) {
        await updateEmployeeWithPhoto(searchResult.id, form, selectedPhoto || undefined);
        employeeId = searchResult.id;
        empNoToSearch = searchResult.emp_no;
      } else {
        const newEmp = await addEmployeeWithPhoto(form, selectedPhoto || undefined);
        employeeId = newEmp.id;
        empNoToSearch = newEmp.emp_no;
        // Auto-create dexterity assessment for new employee
        try {
          const assessmentData = {
            employee: employeeId,
            ...Object.fromEntries(
              Object.entries(dexterityForm).map(([k, v]) => {
                if (v === '' || v === null || v === undefined) return [k, null];
                const num = Number(v);
                return [k, isNaN(num) ? null : num];
              })
            ),
          };
          await createDexterityAssessment(assessmentData);
        } catch (err) {
          setError('Failed to save dexterity assessment');
          console.error(err);
        }
        // Auto-create OJT records for new employee
        for (const rec of ojtRecords) {
          if (rec.product_process) {
            try {
              await createOjtRecord({ ...rec, employee: employeeId });
            } catch (err) {
              setError('Failed to save OJT record');
              console.error(err);
            }
          }
        }
        // Auto-create training records for new employee
        for (const rec of trainingRecords) {
          if (rec.date && rec.training_program && rec.duration) {
            try {
              await createTrainingRecord({ ...rec, employee: employeeId });
            } catch (err) {
              setError('Failed to save training record');
              console.error(err);
            }
          }
        }
      }

      // Save dexterity assessment
      try {
        const assessmentData = {
          employee: employeeId,
          ...Object.fromEntries(
            Object.entries(dexterityForm).map(([k, v]) => {
              if (v === '' || v === null || v === undefined) return [k, null];
              const num = Number(v);
              return [k, isNaN(num) ? null : num];
            })
          ),
        };
        if (
          isEdit &&
          searchResult &&
          Array.isArray(searchResult.dexterity_assessments) &&
          searchResult.dexterity_assessments.length > 0
        ) {
          const latestAssessment = searchResult.dexterity_assessments[0];
          await updateDexterityAssessment(latestAssessment.id, assessmentData);
        } else {
          await createDexterityAssessment(assessmentData);
        }
      } catch (err) {
        setError('Failed to save dexterity assessment');
        console.error(err);
      }

      // Upsert OJT records
      for (const rec of ojtRecords) {
        if (rec.product_process) { // Only save if Product/Process is filled
          if (rec.id) {
            await updateOjtRecord(rec.id, { ...rec, employee: employeeId });
          } else {
            await createOjtRecord({ ...rec, employee: employeeId });
          }
        }
      }

      // Upsert training records
      for (const rec of trainingRecords) {
        if (rec.date && rec.training_program && rec.duration) { // Only save if filled
          if (rec.id) {
            await updateTrainingRecord(rec.id, { ...rec, employee: employeeId });
          } else {
            await createTrainingRecord({ ...rec, employee: employeeId });
          }
        }
      }

      // Refresh main view
      setDexterityForm(initialDexterityForm);
      if (isEdit) {
        setEditEmployeeOpen(false);
      } else {
        setAddEmployeeOpen(false);
      }
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setForm({
        emp_no: "",
        name: "",
        gender: "",
        dob: "",
        age: "",
        doj: "",
        dol: "",
        plant: "",
        area_of_work: "",
        dept: "",
        category: "",
        batch_no: "",
        training_days: "0",
        sl1_marks: "0",
        sl2_marks: "0",
        sl2_ojt: "",
        after_ojt_area_of_work: "",
        overall_percent: "0.0",
        skill_level: "beginner",
        remarks: "",
        sl1_status: "pending",
        sl2_status: "pending",
        sl3_status: "pending",
        supervisor_name: "",
      });
      setFormErrors({});

      if (empNoToSearch) {
        const updatedEmployee = await searchEmployee(empNoToSearch);
        setSearchResult(updatedEmployee);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save employee');
    }
  };

  const handleSearch = async () => {
    if (!searchEmpNo) {
      setError("Please enter an employee number to search.");
      return;
    }
    try {
      console.log("Searching for EMP NO:", searchEmpNo);
      const result = await searchEmployee(searchEmpNo);
      console.log("Search result:", result);
      setSearchResult(result);
      setOjtRecords(
        result.ojt_records && result.ojt_records.length > 0
          ? [
              ...result.ojt_records.map((ojt: Record<string, any>) => ({
                id: ojt.id,
                product_process: ojt.product_process,
                machine_operations: ojt.machine_operations,
                quality_check_points: ojt.quality_check_points,
                secondary_operations: ojt.secondary_operations,
                handling: ojt.handling,
                packing_labeling: ojt.packing_labeling,
                others: ojt.others,
              })),
              ...Array.from({ length: Math.max(1, 4 - result.ojt_records.length) }, () => ({
                product_process: '',
                machine_operations: '',
                quality_check_points: '',
                secondary_operations: '',
                handling: '',
                packing_labeling: '',
                others: '',
              })),
            ]
          : Array.from({ length: 1 }, () => ({
              product_process: '',
              machine_operations: '',
              quality_check_points: '',
              secondary_operations: '',
              handling: '',
              packing_labeling: '',
              others: '',
            }))
      );
      setTrainingRecords(
        result.training_records && result.training_records.length > 0
          ? [
              ...result.training_records.map(tr => ({
                id: tr.id,
                date: tr.date,
                training_program: tr.training_program,
                duration: tr.duration,
              })),
              ...Array.from({ length: Math.max(0, 5 - result.training_records.length) }, () => ({
                date: '',
                training_program: '',
                duration: '',
              })),
            ]
          : Array.from({ length: 5 }, () => ({
              date: '',
              training_program: '',
              duration: '',
            }))
      );
    } catch (error) {
      let errorMessage = "Error searching for employee";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setSearchResult(null);
    }
  }

  const handleModuleAction = async (moduleTitle: string, action: "accept" | "deny") => {
    setModuleStatuses((prev) => ({
      ...prev,
      [moduleTitle]: action === "accept" ? "accepted" : "denied",
    }));

    if (!searchResult) return;
    // Find the module object in searchResult.training_modules by title
    const tm = searchResult.training_modules.find((m) => m.module.title === moduleTitle);
    if (!tm) return;
    const module_id = tm.module.id;
    const status = action === "accept" ? "accepted" : "denied";
    let completed_date: string | null = null;
    if (status === "accepted") {
      // Format today's date as YYYY-MM-DD
      const today = new Date();
      completed_date = today.toISOString().slice(0, 10);
    }
    try {
      await updateEmployeeTrainingModulesBulk(searchResult.id, [
        { module_id, status, completed_date },
      ]);
      // Refresh employee data
      const updated = await searchEmployee(searchResult.emp_no);
      setSearchResult(updated);
    } catch (err) {
      setError('Failed to update training module status');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "denied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const handleAddEmployeeOpenChange = (open: boolean) => {
    setAddEmployeeOpen(open);
    if (!open) {
      setForm({
        emp_no: "",
        name: "",
        gender: "",
        dob: "",
        age: "",
        doj: "",
        dol: "",
        plant: "",
        area_of_work: "",
        dept: "",
        category: "",
        batch_no: "",
        training_days: "0",
        sl1_marks: "0",
        sl2_marks: "0",
        sl2_ojt: "",
        after_ojt_area_of_work: "",
        overall_percent: "0.0",
        skill_level: "beginner",
        remarks: "",
        sl1_status: "pending",
        sl2_status: "pending",
        sl3_status: "pending",
        supervisor_name: "",
      });
      setFormErrors({});
      setSelectedPhoto(null);
      setPhotoPreview(null);
    }
  };

  const handleEditEmployeeOpenChange = (open: boolean) => {
    setEditEmployeeOpen(open);
    if (open && searchResult && searchResult.ojt_records) {
      setOjtRecords(
        searchResult.ojt_records.length > 0
          ? [
              ...searchResult.ojt_records.map((ojt: Record<string, any>) => ({
                id: ojt.id,
                product_process: ojt.product_process,
                machine_operations: ojt.machine_operations,
                quality_check_points: ojt.quality_check_points,
                secondary_operations: ojt.secondary_operations,
                handling: ojt.handling,
                packing_labeling: ojt.packing_labeling,
                others: ojt.others,
              })),
              ...Array.from({ length: Math.max(1, 4 - searchResult.ojt_records.length) }, () => ({
                product_process: '',
                machine_operations: '',
                quality_check_points: '',
                secondary_operations: '',
                handling: '',
                packing_labeling: '',
                others: '',
              })),
            ]
          : Array.from({ length: 1 }, () => ({
              product_process: '',
              machine_operations: '',
              quality_check_points: '',
              secondary_operations: '',
              handling: '',
              packing_labeling: '',
              others: '',
            }))
      );
    }
    if (!open) {
      setForm({
        emp_no: "",
        name: "",
        gender: "",
        dob: "",
        age: "",
        doj: "",
        dol: "",
        plant: "",
        area_of_work: "",
        dept: "",
        category: "",
        batch_no: "",
        training_days: "0",
        sl1_marks: "0",
        sl2_marks: "0",
        sl2_ojt: "",
        after_ojt_area_of_work: "",
        overall_percent: "0.0",
        skill_level: "beginner",
        remarks: "",
        sl1_status: "pending",
        sl2_status: "pending",
        sl3_status: "pending",
        supervisor_name: "",
      });
      setFormErrors({});
      setSelectedPhoto(null);
      setPhotoPreview(null);
    }
  };

  const handleDexterityChange = (field: string, value: string) => {
    setDexterityForm((prev: DexterityFormType) => ({ ...prev, [field]: value }));
  };

  const handleSaveDexterityAssessment = async () => {
    if (!searchResult) return;
    try {
      const assessmentData = Object.fromEntries(
        Object.entries(dexterityForm).map(([k, v]) => {
          if (v === '' || v === null || v === undefined) return [k, null];
          const num = Number(v);
          return [k, isNaN(num) ? null : num];
        })
      );
      if (searchResult.dexterity_assessments && searchResult.dexterity_assessments.length > 0) {
        // Update existing assessment
        const latestAssessment = searchResult.dexterity_assessments[0];
        try {
          await updateDexterityAssessment(latestAssessment.id, {
            employee: searchResult.id,
            ...assessmentData,
          });
        } catch (apiErr: any) {
          let msg = 'Failed to update dexterity assessment';
          if (apiErr && apiErr.response) {
            msg += ': ' + (await apiErr.response.text());
          }
          setError(msg);
          console.error(msg, apiErr);
          return;
        }
      } else {
        // Create new assessment
        try {
          await createDexterityAssessment({
            employee: searchResult.id,
            ...assessmentData,
          });
        } catch (apiErr: any) {
          let msg = 'Failed to create dexterity assessment';
          if (apiErr && apiErr.response) {
            msg += ': ' + (await apiErr.response.text());
          }
          setError(msg);
          console.error(msg, apiErr);
          return;
        }
      }
      setDexterityForm(initialDexterityForm);
      setError('');
      // Refresh employee data
      const updatedEmployee = await searchEmployee(searchResult.emp_no);
      setSearchResult(updatedEmployee);
    } catch (err) {
      setError('Failed to save dexterity assessment');
      console.error(err);
    }
  };

  useEffect(() => {
    if (editEmployeeOpen && searchResult) {
      populateFormForEdit(searchResult);
      // Populate dexterityForm with latest assessment if available
      if (searchResult.dexterity_assessments && searchResult.dexterity_assessments.length > 0) {
        const latest = searchResult.dexterity_assessments[0];
        setDexterityForm({
          test_1s_2s: latest.test_1s_2s?.toString() ?? '',
          test_1s_2s_ball: latest.test_1s_2s_ball?.toString() ?? '',
          memory_test: latest.memory_test?.toString() ?? '',
          mind_hand_coordination: latest.mind_hand_coordination?.toString() ?? '',
          nerve_stability: latest.nerve_stability?.toString() ?? '',
          material_identification: latest.material_identification?.toString() ?? '',
          pick_place_sequence: latest.pick_place_sequence?.toString() ?? '',
          pick_right_material: latest.pick_right_material?.toString() ?? '',
          visual_inspection: latest.visual_inspection?.toString() ?? '',
          defect_identification: latest.defect_identification?.toString() ?? '',
          written_test: latest.written_test?.toString() ?? '',
          insert_loading_1: latest.insert_loading_1?.toString() ?? '',
          insert_loading_2: latest.insert_loading_2?.toString() ?? '',
          safety_test: latest.safety_test?.toString() ?? '',
          painting: latest.painting?.toString() ?? '',
          screw_assembly: latest.screw_assembly?.toString() ?? '',
          air_cleaner_assembly: latest.air_cleaner_assembly?.toString() ?? '',
          msa_test: latest.msa_test?.toString() ?? '',
          deflashing: latest.deflashing?.toString() ?? '',
        });
      } else {
        setDexterityForm(initialDexterityForm);
      }
    }
    if (!editEmployeeOpen) {
      setDexterityForm(initialDexterityForm);
    }
  }, [editEmployeeOpen, searchResult]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/images/pricol-logo.png" alt="Pricol Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Training Management System</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/*
            <Dialog open={addEmployeeOpen} onOpenChange={handleAddEmployeeOpenChange}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Enter employee details and training information</DialogDescription>
                </DialogHeader>
                <EmployeeForm
                  isEdit={false}
                  onClose={() => setAddEmployeeOpen(false)}
                  initialForm={form}
                  initialDexterityForm={dexterityForm}
                  initialModuleStatuses={moduleStatuses}
                  searchResult={searchResult}
                  initialPhotoPreview={photoPreview}
                  initialSelectedPhoto={selectedPhoto}
                  onSave={handleSearch}
                  setEditEmployeeOpen={setEditEmployeeOpen}
                  setAddEmployeeOpen={setAddEmployeeOpen}
                  setSearchResult={setSearchResult}
                />
              </DialogContent>
            </Dialog>
            */}

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter EMP NO to search"
                value={searchEmpNo}
                onChange={(e) => setSearchEmpNo(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Employee Details Section - Always visible below navbar */}
      {searchResult && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={searchResult?.photo || "/placeholder.svg"} />
                  <AvatarFallback>
                    {(searchResult?.name ?? "")
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("") || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{searchResult?.name}</h2>
                  <p className="text-sm text-gray-500">
                    EMP NO: {searchResult?.emp_no} | {searchResult?.area_of_work} - {searchResult?.category}
                  </p>
                </div>
              </div>
              <Dialog open={editEmployeeOpen} onOpenChange={handleEditEmployeeOpenChange}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                    onClick={() => setEditEmployeeOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Employee Details</DialogTitle>
                    <DialogDescription>Update employee information and training records</DialogDescription>
                  </DialogHeader>
                  <EmployeeForm
                    isEdit={true}
                    onClose={() => setEditEmployeeOpen(false)}
                    initialForm={form}
                    initialDexterityForm={dexterityForm}
                    initialModuleStatuses={moduleStatuses}
                    searchResult={searchResult}
                    initialPhotoPreview={photoPreview}
                    initialSelectedPhoto={selectedPhoto}
                    onSave={handleSearch}
                    setEditEmployeeOpen={setEditEmployeeOpen}
                    setAddEmployeeOpen={setAddEmployeeOpen}
                    setSearchResult={setSearchResult}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Plant</p>
                <p className="text-sm font-semibold text-blue-900">{searchResult?.plant}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-600 font-medium">Training Days</p>
                <p className="text-sm font-semibold text-green-900">{searchResult?.training_days}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-purple-600 font-medium">Overall %</p>
                <p className="text-sm font-semibold text-purple-900">{searchResult?.overall_percent}%</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-600 font-medium">Skill Level</p>
                <p className="text-sm font-semibold text-orange-900">{searchResult?.skill_level}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">DOJ</p>
                <p className="text-sm font-semibold text-gray-900">{searchResult?.doj}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-600 font-medium">Batch</p>
                <p className="text-sm font-semibold text-red-900">{searchResult?.batch_no}</p>
              </div>
            </div>

            {/* Remarks Section */}
            {searchResult.remarks && (
              <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-600 font-medium mb-1">Remarks</p>
                <p className="text-sm text-yellow-900">{searchResult.remarks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6">
        {searchResult ? (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Training Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">S No</th>
                        <th className="border border-gray-300 p-2">Title</th>
                        <th className="border border-gray-300 p-2">Expert</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Completed Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResult.training_modules?.map((tm) => (
                        <tr key={tm.id ?? tm.module.id}>
                          <td className="border border-gray-300 p-2">{tm.module.s_no}</td>
                          <td className="border border-gray-300 p-2">{tm.module.title}</td>
                          <td className="border border-gray-300 p-2">{tm.module.expert}</td>
                          <td className="border border-gray-300 p-2">{tm.status}</td>
                          <td className="border border-gray-300 p-2">{tm.completed_date || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Training Records */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Program</th>
                        <th className="border border-gray-300 p-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResult.training_records?.map((tr: Record<string, any>) => (
                        <tr key={tr.id}>
                          <td className="border border-gray-300 p-2">{tr.date}</td>
                          <td className="border border-gray-300 p-2">{tr.training_program}</td>
                          <td className="border border-gray-300 p-2">{tr.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* OJT Records */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">On Job Training Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Product/Process</th>
                        <th className="border border-gray-300 p-2">Machine Operations</th>
                        <th className="border border-gray-300 p-2">Quality Check Points</th>
                        <th className="border border-gray-300 p-2">Secondary Operations</th>
                        <th className="border border-gray-300 p-2">Handling</th>
                        <th className="border border-gray-300 p-2">Packing & Labeling</th>
                        <th className="border border-gray-300 p-2">Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ojtRecords
                        ?.filter(
                          (ojt: Record<string, any>) =>
                            ojt.product_process ||
                            ojt.machine_operations === "signed" ||
                            ojt.quality_check_points === "signed" ||
                            ojt.secondary_operations === "signed" ||
                            ojt.handling === "signed" ||
                            ojt.packing_labeling === "signed" ||
                            ojt.others === "signed"
                        )
                        .map((ojt: Record<string, any>, idx: number) => (
                          <tr key={ojt.id ?? idx}>
                            <td className="border border-gray-300 p-2">{ojt.product_process}</td>
                            <td className="border border-gray-300 p-2">{ojt.machine_operations === "signed" ? "signed" : ""}</td>
                            <td className="border border-gray-300 p-2">{ojt.quality_check_points === "signed" ? "signed" : ""}</td>
                            <td className="border border-gray-300 p-2">{ojt.secondary_operations === "signed" ? "signed" : ""}</td>
                            <td className="border border-gray-300 p-2">{ojt.handling === "signed" ? "signed" : ""}</td>
                            <td className="border border-gray-300 p-2">{ojt.packing_labeling === "signed" ? "signed" : ""}</td>
                            <td className="border border-gray-300 p-2">{ojt.others === "signed" ? "signed" : ""}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Dexterity Assessments */}
            {searchResult && searchResult.dexterity_assessments && searchResult.dexterity_assessments.length > 0 && (
              <Card className="mt-6">
              <CardHeader>
                  <CardTitle className="text-lg">Dexterity Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">Field</th>
                          <th className="border border-gray-300 p-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                        {(() => {
                          const latest = searchResult.dexterity_assessments[0];
                          const fields = [
                            { label: '1S & 2S test', value: latest.test_1s_2s },
                            { label: '1S & 2S test (Ball)', value: latest.test_1s_2s_ball },
                            { label: 'Memory test', value: latest.memory_test },
                            { label: 'Mind & hand co-ordination', value: latest.mind_hand_coordination },
                            { label: 'Nerve stability testing', value: latest.nerve_stability },
                            { label: 'Material identification', value: latest.material_identification },
                            { label: 'Pick & Place material in sequence', value: latest.pick_place_sequence },
                            { label: 'Pick right material with right quantity', value: latest.pick_right_material },
                            { label: 'Visual inspection', value: latest.visual_inspection },
                            { label: 'Defect identification', value: latest.defect_identification },
                            { label: 'Written test', value: latest.written_test },
                            { label: 'Insert loading - 1', value: latest.insert_loading_1 },
                            { label: 'Insert loading - 2', value: latest.insert_loading_2 },
                            { label: 'Safety test', value: latest.safety_test },
                            { label: 'Painting', value: latest.painting },
                            { label: 'Screw assembly', value: latest.screw_assembly },
                            { label: 'Air cleaner assembly', value: latest.air_cleaner_assembly },
                            { label: 'MSA TEST', value: latest.msa_test },
                            { label: 'Deflashing', value: latest.deflashing },
                            { label: 'Basic Total', value: latest.basic_skills_total },
                            { label: 'Advanced Total', value: latest.advanced_skills_total },
                            { label: 'Overall Score', value: latest.overall_score },
                            { label: 'Created At', value: latest.created_at ? latest.created_at.split('T')[0] : '-' },
                            { label: 'Updated At', value: latest.updated_at ? latest.updated_at.split('T')[0] : '-' },
                          ];
                          return fields.map((f, idx) => (
                            <tr key={idx}>
                              <td className="border border-gray-300 p-2">{f.label}</td>
                              <td className="border border-gray-300 p-2">{f.value ?? '-'}</td>
                        </tr>
                          ));
                        })()}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <img src="/images/pricol-logo.png" alt="Pricol Logo" className="h-16 w-auto mx-auto mb-4 opacity-60" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Training Management Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Use the navigation above to add new employees or search existing records
            </p>
          </div>
        )}
      </main>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
