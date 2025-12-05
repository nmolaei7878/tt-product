import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SearchFilter from './SearchFilter';
import StatusFilter from './StatusFilter';
import StockRangeFilter from './StockRangeFilter';

const Filters = () => {
  return (
    <>
      <SearchFilter />
      <StatusFilter />
      <CategoryFilter categories={['Active', 'Inactive', 'Discontinued']} />

      <div className="flex gap-2">
        <PriceRangeFilter type="minPrice" />
        <PriceRangeFilter type="maxPrice" />
      </div>

      <div className="flex gap-2">
        <StockRangeFilter type="minStock" />
        <StockRangeFilter type="maxStock" />
      </div>
    </>
  );
};

export default Filters;
