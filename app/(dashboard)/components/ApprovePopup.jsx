import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FcApproval } from 'react-icons/fc';
import { MdOutlinePendingActions } from 'react-icons/md';
import { apiCallerWithStatusCode } from '@/utils/api';
import { SuccessNotification } from '@/components/Toster/success';
import { ToastContainer } from 'react-toastify';
import { ImCancelCircle, ImCheckmark, ImWarning } from 'react-icons/im';
const ApprovePopup = ({ item, onCancel, event_name_reg }) => {
    const [loading, setLoading] = useState(false);
    const [sponsorshipFields, setSponsorshipFields] = useState([]);
    const [approvalStates, setApprovalStates] = useState({});
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedSponsorship, setSelectedSponsorship] = useState(null);
    const [sponsorshipFieldsForUpdate, setSponsorshipFieldsForUpdate] = useState(null);
    const [eventParticipantForUpdate, setEventParticipantForUpdate] = useState(null);
    const [eventId, setEventId] = useState(null);
    // console.log('sponsorshipFields', sponsorshipFields)
    // console.log('sponsorshipFieldsForUpdate', sponsorshipFieldsForUpdate)

    useEffect(() => {
        const getSponsorshipFields = async () => {

            const fields = await apiCallerWithStatusCode('get', `events?filters[event_name]=${event_name_reg}&populate=*`);
            const eventParticipant = await apiCallerWithStatusCode('get', `event-participants/${item?.id}`);

            setSponsorshipFields(fields?.data?.data[0]?.attributes?.event_sponsorship_fields);
            setSponsorshipFieldsForUpdate(fields?.data?.data[0]?.attributes);
            setEventParticipantForUpdate(eventParticipant?.data?.data?.attributes);
            setEventId(fields?.data?.data[0]?.id);
        };

        getSponsorshipFields();
    }, []);

    const selectedSponsorships = sponsorshipFields
        ?.filter((field) => item?.[field.name])
        .reduce((acc, field) => {
            acc[field.name] = { label: field.label, price: field.price, amount: field.price };
            return acc;
        }, {});

    const sponsorshipFieldsTable = sponsorshipFields?.filter((field) => {
        return Object.keys(selectedSponsorships).includes(field.name);
    });

    const handleApprovalChange = (fieldName, isApproved) => {
        setSelectedSponsorship({ fieldName, isApproved });
        setShowConfirmDialog(true);
    };

    const confirmApproval = async () => {
        try {
            setLoading(true);
            setApprovalStates((prev) => ({
                ...prev,
                [selectedSponsorship.fieldName]: selectedSponsorship.isApproved,
            }));
            // Here you would implement your approval logic
            // await updateSponsorshipApproval(selectedSponsorship.fieldName, selectedSponsorship.isApproved);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            setLoading(true);

            // Add the approval status (true/false) into sponsorship fields
            const updatedItemApproved = Object.keys(approvalStates).reduce((acc, key) => {
                const field = sponsorshipFieldsTable?.find((field) => field.name === key);
                if (field) {
                    acc[field.name] = {
                        ...field,
                        status: field.status === 'available' && approvalStates[field.name] ? 'reserved' : field.status,
                        reservedBy: {
                            ...field.reservedBy,
                            [item.companyName]: {
                                paymentStatus: approvalStates[field.name] ? 'pending' : 'rejected',
                            },
                        },
                    };
                }
                return acc;
            }, {});

            // Merge `updatedItemApproved` with `sponsorshipFields`
            const mergedSponsorshipFields = sponsorshipFields?.map((field) => {
                if (updatedItemApproved[field.name]) {
                    return {
                        ...field,
                        ...updatedItemApproved[field.name],
                    };
                }
                return field;
            });

            // Convert mergedSponsorshipFields from object format to an array format
            const sponsorshipFieldsArray = mergedSponsorshipFields?.map((field) => ({
                id: field.id,
                name: field.name,
                label: field.label,
                price: field.price,
                maxLimit: field.maxLimit,
                quantity: field.quantity,
                type: field.type,
                paidCount: field.paidCount || 0,
                status: field.status || 'available', // Add default status if not provided
                reservedBy: field.reservedBy || null, // Add default reservedBy if not provided
                validation: field.validation || {}, // Add default validation if not provided
            }));

            const updatedItemBody = {
                ...eventParticipantForUpdate,
                Registration_Data: {
                    ...item,
                    ...approvalStates,
                    approved: 'Yes',
                    mailTrigger: true,
                },
            };

            const updatedEventBody = {
                ...sponsorshipFieldsForUpdate,
                event_banner_image: sponsorshipFieldsForUpdate?.event_banner_image?.id,
                event_sponsorship_fields: sponsorshipFieldsArray, // Use the transformed array here
            };

            // console.log('updatedEventBody', updatedEventBody);

            const updatedEventApprovedApi = await apiCallerWithStatusCode('put', `events/${eventId}`, {
                data: updatedEventBody,
            });

            const updatedItemApprovedApi = await apiCallerWithStatusCode('put', `event-participants/${item?.id}`, {
                data: updatedItemBody,
            });

            // console.log('updatedItemApprovedApi', updatedItemApprovedApi);

            if (updatedEventApprovedApi.status === 200 && updatedItemApprovedApi.status === 200) {
                SuccessNotification('Approval status updated successfully');
                setTimeout(() => {
                    onCancel();
                }, 1000);
            }

            // console.log('updatedEventApprovedApi', updatedEventApprovedApi);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-5xl rounded-lg bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold">Registration Approval</h2>
                    <button onClick={onCancel} className="rounded-full p-1 transition-colors hover:bg-gray-100">
                        <IoMdClose className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="rounded-lg border bg-white p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-bold">Company Name</p>
                                <p className="mt-1 text-gray-500">{item.companyName || "Texh Naky Co"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Event ID</p>
                                <p className="mt-1 text-gray-500">{item.event_taking_id || "BE-123231-123123-13-1313"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Selected Sponsorships</p>
                                <p className="mt-1 text-gray-500">
                                    {selectedSponsorships && Object.keys(selectedSponsorships).length > 0
                                        ? Object.keys(selectedSponsorships).map((key) => <p key={key}>- {selectedSponsorships[key]?.label || 'No Label'}</p>)
                                        : 'No Sponsorships Selected'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Current Registration Status</p>
                                <div className="mt-1 flex items-center gap-2 text-gray-500">
                                    {item.approved === 'Yes' ? (
                                        <>
                                            <span>Approved</span>
                                            <FcApproval className="h-5 w-5" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Pending</span>
                                            <MdOutlinePendingActions className="h-5 w-5 text-blue-400" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {sponsorshipFieldsTable && sponsorshipFieldsTable.length > 0 && (
                            <table className="mt-4 w-full table-auto">
                                <thead>
                                    <tr className="text-nowrap">
                                        <th className="border border-r-2 px-4 py-2  text-center">Sponsorship</th>
                                        <th className="border border-r-2 px-4 py-2  text-center">Companies Who Selected</th>
                                        <th className="border border-r-2 px-2 py-2  text-center ">Maximum Slots</th>
                                        <th className="border border-r-2 px-4 py-2  text-left">Approval Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sponsorshipFieldsTable.map((field) => {
                                        const validPaymentStatuses = field?.reservedBy
                                            ? Object?.values(field?.reservedBy).filter((entry) => entry.paymentStatus === 'paid' || entry.paymentStatus === 'pending').length
                                            : null;
                                        {
                                            /* console.log('validPaymentStatuses', validPaymentStatuses) */
                                        }
                                        return (
                                            <tr key={field.name}>
                                                <td className="border px-2 py-2">{field.label}</td>
                                                <td className="border px-3 py-2">
                                                    {field?.reservedBy && Object.keys(field.reservedBy).length > 0 ? (
                                                        <div className="space-y-2">
                                                            {Object.keys(field.reservedBy).map((company) => {
                                                                const status = field.reservedBy[company]?.paymentStatus?.toLowerCase() || 'pending';
                                                                return (
                                                                    <div key={company} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 p-2">
                                                                        <span className="font-medium">{company}</span>
                                                                        {status === 'paid' ? (
                                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                                                                <ImCheckmark className="mr-1 h-3 w-3" />
                                                                                Payment Confirmed
                                                                            </span>
                                                                        ) : status === 'pending' ? (
                                                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                                                                                <MdOutlinePendingActions className="mr-1 h-3 w-3" />
                                                                                Awaiting Payment
                                                                            </span>
                                                                        ) : status === 'rejected' ? (
                                                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                                                <ImWarning className="mr-1 h-3 w-3" />
                                                                                Rejected
                                                                            </span>
                                                                        ) : (
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
                                                            <IoMdClose className="mr-2 h-5 w-5" />
                                                            <p>Yet No Company Selected</p>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="border px-3 py-2 text-center">{field?.maxLimit}</td>

                                                <td className="border px-3 py-2">
                                                    <div className="flex items-center gap-4">
                                                        {/* Approve Checkbox */}
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    item.approved === 'Yes'
                                                                        ? field?.reservedBy?.[item?.companyName]?.paymentStatus === 'pending' ||
                                                                          field?.reservedBy?.[item?.companyName]?.paymentStatus === 'paid'
                                                                        : approvalStates[field.name] === true
                                                                }
                                                                title={
                                                                    validPaymentStatuses >= field.maxLimit ? 'Maximum limit reached. Please increase the slot limit to approve.' : 'Approve sponsorship'
                                                                }
                                                                disabled={item.approved === 'Yes' || validPaymentStatuses >= field.maxLimit} // Disable if already approved
                                                                onChange={() => handleApprovalChange(field.name, true)} // Handle approval logic
                                                                className="h-4 w-4 cursor-pointer rounded border-gray-300"
                                                            />
                                                            <span className="text-sm">Approve</span>
                                                        </label>

                                                        {/* Reject Checkbox */}
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    item.approved === 'Yes'
                                                                        ? field?.reservedBy?.[item?.companyName]?.paymentStatus === 'rejected'
                                                                        : approvalStates[field.name] === false
                                                                }
                                                                disabled={item.approved === 'Yes'} // Disable if already approved
                                                                onChange={() => handleApprovalChange(field.name, false)} // Handle rejection logic
                                                                className="h-4 w-4 cursor-pointer rounded border-gray-300"
                                                            />
                                                            <span className="text-sm">Reject</span>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t bg-gray-50 p-4">
                    <button onClick={onCancel} className="rounded-md border px-4 py-2 transition-colors hover:bg-gray-50">
                        Cancel
                    </button>
                    {/* {console.log('approvalStates', Object.keys(approvalStates || {}))} */}
                    <button
                        onClick={() => {
                            item?.approved != 'Yes' ? handleApprove() : '';
                        }}
                        className={`rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700
            ${
                (sponsorshipFieldsTable && sponsorshipFieldsTable.length !== Object.keys(approvalStates || {}).length) || item.approved === 'Yes' || loading
                    ? 'cursor-not-allowed opacity-50' // Disable styles
                    : ''
            }`}
                        disabled={(sponsorshipFieldsTable && sponsorshipFieldsTable.length !== Object.keys(approvalStates || {}).length) || loading}
                    >
                        {loading ? 'Processing...' : 'Approve Registration'}
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="text-lg font-semibold">Confirm {selectedSponsorship?.isApproved ? 'Approval' : 'Rejection'}</h3>
                        <p className="mt-2 text-gray-600">Are you sure you want to {selectedSponsorship?.isApproved ? 'approve' : 'reject'} this sponsorship?</p>
                        <div className="mt-4 flex justify-end gap-3">
                            <button onClick={() => setShowConfirmDialog(false)} className="rounded-md border px-4 py-2 transition-colors hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={confirmApproval} className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ApprovePopup;
