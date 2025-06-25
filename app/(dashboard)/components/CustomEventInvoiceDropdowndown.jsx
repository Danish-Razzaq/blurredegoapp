import { useState } from 'react';
import { ImCross } from 'react-icons/im';

const InvoiceDropdown = ({invoiceData, setFormData, setAttachedParticipantsModel, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInvoices, setFilteredInvoices] = useState(invoiceData);
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFilteredInvoices(invoiceData.filter((participant) => participant?.attributes?.Invoice_data?.invoiceId?.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSelect = (participant) => {
        const selectedParticipant = participant?.attributes?.Invoice_data 
         const id =   participant?.id;
        setSelectedParticipant({ ...selectedParticipant, id });
        setSearchTerm(`${participant?.attributes?.Invoice_data?.invoiceId} - ${participant?.attributes?.Invoice_data?.name}`);
        setFilteredInvoices([]); // Hide dropdown after selection
    };

    const handleSave = () => {
        if (selectedParticipant) {
            setFormData((prev) => ({
                // id: selectedParticipant.id || '',
                customInvOfID: selectedParticipant.id || '',
                ...prev,
                name: selectedParticipant.name || '',
                companyName: selectedParticipant.companyName || '',
                email: selectedParticipant.email || '',
                // invoiceId: `${selectedParticipant.invoiceId}-AB` || '',
                customInvoice: true,
                mobile : selectedParticipant.mobile || '',
                address: selectedParticipant.address || '',
                attachedParticipants: true,

            }));
        }
        setAttachedParticipantsModel(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div
                className={`relative  w-full max-w-2xl p-6
            ${filteredInvoices?.length > 0 ? 'h-[50%]' : 'h-[auto]'}
             
               overflow-hidden rounded-lg bg-white shadow-xl`}
            >
                <div className="relative mb-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold  color-brand-2">Select Participant</h1>
                            <button className="" onClick={onClose}>
                                <ImCross className="mr-2 " color="red" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-2 flex justify-end">
                        <button className="btn btn-blue px-3" onClick={handleSave}
                        disabled={!selectedParticipant}>
                            Save
                        </button>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by Invoice ID"
                        className="form-control w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {filteredInvoices?.length > 0 && (
                        <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
                            {filteredInvoices.map((participant) =>
                                participant?.attributes?.Invoice_data?.invoiceId !== null && participant?.attributes?.Invoice_data?.invoiceId !== undefined ? (
                                    <li key={participant.id} className="cursor-pointer px-3 py-2 hover:bg-blue-100" onClick={() => handleSelect(participant)}>
                                        {participant?.attributes?.Invoice_data?.invoiceId} - {participant?.attributes?.Invoice_data?.name}
                                    </li>
                                ) : null
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceDropdown;
