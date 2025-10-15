# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vanguarda is a Vue 3 frontend application for simulating consortium proposals. It connects to a Python backend API (expected at `http://localhost:8000`) to handle consortium simulations, client management, and proposal/reservation creation.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

## Architecture

### Application Flow
The application follows a linear wizard-like flow:
1. **Simulador** - User inputs consortium simulation parameters
2. **Resultado** - Displays calculated values and charts
3. **Cliente** - Client data entry or search (integrates with ViaCEP API)
4. **Escolha** - Choose between creating a Reserva or Proposta
5. **Confirmação** - Success confirmation

### State Management Pattern
The app uses **Pinia stores** with Composition API pattern. Each domain has its own store:
- `auth.js` - JWT authentication (token stored in localStorage)
- `simulacao.js` - Simulation data and results
- `cliente.js` - Client information
- `reserva.js` - Reservation creation
- `proposta.js` - Proposal creation

All stores follow the same pattern:
```javascript
export const useXStore = defineStore('x', () => {
  const data = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  async function action() { /* ... */ }

  return { data, carregando, erro, action }
})
```

### Service Layer
Services in `src/services/` handle all API communication:
- Each service exports functions that return Axios promises
- `api.js` configures the base Axios instance with `/api/v1` prefix
- Authentication token is automatically injected via interceptor in auth service

### Backend Communication
- API base URL: `/api/v1` (proxied to `http://localhost:8000` in dev)
- Proxy configured in `vite.config.js` for CORS handling
- All requests go through `/api` path which is proxied to backend

### Utilities
- `masks.js` - Input masking for CPF, phone, CEP
- `formatters.js` - Display formatting for currency, dates, etc.
- `validators.js` - Form validation functions
- `viacep.js` - Integration with public ViaCEP API for address lookup

### Routing
Simple router configuration in `src/router/index.js`:
- Default route redirects to `/simulador`
- All routes use lazy loading with dynamic imports
- No authentication guards currently implemented

## Important Implementation Details

### Fixed Values
- **Grupo ID**: Currently hardcoded to `1` in simulation flows
- **Cidade/Estado IDs**: Hardcoded to `1` in address forms
- These should be made dynamic when backend supports multiple groups/locations

### Authentication
- Uses JWT tokens stored in `localStorage`
- Token key: implementation detail in `auth.service.js`
- No automatic token refresh implemented
- No route guards - authentication is handled at component level

### API Integration
- Backend must be running at `http://localhost:8000`
- Backend must include CORS middleware allowing `http://localhost:3000`
- API expects `/api/v1` prefix on all endpoints
- Timeout set to 30 seconds for all requests

### Environment Variables
Optional `.env` file can override:
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000/api/v1`)
- `VITE_PORT` - Dev server port (default: 3000)

## Common Issues

### CORS Errors
Ensure backend has CORS middleware configured for `http://localhost:3000`

### Port Already in Use
Change port in `vite.config.js` server section or use `VITE_PORT` env var

### Module Resolution
Alias `@` points to `src/` directory (configured in `vite.config.js`)

## Tech Stack
- Vue 3 (Composition API)
- Vite (build tool)
- Pinia (state management)
- Vue Router (routing)
- Axios (HTTP client)
- Chart.js + vue-chartjs (data visualization)
