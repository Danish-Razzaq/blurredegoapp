'use client';
import IconPrinter from '@/public/icon/icon-printer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import PaginatedInvoiceTable from '@/components/PaginatedInvoiceTable';
import { dummyInvoiceItems } from '@/Data/eventinvoice';
const PreviewInvoice = () => {
    const params = useParams();

    // console.log('params', params?.slug);

    const [invoiceData, setInvoiceData] = useState(null);
    const [invoiceAllData, setInvoiceAllData] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const getUserData = async () => {
        try {
            // const invoiceCall = await axios.get('get', `event-participants?filters[id][$eq]=${params?.slug}&populate=*`);
            const invoiceCall = await axios.get(`${apiUrl}/event-participants?filters[id][$eq]=${params?.slug}&populate=*`);
            // console.log('invoiceCall', invoiceCall);

            const invoice = invoiceCall?.data?.data[0]?.attributes?.Invoice_data;
            // console.log('invoice', invoice);
            const invoiceCallData = invoiceCall?.data?.data[0];

            setInvoiceData(invoice);
            setInvoiceAllData(invoiceCallData); // for using the data of uer registration object in the invoice
        } catch (error) {
            console.log('Error fetching invoice data:', error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const exportTable = () => {
        window.print();
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date';

        const date = new Date(dateString);
        if (isNaN(date)) return 'Invalid Date';

        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };
    const getDueDate = (createdAt, daysToAdd = 7) => {
        if (!createdAt) return null;

        const date = new Date(createdAt);
        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString(); // Convert back to string to use with formatDate
    };

    // const membershipFees = parseFloat(invoiceData?.invoiceAmount);

    const registrationFees = invoiceData?.registrationFees || 0;
    const additionAttendees = invoiceData?.additionalAttendees || 0;

    const additionalAttendeesTotal = (invoiceData?.additionalAttendees?.quantity || 0) * (invoiceData?.additionalAttendees?.price || 0);

    const discountShareRoom = invoiceData?.shareRoomDiscount?.amount || 0;

    const newItem = invoiceData?.newItem || 0;

    const newItemsTotal = invoiceData?.newItem?.reduce((total, item) => total + item.amount, 0) || 0;

    const totalSponsorshipAmount = Object.values(invoiceData?.sponsorships || {}).reduce((total, value) => {
        return total + value.amount;
    }, 0);

    const subtotal = registrationFees + totalSponsorshipAmount + additionalAttendeesTotal + newItemsTotal;

    const discount = invoiceData?.discount || 0;
    // also add the discount of share room
    const grandTotal = Math.max(0, subtotal - discount - discountShareRoom);

    const sponsorshipItems = Object.entries(invoiceData?.sponsorships || {}).map(([key, value], index) => ({
        id: index + 1,
        title: value.label,
        quantity: value.quantity || '1',
        price: value.price,
        amount: value.amount,
    }));

    const shareRoomdelegates = invoiceData?.shareRoomDiscount || 0;

    const items = [
        ...(invoiceData?.registrationFees > 0
            ? [
                  {
                      id: sponsorshipItems.length + 1,
                      title: 'Event Registration Fees',
                      quantity: '1',
                      price: registrationFees,
                      amount: registrationFees,
                  },
              ]
            : []),
        ...(additionAttendees.quantity > 0
            ? [
                  {
                      id: sponsorshipItems.length + 2,
                      title: 'Additional Attendees',
                      quantity: additionAttendees.quantity || '1',
                      price: additionAttendees.price,
                      amount: additionAttendees.amount,
                  },
              ]
            : []),

        ...(shareRoomdelegates.quantity > 0
            ? [
                  {
                      id: sponsorshipItems.length + 3,
                      title: invoiceData?.shareRoomDiscount?.label,
                      quantity: shareRoomdelegates.quantity || '1',
                      price: invoiceData?.shareRoomDiscount?.price,
                      amount: invoiceData?.shareRoomDiscount?.amount,
                  },
              ]
            : []),

        ...(sponsorshipItems.length > 0 ? sponsorshipItems : []),

        ...(newItem.length > 0
            ? newItem.map((item, index) => ({
                  id: sponsorshipItems.length + 4 + index,
                  title: item.title,
                  quantity: item.quantity || '1',
                  price: item.price,
                  amount: item.amount,
              }))
            : []),
    ];

    // Define table columns
    const columns = [
        { key: 'title', label: 'Item' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'price', label: 'PRICE (USD)', class: 'ltr:text-right rtl:text-left' },
        { key: 'amount', label: 'AMOUNT (USD)', class: 'ltr:text-right rtl:text-left' },
    ];

    return (
        <>
            <div id="invoice-loaded-event"></div>
            <style jsx>{`
                @media print {
                    .print-button {
                        display: none;
                    }
                }
            `}</style>
            <title>Invoice | Preview</title>

            <div className=" relative p-0" style={{ padding: '0px' }}>
                <div className="print-header absolute w-full">
                    <img src="/assets/images/invoiceheader.svg" alt="logo" className="h-full w-full" />
                </div>

                <div className="flex flex-col items-center justify-center gap-2   pt-24   max-lg:pt-12 ">
                    <Image className="mr-1 flex  items-center justify-self-center  " alt="Blurred Ego" src="/assets/imgs/template/logo.png" width={158} height={55} />
                    <p className="text-2xl font-semibold uppercase underline">Invoice</p>
                </div>
                <div className="mt-1  ">
                    {/* Content of the panel */}
                    <div className="panel container bg-transparent shadow-none max-lg:px-7">
                        <div className="flex  justify-between gap-3 ">
                            <div className="flex">
                                <div className="space-y-1 text-white-dark">
                                    <div>Issue For:</div>
                                    <div className="font-semibold text-black dark:text-white">{invoiceData?.attributes?.companyName || 'LogiFem Limited'}</div>
                                    <div>{invoiceData?.attributes?.companyEmail || 'logiFem@limited.com'}</div>
                                    <div>{invoiceData?.attributes?.mobile1 || invoiceData?.attributes?.Invoice_data?.mobile || '1234567890'}</div>
                                    <div>{invoiceData?.attributes?.mainOfficeAddress || invoiceData?.attributes?.Invoice_data?.address || '123 Main St, City, Country'}</div>
                                </div>
                            </div>
                            <div className="flex w-full flex-col justify-end  sm:flex-row  ">
                                <div className=" ">
                                    {/* <div className=" flex w-full items-center justify-between"></div> */}
                                    <div className=" flex w-full items-center justify-between">
                                        <div className="text-white-dark">Issue Date :</div>
                                        <div>20 Oct 2024</div>
                                    </div>
                                    <div className=" flex w-full items-center justify-between">
                                        <div className="text-white-dark">Due Date :</div>
                                        <div> 27 Oct 2024</div>
                                    </div>
                                    <div className=" flex w-full items-center justify-between">
                                        <div className="text-white-dark">Invoice No :</div>
                                        <div>{invoiceData?.attributes?.invoiceId || 'INV-2024-0001'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className=" ">
                            <div className="mb-1 flex flex-wrap items-center  justify-end gap-2">
                                <button type="button" className="print-button btn btn-primary btn-lg-d gap-2" onClick={() => exportTable()}>
                                    <IconPrinter />
                                    Print
                                </button>
                                <Link
                                    href={`/components/eventInvoice/InvoiceOnline/${invoiceAllData?.attributes?.event_taking_id || `Blurred Ego-EVT-${Math.floor(100000000 + Math.random() * 9901)} `}`}
                                >
                                    <button type="button" className="btn btn-primary btn-lg-d gap-2">
                                        Pay Online
                                    </button>
                                </Link>
                            </div>
                            {/* Table that show the invoice items */}
                            <PaginatedInvoiceTable items={dummyInvoiceItems} columns={columns} itemsPerPage={6} />
                        </div>
                        <hr className="my-3" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 ">
                            <div></div>
                            {/* Content Container */}
                            <div className="space-y-2 ltr:text-right rtl:text-left">
                                {/* Bank Fees */}
                                <div className="flex items-center justify-between">
                                    <span className="flex-1 font-medium">Bank Fees</span>
                                    <span className="w-[37%]">${(50).toFixed(2)}</span>
                                </div>

                                {/* Subtotal */}
                                <div className="flex items-center justify-between">
                                    <span className="flex-1 font-medium">Subtotal</span>
                                    <span className="w-[37%]">${(2050).toFixed(2)}</span>
                                </div>

                                {/* Share Room Discount */}
                                {/* {discountShareRoom > 0 && ( */}
                                <div className="flex items-center justify-between  text-red-600">
                                    <span className="flex-1 text-nowrap font-medium">Share Room Discount (25% for shared rooms)</span>
                                    <span className="w-[37%]">- ${(150).toFixed(2)}</span>
                                </div>
                                {/* )}  */}

                                {/* Additional Discount */}
                                {/* {discount > 0 && ( */}
                                <div className="flex items-center  justify-between  text-red-600">
                                    <span className="flex-1 text-nowrap font-medium">Additional Discount</span>
                                    <span className="w-[37%]">- ${(20).toFixed(2)}</span>
                                </div>
                                {/* )} */}

                                {/* Grand Total */}

                                <div className="flex items-center justify-between border-t pt-2 text-lg font-semibold text-green-700">
                                    <span className="flex-1">Grand Total</span>
                                    <span className="w-[37%]">USD ${(1880).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <br />
                        <br />
                    </div>
                    <div className="print-footer relative w-full">
                        <div className="absolute  top-24 mx-auto flex w-full pl-[10%]  max-lg:top-10 ">
                            <div className="flex flex-col items-center justify-between  pb-3 sm:flex-row lg:gap-52">
                                <div className="xl:1/3 text-nowrap lg:w-1/2  lg:text-lg  max-lg:text-xs">
                                    <div className="mb-2 flex w-full items-start gap-2 max-lg:text-xs">
                                        <div className="text-white-dark ">Account Name:</div>
                                        <div className="whitespace-nowrap">LogiFem LIMITED</div>
                                    </div>
                                    <div className="mb-2 flex w-full items-start gap-2 max-lg:text-xs  ">
                                        <div className="text-white-dark">BANK NAME:</div>
                                        <div>The Hongkong and Shanghai Banking Corporation Limited</div>
                                    </div>
                                    <div className="mb-2 flex w-full items-start gap-2 max-lg:text-xs ">
                                        <div className="text-white-dark">BANK ADDRESS:</div>
                                        <div>1 Queen's Road Central, Hong Kong</div>
                                    </div>
                                    <div className="mb-2 flex w-full items-start gap-2 max-lg:text-xs ">
                                        <div className="text-white-dark">SWIFT CODE :</div>
                                        <div>HSBCHKHHHKH</div>
                                    </div>
                                    <div className="mb-2 flex w-full items-start gap-2">
                                        <div className="text-nowrap text-white-dark">Multiple Currency Account No:</div>
                                        <div className="text-nowrap">004-801-773609-818</div>
                                    </div>
                                    <div className="mb-2 flex w-full items-start gap-2">(HKD/RMB/USD/EUR/GBP)</div>
                                </div>
                            </div>
                        </div>
                        <img src="/assets/images/invoicefooter.svg" alt="footer" className="h-[20%] w-full" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PreviewInvoice;
