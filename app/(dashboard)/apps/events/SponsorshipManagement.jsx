'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaDollarSign } from 'react-icons/fa'; 

const SponsorshipManagement = ({ setValue, updateSponsorshipList = [] }) => {
    const [sponsorships, setSponsorships] = useState([]);

    // Initialize sponsorships when in update mode
    useEffect(() => {
        if (updateSponsorshipList?.length > 0) {
            setSponsorships(updateSponsorshipList); // Populate with existing data if updating
        }
    }, [updateSponsorshipList]);

    // Add a new sponsorship item
    const addSponsorship = () => {
        const newSponsorship = {
            id: Date.now(),
            name: '',
            label: '',
            price: 0,
            maxLimit: 1,
            paidCount: 0, 
            quantity: 1, // For Invoice (quantity of items each sponsorship)
            type: 'checkbox',
            validation: {},
            status: 'available',
            reservedBy: null,
            paidBy: null,
        };

        // Add the new sponsorship to the existing sponsorships state
        setSponsorships((prevSponsorships) => {
            const updatedSponsorships = [newSponsorship , ...prevSponsorships,];
            setValue('event_sponsorship_fields', updatedSponsorships); // Update form value
            return updatedSponsorships;
        });
    };

    // Remove a sponsorship item
    const removeSponsorship = (index) => {
        const updatedSponsorships = sponsorships.filter((_, i) => i !== index);
        setSponsorships(updatedSponsorships);
        // Update form value
        setValue('event_sponsorship_fields', updatedSponsorships);
    };
    const handleModifySponsorship = (index, field, value) => {
        setSponsorships((prevSponsorships) => {
            const updatedSponsorships = prevSponsorships.map((sponsorship, i) => {
                if (i === index) {
                    if (field === 'label') {
                        return {
                            ...sponsorship,
                            [field]: value,
                            //lanyard-sponsorship-(usd-3000.00)
                            // set name just until (  start if anywhere start ( then stop and replace with - and lower case
                            name: value.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
                            reservedBy: sponsorship.reservedBy ? sponsorship.reservedBy : null,
                            paidBy: sponsorship.paidBy ? sponsorship.paidBy : null,
                            paidCount: sponsorship.paidCount ? sponsorship.paidCount : 0,
                            status: sponsorship.status ? sponsorship.status : 'available',
                        };
                    }
                    return { ...sponsorship, [field]: value };
                }

                return sponsorship;
            });

            setValue('event_sponsorship_fields', updatedSponsorships); 
            return updatedSponsorships;
        });
    };

    


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Sponsorship Options</h3>
                <button type="button" onClick={addSponsorship} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                    <FaPlus className="h-4 w-4" />
                    Add Sponsorship
                </button>
            </div>

            {/* Render sponsorship fields for adding or updating */}
            <div className="space-y-4">
                {sponsorships.map((sponsorship, index) => (
                    <div key={sponsorship.id} className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sponsorship Title</label>
                                <input
                                    type="text"
                                    value={sponsorship.label}
                                    onChange={(e) => handleModifySponsorship(index, 'label', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="e.g., Welcome Cocktail Sponsorship"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                                    <div className="relative mt-1">
                                        <FaDollarSign className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={sponsorship.price}
                                            onChange={(e) => handleModifySponsorship(index, 'price', Number(e.target.value))}
                                            className="block w-full rounded-md border border-gray-300 py-2 pl-4 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="0.00"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Maximum Slots</label>
                                    <input
                                        type="number"
                                        value={sponsorship.maxLimit}
                                        onChange={(e) => handleModifySponsorship(index, 'maxLimit', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="1"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {sponsorships.length > 1 && (
                            <button type="button" onClick={() => removeSponsorship(index)} className="absolute right-4 top-4 text-red-600 hover:text-red-700">
                                <FaTrash className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SponsorshipManagement;
