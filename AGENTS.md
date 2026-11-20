# AGENTS.md

## Обзор

- Учебный проект Хекслета: сервис бронирования календаря.
- Стек: Swift 6.4 + Vapor 4 на бэкенде, TypeScript + Vite + Mantine на фронтенде.
- Сейчас есть админка типов встреч и форма записи на свободное время; API пока минимальный — health-check.
- `README.md` описывает проект для людей; здесь собраны инструкции и ограничения для агентов.

## Команды

- Все команды идут через `mise`: bare `npm` не в PATH. Для ad-hoc Node-команд используйте `mise exec -- npm ...`.
- Установка: `mise install`, затем `mise run install` (`npm --prefix web ci`); после смены версий в `mise.toml` обновляйте `mise.lock`.
- Разработка: `swift run --package-path server App` и `mise run web`; Vite проксирует `/api` на `http://127.0.0.1:8080`.
- Автоисправление: `mise run fix`; хуки: `mise run hooks:install` (pre-commit чинит staged-файлы, pre-push запускает `mise run check`).

## Тестирование

- Полный гейт: `mise run check` — install → lint/actions → Vitest → typecheck → build → Swift tests; именно его запускает CI и pre-push.
- Быстрая проверка: `mise run check:fast` — ESLint/Prettier/Swift format lint + jactionlint.
- Один тест: `mise exec -- npm --prefix web test -- src/App.test.tsx`, `swift test --package-path server --filter healthReturnsOk`.
- Для изменённого поведения добавляйте или обновляйте тест; не отключайте проверки ради зелёного CI.

## Структура

- Два независимых пакета: `web/` (Vite + React + Mantine, TypeScript) и `server/` (Swift package `App`, Vapor executable target `App`).
- Единственный API-маршрут сейчас `GET /api/health` в `server/Sources/App/routes.swift`; фронт читает его напрямую в `web/src/App.tsx`.
- `web/vite.config.ts` импортирует `defineConfig` из `vitest/config`: конфиг тестов лежит там же, шаблоны `src/**/*.test.{ts,tsx}`, setup — `web/src/test/setup.ts` (mocks `matchMedia`, `ResizeObserver`).
- Swift-тесты используют Swift Testing (`@Test`, `#expect`) и `VaporTesting.withApp`; общая сборка приложения для теста — `configureTestApp` в `server/Tests/AppTests/AppTests.swift`.

## Стиль кода

- Фронтенд: ESLint + Prettier; проверка `mise run check:fast`, исправление `mise run fix`.
- Бэкенд: `server/.swift-format` — 4 пробела, 120 символов; линтер и форматтер работают только с `server/Sources` и `server/Tests`.
- Комментарии в код и конфиги не добавлять без явной просьбы; новые `.md`-файлы — только по явной просьбе.

## Безопасность

- Не коммитить токены, ключи и `.env`; при появлении секретов использовать переменные окружения и GitHub Secrets.
- Actions в `ci.yml` закреплены по SHA, `checkout` использует `persist-credentials: false`; не ослаблять эти настройки ради удобства.
- `skip-verify-signature: true` в `setup-swift` v3 beta — обход бага с импортом GPG-ключей; при обновлении action проверить, можно ли убрать флаг.

## Ограничения и подводные камни

- `.github/workflows/hexlet-check.yml` сгенерирован Хекслетом: не редактировать, не переименовывать, не удалять.
- `.github/jactionlint.yaml` держит `profile: correctness` из-за неизменяемого `hexlet-check.yml` с unpinned actions; не снижать профиль ради прохождения линтера.
- CI использует `ubuntu-24.04` и Swift `6.4` через `setup-swift` v3 beta на Swiftly; стабильный `setup-swift` v2.4.0 знает только до `6.2.1` и не соберёт свежие транзитивные зависимости.

## Pull request

- Перед PR запускать `mise run check`; перед коммитом достаточно `mise run check:fast`.
- Заголовок PR и коммитов — короткая однострочная строка на русском с префиксом `feat:` или `fix:`, без body.
- В описании PR указывать, что изменилось и какими проверками это подтверждено; при изменении команд или архитектуры обновлять `README.md` и этот файл.
