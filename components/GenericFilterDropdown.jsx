'use client';
import IconLayoutGrid from '@/public/icon/icon-layout-grid';
import IconListCheck from '@/public/icon/icon-list-check';
import IconSearch from '@/public/icon/icon-search';

const FilterHeader = ({
    value,
    setValue,
    companySearch,
    setCompanySearch,
    searchMemberById,
    setSearchMemberById,
    selectedCountry,
    handleCountryChange,
    uniqueCountries,
    selectedCity,
    handleCityChange,
    uniqueCities,
}) => {
    return (
        <div className="flex w-full flex-wrap justify-between gap-4">
            <h2 className="text-xl">Members</h2>

            {/* Container for buttons and inputs */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3 md:items-center">
                {/* Button Group */}
                <div className="flex gap-2">
                    <button type="button" className={`btn btn-outline-primary h-fit p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                        <IconLayoutGrid />
                    </button>
                    <button type="button" className={`btn btn-outline-primary h-fit p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                        <IconListCheck />
                    </button>
                </div>

                {/* Country and City Select */}
                <div className="flex w-full flex-wrap gap-4 sm:w-auto">
                    <select value={selectedCountry} onChange={handleCountryChange} className="form-select w-full sm:w-[280px]">
                        <option value="">Select Country</option>
                        {uniqueCountries.map((country, index) => (
                            <option key={index} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    {selectedCountry && (
                        <select value={selectedCity} onChange={handleCityChange} className="form-select w-full sm:w-[280px]">
                            <option value="">Select City</option>
                            {uniqueCities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Search by Company */}
                <div className="relative w-full items-center  sm:w-[280px]">
                    <input type="text" placeholder="Search Members by Company" className="peer form-input w-full py-2" value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} />
                    <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                        <IconSearch />
                    </button>
                </div>
                {/* Search by ID */}
                <div className="relative w-full items-center  sm:w-[280px]">
                    <input type="text" placeholder="Search Members by ID" className="peer form-input w-full py-2" value={searchMemberById} onChange={(e) => setSearchMemberById(e.target.value)} />
                    <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                        <IconSearch />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterHeader;
