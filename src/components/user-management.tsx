"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserTable } from "@/components/user-table"
import { AddUserDialog } from "@/components/add-user-dialog"
import { type User, PermissionLevel } from "@/lib/types"
import { supabase } from "@/utils/supabaseClient"

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: authUsers, error: authError } = await supabase.from("users_view").select("*")
      if (authError) {
        console.error("Erro ao buscar usuários:", authError)
        return
      }

      const mapPermission = (level: string): PermissionLevel => {
        switch (level?.toLowerCase()) {
          case "coordenador":
            return PermissionLevel.COORDENADOR
          case "qualidade":
            return PermissionLevel.QUALIDADE
          case "supervisor":
            return PermissionLevel.SUPERVISOR
          case "agente":
            return PermissionLevel.AGENTE
          default:
            return PermissionLevel.AGENTE
        }
      }

      const usersFormatted: User[] = authUsers.map((user) => ({
        id: user.id,
        name: user.name || "Sem nome",
        email: user.email,
        role: user.permission_level ?? "agente",
        permissionLevel: mapPermission(user.permission_level),
        createdAt: new Date(user.created_at),
      }))

      setUsers(usersFormatted)
    }

    fetchUsers()
  }, [])

  const handleAddUser = (user: User) => {
    setUsers([...users, { ...user, id: (users.length + 1).toString() }])
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsAddUserOpen(true)
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleUpdatePermission = async (userId: string, permissionLevel: PermissionLevel) => {
    const mapPermissionReverse = (level: PermissionLevel): string => {
      switch (level) {
        case PermissionLevel.COORDENADOR:
          return "coordenador"
        case PermissionLevel.QUALIDADE:
          return "qualidade"
        case PermissionLevel.SUPERVISOR:
          return "supervisor"
        case PermissionLevel.AGENTE:
        default:
          return "agente"
      }
    }

    const { error } = await supabase
      .from("user_permissions")
      .update({ permission_level: mapPermissionReverse(permissionLevel) })
      .eq("user_id", userId)

    if (error) {
      console.error("Erro ao atualizar permissão:", error)
      return
    }

    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              permissionLevel,
              role: mapPermissionReverse(permissionLevel),
            }
          : user,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Usuários Registrados</h2>
        <Button
          onClick={() => {
            setEditingUser(null)
            setIsAddUserOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onUpdatePermission={handleUpdatePermission}
      />

      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onAdd={handleAddUser}
        onUpdate={handleUpdateUser}
        user={editingUser}
      />
    </div>
  )
}
