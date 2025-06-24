// Types for the API data
export interface TrainingModule {
  id: number
  s_no: number
  title: string
  expert: string
}

export interface EmployeeTrainingModule {
  id: number
  module: TrainingModule
  status: 'pending' | 'accepted' | 'denied'
  completed_date: string | null
}

export interface TrainingRecord {
  id: number
  date: string
  program: string
  duration: string
}

export interface OJTRecord {
  id: number
  product_process: string
  machine_operations: string
  quality_check_points: string
  secondary_operations: string
  handling: string
  packing_labeling: string
  others: string
}

export interface DexterityAssessment {
  id: number
  test_name: string
  criteria: string
  average: number
  score: number | null
  type: 'basic' | 'advanced'
  overall_score: number
}

export interface PerformanceScores {
  attendance: number
  discipline: number
  productivity: number
  quality: number
  safety: number
  initiative: number
  knowledge: number
  teamwork: number
}

export interface PerformanceRecord {
  id: number
  day: number
  date: string
  shift: string
  scores: PerformanceScores
  description: string
  su_status: string
  scope: string
  operation_name: string
  production: string
  weight: string
  quantity: string
  pro_n: string
  perf_n: string
  final_score: string
  supervisor_approved: boolean
  personnel_certified: boolean
  created_at: string
  updated_at: string
  employee: number
}

export interface Employee {
  id: number
  emp_no: string
  name: string
  gender: string
  dob: string
  age: number
  doj: string
  dol: string | null
  plant: string
  area_of_work: string
  dept: string
  category: string
  batch_no: string
  training_days: number
  sl1_marks: number
  sl2_marks: number
  sl2_ojt: string
  after_ojt_dept: string
  overall_percent: number
  skill_level: string
  remarks: string
  photo: string | null
  sl1_status: string
  sl2_status: string
  sl3_status: string
  created_at: string
  updated_at: string
  training_modules: Array<{
    id: number
    module: {
      id: number
      s_no: number
      title: string
      expert: string
    }
    status: string
    completed_date: string | null
  }>
  training_records: Array<{
    id: number
    date: string
    training_program: string
    duration: string
    employee: number
  }>
  ojt_records: Array<{
    id: number
    product_process: string
    machine_operations: string
    quality_check_points: string
    secondary_operations: string
    handling: string
    packing_labeling: string
    others: string
    employee: number
  }>
  dexterity_assessments: Array<DexterityAssessment>
  performance_records: Array<PerformanceRecord>
} 