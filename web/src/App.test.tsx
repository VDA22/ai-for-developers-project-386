import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the application shell', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 200 }) as Response),
    )

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Календарь звонков' })).toBeInTheDocument()
    expect(await screen.findByText('Бэкенд доступен')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
