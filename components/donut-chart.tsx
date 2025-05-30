"use client"

import { useState } from "react"

interface DonutChartProps {
  data: {
    name: string
    value: number
    percentage: number
  }[]
  formatCurrency: (value: number) => string
}

export function DonutChart({ data, formatCurrency }: DonutChartProps) {
  const [activeSegment, setActiveSegment] = useState<number | null>(null)
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Cores para os segmentos
  const colors = [
    { bg: "bg-blue-600 dark:bg-orange-400", hover: "hover:bg-blue-700 dark:hover:bg-orange-500" },
    { bg: "bg-blue-800 dark:bg-orange-500", hover: "hover:bg-blue-900 dark:hover:bg-orange-600" },
    { bg: "bg-blue-500 dark:bg-orange-600", hover: "hover:bg-blue-600 dark:hover:bg-orange-700" },
  ]

  return (
    <div className="flex flex-col items-center">
      {/* Gráfico de rosca simplificado */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {data.map((segment, i) => {
            // Calcular ângulos para o segmento
            let cumulativePercentage = 0
            for (let j = 0; j < i; j++) {
              cumulativePercentage += data[j].percentage
            }

            const startAngle = (cumulativePercentage / 100) * 360
            const endAngle = ((cumulativePercentage + segment.percentage) / 100) * 360

            // Calcular pontos do arco
            const startX = 50 + 35 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 50 + 35 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 50 + 35 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 50 + 35 * Math.sin((endAngle * Math.PI) / 180)

            // Determinar se o arco é maior que 180 graus
            const largeArcFlag = segment.percentage > 50 ? 1 : 0

            // Criar o caminho do segmento
            const path = `M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY} Z`

            return (
              <path
                key={i}
                d={path}
                fill={i === 0 ? "#1e40af" : i === 1 ? "#1e3a8a" : "#3b82f6"}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSegment === i ? "opacity-100 stroke-2 stroke-white dark:stroke-gray-800" : "opacity-90"
                } dark:fill-opacity-0`}
                onMouseEnter={() => setActiveSegment(i)}
                onMouseLeave={() => setActiveSegment(null)}
                onClick={() => setActiveSegment(i === activeSegment ? null : i)}
              />
            )
          })}

          {/* Versão para modo escuro */}
          {data.map((segment, i) => {
            // Calcular ângulos para o segmento
            let cumulativePercentage = 0
            for (let j = 0; j < i; j++) {
              cumulativePercentage += data[j].percentage
            }

            const startAngle = (cumulativePercentage / 100) * 360
            const endAngle = ((cumulativePercentage + segment.percentage) / 100) * 360

            // Calcular pontos do arco
            const startX = 50 + 35 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 50 + 35 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 50 + 35 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 50 + 35 * Math.sin((endAngle * Math.PI) / 180)

            // Determinar se o arco é maior que 180 graus
            const largeArcFlag = segment.percentage > 50 ? 1 : 0

            // Criar o caminho do segmento
            const path = `M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY} Z`

            return (
              <path
                key={`dark-${i}`}
                d={path}
                fill={i === 0 ? "#f97316" : i === 1 ? "#ea580c" : "#c2410c"}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSegment === i ? "opacity-100 stroke-2 stroke-white dark:stroke-gray-800" : "opacity-90"
                } fill-opacity-0 dark:fill-opacity-100`}
                onMouseEnter={() => setActiveSegment(i)}
                onMouseLeave={() => setActiveSegment(null)}
                onClick={() => setActiveSegment(i === activeSegment ? null : i)}
              />
            )
          })}

          {/* Círculo central */}
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-900" />
        </svg>

        {/* Texto central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-navy-900 dark:text-orange-100">
              {activeSegment !== null ? `${data[activeSegment].percentage.toFixed(1)}%` : "100%"}
            </div>
            <div className="text-xs text-navy-500 dark:text-orange-400">
              {activeSegment !== null ? data[activeSegment].name : "Total"}
            </div>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-6 w-full space-y-2">
        {data.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between text-sm p-2 rounded-md transition-all duration-200 ${
              activeSegment === i ? "bg-gray-100 dark:bg-gray-800" : ""
            } cursor-pointer`}
            onMouseEnter={() => setActiveSegment(i)}
            onMouseLeave={() => setActiveSegment(null)}
            onClick={() => setActiveSegment(i === activeSegment ? null : i)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colors[i % colors.length].bg}`}></div>
              <span className="text-navy-600 dark:text-orange-400">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-navy-900 dark:text-orange-100">{formatCurrency(item.value)}</span>
              <span className="text-xs text-navy-500 dark:text-orange-400">({item.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
