export enum PermissionLevel {
  COORDENADOR = 0,
  QUALIDADE = 1,
  SUPERVISOR = 2,
  AGENTE = 3,
}

export interface User {
  id: string
  name: string
  email: string
  permissionLevel: PermissionLevel
  role?: string
  createdAt: Date
}
