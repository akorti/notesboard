/// <reference types="vitest" />
import { render, screen } from '@testing-library/react'
import BoardList from '../components/BoardList'
import { useBoardsStore } from '../stores/boardsStore'

vi.mock('../stores/boardsStore', () => ({
  useBoardsStore: vi.fn(),
}))

const mockedUseBoardsStore = useBoardsStore as unknown as ReturnType<typeof vi.fn>

describe('BoardList', () => {
  it('renders board names', () => {
    mockedUseBoardsStore.mockReturnValue({
      boards: [{ id: 1, name: 'Board A' }, { id: 2, name: 'Board B' }],
      selectedBoard: 1,
      setSelectedBoard: vi.fn(),
    })

    render(<BoardList />)
    expect(screen.getByText('Board A')).toBeInTheDocument()
    expect(screen.getByText('Board B')).toBeInTheDocument()
  });
});
