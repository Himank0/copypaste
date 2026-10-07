# CMD UI Code Generation Workspace

This repository contains the **Contract Management Database (CMD) UI** — a React + TypeScript + Vite application — along with a **spec-driven code generation workflow** that lets the team generate new screens consistently using AI, governed by a shared architecture constitution.

## What's in this repo

```
specs/ui/            Screen specs (input) — one markdown file + optional legacy screenshot per screen
ui/                   The React application (source of truth for the running app)
.github/prompts/      Governance docs: UI_Constitution.md, ui-codegen.prompt.md, UI_CODEGEN_GUIDE.md
```

- **`ui/`** — The actual Vite + React + TypeScript app. See [ui/package.json](ui/package.json) for scripts.
- **`specs/ui/`** — Each subfolder is a "domain" (e.g. `home/`, `login/`, `advanced_search/`) containing spec markdown files and, for new screens, the legacy screenshot being replaced.
- **`specs/ui/_template/UI_Spec_Template.md`** — Copy this to start a new screen spec.
- **`.github/prompts/constitution/UI_Constitution.md`** — The architecture rulebook (folder structure, component patterns, data fetching, validation, error handling, etc.) that all generated code must follow.
- **`.github/prompts/ui-codegen.prompt.md`** — The `/ui-codegen` agent prompt that reads a spec and generates the screen.
- **`.github/prompts/UI_CODEGEN_GUIDE.md`** — Full setup & usage guide for the codegen workflow (start here if you're new).

## Getting started

### Prerequisites
- Node.js (LTS) and npm
- VS Code with GitHub Copilot

### Install & run the app

```powershell
cd ui
npm install
npm run dev
```

Other useful scripts (run from `ui/`):

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and produce a production build in `ui/dist/` |
| `npm run typecheck` | Run TypeScript checks only |
| `npm run preview` | Preview an individual component in isolation via `preview.html` |
| `npm run lint` | Run ESLint |

### Generating a new screen

1. Read **`.github/prompts/UI_CODEGEN_GUIDE.md`** for the full walkthrough.
2. Copy `specs/ui/_template/UI_Spec_Template.md` into a new folder under `specs/ui/<domain_name>/`, and fill it in. If the screen is based on a legacy page, place the screenshot in the same folder.
3. In VS Code Copilot Chat, run:
   ```
   /ui-codegen <domain_name>/<your_spec_file>.md
   ```
4. The agent will read the spec (and screenshot, if any), follow `UI_Constitution.md`, and generate/modify the relevant files under `ui/src/`.
5. Validate with `npm run build` and `npm run typecheck` before committing.

## Architecture at a glance

- **Feature-based structure**: screens live in `ui/src/features/<domain>/`, shared UI in `ui/src/components/{common,layout,modal,table}/`.
- **Service layer**: `ui/src/services/` holds domain services and mappers; mock fixtures live in `ui/src/services/mocks/`; request/response shapes live in `ui/src/types/{dto,viewmodel}/`.
- **Hooks**: stateful data-fetching orchestration lives in `ui/src/hooks/` (shared) or feature-local `hooks/` folders — components stay presentational.
- **Validation**: shared composable validators live in `ui/src/utils/validation.ts`.
- **Error handling**: a root-level `ErrorBoundary` (`ui/src/components/common/ErrorBoundary.tsx`) wraps the app.
- **Routing**: `react-router-dom`, with centralized route paths (`ui/src/routes/paths.ts`) and nav items (`ui/src/routes/navItems.ts`).

See `UI_Constitution.md` for the full, authoritative set of rules.

## Status

This codebase currently includes two fully generated reference screens (Login, Home Dashboard) plus Advanced Search, and has had an enterprise-standard architecture review applied (hooks extraction, error boundary, mock data folder, shared validation utility). Git version control and CI are not yet set up — see the team for current rollout status before cloning/sharing further.
