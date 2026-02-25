import React from 'react';

const FilterPanel = ({ items, onFilter }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortBy, setSortBy] = React.useState('name');
    const [sortOrder, setSortOrder] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    const { filterItems, sortItems, paginateItems, getTotalPages } = React.useMemo(() => {
        const filter = (arr, term) => {
            if (!term) return arr;
            return arr.filter(item =>
                item.name.toLowerCase().includes(term.toLowerCase()) ||
                item.description?.toLowerCase().includes(term.toLowerCase())
            );
        };
        const sort = (arr, field, order) => {
            const sorted = [...arr];
            sorted.sort((a, b) => {
                if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
                if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
                return 0;
            });
            return sorted;
        };
        const paginate = (arr, page, size) => {
            const start = (page - 1) * size;
            return arr.slice(start, start + size);
        };
        const getTotalPgs = (count, size) => Math.ceil(count / size);
        return { filterItems: filter, sortItems: sort, paginateItems: paginate, getTotalPages: getTotalPgs };
    }, []);

    const filtered = filterItems(items, searchTerm);
    const sorted = sortItems(filtered, sortBy, sortOrder);
    const totalPages = getTotalPages(sorted.length, pageSize);
    const paginated = paginateItems(sorted, currentPage, pageSize);

    const handleSearch = React.useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const handleSort = React.useCallback((field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    }, [sortBy, sortOrder]);

    const handlePageSizeChange = React.useCallback((e) => {
        setPageSize(parseInt(e.target.value, 10));
        setCurrentPage(1);
    }, []);

    const handlePreviousPage = React.useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);

    const handleNextPage = React.useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, totalPages]);

    React.useEffect(() => {
        onFilter({
            items: paginated,
            searchTerm,
            sortBy,
            sortOrder,
            pageSize,
            currentPage,
            totalPages,
            totalItems: sorted.length,
        });
    }, [paginated, searchTerm, sortBy, sortOrder, pageSize, currentPage, totalPages, sorted.length, onFilter]);

    return (
        <div data-testid="filter-panel" className="filter-panel">
            <input
                data-testid="search-input"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <button data-testid="sort-name" onClick={() => handleSort('name')}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
                data-testid="prev-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            <span data-testid="page-info">Page {currentPage} of {totalPages || 1}</span>
            <button
                data-testid="next-btn"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || totalPages === 0}
            >
                Next
            </button>
            <select data-testid="page-size" value={pageSize} onChange={handlePageSizeChange}>
                <option>5</option>
                <option>10</option>
                <option>25</option>
            </select>
            <span data-testid="count">Showing {paginated.length} of {sorted.length}</span>
        </div>
    );
};

export default FilterPanel;
