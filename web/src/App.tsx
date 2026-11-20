import { useEffect, useState } from 'react'
import { Badge, Container, Group, Paper, Text, Title, MantineProvider } from '@mantine/core'
import { IconCalendarEvent } from '@tabler/icons-react'

type HealthStatus = 'loading' | 'ok' | 'error'

const healthLabels: Record<HealthStatus, string> = {
  loading: 'Проверка…',
  ok: 'Бэкенд доступен',
  error: 'Бэкенд недоступен',
}

const healthColors: Record<HealthStatus, string> = {
  loading: 'gray',
  ok: 'green',
  error: 'red',
}

export default function App() {
  const [health, setHealth] = useState<HealthStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`)
        }
        setHealth('ok')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setHealth('error')
      })

    return () => controller.abort()
  }, [])

  return (
    <MantineProvider>
      <Container size="sm" py="xl">
        <Paper shadow="xs" p="xl" withBorder>
          <Group justify="space-between" wrap="nowrap">
            <Group>
              <IconCalendarEvent size={28} />
              <div>
                <Title order={1}>Календарь звонков</Title>
                <Text c="dimmed">Фронтенд подключён к бэкенду</Text>
              </div>
            </Group>
            <Badge color={healthColors[health]}>{healthLabels[health]}</Badge>
          </Group>
        </Paper>
      </Container>
    </MantineProvider>
  )
}
