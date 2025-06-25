'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImBackward } from 'react-icons/im';
import { BiTrash } from 'react-icons/bi';
import { IoMdAddCircle } from 'react-icons/io';

const PreviewInvoice = () => {
    const params = useParams();
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Consolidated state management
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModel, setShowModel] = useState(false);
    // const [newItem, setNewItem] = useState([]);

    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        mobile: '',
        address: '',
        sponsorships: {},
        discount: 0,
        bankFees: 0,
        registrationFees: 0,
        additionalAttendees: {
            quantity: 0,
            price: 0,
        },
        shareRoomDiscount: {
            quantity: 0,
            price: 0,
        },
        newItem: [],
    });

    const [calculatedTotals, setCalculatedTotals] = useState({
        subtotal: 0,
        grandTotal: 0,
    });

    const getUserData = async () => {
        try {
            setLoading(true);
            const invoiceCall = await axios.get(`${apiUrl}/event-participants?filters[id][$eq]=${params?.slug}&populate=*`);
            const invoice = invoiceCall?.data?.data[0]?.attributes?.Invoice_data;

            // Set initial form data
            setFormData({
                companyName: invoice?.companyName || '',
                email: invoice?.email || '',
                mobile: invoice?.mobile || '',
                address: invoice?.address || '',
                sponsorships: invoice?.sponsorships || {},
                discount: invoice?.discount || 0,
                bankFees: invoice?.bankFees || 0,
                registrationFees: invoice?.registrationFees || 0,
                additionalAttendees: invoice?.additionalAttendees || { quantity: 0, price: 0 },
                shareRoomDiscount: invoice?.shareRoomDiscount || { quantity: 0, price: 0 },
                newItem: invoice?.newItem || [],
            });

            setInvoiceData(invoice);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            toast.error('Failed to load invoice data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!formData) return;

        const registrationFees = parseFloat(formData.registrationFees) || 0;
        const additionalAttendeesTotal = (formData.additionalAttendees.quantity || 0) * (formData.additionalAttendees.price || 0);

        const totalSponsorshipAmount = Object.values(formData.sponsorships || {}).reduce((total, value) => {
            return total + (value.price || 0) * (value.quantity || 1);
        }, 0);

        // const newItemsTotal = formData?.newItem?.reduce((total, item) => total + item.amount, 0);
        const newItemsTotal = formData?.newItem?.reduce((total, item) => total + item.amount, 0) || 0;

        const shareRoomDiscount = (formData.shareRoomDiscount.quantity || 0) * (formData.shareRoomDiscount.price || 0);

        // const bankFees = parseFloat(formData.bankFees) || 0; // Bank fees are not included in the total bcz we set separate this field in backend

        const subtotal = registrationFees + additionalAttendeesTotal + totalSponsorshipAmount + newItemsTotal;
        // set not to be negative
        const grandTotal = Math.max(subtotal - (parseFloat(formData.discount) || 0) - parseFloat(shareRoomDiscount), 0);

        setCalculatedTotals({ subtotal, grandTotal });
    }, [formData]);

    const handleInputChange = (section, key, field, value) => {
        setFormData((prevData) => {
            if (section === 'sponsorships') {
                const updatedField = {
                    ...prevData.sponsorships[key],
                    [field]: field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value,
                };

                // Calculate the amount dynamically
                updatedField.amount = (updatedField.price || 0) * (updatedField.quantity || 0);

                return {
                    ...prevData,
                    sponsorships: {
                        ...prevData.sponsorships,
                        [key]: updatedField,
                    },
                };
            } else if (section === 'additionalAttendees') {
                const updatedField = {
                    ...prevData.additionalAttendees,
                    [field]: field === 'price' ? parseFloat(value) || 0 : Math.max(parseInt(value) || 1, 1),
                };

                // Calculate the amount dynamically
                updatedField.amount = (updatedField.price || 0) * (updatedField.quantity || 0);

                return {
                    ...prevData,
                    additionalAttendees: updatedField,
                };

                // return {
                //     ...prevData,
                //     additionalAttendees: {
                //         ...prevData.additionalAttendees,
                //         [field]: field === 'price' ? parseFloat(value) || 0 : Math.max(parseInt(value) || 1, 1),
                //     },
                // };
            } else if (section === 'shareRoomDiscount') {
                const updatedField = {
                    ...prevData.shareRoomDiscount,
                    [field]: field === 'price' ? parseFloat(value) || 0 : Math.max(parseInt(value) || 1, 1),
                };

                // Calculate the amount dynamically
                updatedField.amount = (updatedField.price || 0) * (updatedField.quantity || 0);

                return {
                    ...prevData,
                    shareRoomDiscount: updatedField,
                };
            } else if (section === 'newItem') {
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

    const handleUpdate = async () => {
        try {
            const updatedData = {
                data: {
                    Invoice_data: {
                        ...invoiceData,
                        ...formData,
                        invoiceAmount:
                            calculatedTotals.grandTotal /* Previously, the invoiceAmount shown in the table included an additional registration fee due to its inclusion in both the grandTotal and invoiceAmount. 
                        To resolve this, subtracted registrationFees from the grandTotal when calculating invoiceAmount. 
                        
                        This ensures that the invoiceAmount displayed in the table is accurate and does not overstate the total by duplicating the registration fee.
                        */,
                        // invoiceMailTrigger: false,
                        // mcMailTrigger: false,
                        // pdfEmail: false,
                    },
                },
            };

            console.log('updatedData', updatedData);

            const result = await axios.put(`${apiUrl}/event-participants/${params?.slug}`, updatedData);

            result?.status === 200 ? toast.success('Invoice updated successfully') : toast.error('Failed to update invoice. Please try again.');
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('An error occurred while updating the invoice.');
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        getUserData();
    }, [params?.slug]);

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
                if (section === 'registrationFees') {
                    return {
                        ...prevData,
                        registrationFees: 0,
                    };
                } else if (section === 'additionalAttendees') {
                    return {
                        ...prevData,
                        additionalAttendees: {
                            quantity: 0,
                            price: 0,
                        },
                    };
                } else if (section === 'shareRoomDiscount') {
                    return {
                        ...prevData,
                        shareRoomDiscount: {
                            quantity: 0,
                            price: 0,
                        },
                    };
                } else if (section === 'sponsorships') {
                    const updatedSponsorships = { ...prevData.sponsorships };
                    delete updatedSponsorships[key];
                    return {
                        ...prevData,
                        sponsorships: updatedSponsorships,
                    };
                }
                else if (section === 'newItem') {
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
        <div className="container mx-auto max-w-4xl px-4 ">
            <title>Invoice | Edit</title>
            <div className="mb-6 flex items-center justify-between">
                <Link href={`/apps/event-invoices/${invoiceData?.RegEventName || 'Blurred Ego-EVT-1'}`} className="btn btn-blue p-2 ">
                    <ImBackward className="mr-2 inline-block h-4 w-4" /> Back to Invoices
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="p-8">
                    {/* Invoice Header */}
                    <div className="mb-8 flex flex-wrap items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold uppercase text-gray-800">Invoice</h1>
                            <p className="text-lg text-gray-600">#{invoiceData?.invoiceId}</p>
                        </div>
                        <Image alt="Company Logo" src="/assets/imgs/template/logo.png" width={180} height={64} className="object-contain" />
                    </div>

                    {/* Company Details */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block font-bold text-gray-700">Company Name</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block font-bold text-gray-700">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                placeholder="Enter Email (e.g. jone@gmail.com)"
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Contact  Details */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block font-bold text-gray-700">Phone NO</label>
                            <input
                                type="text"
                                value={formData.mobile}
                                placeholder="Phone NO (e.g. 123-456-7890)"
                                onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block font-bold text-gray-700">Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                placeholder="Enter Address"
                                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Invoice Table */}

                    <button className="btn btn-blue mb-2 justify-self-end p-2" onClick={() => setShowModel(true)}>
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
                                {/* Registration Fees */}
                                {formData.registrationFees > 0 && (
                                    <tr className="bg-gray-50">
                                        <td className="border p-3">Event Registration Fees</td>
                                        <td className="border p-3 text-center">
                                            <input type="number" value={1} disabled className="w-20 cursor-not-allowed rounded border text-center" title="Registration fees quantity is fixed at 1" />
                                        </td>
                                        <td className="border p-3 text-center">
                                            <input
                                                type="number"
                                                value={formData.registrationFees}
                                                onChange={(e) => handleInputChange('registrationFees', null, null, e.target.value)}
                                                className="w-20 rounded border text-center"
                                            />
                                        </td>
                                        <td className="border p-3 text-right">${parseFloat(formData.registrationFees).toFixed(2)}</td>
                                        <td className="border p-3 text-right">
                                            <button className="text-red-500" onClick={() => handleDelete('registrationFees', null, null)}>
                                                <BiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )}

                                {/* Additional Attendees */}

                                {formData.additionalAttendees.quantity > 0 ? (
                                    <tr className="hover:bg-gray-50">
                                        <td className="border p-3">Additional Attendees</td>
                                        <td className="border p-3 text-center">
                                            <input
                                                type="number"
                                                value={formData.additionalAttendees.quantity || 0}
                                                min={1}
                                                onChange={(e) => handleInputChange('additionalAttendees', null, 'quantity', e.target.value)}
                                                className="w-20 rounded border text-center"
                                            />
                                        </td>
                                        <td className="border p-3 text-center">
                                            <input
                                                type="number"
                                                value={formData.additionalAttendees.price}
                                                onChange={(e) => handleInputChange('additionalAttendees', null, 'price', e.target.value)}
                                                className="w-20 rounded border text-center"
                                            />
                                        </td>
                                        <td className="border p-3 text-right">${((formData.additionalAttendees.quantity || 0) * (formData.additionalAttendees.price || 0)).toFixed(2)}</td>
                                        <td className="border p-3 text-right">
                                            <button className="text-red-500" onClick={() => handleDelete('additionalAttendees', null, null)}>
                                                <BiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ) : null}

                                {/* Share Room Discount */}
                                {formData.shareRoomDiscount.quantity > 0 ? (
                                    <tr className="hover:bg-gray-50">
                                        <td className="border p-3">25% off for delegates sharing a room</td>
                                        <td className="border p-3 text-center">
                                            <input
                                                type="number"
                                                value={formData.shareRoomDiscount.quantity || 0}
                                                min={1}
                                                onChange={(e) => handleInputChange('shareRoomDiscount', null, 'quantity', e.target.value)}
                                                className="w-20 rounded border text-center"
                                            />
                                        </td>
                                        <td className="border p-3 text-center">
                                            <input
                                                type="number"
                                                value={formData.shareRoomDiscount.price}
                                                onChange={(e) => handleInputChange('shareRoomDiscount', null, 'price', e.target.value)}
                                                className="w-20 rounded border text-center"
                                            />
                                        </td>
                                        <td className="border p-3 text-right">${((formData.shareRoomDiscount.quantity || 0) * (formData.shareRoomDiscount.price || 0)).toFixed(2)}</td>
                                        <td className="border p-3 text-right">
                                            <button className="text-red-500" onClick={() => handleDelete('shareRoomDiscount', null, null)}>
                                                <BiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ) : null}

                                {/* Sponsorships */}
                                {Object.entries(formData.sponsorships || {}).map(([key, value]) => (
                                    <tr key={key} className="hover:bg-gray-50">
                                        <td className="border p-3">{value.label}</td>
                                        <td className="border p-3 text-center">
                                            <input
                                                type="number"
                                                value={value.quantity || 0}
                                                min={1}
                                                onChange={(e) => handleInputChange('sponsorships', key, 'quantity', e.target.value)}
                                                className="w-20 rounded border text-center"
                                            />
                                        </td>
                                        <td className="border p-3 text-center">
                                            <input
                                                type="number"
                                                value={value.price || 0}
                                                onChange={(e) => handleInputChange('sponsorships', key, 'price', e.target.value)}
                                                className="w-20 rounded border text-center"
                                            />
                                        </td>
                                        <td className="border p-3 text-right">${Number(value.price * value.quantity).toFixed(2)}</td>
                                        <td className="border p-3 text-right">
                                            <button className="text-red-500" onClick={() => handleDelete('sponsorships', null, key, null)}>
                                                <BiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* New Item */}
                                {/* {newItem.title && (
                                    <tr className="hover:bg-gray-50">
                                        <td className="border p-3">{newItem.title}</td>
                                        <td className="border p-3 text-center">{newItem.quantity}</td>
                                        <td className="border p-3 text-center">{newItem.price}</td>
                                        <td className="border p-3 text-right">{newItem.amount}</td>
                                    </tr>
                                )} */}

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
                                placeholder="Enter Discount Amount"
                                inputMode='numeric'
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Reject decimal values
                                    if (/^\d*$/.test(value)) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            discount: parseInt(value, 10) || 0,
                                        }));
                                    }
                                }}

                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-fit"
                            />
                        </div>

                        {/* Totals Section */}
                        <div className=" w-full  ">
                            <div className="space-y-4 text-sm sm:text-base ltr:text-right rtl:text-left ">
                                {/* Bank Fees */}
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Bank Fees</span>
                                    <span className="">
                                        <input
                                            type="number"
                                            min={0}
                                            value={formData.bankFees}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, bankFees: parseFloat(e.target.value) || 0 }))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-fit"
                                        />
                                    </span>
                                    {/* <span className="w-[37%]">${formData?.bankFees}</span> */}
                                </div>

                                {/* Subtotal */}
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="w-[37%]">${calculatedTotals.subtotal.toFixed(2)}</span>
                                </div>

                                {/* Share Room Discount */}
                                {formData.shareRoomDiscount.quantity > 0 ? (
                                    <div className="flex items-center justify-between text-red-600">
                                        <span className="font-medium">Share Room Discount (25% for shared rooms)</span>
                                        <span className="w-[37%]">- ${((formData.shareRoomDiscount.quantity || 0) * (formData.shareRoomDiscount.price || 0)).toFixed(2)}</span>
                                    </div>
                                ) : null}

                                {/* Additional Discount */}

                                <div className="flex items-center justify-between text-red-600">
                                    <span className="font-medium">Additional Discount</span>
                                    <span className="w-[37%]">- ${formData.discount.toFixed(2)}</span>
                                </div>

                                {/* Grand Total */}
                                <div className="flex items-center justify-between border-t pt-2 text-lg font-semibold text-green-700">
                                    <span>Grand Total</span>
                                    {/* <span className="w-[37%]">${(calculatedTotals?.grandTotal +  ).toFixed(2)}</span> */}
                                    <span className="w-[37%]">USD ${Math.max(0, calculatedTotals.grandTotal + (formData?.bankFees || 0)).toFixed(2)}</span>
                                </div>
                            </div>
                            {/* Update Invoice Button */}
                            <div className="mt-2 flex justify-end">
                                <button
                                    onClick={handleUpdate}
                                    className="transform rounded bg-green-500 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600"
                                >
                                    Update Invoice
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
                                <input type="text" id="title" className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                <input type="number" id="price" className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
    );
};

export default PreviewInvoice;
