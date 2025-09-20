"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ROIData {
  year: number
  cumulativeCosts: number
  cumulativeEarnings: number
  netValue: number
}

interface PieData {
  name: string
  value: number
  color: string
}

interface CurrencyOption {
  code: string
  symbol: string
  name: string
}

interface ResultsType {
  totalEducationCost: number
  breakEvenPoint: number
  roiPercentage: number
  paybackPeriod: number
  chartData: ROIData[]
  costBreakdown: PieData[]
  projectedSalary: number
}

interface ParentROIInsightsProps {
  simplifiedMode: boolean
}

export function ParentROIInsights({ simplifiedMode }: ParentROIInsightsProps) {
  const [inputs, setInputs] = useState({
    tuitionFees: 50000,
    trainingFees: 10000,
    livingExpenses: 30000,
    otherCosts: 5000,
    startingSalary: 60000,
    annualGrowthRate: 5,
    careerLength: 30,
  })

  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  const currencies: CurrencyOption[] = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  ]

  const currencySymbol =
    currencies.find((c) => c.code === selectedCurrency)?.symbol ?? "$"

  const results: ResultsType = useMemo(() => {
    const totalEducationCost =
      inputs.tuitionFees +
      inputs.trainingFees +
      inputs.livingExpenses +
      inputs.otherCosts

    const growthRate = inputs.annualGrowthRate / 100
    let cumulativeEarnings = 0
    let breakEvenYear = 0
    const chartData: ROIData[] = []

    for (let year = 1; year <= inputs.careerLength; year++) {
      const yearlyEarnings =
        inputs.startingSalary * Math.pow(1 + growthRate, year - 1)

      cumulativeEarnings += yearlyEarnings
      const netValue = cumulativeEarnings - totalEducationCost

      chartData.push({
        year,
        cumulativeCosts: totalEducationCost,
        cumulativeEarnings,
        netValue,
      })

      if (netValue >= 0 && breakEvenYear === 0) {
        breakEvenYear = year
      }
    }

    const netProfit = cumulativeEarnings - totalEducationCost
    const finalROI = (netProfit / totalEducationCost) * 100
    const projectedSalary =
      inputs.startingSalary *
      Math.pow(1 + growthRate, inputs.careerLength - 1)

    const costBreakdown: PieData[] = [
      { name: "Tuition Fees", value: inputs.tuitionFees, color: "#ef4444" },
      { name: "Training Fees", value: inputs.trainingFees, color: "#f97316" },
      { name: "Living Expenses", value: inputs.livingExpenses, color: "#eab308" },
      { name: "Other Costs", value: inputs.otherCosts, color: "#84cc16" },
    ]

    return {
      totalEducationCost,
      breakEvenPoint: breakEvenYear,
      roiPercentage: finalROI,
      paybackPeriod: breakEvenYear > 0 ? breakEvenYear : -1,
      chartData,
      costBreakdown,
      projectedSalary,
    }
  }, [inputs])

  const handleChange = (field: keyof typeof inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Parent ROI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Inputs */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            {(Object.entries(inputs) as [keyof typeof inputs, number][]).map(
              ([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    id={key}
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                  />
                </div>
              )
            )}
          </div>

          {/* Results */}
          <div className="space-y-2 mb-6">
            <p>
              Total Education Cost: {currencySymbol}
              {results.totalEducationCost.toLocaleString()}
            </p>
            <p>ROI: {results.roiPercentage.toFixed(2)}%</p>
            <p>
              Break-even Point:{" "}
              {results.breakEvenPoint > 0
                ? `${results.breakEvenPoint} years`
                : "Not reached"}
            </p>
            <p>
              Projected Salary at Career End: {currencySymbol}
              {results.projectedSalary.toLocaleString()}
            </p>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="cumulativeEarnings"
                  fill="#4ade80"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="cumulativeCosts"
                  fill="#f87171"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={
                    results.costBreakdown as unknown as { name: string; value: number }[]
                  }
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {results.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
