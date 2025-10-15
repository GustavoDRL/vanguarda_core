# 🚀 INSTRUÇÕES DE INSTALAÇÃO E EXECUÇÃO

## 📋 Pré-requisitos

- Node.js v16+ instalado
- Backend Python rodando em `http://localhost:8000`

## 🔧 Instalação

### 1. Entre no diretório do projeto

```bash
cd /home/gustavo/Documents/Vanguarda/vanguarda-frontend-vue
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente (opcional)

```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário para alterar a URL do backend.

## ▶️ Executar em Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

## 👁️ Preview do Build

```bash
npm run preview
```

## 🧪 Como Testar

### 1. Certifique-se que o backend está rodando

```bash
# No diretório do backend
uvicorn app.main:app --reload
```

### 2. Execute o frontend

```bash
# No diretório do frontend
npm run dev
```

### 3. Acesse o navegador

Abra: http://localhost:3000

### 4. Faça login

Use as credenciais do backend (provavelmente):
- **Login**: vendedor
- **Senha**: senha123

### 5. Teste o fluxo completo

1. Preencha os dados da simulação
2. Clique em "Simular"
3. Veja o resultado
4. Clique em "Continuar"
5. Preencha ou busque dados do cliente
6. Escolha criar Reserva ou Proposta
7. Veja a confirmação!

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Estilos globais
├── components/      # Componentes reutilizáveis
│   ├── AlertMessage.vue
│   ├── AppHeader.vue
│   └── LoadingSpinner.vue
├── views/           # Páginas/telas
│   ├── Login.vue
│   ├── Simulador.vue
│   ├── Resultado.vue
│   ├── Cliente.vue
│   ├── Escolha.vue
│   └── Confirmacao.vue
├── services/        # Integração com API
│   ├── api.js
│   ├── auth.service.js
│   ├── simulacao.service.js
│   ├── cliente.service.js
│   ├── reserva.service.js
│   └── proposta.service.js
├── stores/          # Estado global (Pinia)
│   ├── auth.js
│   ├── simulacao.js
│   ├── cliente.js
│   ├── reserva.js
│   └── proposta.js
├── utils/           # Funções utilitárias
│   ├── masks.js
│   ├── formatters.js
│   ├── validators.js
│   └── viacep.js
├── router/          # Configuração de rotas
│   └── index.js
├── App.vue          # Componente raiz
└── main.js          # Entry point
```

## 🔄 Fluxo da Aplicação

```
Login → Simulador → Resultado → Cliente → Escolha → Confirmação
```

## 🎨 Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Roteamento
- **Axios** - HTTP client

## 🐛 Problemas Comuns

### Erro de CORS

Se aparecer erro de CORS, certifique-se que o backend tem:

```python
# No backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Porta 3000 já em uso

Altere a porta no arquivo `vite.config.js`:

```javascript
server: {
  port: 3001 // Ou outra porta
}
```

### Módulos não encontrados

Delete `node_modules` e reinstale:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas Importantes

1. **Grupo ID Fixo**: Por enquanto o frontend usa `grupo_id: 1` fixo. Pode ser melhorado depois com seleção de grupos.

2. **Cidade/Estado IDs**: Endereço usa IDs fixos (1) para cidade e estado. Deve ser ajustado quando tiver tabelas de localidades.

3. **Busca de CEP**: Usa API pública ViaCEP, funciona sem configuração.

4. **Validações**: Validações básicas implementadas. Pode adicionar mais conforme necessário.

5. **Máscaras**: Máscaras de CPF, telefone, CEP aplicadas automaticamente.

## 🔐 Autenticação

O sistema usa JWT tokens armazenados no `localStorage`. O token é automaticamente incluído em todas as requisições após o login.

## 🎯 Próximos Passos (Melhorias Futuras)

1. Adicionar seleção de grupos na simulação
2. Criar tabelas de cidades/estados
3. Adicionar telas de listagem (reservas/propostas)
4. Implementar edição de reservas/propostas
5. Adicionar validações mais robustas
6. Implementar testes unitários
7. Adicionar mais feedback visual
8. Implementar paginação nas listagens

## 📞 Suporte

Se encontrar problemas, verifique:
1. Backend está rodando?
2. Variáveis de ambiente corretas?
3. Dependências instaladas?
4. Console do navegador tem erros?
