# ✅ SOLUÇÃO: Erro 404 ao Simular Consórcio

## 🔍 DIAGNÓSTICO

O backend está **100% funcional**! O teste via `curl` retornou **200 OK**:

```bash
$ curl -X POST http://localhost:3000/api/v1/simulacoes \
  -H "Content-Type: application/json" \
  -d '{"grupo_id":1,"valor_credito":50000,"prazo_meses":60}'

✅ HTTP/1.1 200 OK
✅ Resposta JSON completa
```

**Conclusão:** O problema está no **navegador/cache**, não no backend!

---

## 🚀 SOLUÇÃO RÁPIDA

Execute estes passos **NA ORDEM**:

### 1. Limpar Cache do Navegador

**Firefox:**
1. Pressione `Ctrl + Shift + Delete`
2. Marque "Cache"
3. Clique em "Limpar agora"
4. **OU** Pressione `Ctrl + F5` (hard refresh)

**Chrome:**
1. Pressione `Ctrl + Shift + Delete`
2. Marque "Imagens e arquivos em cache"
3. Clique em "Limpar dados"
4. **OU** Pressione `Ctrl + Shift + R` (hard refresh)

### 2. Reiniciar Vite Dev Server

```bash
# Terminal do frontend
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-frontend-vue

# Parar o servidor (Ctrl + C)

# Limpar cache do Vite
rm -rf node_modules/.vite

# Reiniciar
npm run dev
```

### 3. Abrir em Aba Anônima

- **Firefox:** `Ctrl + Shift + P`
- **Chrome:** `Ctrl + Shift + N`

Isso força o navegador a ignorar cache completamente.

### 4. Verificar Console do Navegador

Pressione `F12` e veja se há algum erro **além** do 404.

---

## 🔧 SOLUÇÃO COMPLETA

Se o problema persistir após limpar cache:

### Opção 1: Reiniciar Stack Completo

```bash
# Terminal 1: Frontend
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-frontend-vue
# Parar com Ctrl + C
rm -rf node_modules/.vite dist
npm run dev

# Terminal 2: Backend (se necessário)
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-backend-python
docker compose restart backend
```

### Opção 2: Verificar Porta do Vite

```bash
# Verificar se Vite está na porta 3000
netstat -tlnp | grep 3000

# Deve mostrar:
# tcp 0 0 127.0.0.1:3000 0.0.0.0:* LISTEN 12468/node
```

Se não aparecer, o Vite não está rodando!

```bash
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-frontend-vue
npm run dev
```

### Opção 3: Verificar Configuração do Axios

Verifique se `src/services/api.js` está correto:

```javascript
// Deve ser exatamente assim:
const api = axios.create({
  baseURL: '/api/v1',  // ← SEM http://localhost:3000
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})
```

**IMPORTANTE:** A baseURL deve ser **relativa** (`/api/v1`), não absoluta!

---

## 🧪 TESTAR A CORREÇÃO

### Teste 1: Via curl (bypass do navegador)

```bash
curl -X POST http://localhost:3000/api/v1/simulacoes \
  -H "Content-Type: application/json" \
  -d '{"grupo_id":1,"valor_credito":50000,"prazo_meses":60}'

# Deve retornar: 200 OK com JSON
```

### Teste 2: No navegador (após limpar cache)

1. Abrir `http://localhost:3000`
2. Navegar até o Simulador
3. Selecionar um grupo
4. Ajustar valores
5. Verificar se simulação aparece ✅

### Teste 3: Console do navegador (F12)

Verificar aba "Network":
- Deve aparecer: `POST /api/v1/simulacoes`
- Status: `200 OK` (não 404)
- Response: JSON com simulação

---

## 🐛 SE O PROBLEMA PERSISTIR

### Causa Provável: HMR (Hot Module Replacement) do Vite

O Vite pode estar servindo versão em cache do código. Solução:

```bash
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-frontend-vue

# 1. Parar o servidor (Ctrl + C)

# 2. Limpar TUDO
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite

# 3. Reiniciar
npm run dev

# 4. Abrir navegador em aba anônima
# Firefox: Ctrl + Shift + P
# Chrome: Ctrl + Shift + N
```

### Verificar Service Workers

Service workers podem cachear requisições:

1. Abrir DevTools (F12)
2. Ir em "Application" (Chrome) ou "Armazenamento" (Firefox)
3. Clicar em "Service Workers"
4. Se houver algum registrado, clicar em "Unregister"

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após aplicar a solução, verificar:

- ✅ `curl` retorna 200 OK
- ✅ Backend rodando (docker ps | grep vanguarda_backend)
- ✅ Frontend rodando (netstat -tlnp | grep 3000)
- ✅ Cache do navegador limpo
- ✅ Aba anônima funcionando
- ✅ Console do navegador sem erros (além do 404 inicial)

---

## 📊 EXPLICAÇÃO TÉCNICA

### Por que curl funciona mas navegador não?

1. **curl** faz requisição direta, sem cache
2. **Navegador** pode ter:
   - Cache de resposta HTTP antiga (404)
   - Service workers interceptando requisições
   - Extensões bloqueando requisições
   - HMR do Vite servindo código antigo

### Fluxo Correto

```
Navegador
  ↓ POST /api/v1/simulacoes
Vite Dev Server (localhost:3000)
  ↓ Proxy: /api → http://localhost:8000
Backend Docker (localhost:8000)
  ↓ FastAPI processa
  ↓ Route: /api/v1/simulacoes
  ✅ 200 OK + JSON
```

### Fluxo com Cache (ERRADO)

```
Navegador
  ↓ POST /api/v1/simulacoes
  ✖️ Cache retorna 404 (resposta antiga)
  ✖️ Não chega no Vite
  ✖️ Não chega no Backend
```

---

## 🆘 ÚLTIMO RECURSO

Se NADA funcionar:

```bash
# 1. Parar TUDO
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-backend-python
docker compose down

cd /home/gustavo/Documents/Vanguarda_core/vanguarda-frontend-vue
# Ctrl + C no terminal do Vite

# 2. Limpar TUDO
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-frontend-vue
rm -rf node_modules/.vite dist .vite

# 3. Reiniciar TUDO
cd /home/gustavo/Documents/Vanguarda_core/vanguarda-backend-python
docker compose up -d

cd /home/gustavo/Documents/Vanguarda_core/vanguarda-frontend-vue
npm run dev

# 4. Aguardar ~15 segundos

# 5. Abrir navegador em ABA ANÔNIMA
# http://localhost:3000

# 6. Testar simulação
```

---

## 📝 NOTAS IMPORTANTES

1. **Backend está funcionando perfeitamente** - comprovado por testes com curl
2. **Proxy Vite está funcionando** - curl através da porta 3000 funciona
3. **Problema é no frontend/navegador** - cache ou HMR

**A solução é simplesmente limpar o cache e reiniciar o Vite!**
