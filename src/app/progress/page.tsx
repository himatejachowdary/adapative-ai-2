
"use client"

import { AppLayout } from "@/components/app/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CheckCircle, Clock, Star, TrendingUp } from "lucide-react";

const chartData = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 25 },
  { day: "Thu", minutes: 75 },
  { day: "Fri", minutes: 40 },
  { day: "Sat", minutes: 90 },
  { day: "Sun", minutes: 20 },
];

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "hsl(var(--primary))",
  },
};

const stats = [
    { title: "Courses Completed", value: "8", icon: CheckCircle, change: "+2 this month" },
    { title: "Time Spent", value: "24.5h", icon: Clock, change: "+5h this month" },
    { title: "Average Score", value: "92%", icon: Star, change: "-1% from last month" },
    { title: "Current Streak", value: "12 days", icon: TrendingUp, change: "Keep it up!" },
]

export default function ProgressPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-glow-primary">Your Progress</h1>
          <p className="text-muted-foreground">A detailed look at your learning journey and achievements.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => (
                <Card key={stat.title} className="glassmorphic">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}m`} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="minutes" fill="var(--color-minutes)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
