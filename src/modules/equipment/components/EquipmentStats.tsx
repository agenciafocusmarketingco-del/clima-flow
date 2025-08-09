import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type Equipment } from "@/domain/types"

interface EquipmentStatsProps {
  equipment: Equipment[]
}

export function EquipmentStats({ equipment }: EquipmentStatsProps) {
  const models = ["CT50", "CT80", "CT90"] as const
  
  const getModelStats = (model: string) => {
    const modelEquipment = equipment.filter(eq => eq.model === model)
    const total = modelEquipment.reduce((acc, eq) => acc + eq.quantity.total, 0)
    const available = modelEquipment.reduce((acc, eq) => acc + eq.quantity.available, 0)
    const reserved = modelEquipment.reduce((acc, eq) => acc + eq.quantity.reserved, 0)
    const maintenance = modelEquipment.reduce((acc, eq) => acc + eq.quantity.maintenance, 0)
    const availabilityPercentage = total > 0 ? (available / total) * 100 : 0
    
    return { total, available, reserved, maintenance, availabilityPercentage }
  }

  const getModelSpecs = (model: string) => {
    switch (model) {
      case "CT50":
        return { airflow: "10.000 m³/h", power: "380W", tank: "100L" }
      case "CT80":
        return { airflow: "16.000 m³/h", power: "510W", tank: "80L" }
      case "CT90":
        return { airflow: "20.000 m³/h", power: "750W", tank: "150L" }
      default:
        return { airflow: "-", power: "-", tank: "-" }
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Visão Geral por Modelo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => {
          const stats = getModelStats(model)
          const specs = getModelSpecs(model)
          
          return (
            <Card key={model}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{model}</CardTitle>
                <CardDescription>
                  {specs.airflow} • {specs.power} • {specs.tank}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Disponibilidade</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.available}/{stats.total}
                    </span>
                  </div>
                  <Progress value={stats.availabilityPercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-lg font-bold text-success">{stats.available}</div>
                    <div className="text-muted-foreground">Disponível</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-warning">{stats.reserved}</div>
                    <div className="text-muted-foreground">Reservado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-destructive">{stats.maintenance}</div>
                    <div className="text-muted-foreground">Manutenção</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}