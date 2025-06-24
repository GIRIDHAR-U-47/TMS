"use client"

import { useState } from "react"
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
import { searchEmployee, addEmployee, updateEmployee } from "../lib/api"

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
  after_ojt_dept: string;
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
    overall_score: number;
    // Add other fields as needed
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

export default function TrainingDashboard() {
  const [searchEmpNo, setSearchEmpNo] = useState("")
  const [searchResult, setSearchResult] = useState<Employee | null>(null)
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false)
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false)
  const [moduleStatuses, setModuleStatuses] = useState(
    trainingModules.reduce((acc, module) => ({ ...acc, [module.title]: "pending" }), {}) as Record<string, string>,
  )
  const [showPerformanceRecord, setShowPerformanceRecord] = useState(false)

  const handleSearch = async () => {
    try {
      const result = await searchEmployee(searchEmpNo);
      console.log("Search result:", result);
      setSearchResult(result);
    } catch (error) {
      console.error("Error searching for employee:", error);
      setSearchResult(null);
    }
  }

  const handleModuleAction = (module: string, action: "accept" | "deny") => {
    setModuleStatuses((prev) => ({
      ...prev,
      [module]: action === "accept" ? "accepted" : "denied",
    }))
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

  const EmployeeForm = ({ isEdit = false, onClose }: { isEdit: boolean; onClose: () => void }) => (
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
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan
                </Button>
              </div>
            </div>
            <Avatar className="h-20 w-20">
              <AvatarImage src={isEdit ? searchResult?.photo || undefined : "/placeholder.svg?height=80&width=80"} />
              <AvatarFallback>
                {searchResult?.name
                  ? searchResult.name.split(" ").map((n) => n[0]).join("")
                  : "NA"}
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
            <Input id="empNo" placeholder="Enter employee number" defaultValue={isEdit ? searchResult?.emp_no || "" : ""} />
          </div>
          <div>
            <Label htmlFor="name">NAME *</Label>
            <Input id="name" placeholder="Enter full name" defaultValue={isEdit ? searchResult?.name : ""} />
          </div>
          <div>
            <Label htmlFor="gender">GENDER *</Label>
            <Select defaultValue={isEdit ? searchResult?.gender?.toLowerCase() : ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dob">DOB *</Label>
            <Input id="dob" type="date" defaultValue={isEdit ? searchResult?.dob : ""} />
          </div>
          <div>
            <Label htmlFor="age">AGE</Label>
            <Input id="age" type="number" placeholder="Age" defaultValue={isEdit ? searchResult?.age : ""} />
          </div>
          <div>
            <Label htmlFor="doj">DOJ *</Label>
            <Input id="doj" type="date" defaultValue={isEdit ? searchResult?.doj : ""} />
          </div>
          <div>
            <Label htmlFor="dol">DOL</Label>
            <Input id="dol" type="date" defaultValue={isEdit ? searchResult?.dol ?? "" : ""} />
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
            <Select>
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
            <Select>
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
            <Select>
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
            <Select defaultValue={isEdit ? searchResult?.plant?.toLowerCase().replace(" ", "-") : ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plant-a">Plant A</SelectItem>
                <SelectItem value="plant-b">Plant B</SelectItem>
                <SelectItem value="plant-c">Plant C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="areaOfWork">AREA OF WORK *</Label>
            <Input
              id="areaOfWork"
              placeholder="Enter area of work"
              defaultValue={isEdit ? searchResult?.area_of_work : ""}
            />
          </div>
          <div>
            <Label htmlFor="dept">DEPT *</Label>
            <Select defaultValue={isEdit ? searchResult?.dept?.toLowerCase() : ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">CATEGORY *</Label>
            <Select defaultValue={isEdit ? searchResult?.category?.toLowerCase() : ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="batchNo">BATCH NO</Label>
            <Input id="batchNo" placeholder="Enter batch number" defaultValue={isEdit ? (searchResult?.batch_no ?? '') : ''} />
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
              defaultValue={isEdit ? searchResult?.training_days : ""}
            />
          </div>
          <div>
            <Label htmlFor="sl1Marks">SL1 MARKS</Label>
            <Input
              id="sl1Marks"
              type="number"
              placeholder="SL1 marks"
              defaultValue={isEdit ? searchResult?.sl1_marks : ""}
            />
          </div>
          <div>
            <Label htmlFor="sl2Marks">SL2 MARKS</Label>
            <Input
              id="sl2Marks"
              type="number"
              placeholder="SL2 marks"
              defaultValue={isEdit ? searchResult?.sl2_marks : ""}
            />
          </div>
          <div>
            <Label htmlFor="sl2Ojt">SL2 OJT</Label>
            <Input id="sl2Ojt" placeholder="SL2 OJT status" defaultValue={isEdit ? searchResult?.sl2_ojt : ""} />
          </div>
          <div>
            <Label htmlFor="afterOjtDept">AFTER OJT DEPT</Label>
            <Input
              id="afterOjtDept"
              placeholder="Department after OJT"
              defaultValue={isEdit ? searchResult?.after_ojt_dept : ""}
            />
          </div>
          <div>
            <Label htmlFor="overallPercent">OVERALL %</Label>
            <Input
              id="overallPercent"
              type="number"
              step="0.1"
              placeholder="Overall percentage"
              defaultValue={isEdit ? searchResult?.overall_percent : ""}
            />
          </div>
          <div>
            <Label htmlFor="skillLevel">SKILL LEVEL</Label>
            <Select defaultValue={isEdit ? searchResult?.skill_level?.toLowerCase() : ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
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
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <Input type="date" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Training program name" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Duration" className="h-8" />
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
                {[...Array(4)].map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Product/Process" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Machine operations" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Quality check points" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Secondary operations" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Handling" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Packing & Labeling" className="h-8" />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input placeholder="Others" className="h-8" />
                    </td>
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
            defaultValue={isEdit ? searchResult?.remarks : ""}
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
          <CardDescription>Basic and Advanced skill assessment scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Skills */}
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">Basic Skills</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium bg-gray-100 p-2 rounded">
                  <span>Test</span>
                  <span>Criteria</span>
                  <span>Avg.</span>
                  <span>Score</span>
                </div>
                {[
                  { test: "1S & 2S test", criteria: "1min", avg: "5" },
                  { test: "1S & 2S test (Ball)", criteria: "30 sec", avg: "5" },
                  { test: "Memory test", criteria: "30 sec", avg: "5" },
                  { test: "Mind & hand co-ordination", criteria: "3min", avg: "5" },
                  {
                    test: "Nerve stability testing 3 touches allowed",
                    criteria: "L to R / R to L",
                    avg: "5",
                  },
                  { test: "Material identification", criteria: "1 min", avg: "5" },
                  { test: "Pick & Place material in sequence", criteria: "3 min", avg: "10" },
                  { test: "Pick right material with right quantity", criteria: "1 min", avg: "5" },
                  { test: "Visual inspection", criteria: "L1-5min / L2-5min / L3-5min", avg: "5" },
                  { test: "Defect identification", criteria: "12p - 5min", avg: "15" },
                  { test: "Written test", criteria: "15mins", avg: "20" },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 text-xs p-2 border-b">
                    <span className="text-gray-700">{item.test}</span>
                    <span>{item.criteria}</span>
                    <span>{item.avg}</span>
                    <Input className="h-6 text-xs" placeholder="Score" />
                  </div>
                ))}
                <div className="grid grid-cols-4 gap-2 text-sm font-medium bg-blue-50 p-2 rounded">
                  <span>Basic skill - Total score</span>
                  <span></span>
                  <span>Overall</span>
                  <Input className="h-8" placeholder="Total" />
                </div>
              </div>
            </div>

            {/* Advanced Skills */}
            <div>
              <h4 className="font-semibold mb-3 text-green-600">Advanced Skills</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium bg-gray-100 p-2 rounded">
                  <span>Test</span>
                  <span>Criteria</span>
                  <span>Avg.</span>
                  <span>Score</span>
                </div>
                {[
                  { test: "Insert loading - 1", criteria: "A1/2mins / A2/2mins", avg: "10" },
                  { test: "Insert loading - 2", criteria: "A1/9sec / A2/9sec", avg: "10" },
                  { test: "Safety test", criteria: "A1/30sec / A2/30sec", avg: "15" },
                  { test: "Painting", criteria: "A1/30sec / A2/30sec", avg: "15" },
                  { test: "Screw assembly", criteria: "A1/1min / A2/1min", avg: "10" },
                  { test: "Air cleaner assembly", criteria: "A1/40sec / A2/40sec", avg: "10" },
                  { test: "MSA TEST", criteria: "A1/1min / A2/1min", avg: "15" },
                  { test: "Deflashing", criteria: "A1/45sec / A2/45sec", avg: "15" },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 text-xs p-2 border-b">
                    <span className="text-gray-700">{item.test}</span>
                    <span>{item.criteria}</span>
                    <span>{item.avg}</span>
                    <Input className="h-6 text-xs" placeholder="Score" />
                  </div>
                ))}
                <div className="grid grid-cols-4 gap-2 text-sm font-medium bg-green-50 p-2 rounded">
                  <span>Advanced skill - Total score</span>
                  <span></span>
                  <span></span>
                  <Input className="h-8" placeholder="Total" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold mb-3 text-purple-600">Overall Assessment</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-purple-50 p-4 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Basic Skill Total Score</Label>
              <Input className="mt-1" placeholder="Basic total" />
            </div>
            <div>
              <Label className="text-sm font-medium">Advanced Skill Total Score</Label>
              <Input className="mt-1" placeholder="Advanced total" />
            </div>
            <div>
              <Label className="text-sm font-medium text-purple-700">Overall Score</Label>
              <Input className="mt-1 font-bold border-purple-300" placeholder="Overall score" />
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Observation Record */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Observation Record</CardTitle>
          <CardDescription>31-day performance monitoring and evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPerformanceRecord}
                onChange={(e) => setShowPerformanceRecord(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Show Performance Observation Record</span>
            </label>
          </div>

          {showPerformanceRecord && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="border border-gray-300 p-2 text-xs">Day</th>
                      <th className="border border-gray-300 p-2 text-xs">Description</th>
                      <th className="border border-gray-300 p-2 text-xs">S/U</th>
                      <th className="border border-gray-300 p-2 text-xs">Scope</th>
                      <th className="border border-gray-300 p-2 text-xs">Operation Name</th>
                      <th className="border border-gray-300 p-2 text-xs">Production</th>
                      <th className="border border-gray-300 p-2 text-xs">Wt</th>
                      <th className="border border-gray-300 p-2 text-xs">Qty</th>
                      <th className="border border-gray-300 p-2 text-xs">PRO-N</th>
                      <th className="border border-gray-300 p-2 text-xs">Perf-N</th>
                      <th className="border border-gray-300 p-2 text-xs">Final Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(31)].map((_, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-1 text-center text-sm font-medium">{index + 1}</td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Description" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="S/U" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Scope" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Operation" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Production" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Wt" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Qty" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="PRO-N" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Perf-N" />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="h-6 text-xs" placeholder="Score" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Approval Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Approved by Supervisor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive">
                        Deny
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Certified by Personnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive">
                        Deny
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">{isEdit ? "Update Employee" : "Save Employee"}</Button>
      </div>
    </div>
  )

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
            <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
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
                <EmployeeForm isEdit={false} onClose={() => setAddEmployeeOpen(false)} />
              </DialogContent>
            </Dialog>

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
                  <AvatarImage src={searchResult.photo || "/placeholder.svg"} />
                  <AvatarFallback>
                    {searchResult?.name
                      ? searchResult.name.split(" ").map((n) => n[0]).join("")
                      : "NA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{searchResult.name}</h2>
                  <p className="text-sm text-gray-500">
                    EMP NO: {searchResult.emp_no} | {searchResult.dept} - {searchResult.category}
                  </p>
                </div>
              </div>
              <Dialog open={editEmployeeOpen} onOpenChange={setEditEmployeeOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
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
                  <EmployeeForm isEdit={true} onClose={() => setEditEmployeeOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Plant</p>
                <p className="text-sm font-semibold text-blue-900">{searchResult.plant}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-600 font-medium">Training Days</p>
                <p className="text-sm font-semibold text-green-900">{searchResult.training_days}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-purple-600 font-medium">Overall %</p>
                <p className="text-sm font-semibold text-purple-900">{searchResult.overall_percent}%</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-600 font-medium">Skill Level</p>
                <p className="text-sm font-semibold text-orange-900">{searchResult.skill_level}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">DOJ</p>
                <p className="text-sm font-semibold text-gray-900">{searchResult.doj}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-600 font-medium">Batch</p>
                <p className="text-sm font-semibold text-red-900">{searchResult.batch_no}</p>
              </div>
            </div>
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
                        <tr key={tm.id}>
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
                      {searchResult.training_records?.map((tr) => (
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
                      {searchResult.ojt_records?.map((ojt) => (
                        <tr key={ojt.id}>
                          <td className="border border-gray-300 p-2">{ojt.product_process}</td>
                          <td className="border border-gray-300 p-2">{ojt.machine_operations}</td>
                          <td className="border border-gray-300 p-2">{ojt.quality_check_points}</td>
                          <td className="border border-gray-300 p-2">{ojt.secondary_operations}</td>
                          <td className="border border-gray-300 p-2">{ojt.handling}</td>
                          <td className="border border-gray-300 p-2">{ojt.packing_labeling}</td>
                          <td className="border border-gray-300 p-2">{ojt.others}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Dexterity Assessments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dexterity Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Overall Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResult.dexterity_assessments?.map((da) => (
                        <tr key={da.id}>
                          <td className="border border-gray-300 p-2">{da.id}</td>
                          <td className="border border-gray-300 p-2">{da.overall_score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Performance Records */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Day</th>
                        <th className="border border-gray-300 p-2">Description</th>
                        <th className="border border-gray-300 p-2">Final Score</th>
                        <th className="border border-gray-300 p-2">Supervisor Approved</th>
                        <th className="border border-gray-300 p-2">Personnel Certified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResult.performance_records?.map((pr) => (
                        <tr key={pr.id}>
                          <td className="border border-gray-300 p-2">{pr.day}</td>
                          <td className="border border-gray-300 p-2">{pr.description}</td>
                          <td className="border border-gray-300 p-2">{pr.final_score}</td>
                          <td className="border border-gray-300 p-2">{pr.supervisor_approved ? 'Yes' : 'No'}</td>
                          <td className="border border-gray-300 p-2">{pr.personnel_certified ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <img src="/images/pricol-logo.png" alt="Pricol Logo" className="h-16 w-auto mx-auto mb-4 opacity-60" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Training Management Dashboard</h2>
            <p className="text-gray-600 mb-6">
              Use the navigation above to add new employees or search existing records
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setAddEmployeeOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Records
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
