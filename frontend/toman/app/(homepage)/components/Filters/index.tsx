import PriceRangeFilter from './PriceRangeFilter';
import SearchFilter from './SearchFilter';
import StatusFilter from './StatusFilter';
import StockRangeFilter from './StockRangeFilter';

const Filters = () => {
  return (
    <>
      <SearchFilter />
      <div className="mt-3">
        <StatusFilter />
      </div>

      <div className="mt-3">
        <PriceRangeFilter type="minPrice" />
        <PriceRangeFilter type="maxPrice" />
      </div>

      <div className="mt-3">
        <StockRangeFilter type="minStock" />
        <StockRangeFilter type="maxStock" />
      </div>
    </>
  );
};

export default Filters;
