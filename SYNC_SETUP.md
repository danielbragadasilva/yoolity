# Configuração da Sincronização Freshchat → Xano

Este documento explica como configurar a sincronização automática entre os dados de agentes do Freshchat e a base de dados Xano.

## 🚀 Funcionalidades Implementadas

### 1. Integração com Freshchat
- ✅ Busca automática de agentes via API
- ✅ Mapeamento de roles (Agente/Coordenador)
- ✅ Transformação de dados para formato padronizado
- ✅ Interface visual com dados em tempo real

### 2. Sincronização com Xano
- ✅ API endpoint para sincronização (`/api/sync-users-xano`)
- ✅ Criação/atualização de usuários baseado no `freshchat_id`
- ✅ Tratamento de erros e logs detalhados
- ✅ Interface com botão de sincronização manual

### 3. Interface de Usuário
- ✅ Dashboard com estatísticas em tempo real
- ✅ Indicadores de status de sincronização
- ✅ Filtros por turno e cargo
- ✅ Feedback visual com toasts

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e configure:

```bash
# Freshchat API
FRESHCHAT_API_TOKEN=seu_token_aqui
FRESHCHAT_BASE_URL=https://yoogatecnologia.freshchat.com

# Xano API
XANO_API_BASE_URL=https://seu-workspace.xano.io/api:seu-grupo
XANO_API_KEY=sua_chave_xano_aqui
```

### 2. Estrutura da Tabela Xano

Crie uma tabela `users` no Xano com os seguintes campos:

```sql
- id (auto-increment)
- freshchat_id (text, unique)
- nome (text)
- email (text)
- cargo (text)
- turno (text)
- status (text)
- avatar_url (text)
- created_at (datetime)
- updated_at (datetime)
```

### 3. Mapeamento de Roles

O sistema mapeia automaticamente os roles do Freshchat:

```typescript
const roleMapping = {
  "855dd18d-0b29-4f2a-a6ad-931027963b9d": "Coordenador",
  "72bf957d-f2b7-41db-aa6f-8146351e4685": "Agente",
};
```

## 🔄 Como Usar

### 1. Visualização de Dados
- Acesse `/agentes` para ver a interface
- Os dados do Freshchat são carregados automaticamente
- Use os filtros para navegar entre turnos e cargos

### 2. Sincronização Manual
- Clique no botão "Sincronizar" na seção superior
- Acompanhe o progresso através dos indicadores visuais
- Verifique os toasts para feedback de sucesso/erro

### 3. Sincronização Automática (Opcional)
- Configure um cron job para chamar `/api/sync-users-xano`
- Recomendado: executar a cada 15-30 minutos

## 🛠️ Desenvolvimento

### Arquivos Principais

1. **`/src/components/agent-page.tsx`**
   - Interface principal com dados do Freshchat
   - Botão de sincronização e indicadores

2. **`/src/app/api/sync-users-xano/route.ts`**
   - Endpoint de sincronização
   - Lógica de criação/atualização de usuários

3. **`/src/hooks/useFreshchatAgents.ts`**
   - Hook para buscar dados do Freshchat
   - Cache e gerenciamento de estado

### Fluxo de Dados

```
Freshchat API → useFreshchatAgents → AgentPage → Sync Button → Xano API
```

## 🐛 Troubleshooting

### Erro de Conexão com Freshchat
- Verifique o token de API
- Confirme a URL base
- Teste manualmente: `GET /api/proxy?endpoint=agents`

### Erro de Sincronização com Xano
- Verifique as credenciais do Xano
- Confirme a estrutura da tabela
- Analise os logs no console do navegador

### Dados Não Aparecem
- Verifique se há agentes com roles válidos no Freshchat
- Confirme o mapeamento de roles no código
- Teste a API diretamente

## 📊 Monitoramento

- **Logs**: Console do navegador e Network tab
- **Status**: Indicadores visuais na interface
- **Métricas**: Contadores de agentes/coordenadores
- **Última Sync**: Timestamp da última sincronização

## 🔮 Próximos Passos

- [ ] Sincronização automática via webhook
- [ ] Histórico de sincronizações
- [ ] Relatórios de atividade
- [ ] Notificações por email
- [ ] Backup automático de dados