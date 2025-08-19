# Repository Guidelines

These guidelines define how to structure, build, test, and contribute to this repository. The repo currently has minimal scaffolding; follow the conventions below as you add code.

## Project Structure & Module Organization

- `src/`: Application and library code (group by domain or feature).
- `tests/`: Automated tests mirroring `src/` (e.g., `tests/foo/` for `src/foo/`).
- `scripts/`: Developer scripts (setup, release, data tasks).
- `assets/` or `public/`: Static files (images, schemas, fixtures).
- `docs/`: Architecture notes, ADRs, and usage docs.
- `.github/`: CI workflows, issue/PR templates.

Example: `src/app/`, `src/core/`, `tests/app/`, `scripts/release.sh`.

## Build, Test, and Development Commands

Prefer a `Makefile` as a uniform entrypoint; add wrappers even if the underlying tool differs by language.

- `make setup`: Install toolchain and dependencies.
- `make build`: Compile or bundle the project.
- `make test`: Run the test suite with coverage.
- `make lint`: Run formatters and linters.
- `make run`: Run the app locally (watch mode if supported).

If a Makefile is not present, use the native tool, e.g., `npm ci && npm run build`, `pytest -q`, `cargo build`, or `go test ./...`.

## Coding Style & Naming Conventions

- Indentation: 2 spaces for web/TypeScript; 4 spaces for Python/Go.
- Naming: `kebab-case` for files, `snake_case` for Python, `camelCase` for vars/functions, `PascalCase` for types/components.
- Formatting: Prefer automatic tools (examples) — JavaScript/TS: `prettier` + `eslint`; Python: `black` + `ruff`; Go: `gofmt`/`golangci-lint`.
- Add an `.editorconfig` to enforce basics across editors.

## Testing Guidelines

- Place tests in `tests/` mirroring `src/` paths.
- Naming: Python `test_*.py`; JS/TS `*.spec.ts`; Go `_test.go`.
- Coverage: target ≥ 80% for changed code; include edge cases and error paths.
- Run locally with `make test` (or framework equivalent). Add fixtures under `tests/fixtures/`.

## Commit & Pull Request Guidelines

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.
- Commits: small, scoped, and passing tests/linters.
- PRs: clear description, motivation, and scope; link issues (e.g., `Closes #123`); include screenshots for UI changes and notes for breaking changes; update docs when behavior changes.

## Security & Configuration Tips

- Never commit secrets. Use `.env` (ignored) and provide `.env.example`.
- Validate user input and handle errors explicitly. Prefer least-privilege defaults.
- Pin tool and dependency versions where feasible to ensure reproducible builds.

