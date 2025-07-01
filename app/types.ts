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
  employee: number
  test_1s_2s: number | null
  test_1s_2s_ball: number | null
  memory_test: number | null
  mind_hand_coordination: number | null
  nerve_stability: number | null
  material_identification: number | null
  pick_place_sequence: number | null
  pick_right_material: number | null
  visual_inspection: number | null
  defect_identification: number | null
  written_test: number | null
  basic_skills_total: number | null
  insert_loading_1: number | null
  insert_loading_2: number | null
  safety_test: number | null
  painting: number | null
  screw_assembly: number | null
  air_cleaner_assembly: number | null
  msa_test: number | null
  deflashing: number | null
  advanced_skills_total: number | null
  overall_score: number | null
  created_at: string
  updated_at: string
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