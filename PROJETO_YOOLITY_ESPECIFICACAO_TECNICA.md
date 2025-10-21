# Yoolity - Especificação Técnica Completa

## 📋 Visão Geral do Projeto

**Yoolity** é uma plataforma de gestão e monitoramento de agentes de atendimento, desenvolvida em Next.js 15 com TypeScript, que integra com sistemas de help desk (atualmente Freshchat, migrando para HubSpot) para fornecer dashboards em tempo real, gamificação e controle de escalas.

### 🎯 Objetivo da Migração
Migração do sistema atual (Freshchat) para **HubSpot**, implementando um **widget flutuante** que permitirá alteração de status diretamente no help desk do HubSpot.

---

## 🏗️ Arquitetura Atual

### Stack Tecnológico Frontend
- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Charts**: Recharts
- **Estado**: React Hooks + Context API

### Estrutura de Pastas
```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard principal
│   ├── escalas/          # Gestão de escalas
│   ├── challenge/        # Sistema de gamificação
│   ├── control/          # Painel de controle
│   ├── login/            # Autenticação
│   └── wiki/             # Documentação interna
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn)
│   └── gamification/     # Componentes de gamificação
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
└── types/                # Definições TypeScript
```

---

## 👥 Sistema de Permissões

### Níveis de Acesso
```typescript
enum PermissionLevel {
  COORDENADOR = 0,  // Acesso total
  QUALIDADE = 1,    // Supervisão e relatórios
  SUPERVISOR = 2,   // Gestão de equipe
  AGENTE = 3        // Acesso básico
}
```

### Controle de Rotas
- **Middleware**: Proteção baseada em roles do Supabase
- **Rotas Protegidas**: `/dashboard`, `/control`, `/escalas`, `/wiki`
- **Rotas Públicas**: `/login`, `/unauthorized`, `/debug`

---

## 🔄 Integração Atual (Freshchat)

### API Proxy
- **Endpoint**: `/api/proxy`
- **Função**: Proxy para API do Freshchat
- **Cache**: 30 segundos para otimização
- **Polling**: Atualização a cada 60 segundos

### Dados de Agentes
```typescript
type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: { url: string };
  login_status: boolean;
  availability_status: string;
  agent_status?: { id: string; name: string };
  role_id?: string;
}
```

### Status Tracking
- **Mapeamento de Status**: IDs para labels legíveis
- **Histórico Local**: localStorage para tracking de mudanças
- **Duração**: Cálculo automático de tempo em cada status

---

## 🎮 Sistema de Gamificação

### Componentes
1. **Agent Dashboard**: Métricas individuais, progresso, conquistas
2. **Supervisor Dashboard**: Gestão de metas e acompanhamento de equipe
3. **Ranking System**: Classificação baseada em performance
4. **Achievements**: Sistema de conquistas e badges

### Métricas Principais
- Tempo online
- Tickets resolvidos
- Satisfação do cliente
- Metas mensais/semanais

---

## 📊 Dashboard e Monitoramento

### Widgets Principais
1. **Agentes Ativos**: Lista em tempo real
2. **Gráfico de Escalas**: Visualização de turnos
3. **Trocas Pendentes**: Gestão de substituições
4. **Resumo Semanal**: KPIs consolidados
5. **Monitor Widget**: Status individual detalhado

### Funcionalidades de Escala
- Visualização de turnos
- Solicitação de trocas
- Aprovação de substituições
- Histórico de alterações

---

## 🔄 Migração para HubSpot

### 🎯 Objetivos da Migração

#### Widget Flutuante HubSpot
- **Posicionamento**: Overlay fixo no help desk
- **Funcionalidade**: Alteração rápida de status
- **Integração**: API HubSpot para sincronização
- **UI/UX**: Interface minimalista e responsiva

### 📋 Especificações do Backend Separado

#### 1. Arquitetura Recomendada
```
backend/
├── src/
│   ├── controllers/       # Controladores de API
│   ├── services/         # Lógica de negócio
│   ├── models/           # Modelos de dados
│   ├── middleware/       # Autenticação e validação
│   ├── routes/           # Definição de rotas
│   ├── integrations/     # APIs externas (HubSpot)
│   ├── utils/            # Utilitários
│   └── config/           # Configurações
├── prisma/               # Schema do banco
├── tests/                # Testes automatizados
└── docs/                 # Documentação da API
```

#### 2. Stack Tecnológico Recomendada
- **Runtime**: Node.js 18+
- **Framework**: Express.js ou Fastify
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Banco**: PostgreSQL
- **Cache**: Redis
- **Autenticação**: JWT + Supabase
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest + Supertest

#### 3. APIs Essenciais

##### 3.1 Autenticação e Usuários
```typescript
// Endpoints de Autenticação
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me

// Gestão de Usuários
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/permissions
```

##### 3.2 Integração HubSpot
```typescript
// Agentes HubSpot
GET  /api/hubspot/agents
GET  /api/hubspot/agents/:id
PUT  /api/hubspot/agents/:id/status

// Status e Disponibilidade
GET  /api/hubspot/statuses
POST /api/hubspot/status-change
GET  /api/hubspot/agent-activity/:id

// Webhook para sincronização
POST /api/webhooks/hubspot
```

##### 3.3 Monitoramento e Métricas
```typescript
// Dashboard
GET /api/dashboard/overview
GET /api/dashboard/agents-online
GET /api/dashboard/metrics/:period

// Relatórios
GET /api/reports/agent-performance
GET /api/reports/status-history
GET /api/reports/team-metrics
```

##### 3.4 Gamificação
```typescript
// Pontuação e Ranking
GET  /api/gamification/leaderboard
GET  /api/gamification/agent/:id/score
POST /api/gamification/achievement

// Metas e Objetivos
GET  /api/goals
POST /api/goals
PUT  /api/goals/:id
GET  /api/goals/agent/:id
```

##### 3.5 Escalas e Turnos
```typescript
// Gestão de Escalas
GET    /api/schedules
POST   /api/schedules
PUT    /api/schedules/:id
DELETE /api/schedules/:id

// Trocas de Turno
GET  /api/shift-swaps
POST /api/shift-swaps/request
PUT  /api/shift-swaps/:id/approve
PUT  /api/shift-swaps/:id/reject
```

#### 4. Modelos de Dados

##### 4.1 Schema Prisma Atualizado
```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  name            String
  avatar_url      String?
  permission_level Int     @default(3)
  role            String
  hubspot_id      String?  @unique
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  agent_activities AgentActivity[]
  shift_swaps_requested ShiftSwap[] @relation("RequestedBy")
  shift_swaps_approved  ShiftSwap[] @relation("ApprovedBy")
  gamification_scores   GamificationScore[]
  schedules            Schedule[]
}

model AgentActivity {
  id         String   @id @default(uuid())
  user_id    String
  status     String
  started_at DateTime
  ended_at   DateTime?
  duration   Int?     // em minutos
  source     String   // 'hubspot', 'manual', 'system'
  
  user User @relation(fields: [user_id], references: [id])
}

model HubSpotStatus {
  id          String @id
  name        String
  description String?
  color       String?
  is_active   Boolean @default(true)
}

model Schedule {
  id         String   @id @default(uuid())
  user_id    String
  start_time DateTime
  end_time   DateTime
  shift_type String
  created_at DateTime @default(now())
  
  user User @relation(fields: [user_id], references: [id])
}

model ShiftSwap {
  id              String    @id @default(uuid())
  requested_by_id String
  approved_by_id  String?
  original_shift  DateTime
  new_shift       DateTime
  reason          String?
  status          String    @default("pending")
  created_at      DateTime  @default(now())
  approved_at     DateTime?
  
  requested_by User  @relation("RequestedBy", fields: [requested_by_id], references: [id])
  approved_by  User? @relation("ApprovedBy", fields: [approved_by_id], references: [id])
}

model GamificationScore {
  id         String   @id @default(uuid())
  user_id    String
  metric     String   // 'tickets_resolved', 'online_time', 'satisfaction'
  value      Float
  period     String   // 'daily', 'weekly', 'monthly'
  date       DateTime
  
  user User @relation(fields: [user_id], references: [id])
}
```

#### 5. Widget Flutuante - Especificações

##### 5.1 Funcionalidades
- **Seletor de Status**: Dropdown com status disponíveis
- **Status Atual**: Indicador visual do status ativo
- **Histórico Rápido**: Últimas 3 mudanças de status
- **Timer**: Tempo no status atual
- **Notificações**: Alertas de mudanças importantes

##### 5.2 Integração Técnica
```typescript
// Widget API
interface WidgetAPI {
  getCurrentStatus(): Promise<AgentStatus>;
  changeStatus(statusId: string): Promise<void>;
  getStatusHistory(limit?: number): Promise<StatusHistory[]>;
  subscribeToUpdates(callback: (status: AgentStatus) => void): void;
}

// Configuração do Widget
interface WidgetConfig {
  hubspotPortalId: string;
  agentId: string;
  apiBaseUrl: string;
  theme: 'light' | 'dark' | 'auto';
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  autoHide: boolean;
  refreshInterval: number;
}
```

##### 5.3 Implementação Frontend
```typescript
// Widget Component
const HubSpotStatusWidget: React.FC<WidgetConfig> = ({
  hubspotPortalId,
  agentId,
  apiBaseUrl,
  theme = 'auto',
  position = 'top-right',
  autoHide = false,
  refreshInterval = 30000
}) => {
  // Implementação do widget
};
```

#### 6. Configurações e Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL="postgresql://..."

# HubSpot
HUBSPOT_API_KEY="your-hubspot-api-key"
HUBSPOT_PORTAL_ID="your-portal-id"
HUBSPOT_WEBHOOK_SECRET="webhook-secret"

# Autenticação
JWT_SECRET="your-jwt-secret"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Cache
REDIS_URL="redis://localhost:6379"

# API
API_PORT=3001
API_HOST="localhost"
CORS_ORIGIN="http://localhost:3000"

# Monitoramento
LOG_LEVEL="info"
SENTRY_DSN="your-sentry-dsn"
```

#### 7. Cronograma de Implementação

##### Fase 1: Setup e Infraestrutura (Semana 1-2)
- [ ] Configuração do projeto backend
- [ ] Setup do banco de dados
- [ ] Configuração do Prisma
- [ ] Implementação da autenticação
- [ ] Setup do Redis para cache

##### Fase 2: APIs Core (Semana 3-4)
- [ ] API de usuários e permissões
- [ ] Integração básica com HubSpot
- [ ] APIs de monitoramento
- [ ] Sistema de logs e auditoria

##### Fase 3: Widget e Funcionalidades Avançadas (Semana 5-6)
- [ ] Desenvolvimento do widget flutuante
- [ ] APIs de gamificação
- [ ] Sistema de escalas e trocas
- [ ] Webhooks do HubSpot

##### Fase 4: Testes e Deploy (Semana 7-8)
- [ ] Testes automatizados
- [ ] Documentação da API
- [ ] Deploy em produção
- [ ] Migração dos dados

---

## 🔧 Considerações Técnicas

### Performance
- **Cache Strategy**: Redis para dados frequentemente acessados
- **Rate Limiting**: Proteção contra abuse da API
- **Pagination**: Implementação em todas as listagens
- **Indexação**: Otimização de queries no banco

### Segurança
- **CORS**: Configuração restritiva
- **Helmet**: Headers de segurança
- **Validation**: Joi ou Zod para validação de entrada
- **Sanitização**: Prevenção de XSS e SQL Injection

### Monitoramento
- **Logs**: Winston ou Pino para logging estruturado
- **Métricas**: Prometheus + Grafana
- **Alertas**: Configuração de alertas críticos
- **Health Checks**: Endpoints de saúde da aplicação

### Documentação
- **API Docs**: Swagger/OpenAPI 3.0
- **README**: Instruções de setup e desenvolvimento
- **Changelog**: Versionamento e mudanças
- **Deployment Guide**: Guia de deploy

---

## 📈 Métricas e KPIs

### Métricas de Negócio
- Tempo médio de resposta
- Taxa de resolução no primeiro contato
- Satisfação do cliente (CSAT)
- Net Promoter Score (NPS)
- Tempo médio de resolução

### Métricas Técnicas
- Uptime da aplicação
- Tempo de resposta da API
- Taxa de erro das requisições
- Uso de recursos (CPU, memória)
- Latência das integrações

---

## 🚀 Próximos Passos

1. **Aprovação da Arquitetura**: Validação das especificações
2. **Setup do Ambiente**: Configuração inicial do backend
3. **Desenvolvimento Iterativo**: Implementação por fases
4. **Testes Contínuos**: Validação em ambiente de staging
5. **Deploy Gradual**: Migração progressiva dos usuários

---

## 📞 Contatos e Responsabilidades

- **Product Manager**: Definição de requisitos e priorização
- **Tech Lead**: Arquitetura e decisões técnicas
- **Backend Developer**: Implementação das APIs
- **Frontend Developer**: Integração e widget
- **DevOps**: Infraestrutura e deploy
- **QA**: Testes e validação

---

*Documento criado por: Janne (Product Manager)*  
*Última atualização: Janeiro 2025*  
*Versão: 1.0*