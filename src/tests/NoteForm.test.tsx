/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import NoteForm from '../components/NoteForm';

describe('NoteForm', () => {
  it('shows the form with inputs', () => {
    render(<NoteForm boardId={1} noteToEdit={null} onClose={vi.fn()} />)
    expect(screen.getByPlaceholderText('Note title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Note category')).toBeInTheDocument()
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn()
    render(<NoteForm boardId={1} noteToEdit={null} onClose={onClose} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  });
});
