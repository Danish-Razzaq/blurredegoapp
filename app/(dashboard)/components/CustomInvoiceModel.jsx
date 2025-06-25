import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiTrash } from 'react-icons/bi';
import { IoMdAddCircle } from 'react-icons/io';
import InvoiceEventDropdown from './CustomEventInvoiceDropdowndown';
import InvoiceDropdown from './InvoiceDropdowndown';
import { ImCross } from 'react-icons/im';
import { apiCallerWithStatusCode } from '@/utils/api';

const CustomInvoiceModel = ({ onCloseModel, eventName, setShowCreateNotification, CUSINVFOR }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // console.log('CUSINVFOR', CUSINVFOR);

    // Consolidated state management
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModel, setShowModel] = useState(false);
    const [attachedParticipantsModel, setAttachedParticipantsModel] = useState(false);

    console.log('invoiceData', invoiceData);

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        mobile: '',
        address: '',
        isCustomInvoice: true,
        bankFees: 0,
        discount: 0,
        ...(CUSINVFOR === "EVENTINVOICE"
            ? {
                sponsorships: {},
                additionalAttendees: {
                    quantity: 0,
                    price: 0,
                },
                shareRoomDiscount: {
                    quantity: 0,
                    price: 0,
                },
            } : {}),
        newItem: [],
    });

    // console.log('formData', formData);

    const [calculatedTotals, setCalculatedTotals] = useState({
        subtotal: 0,
        grandTotal: 0,
    });

    const getInvoiceData = async () => {
        // console.log('im here');
        try {
            setLoading(true);
            const invoiceCall = await apiCallerWithStatusCode('get', CUSINVFOR === "EVENTINVOICE" ? 'event-participants' : 'invoices');
            console.log('invoiceCall:', invoiceCall);
            setInvoiceData(invoiceCall?.data?.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            toast.error('Failed to load invoice data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!formData) return;

        const subtotal = formData?.newItem?.reduce((total, item) => total + item.amount, 0) || 0;

        // set not to be negative
        const grandTotal = Math.max(subtotal - (parseFloat(formData?.discount) || 0)) || 0;

        setCalculatedTotals({ subtotal, grandTotal });
    }, [formData]);

    const handleInputChange = (section, key, field, value) => {
        setFormData((prevData) => {
            if (section === 'newItem') {
                const updatedField = {
                    ...prevData.newItem[key],
                    [field]: field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value,
                };

                // Calculate the amount dynamically
                updatedField.amount = (updatedField.price || 0) * (updatedField.quantity || 0);

                return {
                    ...prevData,
                    newItem: [...prevData.newItem.slice(0, key), updatedField, ...prevData.newItem.slice(key + 1)],
                };
            } else {
                return {
                    ...prevData,
                    [section]: parseFloat(value) || 0,
                };
            }
        });
    };

    const generateEventTrackingId = () => {
        const timestamp = Date.now();
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        const eventId = `Blurred Ego-EVT-${timestamp}-${randomPart}`;
        return eventId;
    };

    const handleCreate = async () => {
        if (!formData?.name || !formData?.companyName || !formData?.email || !formData?.mobile || !formData?.address) {
            toast.error('Please fill all the required fields');
            return;
        }
        try {

            // Prepare new invoice entry
            const newInvoice = {
                ...formData,
                invoiceAmount: calculatedTotals.grandTotal,
            };

            const updatedDataEventInvoice = {
                data: {
                    RegEventName: eventName,
                    registered_Email: formData.email,
                    event_taking_id: generateEventTrackingId(),
                    Invoice_data: newInvoice,
                },
            };

            const updatedDataInvoice = {
                data: {
                    name: formData.name,
                    companyName: formData.companyName,
                    email: formData.email,
                    companyEmail: formData.email, // because this time we show in place of company email person email that why i set this....
                    amount: calculatedTotals.grandTotal,
                    discount: formData.discount,
                    Invoice_data: newInvoice,
                }
            }



            console.log('Updated Data updatedDataEventInvoice:', updatedDataEventInvoice);
            console.log('Updated Data updatedDataInvoice:', updatedDataInvoice);


            const result = await apiCallerWithStatusCode(
                'post',
                CUSINVFOR === "EVENTINVOICE" ? 'event-participants' : 'invoices',
                CUSINVFOR === "EVENTINVOICE" ? updatedDataEventInvoice : updatedDataInvoice,
                null,
                null
            );
            console.log('result:', result);





            if (result?.status === 200) {
                setShowCreateNotification(true);
                toast.success('Custom Invoice created successfully');
                setTimeout(() => {
                    onCloseModel();
                }, 1000);
            } else {
                toast.error('Failed to Create Invoice. Please try again.');
            }
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('An error occurred while updating the invoice.');
        }
    };

    // Fetch data on component mount

    useEffect(() => {

        getInvoiceData();

    }, []);


    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    const handleNewItem = () => {
        const title = document.getElementById('title').value;
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('price').value;
        const amount = quantity * price;

        const newItem = {
            title,
            quantity,
            price,
            amount,
        };

        setFormData((prev) => ({
            ...prev,
            newItem: [...(prev.newItem || []), newItem],
        }));

        setShowModel(false);
    };

    const handleDelete = (section, index, key, field) => {
        window.confirm('Are you sure you want to delete this item?') &&
            setFormData((prevData) => {
                if (section === 'newItem') {
                    return {
                        ...prevData,
                        newItem: [...prevData.newItem.slice(0, index), ...prevData.newItem.slice(index + 1)],
                    };
                } else {
                    return {
                        ...prevData,
                        [section]: 0,
                    };
                }
            });
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
                    <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
                        <div className="container mx-auto max-w-4xl p-4">
                            <title>Custom Invoice</title>

                            <div >
                                <div className="flex items-center justify-end">
                                    <button onClick={onCloseModel} title='Close'>
                                        <ImCross color="red" size={20} />
                                    </button>
                                </div>
                                <div className="p-1">
                                    {/* Invoice Header */}
                                    <div className="my-3 flex flex-wrap items-center justify-between ">
                                        {/* {
                                        CUSINVFOR === "EVENTINVOICE" ?( */}
                                        <div className="w-1/2">
                                            <p className="mb-1 font-semibold text-gray-800">Would you like to associate this invoice with a
                                                {
                                                    CUSINVFOR === "EVENTINVOICE" ? ' Participant' : ' Member'
                                                }

                                                ?</p>
                                            <div className="flex gap-2">
                                                <label htmlFor="attachedCheck" className="font-semibold uppercase text-gray-800">
                                                    <input
                                                        id="attachedCheck"
                                                        type="checkbox"
                                                        className="mr-2"

                                                        checked={formData?.attachedParticipants === true}
                                                        onChange={() => {
                                                            setAttachedParticipantsModel(true);
                                                        }}
                                                    />
                                                    Yes
                                                </label>

                                                <label htmlFor="notAttachedCheck" className="font-semibold uppercase text-gray-800">
                                                    <input
                                                        id="notAttachedCheck"
                                                        type="checkbox"
                                                        className="mr-2"
                                                        checked={formData?.attachedParticipants === false}
                                                        onChange={() => {
                                                            // setFormData((prev) => ({ ...prev, attachedParticipants: false }));
                                                            setFormData((prev) => ({ ...prev, name: '', companyName: '', email: '', invoiceId: '', address: '', mobile: '', attachedParticipants: false }));
                                                            setAttachedParticipantsModel(false);
                                                        }}
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>

                                        <Image alt="Company Logo" src="/assets/imgs/template/logo.png" width={180} height={64} className="object-contain" />
                                    </div>

                                    {/* Invoice Details */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* <div>
                                            <label className="mb-2 block font-bold text-gray-700">Invoice ID</label>
                                            <input
                                                type="text"
                                                value={formData?.invoiceId || ''}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, invoiceId: e.target.value }))}
                                                placeholder="Enter Invoice ID (e.g. EVT-INV-2025-0001)"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div> */}
                                        <div>
                                            <label className="mb-2 block font-bold text-gray-700">Name<span class="text-red-500"> *</span></label>
                                            <input
                                                type="name"
                                                required
                                                value={formData.name}
                                                // placeholder='Enter Participant Name <span class="text-red-500">*</span>`}
                                                placeholder='Enter Participant Name'
                                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block font-bold text-gray-700">Company Name<span class="text-red-500"> *</span></label>
                                            <input
                                                type="text"
                                                required
                                                placeholder='Enter Company Name'
                                                value={formData.companyName}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Company Details */}
                                    <div className="my-3 grid grid-cols-1 gap-6 md:grid-cols-2">

                                        <div>
                                            <label className="mb-2 block font-bold text-gray-700">Email<span class="text-red-500"> *</span></label>
                                            <input
                                                type="email"
                                                required
                                                placeholder='Enter Company Email (e.g. jone@gmail.com)'
                                                value={formData.email}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block font-bold text-gray-700">Phone Number<span class="text-red-500"> *</span></label>
                                            <input
                                                type="text"
                                                required
                                                placeholder='Enter Phone Number (e.g. +1 234 567 890)'
                                                value={formData.mobile}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact info */}
                                    <div className=" grid grid-cols-1 gap-6 md:grid-cols-2">

                                        <div>
                                            <label className="mb-2 block font-bold text-gray-700">Address<span class="text-red-500"> *</span></label>
                                            <input
                                                type="text"
                                                required
                                                placeholder='Enter Company Address'
                                                value={formData.address}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Invoice Table */}

                                    <button className="btn btn-blue my-2 justify-self-end p-2" onClick={() => setShowModel(true)}>
                                        <IoMdAddCircle className="mr-2" size={20} /> Add Item
                                    </button>

                                    <div className="mb-8 overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border p-3 text-left">Item</th>
                                                    <th className="border p-3 text-center">Quantity</th>
                                                    <th className="border p-3 text-center">Price (USD)</th>
                                                    <th className="border p-3 text-right">Amount (USD)</th>
                                                    <th className="border p-3 text-right ">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData?.newItem?.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="border p-3">
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                className="  rounded border text-center"
                                                                onChange={(e) => handleInputChange('newItem', index, 'title', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border p-3 text-center">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                className="w-20  rounded border text-center"
                                                                min={1}
                                                                onChange={(e) => handleInputChange('newItem', index, 'quantity', e.target.value)}
                                                            />
                                                        </td>

                                                        <td className="border p-3 text-center">
                                                            <input
                                                                type="number"
                                                                value={item.price}
                                                                className="w-20  rounded border text-center"
                                                                onChange={(e) => handleInputChange('newItem', index, 'price', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border p-3 text-right">${parseFloat(item.amount).toFixed(2)}</td>
                                                        <td className="border p-3 text-right">
                                                            <button className="text-red-500" onClick={() => handleDelete('newItem', index, null, null)}>
                                                                <BiTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Totals and Discount */}
                                    <div className="mb-8 grid grid-cols-1 gap-6  md:grid-cols-2">
                                        {/* Discount Input */}
                                        <div>
                                            <label className="mb-2 block font-bold text-gray-700">Discount</label>
                                            <input
                                                type="number"
                                                value={formData.discount}
                                                min={0}
                                                step="1" // Ensures only integer steps
                                                inputMode="numeric"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Accept only integers
                                                    if (/^\d*$/.test(value)) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            discount: value === '' ? 0 : parseInt(value, 10),
                                                        }));
                                                    }
                                                }}
                                                placeholder="Enter Discount Amount"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-fit"
                                            />
                                        </div>


                                        {/* Totals Section */}
                                        <div className=" w-full  ">
                                            <div className="space-y-4 text-sm sm:text-base ltr:text-right rtl:text-left ">
                                                {/* Bank Fees */}
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">Bank Fees</span>
                                                    <span >
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={formData.bankFees}
                                                            onChange={(e) => setFormData((prev) => ({ ...prev, bankFees: parseFloat(e.target.value) || 0 }))}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-fit"
                                                        />
                                                    </span>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">Subtotal</span>
                                                    <span className="w-[37%]">${calculatedTotals.subtotal.toFixed(2)}</span>
                                                </div>

                                                {/* Additional Discount */}

                                                <div className="flex items-center justify-between text-red-600">
                                                    <span className="font-medium">Additional Discount</span>
                                                    <span className="w-[37%]">- ${formData?.discount?.toFixed(2) || 0}</span>
                                                </div>

                                                {/* Grand Total */}
                                                <div className="flex items-center justify-between border-t pt-2 text-lg font-semibold text-green-700">
                                                    <span>Grand Total</span>
                                                    <span className="w-[37%]">
                                                       USD ${Math.max(0, (calculatedTotals?.grandTotal + formData?.bankFees)).toFixed(2)}
                                                    </span>

                                                </div>
                                            </div>
                                            {/* Update Invoice Button */}
                                            <div className="mt-3 flex justify-end">
                                                <button
                                                    // onClick={handleCreate}
                                                    onClick={handleCreate}


                                                    disabled={formData?.newItem.length == 0}
                                                    className={`transform rounded ${formData?.newItem.length == 0 ? ' bg-green-300 cursor-not-allowed' : ' bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out hover:scale-105 '} px-6 py-3 font-bold text-white `}
                                                >
                                                    Create Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ToastContainer position="top-right" />

                            {showModel && (
                                <div className="modelRef fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                                    <div className="w-[32rem] rounded-lg bg-white p-6 shadow-xl">
                                        <h2 className="color-brand-2 mb-6 text-center text-2xl font-semibold text-gray-800">Add New Invoice Item</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    min={1}
                                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
                                                    Price (USD)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between">
                                            <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-300" onClick={() => setShowModel(false)}>
                                                Cancel
                                            </button>
                                            <button className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700" onClick={handleNewItem}>
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {(attachedParticipantsModel === true && CUSINVFOR === "EVENTINVOICE") && (
                <InvoiceEventDropdown invoiceData={invoiceData} setFormData={setFormData} setAttachedParticipantsModel={setAttachedParticipantsModel} onClose={() => setAttachedParticipantsModel(false)} />
            )}
            {(attachedParticipantsModel === true && CUSINVFOR === "INVOICE") && (
                <InvoiceDropdown invoiceData={invoiceData} setFormData={setFormData} setAttachedParticipantsModel={setAttachedParticipantsModel} onClose={() => setAttachedParticipantsModel(false)} />
            )}
        </>
    );
};

export default CustomInvoiceModel;
