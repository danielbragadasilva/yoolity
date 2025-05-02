"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, Clock, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Task = {
  id: string
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  status: "available" | "in_progress" | "completed"
}

type Achievement = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  total: number
  completed: boolean
}

export function AgentDashboard() {
  const [balance, setBalance] = useState(800)
  const [level, setLevel] = useState(3)
  const [levelProgress, setLevelProgress] = useState(65)

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Resolva 10 tickets em um dia",
      description: "Conclua e resolva 10 tickets de suporte ao cliente em um único dia",
      points: 1000,
      difficulty: "medium",
      status: "available",
    },
    {
      id: "2",
      title: "Alcançar 95% de índice de satisfação",
      description: "Manter uma taxa de satisfação do cliente de pelo menos 95% durante a semana",
      points: 200,
      difficulty: "hard",
      status: "in_progress",
    },
    {
      id: "3",
      title: "Módulo de treinamento completo",
      description: "Conclua o módulo de treinamento do novo produto e passe na avaliação",
      points: 50,
      difficulty: "easy",
      status: "completed",
    },
  ])

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Primeira Resposta",
      description: "Responda aos seus primeiros 100 tickets",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      progress: 87,
      total: 100,
      completed: false,
    },
    {
      id: "2",
      title: "Elgin da Velocidade",
      description: "Mantenha um tempo médio de resposta abaixo de 2 minutos por uma semana",
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      progress: 5,
      total: 7,
      completed: false,
    },
    {
      id: "3",
      title: "Beyonce do Suporte",
      description: "Receba 50 avaliações cinco estrelas de clientes",
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      progress: 50,
      total: 50,
      completed: true,
    },
  ])

  const [history, setHistory] = useState([
    { id: "1", type: "earned", description: "Concluído: Resolva 10 tickets em um dia", points: 100, date: "2025-03-12" },
    { id: "2", type: "spent", description: "Comprado: Vale-Mangalô", points: 50, date: "2025-03-10" },
    { id: "3", type: "earned", description: "Conquista: Campeão do Cliente", points: 200, date: "2025-03-08" },
    { id: "4", type: "earned", description: "Concluído: Módulo de treinamento concluído", points: 50, date: "2025-03-05" },
    { id: "5", type: "spent", description: "Comprado: Tempo de Pausa Extra", points: 100, date: "2025-03-01" },
  ])

  const startTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status: "in_progress" } : task)))
  }

  const completeTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: "completed" } : t)))
      setBalance(balance + task.points)
      setHistory([
        {
          id: Date.now().toString(),
          type: "earned",
          description: `Completed: ${task.title}`,
          points: task.points,
          date: new Date().toISOString().split("T")[0],
        },
        ...history,
      ])

      // Update level progress
      const newProgress = levelProgress + Math.floor(task.points / 10)
      if (newProgress >= 100) {
        setLevel(level + 1)
        setLevelProgress(newProgress - 100)
      } else {
        setLevelProgress(newProgress)
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Saldo atual</CardTitle>
            <CardDescription>SuCoins disponíveis para gastar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">SU${balance}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Nível do Agente</CardTitle>
            <CardDescription>Sua classificação atual e progresso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{level}</div>
              <Badge className="text-sm">
                Falta {level + 1} de {100 - levelProgress} SuCoins
              </Badge>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Perfil do agente</CardTitle>
            <CardDescription>Suas estatísticas de desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Lucas Saraiva</p>
                <p className="text-sm text-muted-foreground">Agente do Suporte</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">10% dos melhores desempenhos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tarefas Disponíveis</TabsTrigger>
          <TabsTrigger value="achievements">Conquista</TabsTrigger>
          <TabsTrigger value="history">Histórico de SU$</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Tarefas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge className={getDifficultyColor(task.difficulty)}>
                      {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-yellow-500" />
                      <span className="font-semibold">{task.points} points</span>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === "available"
                        ? "Available"
                        : task.status === "in_progress"
                          ? "In Progress"
                          : "Completed"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  {task.status === "available" && (
                    <Button onClick={() => startTask(task.id)} className="w-full">
                      Iniciar tarefa
                    </Button>
                  )}
                  {task.status === "in_progress" && (
                    <Button onClick={() => completeTask(task.id)} className="w-full">
                      Marcar como concluído
                    </Button>
                  )}
                  {task.status === "completed" && (
                    <Button disabled className="w-full">
                      Concluído
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Conquistas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.completed ? "border-green-200 bg-green-50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    {achievement.completed && <Badge className="bg-green-100 text-green-800">Concluído</Badge>}
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {achievement.icon}
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Histórico de SU$</h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {history.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className={`font-semibold ${item.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                      {item.type === "earned" ? "+" : "-"}
                      {item.points}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

