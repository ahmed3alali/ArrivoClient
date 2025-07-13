import React from "react";

export const FilterBar = ({
  filters = {
    days: 1,
    numberPersons: { minSize: 1, maxSize: 10 },
    priceRange: { minPrice: 0, maxPrice: 10000 },
  },
  setFilters,
  closeModal,
  filteredWithoutType,
}) => {
  const onDaysChange = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    setFilters((f) => ({ ...f, days: val }));
  };

  const onMinPersonsChange = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val <= (filters?.numberPersons?.maxSize ?? Infinity)) {
      setFilters((f) => ({
        ...f,
        numberPersons: { ...f.numberPersons, minSize: val },
      }));
    }
  };

  const onMaxPersonsChange = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val >= (filters?.numberPersons?.minSize ?? 0)) {
      setFilters((f) => ({
        ...f,
        numberPersons: { ...f.numberPersons, maxSize: val },
      }));
    }
  };

  const onMinPriceChange = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 0) val = 0;
    if (val <= (filters?.priceRange?.maxPrice ?? Infinity)) {
      setFilters((f) => ({
        ...f,
        priceRange: { ...f.priceRange, minPrice: val },
      }));
    }
  };

  const onMaxPriceChange = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 0) val = 0;
    if (val >= (filters?.priceRange?.minPrice ?? 0)) {
      setFilters((f) => ({
        ...f,
        priceRange: { ...f.priceRange, maxPrice: val },
      }));
    }
  };

  return (
    <div className="filter-bar">
      <h2>Filter Trips</h2>

      <div className="filter-group">
        <label htmlFor="days-filter">Max Duration (hours):</label>
        <input
          id="days-filter"
          type="number"
          min={1}
          step={1}
          value={filters.days}
          onChange={onDaysChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="min-persons-filter">Min Group Size:</label>
        <input
          id="min-persons-filter"
          type="number"
          min={1}
          step={1}
          value={filters.numberPersons.minSize}
          onChange={onMinPersonsChange}
        />
        <label htmlFor="max-persons-filter">Max Group Size:</label>
        <input
          id="max-persons-filter"
          type="number"
          min={1}
          step={1}
          value={filters.numberPersons.maxSize}
          onChange={onMaxPersonsChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="min-price-filter">Min Price:</label>
        <input
          id="min-price-filter"
          type="number"
          min={0}
          step={1}
          value={filters.priceRange.minPrice}
          onChange={onMinPriceChange}
        />
        <label htmlFor="max-price-filter">Max Price:</label>
        <input
          id="max-price-filter"
          type="number"
          min={0}
          step={1}
          value={filters.priceRange.maxPrice}
          onChange={onMaxPriceChange}
        />
      </div>

      <button onClick={closeModal} className="apply-button">
        Apply Filters
      </button>

      <style jsx>{`
        .filter-bar {
          padding: 20px;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .filter-group {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
        }
        input {
          width: 100px;
          padding: 5px;
          font-size: 1rem;
        }
        .apply-button {
          margin-top: 20px;
          padding: 10px 15px;
          background: #1e90ff;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }
        .apply-button:hover {
          background: #0d6efd;
        }
      `}</style>
    </div>
  );
};

