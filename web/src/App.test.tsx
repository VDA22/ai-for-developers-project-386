import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

beforeEach(() => {
  window.history.pushState({}, '', '/')
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, status: 200 }) as Response),
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the home page with a booking link', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Calendar' })).toBeInTheDocument()
    expect(
      screen.getByText('Забронируйте встречу за минуту: выберите тип события и удобное время'),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Возможности' })).toBeInTheDocument()
    expect(
      screen.getByText('Выбор типа события и удобного времени для встречи.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Быстрое бронирование с подтверждением и дополнительными заметками.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Управление типами встреч и предстоящих записей в админке.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Записаться' })).toHaveAttribute('href', '/booking')
    expect(await screen.findByText('Бэкенд доступен')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('opens the booking page stub when the booking link is clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'Записаться' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Записаться' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/booking')
  })
})
