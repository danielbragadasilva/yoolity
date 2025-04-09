"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldUser,
  Crown,
} from "lucide-react";
import { type User, PermissionLevel } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onUpdatePermission: (
    userId: string,
    permissionLevel: PermissionLevel
  ) => void;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onUpdatePermission,
}: UserTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Permissão</TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const permissionValue = (
              user.permissionLevel ?? PermissionLevel.AGENTE
            ).toString();

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={(
                      user.permissionLevel ?? PermissionLevel.AGENTE
                    ).toString()}
                    onValueChange={(value) =>
                      onUpdatePermission(user.id, parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={PermissionLevel.COORDENADOR.toString()}
                      >
                        <div className="flex items-center">
                          <ShieldUser className="mr-2 h-4 w-4 text-picpay-dark" />
                          <span>Coordenador</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PermissionLevel.QUALIDADE.toString()}>
                        <div className="flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Qualidade</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PermissionLevel.SUPERVISOR.toString()}>
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-sky-500" />
                          <span>Supervisor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PermissionLevel.AGENTE.toString()}>
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-green-500" />
                          <span>Agente</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(user.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
