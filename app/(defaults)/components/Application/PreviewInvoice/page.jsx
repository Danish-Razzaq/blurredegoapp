'use client';
import IconPrinter from '@/public/icon/icon-printer';
import React, { useEffect, useState } from 'react';
import { apiCaller } from '@/utils/api';
import { getUser } from '@/utils/helperFunctions';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import PaginatedInvoiceTable from '@/components/PaginatedInvoiceTable';
const PreviewInvoice = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [appPack, setAppPack] = useState(null);
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get('invoiceId');
    const applicationId = searchParams.get('applicationId');
    const token = searchParams.get('token');

    const fetchInvoiceData = async (invoiceId, applicationId, token) => {
        try {
            const invoiceCall = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Use the token from the URL for authentication
                },
            });
            const invoice = invoiceCall?.data.data;
            setInvoiceData(invoice);
            // Fetch application data if the invoice is not a custom invoice
            if (applicationId !== '103023098128' && !invoice?.attributes?.Invoice_data?.isCustomInvoice) {
                const applicationCall = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}?populate=*`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Use the token from the URL for authentication
                    },
                });
                const appData = applicationCall?.data.data;
                setAppPack(appData);
            }
        } catch (error) {
            console.log('error', error);
        }
    };


    const getUserData = async () => {
        const user = getUser();
        try {
            const applicationCall = await apiCaller('get', `applications?filters[email][$eq]=${user.email}`);

            const invoiceCall = await apiCaller('get', `invoices?filters[email][$eq]=${user.email}&populate=*`);
            const appData = applicationCall?.data[0];
            const invoice = invoiceCall?.data[0];
            setInvoiceData(invoice);
            setAppPack(appData);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (invoiceId && applicationId && token) {
            // fetching data using from query
            fetchInvoiceData(invoiceId, applicationId, token);
        } else {
            //fetching data from old invocie approch
            getUserData();
        }
    }, [invoiceId, applicationId, token]);

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

    const membershipFees = parseFloat(invoiceData?.attributes?.amount);
    const registrationFees = invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? invoiceData?.attributes?.Invoice_data?.bankFees : 50;
    const subtotal = membershipFees + registrationFees;
    const discount = invoiceData?.attributes?.discount || 0;
    const grandTotal = subtotal - parseFloat(discount);
    const items = [
        ...(!invoiceData?.attributes?.Invoice_data?.isCustomInvoice
            ? [
                  {
                      id: 1,
                      title: `${appPack?.attributes?.membershipType} Membership Fees`,
                      quantity: '1',
                      price: membershipFees,
                      amount: membershipFees,
                  },
                  {
                      id: 2,
                      title: `Registration Fees`,
                      quantity: '1',
                      price: registrationFees,
                      amount: registrationFees,
                  },
              ]
            : invoiceData?.attributes?.Invoice_data?.newItem),
    ];

    const columns = [
        {
            key: 'title',
            label: 'Item',
        },
        {
            key: 'quantity',
            label: 'Quantity',
        },
        {
            key: 'price',
            label: 'PRICE (USD)',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'amount',
            label: 'AMOUNT (USD)',
            class: 'ltr:text-right rtl:text-left',
        },
    ];

    return (
        <>
         {(invoiceData?.attributes?.Invoice_data?.isCustomInvoice || appPack) && invoiceData && (
                <div id="invoice-loaded"></div>)}

            <title>Invoice | Preview</title>

            <div className=" relative ">
                <div className="print-header absolute w-full">
                    <img src="/assets/images/invoiceheader.svg" alt="logo" className="h-full w-full" />
                </div>

                <div className="flex flex-col items-center justify-center gap-2   pt-24   max-lg:pt-16 ">
                    <Image className="mr-1 flex  items-center justify-self-center  " alt="Blurred Ego" src="/assets/imgs/template/logo.png" width={158} height={55} />
                    <p className="text-2xl font-semibold uppercase underline">Invoice</p>
                </div>
                <div className=" mt-4  ">
                    {/* Content of the panel */}
                    <div className="panel container bg-transparent shadow-none max-lg:px-7">
                        <div className="flex  justify-between gap-3 ">
                            <div className="flex">
                                <div className="space-y-1 text-white-dark">
                                    <div>Issue For:</div>
                                    <div className="font-semibold text-black dark:text-white">{invoiceData?.attributes?.companyName}</div>
                                    <div>{invoiceData?.attributes?.companyEmail}</div>
                                    <div>{appPack?.attributes?.mobile1 || invoiceData?.attributes?.Invoice_data?.mobile}</div>
                                    <div>{appPack?.attributes?.mainOfficeAddress || invoiceData?.attributes?.Invoice_data?.address}</div>
                                </div>
                            </div>
                            <div className="flex w-full flex-col justify-end  sm:flex-row  ">
                                <div className=" ">
                                    {/* <div className=" flex w-full items-center justify-between"></div> */}
                                    <div className=" flex w-full items-center justify-between">
                                        <div className="text-white-dark">Issue Date :</div>
                                        <div>{formatDate(invoiceData?.attributes?.createdAt)}</div>
                                    </div>
                                    <div className=" flex w-full items-center justify-between">
                                        <div className="text-white-dark">Due Date :</div>
                                        <div>{formatDate(getDueDate(invoiceData?.attributes?.createdAt))}</div>
                                    </div>
                                    <div className=" flex w-full items-center justify-between">
                                        <div className="text-white-dark">Invoice No :</div>
                                        <div>{invoiceData?.attributes?.invoiceId}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="table-responsive ">
                            <div className="mb-1 flex flex-wrap items-center justify-end  gap-1">
                                <button type="button" className="print-button btn btn-primary btn-lg-d mr-1" onClick={() => exportTable()}>
                                    <IconPrinter />
                                    Print
                                </button>
                                <Link href={`InvoiceOnline/${invoiceData?.id || Math.random(1000 * 1000)}`}>
                                    <button type="button" className="btn btn-primary btn-lg-d gap-2">
                                        Pay Online
                                    </button>
                                </Link>
                            </div>
                            <PaginatedInvoiceTable items={items} columns={columns} itemsPerPage={6} />
                            
                            {/* <table className="table-striped">
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column.key} className={column?.class}>
                                                {column.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{item.quantity}</td>
                                            <td className="ltr:text-right rtl:text-left">{item.price}</td>
                                            <td className="ltr:text-right rtl:text-left">{item.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                        </div>
                        <hr className="my-1" />
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div></div>
                            <div className="space-y-2 ltr:text-right rtl:text-left">
                                {/* Bank Fees */}
                                {invoiceData?.attributes?.Invoice_data?.isCustomInvoice && (
                                    <div className="flex items-center">
                                        <span className="flex-1 font-medium">Bank Fees</span>
                                        <span className="w-[37%]">${invoiceData?.attributes?.Invoice_data?.bankFees}.00</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <div className="flex-1">Subtotal</div>
                                    <div className="w-[37%]">${subtotal}</div>
                                </div>

                                {discount > 0 && (
                                    <div className="flex items-center text-red-600">
                                        <div className="flex-1">Discount</div>
                                        <div className="w-[37%]">- ${discount}.00</div>
                                    </div>
                                )}

                                <div className="flex items-center text-lg font-semibold  text-green-700">
                                    <div className="flex-1">Grand Total</div>
                                    <div className="w-[37%]">USD ${grandTotal}</div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                        <br />

                        {/* <br /> */}
                    </div>
                    {/* Footer Image */}
                    <div className="print-footer  relative">
                        <div className="absolute  top-20 mx-auto flex w-full pl-[10%]  max-lg:top-6 ">
                            <div className="flex flex-col items-center justify-between  pb-3 sm:flex-row lg:gap-52">
                                <div className="xl:1/3 text-nowrap lg:w-1/2  lg:text-lg  max-lg:text-xs">
                                    <div className="mb-2 flex w-full items-start gap-2 max-lg:text-xs">
                                        <div className="text-white-dark ">Account Name:</div>
                                        <div className="whitespace-nowrap">Blurred Ego LIMITED</div>
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
                                        <div className="text-nowrap">004-801-772609-838</div>
                                    </div>
                                    <div className="mb-2 flex w-full items-start gap-2">(HKD/RMB/USD/EUR/GBP)</div>
                                </div>
                                <div className="flex items-end  ">
                                    <img src="/assets/images/invoiceimg.png" alt="logo" className="w-96 " />
                                    {/* <img src="/assets/images/stamp.png" alt="logo" className=" h-56 w-56 max-lg:h-32 max-lg:w-32 " /> */}
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
