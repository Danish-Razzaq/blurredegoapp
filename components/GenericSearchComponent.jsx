import React from 'react';

const SearchFields = ({ searchFields }) => {
    return (
        <div className="mb-4 flex w-full flex-col-reverse sm:flex-row items-end justify-end gap-3">
            {searchFields.map((field, index) => (
                <div key={index} className="relative w-full items-center sm:w-[280px]">
                    <input
                        type="text"
                        placeholder={field.placeholder}
                        className="peer form-input w-full py-2"
                        value={field.value}
                        onChange={field.onChange}
                    />
                    <button
                        type="button"
                        className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]"
                    >
                        <field.icon />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SearchFields;
