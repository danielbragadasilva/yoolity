import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, X } from "lucide-react"

export function TrocasPendentes() {
  const trocas = [
    {
      id: 1,
      solicitante: {
        nome: "Roberto Dias",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "14:00 - 20:00",
        data: "Hoje",
      },
      substituto: {
        nome: "Camila Rocha",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "20:00 - 02:00",
        data: "Amanhã",
      },
      motivo: "Consulta médica",
      status: "pendente",
    },
    {
      id: 2,
      solicitante: {
        nome: "Juliana Lima",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "14:00 - 20:00",
        data: "Quinta-feira",
      },
      substituto: {
        nome: "João Pereira",
        avatar: "/placeholder.svg?height=40&width=40",
        turno: "08:00 - 14:00",
        data: "Sexta-feira",
      },
      motivo: "Compromisso familiar",
      status: "pendente",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {trocas.map((troca) => (
        <Card key={troca.id}>
          <CardHeader>
            <CardTitle className="text-base">Solicitação de Troca #{troca.id}</CardTitle>
            <Badge className="w-fit">{troca.status === "pendente" ? "Pendente" : "Aprovada"}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={troca.solicitante.avatar || "/placeholder.svg"} alt={troca.solicitante.nome} />
                  <AvatarFallback>{troca.solicitante.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{troca.solicitante.nome}</p>
                  <p className="text-xs text-muted-foreground">{troca.solicitante.turno}</p>
                  <p className="text-xs text-muted-foreground">{troca.solicitante.data}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={troca.substituto.avatar || "/placeholder.svg"} alt={troca.substituto.nome} />
                  <AvatarFallback>{troca.substituto.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{troca.substituto.nome}</p>
                  <p className="text-xs text-muted-foreground">{troca.substituto.turno}</p>
                  <p className="text-xs text-muted-foreground">{troca.substituto.data}</p>
                </div>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">Motivo: </span>
              {troca.motivo}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" /> Recusar
            </Button>
            <Button size="sm">
              <Check className="h-4 w-4 mr-1" /> Aprovar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
