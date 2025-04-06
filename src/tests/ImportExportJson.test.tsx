/// <reference types="vitest" />
import { render, screen } from '@testing-library/react'
import ImportExportJson from '../components/ImportExportJson'

describe('ImportExportJson', () => {
  it('renders export and import buttons', () => {
    render(<ImportExportJson onSuccess={vi.fn()} onError={vi.fn()} />)
    expect(screen.getByText(/Export JSON/i)).toBeInTheDocument()
    expect(screen.getByText(/Import JSON/i)).toBeInTheDocument()
  });
});
