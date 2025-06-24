export interface Employee {
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
  after_ojt_dept: string;
  overall_percent: number;
  skill_level: string;
  remarks: string;
  photo: string;
  sl1_status: string;
  sl2_status: string;
  sl3_status: string;
  created_at: string;
  updated_at: string;
  training_modules: TrainingModule[];
  training_records: TrainingRecord[];
  ojt_records: OJTRecord[];
  dexterity_assessments: DexterityAssessment[];
  performance_records: PerformanceRecord[];
}

export interface TrainingModule {
  id: number;
  module: {
    id: number;
    s_no: number;
    title: string;
    expert: string;
  };
  status: string;
  completed_date: string | null;
}

export interface TrainingRecord {
  id: number;
  employee_id: number;
  module_id: number;
  score: number;
  date: string;
}

export interface OJTRecord {
  id: number;
  employee_id: number;
  department: string;
  start_date: string;
  end_date: string;
  supervisor: string;
}

export interface DexterityAssessment {
  id: number;
  employee_id: number;
  assessment_date: string;
  score: number;
  remarks: string;
}

export interface PerformanceRecord {
  id: number;
  employee_id: number;
  evaluation_date: string;
  performance_score: number;
  feedback: string;
}
export interface Employee {
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
  after_ojt_dept: string;
  overall_percent: number;
  skill_level: string;
  remarks: string;
  photo: string;
  sl1_status: string;
  sl2_status: string;
  sl3_status: string;
  created_at: string;
  updated_at: string;
  training_modules: TrainingModule[];
  training_records: TrainingRecord[];
  ojt_records: OJTRecord[];
  dexterity_assessments: DexterityAssessment[];
  performance_records: PerformanceRecord[];
}

export interface TrainingModule {
  id: number;
  module: {
    id: number;
    s_no: number;
    title: string;
    expert: string;
  };
  status: string;
  completed_date: string | null;
}

export interface TrainingRecord {
  id: number;
  employee_id: number;
  module_id: number;
  score: number;
  date: string;
}

export interface OJTRecord {
  id: number;
  employee_id: number;
  department: string;
  start_date: string;
  end_date: string;
  supervisor: string;
}

export interface DexterityAssessment {
  id: number;
  employee_id: number;
  assessment_date: string;
  result: string;
  comments: string;
}

export interface PerformanceRecord {
  id: number;
  employee_id: number;
  period_start: string;
  period_end: string;
  rating: string;
  feedback: string;
}
