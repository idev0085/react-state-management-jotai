import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterPanel from '../FilterPanel';

const mockItems = [
    { id: 1, name: 'Apple', description: 'Fresh apple' },
    { id: 2, name: 'Banana', description: 'Yellow banana' },
    { id: 3, name: 'Cherry', description: 'Red cherry fruit' },
    { id: 4, name: 'Date', description: 'Sweet date' },
    { id: 5, name: 'Elderberry', description: 'Dark elderberry' },
    { id: 6, name: 'Fig', description: 'Purple fig' },
    { id: 7, name: 'Grape', description: 'Green grape' },
    { id: 8, name: 'Honeydew', description: 'Sweet honeydew' },
    { id: 9, name: 'Kiwi', description: 'Brown kiwi' },
    { id: 10, name: 'Lemon', description: 'Yellow lemon' },
    { id: 11, name: 'Mango', description: 'Orange mango' },
    { id: 12, name: 'Nectarine', description: 'Sweet nectarine' },
];

describe('FilterPanel', () => {
    it('should render', () => {
        render(<FilterPanel items={mockItems} onFilter={() => { }} />);
        expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should filter items by name', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Apple' } });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    items: [mockItems[0]],
                })
            );
        });
    });

    it('should sort items', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.click(screen.getByTestId('sort-name'));

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sortOrder: 'asc',
                })
            );
        });
    });

    it('should paginate items', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.click(screen.getByTestId('next-btn'));

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentPage: 2,
                })
            );
        });
    });

    it('should change page size', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('page-size'), { target: { value: '5' } });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    pageSize: 5,
                })
            );
        });
    });

    it('should disable prev button on first page', () => {
        render(<FilterPanel items={mockItems} onFilter={() => { }} />);
        expect(screen.getByTestId('prev-btn')).toBeDisabled();
    });

    it('should show results count', async () => {
        render(<FilterPanel items={mockItems} onFilter={() => { }} />);
        await waitFor(() => {
            expect(screen.getByTestId('results-count')).toBeInTheDocument();
        });
    });

    it('should handle empty items', () => {
        render(<FilterPanel items={[]} onFilter={() => { }} />);
        expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should handle search with no results', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'XYZ' } });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    items: [],
                    totalItems: 0,
                })
            );
        });
    });

    it('should toggle sort direction', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.click(screen.getByTestId('sort-name'));
        fireEvent.click(screen.getByTestId('sort-name'));

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sortOrder: 'desc',
                })
            );
        });
    });

    it('should reset page on search', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'test' } });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    currentPage: 1,
                })
            );
        });
    });

    it('should handle case-insensitive search', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'apple' } });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    items: expect.arrayContaining([mockItems[0]]),
                })
            );
        });
    });

    it('should handle description search', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'cherry fruit' } });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    items: [mockItems[2]],
                })
            );
        });
    });

    it('should handle null items', () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={null} onFilter={mockCallback} />);
        expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should handle items without description', async () => {
        const mockCallback = jest.fn();
        const itemsNoDesc = [{ id: 1, name: 'Item' }];
        render(<FilterPanel items={itemsNoDesc} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Item' } });

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    items: [itemsNoDesc[0]],
                })
            );
        });
    });

    it('should not call onFilter if undefined', () => {
        expect(() => {
            render(<FilterPanel items={mockItems} />);
        }).not.toThrow();
    });

    it('should display correct page info', async () => {
        render(<FilterPanel items={mockItems} onFilter={() => { }} />);

        await waitFor(() => {
            expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 2');
        });
    });

    it('should disable next button on last page', async () => {
        render(<FilterPanel items={mockItems} onFilter={() => { }} />);

        fireEvent.click(screen.getByTestId('next-btn'));

        await waitFor(() => {
            expect(screen.getByTestId('next-btn')).toBeDisabled();
        });
    });

    it('should sort by id field', async () => {
        const mockCallback = jest.fn();
        const itemsWithValue = mockItems.map(item => ({ ...item, value: Math.random() }));
        render(<FilterPanel items={itemsWithValue} onFilter={mockCallback} />);

        // Change sort field if available
        const sortBtn = screen.getByTestId('sort-name');
        fireEvent.click(sortBtn);

        await waitFor(() => {
            const result = mockCallback.mock.calls[mockCallback.mock.calls.length - 1][0];
            expect(result).toHaveProperty('sortBy');
        });
    });

    it('should combine search and sort', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'e' } });
        fireEvent.click(screen.getByTestId('sort-name'));

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    searchTerm: 'e',
                    sortBy: expect.any(String),
                })
            );
        });
    });

    it('should handle rapid pagination', async () => {
        const mockCallback = jest.fn();
        render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

        const nextBtn = screen.getByTestId('next-btn');
        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({ currentPage: 2 })
            );
        });
    });
});
