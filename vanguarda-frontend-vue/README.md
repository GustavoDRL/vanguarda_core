# Vanguarda - Frontend de Simulação de Consórcio

Frontend simplificado em Vue 3 para simulação de consórcio.

## 🚀 Tecnologias

- Vue 3 (Composition API)
- Vite
- Pinia (State Management)
- Vue Router
- Axios

## 📦 Instalação

```bash
npm install
```

## 🔧 Desenvolvimento

```bash
npm run dev
```

Abre em: http://localhost:3000

## 🏗️ Build

```bash
npm run build
```

## 📁 Estrutura

```
src/
├── assets/          # Imagens, fontes, etc
├── components/      # Componentes reutilizáveis
├── views/           # Telas/páginas
├── services/        # Integração com API
├── stores/          # Estado global (Pinia)
├── utils/           # Funções utilitárias
├── router/          # Configuração de rotas
├── App.vue          # Componente raiz
└── main.js          # Entry point
```

## 🔄 Fluxo da Aplicação

1. **Simulador** - Simula consórcio
2. **Resultado** - Exibe valores calculados
3. **Cliente** - Cadastro/busca de cliente
4. **Escolha** - Criar reserva ou proposta
5. **Confirmação** - Sucesso!

## 🔌 Backend

Backend deve estar rodando em: http://localhost:8000
