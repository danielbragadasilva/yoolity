/**
 * Script para testar webhooks do Supabase em produção
 * Valida autenticação, payloads e tratamento de erros
 */

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const crypto = require('crypto');

// Configurações
const CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  WEBHOOK_SECRET: process.env.SUPABASE_WEBHOOK_SECRET,
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 segundo
};

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Função para log colorido
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Função para gerar assinatura HMAC
function generateSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

// Função para fazer requisição HTTP/HTTPS
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.setTimeout(CONFIG.TIMEOUT);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Função para testar webhook com retry
async function testWebhookWithRetry(testName, endpoint, payload, expectedStatus = 200) {
  let lastError;
  
  for (let attempt = 1; attempt <= CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      log(`\n🧪 Teste: ${testName} (Tentativa ${attempt}/${CONFIG.RETRY_ATTEMPTS})`, 'cyan');
      
      const payloadString = JSON.stringify(payload);
      const signature = generateSignature(payloadString, CONFIG.WEBHOOK_SECRET);
      
      const url = new URL(endpoint, CONFIG.BASE_URL);
      const options = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payloadString),
          'x-supabase-signature': `sha256=${signature}`,
          'User-Agent': 'Supabase-Webhook-Test/1.0'
        }
      };
      
      const response = await makeRequest(options, payloadString);
      
      // Verificar status code
      if (response.statusCode === expectedStatus) {
        log(`✅ Sucesso: Status ${response.statusCode}`, 'green');
        log(`📄 Resposta: ${JSON.stringify(response.body, null, 2)}`, 'blue');
        return { success: true, response };
      } else {
        throw new Error(`Status inesperado: ${response.statusCode}. Esperado: ${expectedStatus}`);
      }
      
    } catch (error) {
      lastError = error;
      log(`❌ Erro na tentativa ${attempt}: ${error.message}`, 'red');
      
      if (attempt < CONFIG.RETRY_ATTEMPTS) {
        log(`⏳ Aguardando ${CONFIG.RETRY_DELAY}ms antes da próxima tentativa...`, 'yellow');
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
      }
    }
  }
  
  return { success: false, error: lastError };
}

// Payloads de teste
const TEST_PAYLOADS = {
  // Teste de inserção de escala
  scheduleInsert: {
    type: 'INSERT',
    table: 'schedules',
    record: {
      id: 'test-schedule-001',
      user_id: 'test-user-001',
      shift_type: 'morning',
      date: '2024-01-15',
      start_time: '08:00:00',
      end_time: '16:00:00',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    schema: 'public'
  },
  
  // Teste de atualização de escala
  scheduleUpdate: {
    type: 'UPDATE',
    table: 'schedules',
    record: {
      id: 'test-schedule-001',
      user_id: 'test-user-001',
      shift_type: 'afternoon',
      date: '2024-01-15',
      start_time: '14:00:00',
      end_time: '22:00:00',
      status: 'confirmed',
      updated_at: new Date().toISOString()
    },
    old_record: {
      id: 'test-schedule-001',
      shift_type: 'morning',
      start_time: '08:00:00',
      end_time: '16:00:00'
    },
    schema: 'public'
  },
  
  // Teste de inserção de troca de turno
  shiftSwapInsert: {
    type: 'INSERT',
    table: 'shift_swaps',
    record: {
      id: 'test-swap-001',
      requester_id: 'test-user-001',
      target_user_id: 'test-user-002',
      original_schedule_id: 'test-schedule-001',
      target_schedule_id: 'test-schedule-002',
      reason: 'Compromisso pessoal',
      status: 'pending',
      created_at: new Date().toISOString()
    },
    schema: 'public'
  },
  
  // Teste de atualização de troca de turno
  shiftSwapUpdate: {
    type: 'UPDATE',
    table: 'shift_swaps',
    record: {
      id: 'test-swap-001',
      status: 'approved',
      approved_by: 'test-manager-001',
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    old_record: {
      id: 'test-swap-001',
      status: 'pending',
      approved_by: null,
      approved_at: null
    },
    schema: 'public'
  },
  
  // Teste de inserção de notificação
  notificationInsert: {
    type: 'INSERT',
    table: 'notifications',
    record: {
      id: 'test-notification-001',
      user_id: 'test-user-001',
      title: 'Nova escala atribuída',
      message: 'Você foi escalado para o turno da manhã em 15/01/2024',
      type: 'schedule',
      priority: 'medium',
      is_read: false,
      created_at: new Date().toISOString()
    },
    schema: 'public'
  }
};

// Testes de autenticação
const AUTH_TESTS = [
  {
    name: 'Webhook sem assinatura',
    modifyHeaders: (headers) => {
      delete headers['x-supabase-signature'];
      return headers;
    },
    expectedStatus: 401
  },
  {
    name: 'Webhook com assinatura inválida',
    modifyHeaders: (headers) => {
      headers['x-supabase-signature'] = 'sha256=invalid_signature';
      return headers;
    },
    expectedStatus: 401
  },
  {
    name: 'Webhook com formato de assinatura incorreto',
    modifyHeaders: (headers) => {
      headers['x-supabase-signature'] = 'invalid_format';
      return headers;
    },
    expectedStatus: 401
  }
];

// Função principal de teste
async function runTests() {
  log('🚀 Iniciando testes de webhooks do Supabase', 'magenta');
  log(`📍 URL Base: ${CONFIG.BASE_URL}`, 'blue');
  log(`🔐 Webhook Secret: ${CONFIG.WEBHOOK_SECRET ? 'Configurado' : 'NÃO CONFIGURADO'}`, CONFIG.WEBHOOK_SECRET ? 'green' : 'red');
  
  if (!CONFIG.WEBHOOK_SECRET) {
    log('❌ SUPABASE_WEBHOOK_SECRET não está configurado!', 'red');
    process.exit(1);
  }
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };
  
  // Testes de funcionalidade principal
  log('\n📋 TESTES DE FUNCIONALIDADE', 'magenta');
  
  const functionalTests = [
    { name: 'Inserção de Escala', endpoint: '/api/webhooks/supabase', payload: TEST_PAYLOADS.scheduleInsert },
    { name: 'Atualização de Escala', endpoint: '/api/webhooks/supabase', payload: TEST_PAYLOADS.scheduleUpdate },
    { name: 'Inserção de Troca de Turno', endpoint: '/api/webhooks/supabase', payload: TEST_PAYLOADS.shiftSwapInsert },
    { name: 'Atualização de Troca de Turno', endpoint: '/api/webhooks/supabase', payload: TEST_PAYLOADS.shiftSwapUpdate },
    { name: 'Inserção de Notificação', endpoint: '/api/webhooks/supabase', payload: TEST_PAYLOADS.notificationInsert }
  ];
  
  for (const test of functionalTests) {
    results.total++;
    const result = await testWebhookWithRetry(test.name, test.endpoint, test.payload);
    
    if (result.success) {
      results.passed++;
    } else {
      results.failed++;
      results.errors.push(`${test.name}: ${result.error.message}`);
    }
  }
  
  // Testes de autenticação
  log('\n🔐 TESTES DE AUTENTICAÇÃO', 'magenta');
  
  for (const authTest of AUTH_TESTS) {
    results.total++;
    
    try {
      log(`\n🧪 Teste: ${authTest.name}`, 'cyan');
      
      const payload = TEST_PAYLOADS.scheduleInsert;
      const payloadString = JSON.stringify(payload);
      
      let headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadString),
        'x-supabase-signature': `sha256=${generateSignature(payloadString, CONFIG.WEBHOOK_SECRET)}`,
        'User-Agent': 'Supabase-Webhook-Test/1.0'
      };
      
      headers = authTest.modifyHeaders(headers);
      
      const url = new URL('/api/webhooks/supabase', CONFIG.BASE_URL);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers
      };
      
      const response = await makeRequest(options, payloadString);
      
      if (response.statusCode === authTest.expectedStatus) {
        log(`✅ Sucesso: Status ${response.statusCode} (esperado)`, 'green');
        results.passed++;
      } else {
        throw new Error(`Status inesperado: ${response.statusCode}. Esperado: ${authTest.expectedStatus}`);
      }
      
    } catch (error) {
      log(`❌ Erro: ${error.message}`, 'red');
      results.failed++;
      results.errors.push(`${authTest.name}: ${error.message}`);
    }
  }
  
  // Resumo dos resultados
  log('\n📊 RESUMO DOS TESTES', 'magenta');
  log(`Total de testes: ${results.total}`, 'blue');
  log(`Sucessos: ${results.passed}`, 'green');
  log(`Falhas: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  if (results.errors.length > 0) {
    log('\n❌ ERROS ENCONTRADOS:', 'red');
    results.errors.forEach((error, index) => {
      log(`${index + 1}. ${error}`, 'red');
    });
  }
  
  // Status final
  if (results.failed === 0) {
    log('\n🎉 Todos os testes passaram!', 'green');
    process.exit(0);
  } else {
    log('\n💥 Alguns testes falharam!', 'red');
    process.exit(1);
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  runTests().catch((error) => {
    log(`💥 Erro fatal: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runTests, testWebhookWithRetry, TEST_PAYLOADS };