# AGENTS.md

## Команды

- Все команды идут через `mise`: bare `npm` не в PATH. Для ad-hoc Node-команд используйте `mise exec -- npm ...`.
- `mise run check` — полный гейт: install → lint/actions → Vitest → typecheck → build → Swift tests; именно его запускает CI на push.
- `mise run check:fast` — только ESLint/Prettier/Swift format lint + jactionlint; достаточно для быстрой итерации.
- `mise run install` = `npm --prefix web ci`; после смены версий в `mise.toml` выполняйте `mise install`, чтобы обновить `mise.lock`.
- Одна тестовая проверка: `mise exec -- npm --prefix web test -- src/App.test.tsx`, `swift test --package-path server --filter healthReturnsOk`.
- `mise run fix` правит Swift format, ESLint и Prettier; `mise run hooks:install` ставит hk хуки: pre-commit чинит staged-файлы, pre-push запускает полный `mise run check`.

## Структура

- Два независимых пакета: `web/` (Vite + React + Mantine, TypeScript) и `server/` (Swift package `App`, Vapor executable target `App`).
- Dev-запуск: `swift run --package-path server App` и `mise run web`; Vite проксирует `/api` на `http://127.0.0.1:8080`.
- Единственный API-маршрут сейчас `GET /api/health` в `server/Sources/App/routes.swift`; фронт читает его напрямую в `web/src/App.tsx`.
- `web/vite.config.ts` импортирует `defineConfig` из `vitest/config`: конфиг тестов лежит там же, шаблоны `src/**/*.test.{ts,tsx}`, setup — `web/src/test/setup.ts` (mocks `matchMedia`, `ResizeObserver`).
- Swift-тесты используют Swift Testing (`@Test`, `#expect`) и `VaporTesting.withApp`; общая сборка приложения для теста — `configureTestApp` в `server/Tests/AppTests/AppTests.swift`.

## Ограничения и готчи

- `.github/workflows/hexlet-check.yml` сгенерирован Хекслетом: не редактировать, не переименовывать, не удалять.
- `.github/jactionlint.yaml` держит `profile: correctness` из-за неизменяемого `hexlet-check.yml` с unpinned actions; не снижать профиль ради прохождения линтера.
- Actions в `ci.yml` закреплены по SHA; CI использует `ubuntu-24.04` и Swift `6.2.1`, хотя README описывает локальный Swift `6.4` — не менять раннер или версию без проверки поддержки `setup-swift`.
- `server/.swift-format`: 4 пробела, 120 символов; линтер и форматтер работают только с `server/Sources` и `server/Tests`.
- Коммиты в истории — однострочные `feat: ...` на русском, без body.
