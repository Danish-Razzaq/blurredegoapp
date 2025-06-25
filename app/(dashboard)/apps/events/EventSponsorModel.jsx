import GenericTable from '@/components/GenericTable';
import React, { useEffect } from 'react';
import { ImCross, ImCheckmark, ImWarning, ImCancelCircle } from 'react-icons/im';
import { MdOutlinePendingActions, MdAttachMoney, MdPeople, MdBusinessCenter } from 'react-icons/md';
import { CgOrganisation } from 'react-icons/cg';

const EventSponsorDashboard = ({ sponsorshipFields= [], show, onClose }) => {
    if (!show) return null;
    const modalRef = React.useRef();

    const sponsorships = sponsorshipFields?.map((item, index) => ({
        id: index + 1,
        label: item.label,
        price: item.price,
        maxLimit: item.maxLimit,
        paidCount: item.paidCount,
        status: item.status,
        reservedBy: item.reservedBy,
    }));

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    const columns = [
        {
            field: 'id',
            header: '# ID',
            render: (params) => <span className="font-medium">{params?.id}</span>,
        },
        {
            field: 'label',
            header: 'Sponsorship Tier',
            render: (params) => (
                <div className="items-start! flex gap-2">
                    <MdBusinessCenter className="h-4 w-4 text-gray-500" />
                    <span
                        className="font-medium"
                        style={{
                            textAlign: 'left!important',
                        }}
                    >
                        {params?.label}
                    </span>
                </div>
            ),
        },
        {
            field: 'price',
            header: 'Price',
            render: (params) => (
                <div className="flex items-center gap-1 ">
                    <MdAttachMoney className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium">{params?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            ),
        },
        {
            field: 'availability',
            header: 'Availability',
            render: (params) => {
                const available = params.maxLimit - params.paidCount;
                const percentage = (params.paidCount / params.maxLimit) * 100;

                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MdPeople className="h-4 w-4 text-blue-500" />
                            <span>
                                {available} of {params.maxLimit} spots available
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                    </div>
                );
            },
        },
        {
            field: 'reservedBy',
            header: 'Reserved Organizations',
            render: (params) => (
                <div className="rounded-lg border bg-white p-2 shadow-sm">
                    {params?.reservedBy && Object.keys(params.reservedBy).length > 0 ? (
                        <div className="space-y-2">
                            {Object.entries(params.reservedBy).map(([company, details]) => {
                                const status = details?.paymentStatus?.toLowerCase() || 'pending';

                                return (
                                    <div key={company} className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                                        <span className="font-medium">{company}</span>
                                        {status === 'paid' && (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                                <ImCheckmark className="mr-1 h-3 w-3" />
                                                Payment Confirmed
                                            </span>
                                        )}
                                        {status === 'pending' && (
                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                                                <MdOutlinePendingActions className="mr-1 h-3 w-3" />
                                                Awaiting Payment
                                            </span>
                                        )}
                                        {status === 'rejected' && (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                                                <ImWarning className="mr-1 h-3 w-3" />
                                                Payment Declined
                                            </span>
                                        )}
                                        {!status && (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                                                <ImCancelCircle className="mr-1 h-3 w-3" />
                                                No Status
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-2 text-gray-500">
                            <CgOrganisation className="mr-2 h-5 w-5" />
                            <span>No Organizations Reserved</span>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div ref={modalRef} className="h-fit max-h-[80vh] w-full max-w-7xl overflow-x-scroll rounded-lg bg-white p-2">
                <div className="flex items-center justify-between border-b p-2">
                    <h2 className="text-xl font-semibold">Sponsorship Status Dashboard</h2>
                    <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <ImCross className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-1 ">
                    <GenericTable columns={columns} data={sponsorships} itemsPerPageOptions={[20, 25, 30]} />
                </div>
            </div>
        </div>
    );
};

export default EventSponsorDashboard;
