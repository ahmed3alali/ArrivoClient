import React from "react";

const FilterBar = ({ filters, setFilters, closeModal, filteredWithoutType }) => {
  // Handlers for changing filters

  const onDaysChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) setFilters((f) => ({ ...f, days: val }));
  };

  const onMinPersonsChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val <= filters.numberPersons.maxSize) {
      setFilters((f) => ({
        ...f,
        numberPersons: { ...f.numberPersons, minSize: val },
      }));
    }
  };

  const onMaxPersonsChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= filters.numberPersons.minSize) {
      setFilters((f) => ({
        ...f,
        numberPersons: { ...f.numberPersons, maxSize: val },
      }));
    }
  };

  const onMinPriceChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val <= filters.priceRange.maxPrice) {
      setFilters((f) => ({
        ...f,
        priceRange: { ...f.priceRange, minPrice: val },
      }));
    }
  };

  const onMaxPriceChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= filters.priceRange.minPrice) {
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
        <label>
          Max Duration (hours):
          <input
            type="number"
            min={1}
            value={filters.days}
            onChange={onDaysChange}
          />
        </label>
      </div>

      <div className="filter-group">
        <label>
          Min Group Size:
          <input
            type="number"
            min={1}
            value={filters.numberPersons.minSize}
            onChange={onMinPersonsChange}
          />
        </label>
        <label>
          Max Group Size:
          <input
            type="number"
            min={1}
            value={filters.numberPersons.maxSize}
            onChange={onMaxPersonsChange}
          />
        </label>
      </div>

      <div className="filter-group">
        <label>
          Min Price:
          <input
            type="number"
            min={0}
            value={filters.priceRange.minPrice}
            onChange={onMinPriceChange}
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            min={0}
            value={filters.priceRange.maxPrice}
            onChange={onMaxPriceChange}
          />
        </label>
      </div>

      <button onClick={closeModal} className="apply-button">
        Apply Filters
      </button>

      <style jsx>{`
        .filter-bar {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .filter-group {
          display: flex;
          gap: 10px;
          align-items: center;
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

export default FilterBar;
