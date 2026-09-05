## Setup

Install all backend and frontend dependencies from the repository root. pnpm uses one hoisted `node_modules` directory for the project:

```bash
pnpm install
```

Useful commands:

```bash
pnpm run type-check
pnpm run build
pnpm run dev:backend
pnpm run dev:frontend
pnpm run dev
```

The backend requires `DATABASE_URL` in `backend/.env`.
