import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Container,
  Group,
  List,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core'
import { Link } from 'react-router-dom'

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

const features = [
  'Выбор типа события и удобного времени для встречи.',
  'Быстрое бронирование с подтверждением и дополнительными заметками.',
  'Управление типами встреч и предстоящих записей в админке.',
]

export default function HomePage() {
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
    <div className="home-page">
      <Container size="lg" py="xl">
        <Group justify="flex-end" mb="lg">
          <Badge color={healthColors[health]}>{healthLabels[health]}</Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          <div>
            <Title order={1}>Calendar</Title>
            <Text mt="md" c="dimmed">
              Забронируйте встречу за минуту: выберите тип события и удобное время
            </Text>
            <Button component={Link} to="/booking" mt="xl">
              Записаться
            </Button>
          </div>
          <Paper shadow="xs" p="xl" withBorder radius="md">
            <Title order={2}>Возможности</Title>
            <List spacing="sm" mt="md">
              {features.map((feature) => (
                <List.Item key={feature}>{feature}</List.Item>
              ))}
            </List>
          </Paper>
        </SimpleGrid>
      </Container>
    </div>
  )
}
