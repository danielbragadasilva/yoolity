"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Task = {
  id: string
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  status: "ativo" | "inativo"
}

export function SupervisorDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "🛵 TMA do iFood",
      description: "TMA inicial - 22 minutos",
      points: 100,
      difficulty: "medium",
      status: "active",
    },
    {
      id: "2",
      title: "⭐Alcançar 95% de índice de satisfação",
      description: "Manter uma taxa de satisfação do cliente de pelo menos 95% durante a semana",
      points: 200,
      difficulty: "hard",
      status: "active",
    },
    {
      id: "3",
      title: "🖨️Instalar uma impressora daruma dr700",
      description: "Instalar uma impressora daruma dr700 em menos de 20 minutos",
      points: 50,
      difficulty: "easy",
      status: "active",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    points: 0,
    difficulty: "medium",
    status: "active",
  })

  const handleAddTask = () => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...editingTask, ...newTask } : task)))
    } else {
      const task: Task = {
        ...newTask,
        id: Date.now().toString(),
      }
      setTasks([...tasks, task])
    }

    setNewTask({
      title: "",
      description: "",
      points: 0,
      difficulty: "medium",
      status: "active",
    })
    setEditingTask(null)
    setIsOpen(false)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      points: task.points,
      difficulty: task.difficulty,
      status: task.status,
    })
    setIsOpen(true)
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciador de tarefas</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTask(null)
                setNewTask({
                  title: "",
                  description: "",
                  points: 0,
                  difficulty: "medium",
                  status: "active",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Criar Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              <DialogDescription>
                {editingTask
                  ? "Edit the task details below and save your changes."
                  : "Create a new task for agents to complete and earn points."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points" className="text-right">
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  value={newTask.points}
                  onChange={(e) => setNewTask({ ...newTask, points: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                </Label>
                <Select
                  value={newTask.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") => setNewTask({ ...newTask, difficulty: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value: "active" | "inactive") => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTask}>
                {editingTask ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas Disponíveis</CardTitle>
          <CardDescription>Gerencie tarefas que os agentes podem concluir para ganhar supcoins</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>SU$</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                  <TableCell>{task.points}</TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(task.difficulty)}>
                      {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={task.status === "active" ? "default" : "secondary"}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho do agente</CardTitle>
          <CardDescription>Veja como os agentes estão se saindo com o sistema de gamificação</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead>SU$ para resgate</TableHead>
                <TableHead>Tarefas concluídas</TableHead>
                <TableHead>SU$ gasto</TableHead>
                <TableHead>Saldo Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Leandro</TableCell>
                <TableCell>1,250</TableCell>
                <TableCell>15</TableCell>
                <TableCell>450</TableCell>
                <TableCell>800</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">João Victor</TableCell>
                <TableCell>980</TableCell>
                <TableCell>12</TableCell>
                <TableCell>300</TableCell>
                <TableCell>680</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lucas Saraiva</TableCell>
                <TableCell>1,540</TableCell>
                <TableCell>18</TableCell>
                <TableCell>750</TableCell>
                <TableCell>790</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

