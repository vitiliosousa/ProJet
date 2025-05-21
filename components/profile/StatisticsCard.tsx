'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Statistic {
  label: string
  value: number
}

interface StatisticsCardProps {
  statistics: Statistic[]
}

export function StatisticsCard({ statistics }: StatisticsCardProps) {
  return (
    <Card className="rounded-xl glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-2">
          {statistics.map((stat, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}