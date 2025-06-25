'use client';

import React, { useEffect, useState } from 'react';
import { apiCaller } from '@/utils/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BiTrash } from 'react-icons/bi';
import { IoMdAddCircle } from 'react-icons/io';
import { ToastContainer } from 'react-toastify';
import { SuccessNotification } from '@/components/Toster/success';
const PreviewInvoice = () => {
    const params = useParams();
    const [invoiceData, setInvoiceData] = useState(null);
    const [amount, setAmount] = useState(0);
    const [showModel, setShowModel] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [grandTotalValue, setGrandTotalValue] = useState(0);
    // console.log('grandTotalValue', grandTotalValue);

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        mobile: '',
        address: '',
        amount: 0,
        // isCustomInvoice: true,
        bankFees: 0,
        discount: 0,
        newItem: [],
    });

    const [calculatedTotals, setCalculatedTotals] = useState({
        subtotal: 0,
        grandTotal: 0,
    });

    // console.log('formData', formData);

    useEffect(() => {
        if (!amount) return;
        const grandTotal = Math.max(Number(amount) + 50 - (parseFloat(discount) || 0)) || 0;
        setGrandTotalValue(grandTotal);
    }, [amount, discount]);

    useEffect(() => {
        if (!formData) return;

        const subtotal = formData?.newItem?.reduce((total, item) => total + item.amount, 0) || 0;

        // set not to be negative
        const grandTotal = Math.max(subtotal - (parseFloat(formData?.discount) || 0)) || 0;

        setCalculatedTotals({ subtotal, grandTotal });
    }, [formData]);

    // console.log('discount', discount);
    // console.log('invoiceData', invoiceData);

    const getUserData = async () => {
        try {
            // Fetch invoice data
            const invoiceCall = await apiCaller('get', `invoices?filters[id][$eq]=${params?.slug}&populate=*`);
            const invoice = invoiceCall?.data[0];

            setInvoiceData(invoice);
            setAmount(invoice?.attributes?.amount || 0);
            setDiscount(invoice?.attributes?.discount || 0);

            setFormData({
                name: invoice?.attributes?.name || '',
                bankFees: invoice?.attributes?.Invoice_data?.bankFees || 0,
                discount: invoice?.attributes?.discount || 0,
                newItem: invoice?.attributes?.Invoice_data?.newItem || [],
            });

            // Fetch application data **only if email exists**
            if (invoice?.attributes?.email && !invoice?.attributes?.Invoice_data?.isCustomInvoice) {
                // await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay (optional)

                const applicationCall = await apiCaller('get', `applications?filters[email][$eq]=${invoice.attributes.email}`);
                const appData = applicationCall?.data[0];

                setFormData((prev) => ({
                    ...prev,
                    companyName: appData?.attributes?.companyName || invoice?.attributes?.companyName,
                    email: appData?.attributes?.email || invoice?.attributes?.email,
                    mobile: appData?.attributes?.mobile1 || invoice?.attributes?.Invoice_data?.mobile,
                    address: appData?.attributes?.mainOfficeAddress || invoice?.attributes?.Invoice_data?.address,
                }));
            } else if (invoice?.attributes?.Invoice_data && invoice?.attributes?.Invoice_data?.isCustomInvoice) {
                setFormData((prev) => ({
                    ...prev,
                    companyName: invoice?.attributes?.Invoice_data?.companyName,
                    email: invoice?.attributes?.email,
                    mobile: invoice?.attributes?.Invoice_data?.mobile,
                    address: invoice?.attributes?.Invoice_data?.address,
                }));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

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

    const handleUpdate = async () => {
        try {
            const updatedData = {
                data: {
                    name: formData.name,
                    companyName: formData.companyName,
                    email: formData.email,
                    ...(invoiceData?.attributes?.Invoice_data?.isCustomInvoice
                        ? {
                              amount: calculatedTotals?.grandTotal + Number(formData.discount),
                              discount: Number(formData.discount),
                              Invoice_data: {
                                  ...invoiceData?.attributes?.Invoice_data,
                                  ...formData,
                                  invoiceAmount: calculatedTotals?.grandTotal + Number(formData.discount),
                              },
                          }
                        : {
                              amount: grandTotalValue - 50 + parseFloat(discount),
                              discount: discount,
                          }),
                    invoiceMailTrigger: false,
                    mcMailTrigger: false,
                    pdfEmail: false,
                },
            };
            // console.log('updatedData', updatedData);

            const result = await apiCaller('put', `invoices/${params?.slug}`, updatedData);
            if (result?.data) {
                setInvoiceData(result?.data);
                SuccessNotification('Invoice updated successfully!');
                // alert('Invoice updated successfully!');
            } else {
                console.error('Error updating invoice:', result?.err);
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date';
        const date = new Date(dateString);
        return isNaN(date) ? 'Invalid Date' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };
     const getDueDate = (createdAt, daysToAdd = 7) => {
        if (!createdAt) return null;

        const date = new Date(createdAt);
        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString(); // Convert back to string to use with formatDate
    };

    const registrationFees = invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? invoiceData?.attributes?.Invoice_data?.bankFees : 50;
    const subtotal = parseFloat(amount) + registrationFees;
    const grandTotal = subtotal - parseFloat(formData?.discount);

    return (
        <div className="container mt-20">
            <title>Invoice | Edit</title>
            <Link className="btn btn-blue mb-10 w-fit p-1" href="/apps/invoice">
                Back
            </Link>
            <div className="panel">
                <div className="mb-8 flex flex-wrap items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold uppercase text-gray-800">Invoice</h1>
                        <p className="text-lg text-gray-600">#{invoiceData?.attributes?.invoiceId}</p>
                    </div>
                    <Image alt="Company Logo" src="/assets/imgs/template/logo.png" width={180} height={64} className="object-contain" />
                </div>
                <div className="px-4 ltr:text-right rtl:text-left">
                    <div className="mt-6 space-y-1 text-white-dark">
                        <div>Unit 39,14/F, Block D, Wah Lok Industrial Centre, No.31-35 Shan Mei Street, Fo Tan, Shatin, New Territories, Hong Kong</div>
                        <div>Info@blurredego.com</div>
                        <div>+852 3997 3380</div>
                    </div>
                </div>

                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="flex justify-end px-4">
                    <div className="gap-3">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <div className="text-white-dark">Issue Date :</div>
                            <div>{formatDate(invoiceData?.attributes?.createdAt)}</div>
                        </div>
                           <div className=" flex w-full items-center justify-between">
                                        <div className="text-white-dark">Due Date :</div>
                                        <div>{formatDate(getDueDate(invoiceData?.attributes?.createdAt))}</div>
                                    </div>
                    </div>
                </div>

                {/* Personal info */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block font-bold text-gray-700">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block font-bold text-gray-700">Company Name</label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Company Details */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    {invoiceData?.attributes?.Invoice_data?.isCustomInvoice && (
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
                    )}
                </div>

                {/* Contact  Details */}
                {invoiceData?.attributes?.Invoice_data?.isCustomInvoice && (
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                )}
                {invoiceData?.attributes?.Invoice_data?.isCustomInvoice && (
                    <button className="btn btn-blue my-2 justify-self-end p-2" onClick={() => setShowModel(true)}>
                        <IoMdAddCircle className="mr-2" size={20} /> Add Item
                    </button>
                )}

                <div className="table-responsive mt-6">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th className="ltr:text-right rtl:text-left">PRICE (USD)</th>
                                <th className="ltr:text-right rtl:text-left">AMOUNT (USD)</th>
                                {invoiceData?.attributes?.Invoice_data?.isCustomInvoice && <th className="ltr:text-right rtl:text-left">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {!invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? (
                                <>
                                    <tr>
                                        <td>Founding Membership Fees</td>
                                        <td>1</td>
                                        <td className="ltr:text-right rtl:text-left">
                                            <input type="number" value={amount} min={0} onChange={(e) => setAmount(parseFloat(e.target.value))} className="w-full border px-2 py-1" />
                                        </td>
                                        <td className="ltr:text-right rtl:text-left">${parseFloat(amount).toFixed(2)}</td>
                                    </tr>
                                </>
                            ) : (
                                <>
                                    {formData?.newItem.map((item, index) => (
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
                                                    min={0}
                                                    className="w-20  rounded border text-center"
                                                    onChange={(e) => handleInputChange('newItem', index, 'price', e.target.value)}
                                                />
                                            </td>
                                            <td className="border p-3 text-right">${parseFloat(item.amount).toFixed(2)}</td>
                                            {invoiceData?.attributes?.Invoice_data?.isCustomInvoice && (
                                                <td className="border p-3 text-right">
                                                    <button className="text-red-500" onClick={() => handleDelete('newItem', index, null, null)}>
                                                        <BiTrash />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals and Discount */}
                <div className="my-8 grid grid-cols-1 gap-6  md:grid-cols-2">
                    {/* Discount Input */}
                    <div>
                        <label className="mb-2 block font-bold text-gray-700">Discount</label>
                        <input
                            type="number"
                            value={formData.discount}
                            min={0}
                            step="1"
                            inputMode="numeric"
                            onChange={(e) => {
                                const value = e.target.value;

                                // Allow only whole numbers and prevent negatives
                                if (/^\d*$/.test(value)) {
                                    const intValue = parseInt(value, 10) || 0;
                                    setFormData((prev) => ({
                                        ...prev,
                                        discount: intValue,
                                    }));
                                    setDiscount(intValue);
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
                                <span className="font-medium">{invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? 'Bank ' : 'Admin '} Fees</span>
                                <span>
                                    {invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? (
                                        <input
                                            type="number"
                                            min={0}
                                            value={formData.bankFees}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, bankFees: parseFloat(e.target.value) || 0 }))}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-fit"
                                        />
                                    ) : (
                                        <span>${Number(50).toFixed(2)}</span>
                                    )}
                                </span>
                            </div>

                            {/* Subtotal */}
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Subtotal</span>
                                <span className="w-[37%]">${invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? calculatedTotals.subtotal : amount}.00</span>
                            </div>

                            {/* Additional Discount */}

                            <div className="flex items-center justify-between text-red-600">
                                <span className="font-medium">Additional Discount</span>
                                <span className="w-[37%]">- ${formData?.discount || 0}.00</span>
                            </div>

                            {/* Grand Total */}
                            <div className="flex items-center justify-between border-t pt-2 text-lg font-semibold text-green-700">
                                <span>Grand Total</span>
                                <span className="w-[37%]">USD ${invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? calculatedTotals?.grandTotal + formData?.bankFees : grandTotalValue}</span>
                            </div>
                        </div>
                        {/* Update Invoice Button */}
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={formData?.newItem.length == 0 && invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? null : handleUpdate}
                                className={`transform rounded ${
                                    formData?.newItem.length == 0 && invoiceData?.attributes?.Invoice_data?.isCustomInvoice
                                        ? ' cursor-not-allowed bg-green-300'
                                        : ' bg-green-500 transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600 '
                                } px-6 py-3 font-bold text-white `}
                            >
                                Update Invoice
                            </button>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>

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
