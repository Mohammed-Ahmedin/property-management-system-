"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Mock data for last 6 months
const bookingsData = [
  { month: "May", bookings: 18 },
  { month: "Jun", bookings: 22 },
  { month: "Jul", bookings: 28 },
  { month: "Aug", bookings: 24 },
  { month: "Sep", bookings: 19 },
  { month: "Oct", bookings: 16 },
]

export function BookingsTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Trend</CardTitle>
        <CardDescription>Monthly bookings for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            bookings: {
              label: "Bookings",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="var(--color-bookings)"
                strokeWidth={2}
                dot={{ fill: "var(--color-bookings)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
