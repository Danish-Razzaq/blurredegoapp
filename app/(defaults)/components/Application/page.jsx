'use client';
import React, { useEffect, useState } from 'react';
import ApplicationForm from './ApplicationForm';
import { ToastContainer } from 'react-toastify';
import { SuccessNotification } from '@/components/Toster/success';
import { getUser } from '@/utils/helperFunctions';
import Link from 'next/link';
import { apiCaller } from '@/utils/api';
// import { handleDownload } from '@/components/DownloadInvoiceButton';
const Application = () => {
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [CurrentStatus, setCurrentStatus] = useState('AppForm');
    const [invoiceData, setInvoiceData] = useState(null);
    const [appPack, setAppPack] = useState(null);
    const user = getUser();

    // console.log('invoiceData', invoiceData);
    // console.log('appdata', appPack);

    const getUserData = async () => {
        try {
            const applicationCall = await apiCaller('get', `applications?filters[email][$eq]=${user.email}`);

            const invoiceCall = await apiCaller('get', `invoices?filters[email][$eq]=${user.email}&populate=*   `);
            const appData = applicationCall?.data[0];
            const invoice = invoiceCall?.data[0];
            let finalState = decisionFunction(appData, invoice);
            setCurrentStatus(finalState);
            setInvoiceData(invoice);
            setAppPack(appData);
            const jwt = user?.jwt;
            const invoiceId = invoice?.id;
            const applicationId = appData?.id;
            const userEmail = user?.email;
            // // console.log('apppacks', appPack);

            // // console.log('jwt', jwt);
            // // console.log('invoiceId', applicationId);
            // // console.log('applicationId', applicationId);
            // // console.log('userEmail', userEmail);
            // // if (invoice?.attributes?.sentToMember && !invoice?.attributes?.invoiceUrl && !appData?.attributes?.isDeleted) {
            // if (invoice?.attributes?.sentToMember && !invoice?.attributes?.invoiceUrl) {
            //     await handleDownload(jwt, invoiceId, applicationId, userEmail);
            // }

        } catch (error) {
            console.log('error', error);
        }
    };

    const decisionFunction = (application, invoice) => {
        if (invoice?.attributes.received) {
            console.log('REDIRECT TO MEMBER PAGE'); // TODO Redirect to member page if invoice is already okay
        }
        const appSubmitted = application && 'AppSubmitted';
        const appApproved = application?.attributes?.approved && 'AppApproved';
        const invoiceApproved = invoice?.attributes?.sentToMember && 'InvoiceApproved';
        const invoiceGenerated = invoice?.attributes?.invoiceUrl && 'InvoiceGen';
        const appForm = 'AppForm';
        // for application deleted
        const applicationDeleted = application?.attributes?.isDeleted && 'ApplicationDeleted';
        // const invoiceReceived = invoice?.attributes.received && 'InvoiceReceived';
        const decisionsEval = [applicationDeleted, invoiceApproved, invoiceGenerated, appApproved, appSubmitted, appForm];

        // if (applicationDeleted) return applicationDeleted;


        let value = decisionsEval.find((val) => val);
        return value;
    };
    const setApplicationSubmitted = () => {
        getUserData();
    };

    useEffect(() => {
        getUserData();
    }, []);

    // Show success notification only once when the form is submitted
    useEffect(() => {
        if (showSuccessNotification) {
            SuccessNotification('Application submitted successfully');
            setTimeout(() => {
                setShowSuccessNotification(false);
            }, 100); // Add a slight delay to ensure the toast is shown
        }
    }, [showSuccessNotification]);
    return (
        <>
            {renderMethod(CurrentStatus, appPack, invoiceData, { setApplicationSubmitted: setApplicationSubmitted, setShowSuccessNotification: setShowSuccessNotification })}
            <ToastContainer />
        </>
    );
};

const renderMethod = (CurrentStatus, appPack, invoiceData, methods) => {
    const toRender = {
        AppSubmitted: AppSubmitted,
        AppApproved: AppApproved,
        InvoiceApproved: InvoiceApproved,
        AppForm: AppForm,
        ApplicationDeleted: ApplicationDeleted,
    };

    if (toRender[CurrentStatus]) return toRender[CurrentStatus](CurrentStatus, appPack, invoiceData, methods);
    return null;
};

const AppSubmitted = () => {
    return (
        <div className="text-center">
            <h3 className="text-gray-600">Your application has been submitted successfully.</h3>
            <h5 className="text-gray-600">You will be notified once your application is approved.</h5>
        </div>
    );
};

const AppApproved = () => {
    return (
        <div className=" flex flex-col items-center justify-center gap-2">
            <h6 className="text-gray-600 lg:px-6">Dear Member, Congratulations! Your application has been approved. Our Team is currently generating your invoice. Stay tuned with us. </h6>
            {/* <Link href="/components/Application/PreviewInvoice" legacyBehavior>
            You can Preview your invoice by clicking on Preview Button.
                <a className="btn btn-blue btn-lg-d w-fit " target="_blank" rel="noopener noreferrer">
                    Preview Invoice
                </a>
            </Link> */}
        </div>
    );
};
const InvoiceApproved = () => {
    return (
        <div className=" flex flex-col items-center justify-center gap-2">
            <h6 className="text-gray-600 lg:px-6">Dear Member, You can Preview your invoice by clicking on Preview Button. </h6>
            <Link href="/components/Application/PreviewInvoice" legacyBehavior>
                <a className="btn btn-blue btn-lg-d w-fit " target="_blank" rel="noopener noreferrer">
                    Preview Invoice
                </a>
            </Link>
        </div>
    );
};


const ApplicationDeleted = () => {
    return (
        <div className="text-center">
            <h6 className="text-gray-600">
                Your application has been removed by the administrator. For further assistance, please reach out to us at
                <Link className="text-blue-600 underline ml-1" href="mailto:Info@blurredego.com">
                    Info@blurredego.com
                </Link>.
            </h6>
        </div>

    );
}

// const InvoiceGen = (CurrentStatus, appPack, invoiceData, methods) => {
//     const downloadUrl = `${process.env.NEXT_PUBLIC_IMG_URL}${invoiceData.attributes?.invoice?.data?.[0]?.attributes?.url}`;
//     return (
//         <>
//             <p>
//                 {'Dear Member,'} <br /> <br />
//                 Congratulations! Your application has been approved, you may now pay the membership fees to complete the membership process.,
//                 <br />
//                 <br />
//                 You may download your invoice from the button below, once paid kindly send a confirmation at,
//                 <a href="#">info@wnvoec.org</a>. {'After verification of payment you will be granted full membership access to Blurred Ego.'}
//             </p>
//             <a href={downloadUrl} className="inv-btn">
//                 {'Download Invoice'}
//             </a>
//         </>
//     );
// };

const AppForm = (CurrentStatus, appPack, invoiceData, methods) => {
    return <ApplicationForm setApplicationSubmitted={methods.setApplicationSubmitted} setShowSuccessNotification={methods.setShowSuccessNotification} />;
};

export default Application;
