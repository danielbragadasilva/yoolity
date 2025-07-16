import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ResumoSemanal() {
  const diasSemana = [
    {
      dia: "Segunda",
      data: "15/05",
      turnos: [
        { nome: "Manhã", cobertura: "100%", status: "completo" },
        { nome: "Tarde", cobertura: "100%", status: "completo" },
        { nome: "Noite", cobertura: "75%", status: "parcial" },
      ],
    },
    {
      dia: "Terça",
      data: "16/05",
      turnos: [
        { nome: "Manhã", cobertura: "100%", status: "completo" },
        { nome: "Tarde", cobertura: "100%", status: "completo" },
        { nome: "Noite", cobertura: "100%", status: "completo" },
      ],
    },
    {
      dia: "Quarta",
      data: "17/05",
      turnos: [
        { nome: "Manhã", cobertura: "100%", status: "completo" },
        { nome: "Tarde", cobertura: "75%", status: "parcial" },
        { nome: "Noite", cobertura: "100%", status: "completo" },
      ],
    },
    {
      dia: "Quinta",
      data: "18/05",
      turnos: [
        { nome: "Manhã", cobertura: "100%", status: "completo" },
        { nome: "Tarde", cobertura: "100%", status: "completo" },
        { nome: "Noite", cobertura: "100%", status: "completo" },
      ],
    },
    {
      dia: "Sexta",
      data: "19/05",
      turnos: [
        { nome: "Manhã", cobertura: "100%", status: "completo" },
        { nome: "Tarde", cobertura: "100%", status: "completo" },
        { nome: "Noite", cobertura: "75%", status: "parcial" },
      ],
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {diasSemana.map((dia) => (
        <Card key={dia.dia}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{dia.dia}</CardTitle>
            <CardDescription>{dia.data}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dia.turnos.map((turno) => (
                <div key={turno.nome} className="flex items-center justify-between">
                  <span className="text-sm">{turno.nome}</span>
                  <Badge variant={turno.status === "completo" ? "default" : "outline"}>{turno.cobertura}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
