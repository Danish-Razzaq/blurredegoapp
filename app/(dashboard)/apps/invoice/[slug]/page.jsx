'use client';
import IconPrinter from '@/public/icon/icon-printer';
import React, { useEffect, useState } from 'react';
import { apiCaller } from '@/utils/api';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import PaginatedInvoiceTable from '@/components/PaginatedInvoiceTable';
const PreviewInvoice = () => {
    const params = useParams();

    // console.log('params', params?.slug);

    const [invoiceData, setInvoiceData] = useState(null);
    const [appPack, setAppPack] = useState(null);
    // const user = getUser();
    // console.log('appPack', appPack);
    // console.log('invoiceData', invoiceData);
    // console.log("I'm running");

    const getUserData = async () => {
        try {
            const invoiceCall = await apiCaller('get', `invoices?filters[id][$eq]=${params?.slug}&populate=*`);
            // console.log('invoiceCall', invoiceCall);

            const invoice = invoiceCall?.data[0];

            if (invoice?.attributes?.email && !invoice?.attributes?.Invoice_data?.isCustomInvoice) {
                const applicationCall = await apiCaller('get', `applications?filters[email][$eq]=${invoice?.attributes?.email}`);
                // console.log('applicationCall', applicationCall);
                const appData = applicationCall?.data[0];
                setAppPack(appData);
            }

            setInvoiceData(invoice);
        } catch (error) {
            console.log('error', error);
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
        return date?.toISOString(); // Convert back to string to use with formatDate
    };

    const membershipFees = parseFloat(invoiceData?.attributes?.amount);
    const registrationFees = invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? invoiceData?.attributes?.Invoice_data?.bankFees : 50;
    const subtotal = membershipFees + registrationFees || 1550; // Default to 1550 if both are undefined
    const discount = invoiceData?.attributes?.discount || 0;
    const grandTotal = subtotal - parseFloat(discount) || 1550; // Default to 1550 if subtotal is undefined
    // console.log('invoiceData', invoiceData);

    const items = [
        ...(!invoiceData?.attributes?.Invoice_data?.isCustomInvoice
            ? [
                  {
                      id: 1,
                      title: `${appPack?.attributes?.membershipType || 'Founding'} Membership Fees`,
                      quantity: '1',
                      price: membershipFees || 1500,
                      amount: membershipFees || 1500,
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

                <div className="flex flex-col items-center justify-center gap-2   pt-24   max-lg:pt-16 ">
                    <Image className="mr-1 flex  items-center justify-self-center  " alt="Blurred Ego" src="/assets/imgs/template/logo.png" width={158} height={55} />
                    <p className="text-2xl font-semibold uppercase underline">Invoice</p>
                </div>
                <div className="mt-4  ">
                    {/* Content of the panel */}
                    <div className="panel container bg-transparent shadow-none max-lg:px-7">
                        <div className="flex  justify-between gap-3 ">
                            <div className="flex">
                                <div className="space-y-1 text-white-dark">
                                    <div>Issue For:</div>
                                    <div className="font-semibold text-black dark:text-white">{invoiceData?.attributes?.companyName ||
                                        "Bluured Ego Limited"}</div>
                                    <div>{invoiceData?.attributes?.companyEmail || "blurredEgo@limited.com"}</div>
                                    <div>{appPack?.attributes?.mobile1 || invoiceData?.attributes?.Invoice_data?.mobile || "1234567890"}</div>
                                    <div>{appPack?.attributes?.mainOfficeAddress || invoiceData?.attributes?.Invoice_data?.address || "123 Main St, City, Country"}</div>
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
                        <div className="table-responsive ">
                            <div className="mb-1 flex flex-wrap items-center  justify-end">
                                <button type="button" className="print-button btn btn-primary btn-lg-d gap-2" onClick={() => exportTable()}>
                                    <IconPrinter />
                                    Print
                                </button>
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
                        <hr className="my-3" />
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
                                    <div className="w-[37%]">${subtotal }.00</div>
                                </div>

                                {discount > 0 && (
                                    <div className="flex items-center text-red-600">
                                        <div className="flex-1">Discount</div>
                                        <div className="w-[37%]">- ${discount}.00</div>
                                    </div>
                                )}

                                <div className="flex items-center text-lg font-semibold text-green-700">
                                    <div className="flex-1">Grand Total</div>
                                    <div className="w-[37%]">USD ${grandTotal}.00 </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                    </div>
                    <div className="print-footer relative w-full">
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
