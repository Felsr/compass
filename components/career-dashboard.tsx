"use client"
import { ROICalculator } from "./roi-calculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, BookOpen, Target } from "lucide-react"

export function CareerDashboard() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Career Investment Dashboard</h2>
        <p className="text-lg text-muted-foreground">
          Make informed decisions about your education and career investments with comprehensive analysis tools
        </p>
      </div>

      <Tabs defaultValue="roi-calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="roi-calculator" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            ROI Calculator
          </TabsTrigger>
          <TabsTrigger value="career-paths" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Career Paths
          </TabsTrigger>
          <TabsTrigger value="skills-tracker" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Skills Tracker
          </TabsTrigger>
          <TabsTrigger value="goal-planner" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Goal Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roi-calculator">
          <ROICalculator />
        </TabsContent>

        <TabsContent value="career-paths">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Career Path Analysis
              </CardTitle>
              <CardDescription>Explore different career trajectories and their potential outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Software Engineering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entry Level</span>
                        <span className="font-semibold">$75,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mid Level</span>
                        <span className="font-semibold">$120,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Senior Level</span>
                        <span className="font-semibold">$180,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Data Science</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entry Level</span>
                        <span className="font-semibold">$85,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mid Level</span>
                        <span className="font-semibold">$130,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Senior Level</span>
                        <span className="font-semibold">$200,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Product Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entry Level</span>
                        <span className="font-semibold">$90,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mid Level</span>
                        <span className="font-semibold">$140,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Senior Level</span>
                        <span className="font-semibold">$220,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills-tracker">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Skills Development Tracker
              </CardTitle>
              <CardDescription>
                Track your skill development progress and identify areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Technical Skills</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">JavaScript</span>
                          <span className="text-sm text-gray-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">React</span>
                          <span className="text-sm text-gray-600">75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Python</span>
                          <span className="text-sm text-gray-600">60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Soft Skills</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Communication</span>
                          <span className="text-sm text-gray-600">90%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Leadership</span>
                          <span className="text-sm text-gray-600">70%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Problem Solving</span>
                          <span className="text-sm text-gray-600">80%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-teal-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goal-planner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                Career Goal Planner
              </CardTitle>
              <CardDescription>Set and track your career goals with actionable milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-800">Short Term (6 months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          Complete React certification
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          Build 3 portfolio projects
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Network with 10 professionals
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-800">Medium Term (1-2 years)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Land first developer role
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Gain 2 years experience
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Lead a small project
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-purple-800">Long Term (3-5 years)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Senior developer position
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Mentor junior developers
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          Contribute to open source
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
