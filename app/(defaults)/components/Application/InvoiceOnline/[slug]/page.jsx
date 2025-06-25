'use client';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, AddressElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiCaller } from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { getUser } from '@/utils/helperFunctions';
import './style.css';
import axios from 'axios';
import Image from 'next/image';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


const PaymentForm = ({ invoiceId }) => {
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${FRONTEND_URL}/components/Application/InvoicePaymentStatus`, // Replace with your actual return URL
            },
        });

        if (error) {
            setMessage(`Payment failed: ${error.message}`);
        } else {
            setMessage('Payment successful!');
        }
        setProcessing(false);
    };

    return (
        <form className="Form" onSubmit={handleSubmit}>
            <PaymentElement />
            <AddressElement options={{ mode: 'shipping' }} />
            {/* <Field label="Email" id="email" type="email" placeholder="john.doe@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field label="Name on Card" id="name" type="text" placeholder="John Doe" required autoComplete="cc-name" value={name} onChange={(e) => setName(e.target.value)} /> */}
            {/* <CardField />
            <BillingAddressFields billingAddress={billingAddress} setBillingAddress={setBillingAddress} /> */}
            {message && <ErrorMessage>{message}</ErrorMessage>}
            <SubmitButton processing={processing} disabled={!stripe}>
                Pay
            </SubmitButton>
        </form>
    );
};

export default function InvoicePage({ }) {
    const [clientSecret, setClientSecret] = useState(null);
    const params = useParams();
    const router = useRouter();
    const invoiceId = params?.slug;
    const [invoiceData, setInvoiceData] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const amount = Number(invoiceData?.attributes?.amount || 0);
    const discount = Number(invoiceData?.attributes?.discount || 0);
    const registrationFees = invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? invoiceData?.attributes?.Invoice_data?.bankFees : 50;

    const baseAmount = amount + registrationFees - discount;
    const onlinePaymentFee = baseAmount * 0.03; // Calculate 3% fee for online payment
    const amountInDollars = baseAmount + onlinePaymentFee;


    useEffect(() => {
        // Fetch the client secret from the server
        const fetchClientSecret = async () => {
            const user = getUser(); // Make sure to import this utility function correctly
            
            try {
                const response = await fetch(`${apiUrl}/invoices/pay/${invoiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.jwt}`,
                    },
                });
                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Failed to fetch client secret:', error);
            }
        };
        const fetchInvoiceData = async () => {
            const user = getUser(); // Make sure to import this utility function correctly
            if (!user) {
                alert('Access restricted! Please log in to proceed with the payment.')
                router.push('/login'); // Redirect to the login page

            }
            try {
                const response = await fetch(`${apiUrl}/invoices/${invoiceId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.jwt}`,
                    },
                });
                const data = await response.json();
                if (data?.data?.id) {
                    setInvoiceData(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch client secret:', error);
            }
        };
        fetchClientSecret();
        fetchInvoiceData();
    }, [invoiceId]);

    const options = {
        clientSecret,
        appearance: {
            theme: 'flat',
        },
    };
    return (
        <>
         <title>Invoice Payment</title>
        <div className="AppWrapperContainer">
            <div className="AppWrapperLeftMain red">
                <Image className="wow  animate__animated animate__fadeIn mb-28" alt="Blurred Ego" src="/assets/imgs/template/logo-footer.png " width={158} height={55} />
                <div className="AppWrapperLeft">
                    <div>
                        <p className="wow animate__animated animate__fadeInUp -mb-2 font-bold text-gray-300 sm:text-lg">Total Amount:</p>

                        <h2 className="wow animate__animated animate__fadeInUp mb-3 text-white">USD : ${amountInDollars}</h2>
                        <p className="wow animate__animated animate__fadeInUp  text-white sm:text-lg">
                          {invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? "Total Invoice Amount: " : "Membership Fee: "}
                            <span className="text-gray-300"> ${invoiceData?.attributes?.amount}.00</span>
                        </p>
                        <p className="wow animate__animated animate__fadeInUp my-3 text-white sm:text-lg">
                            Card Processing Fee (3%): <span className="text-gray-300"> ${onlinePaymentFee.toFixed(2)} </span>
                        </p>
                        <p className="wow animate__animated animate__fadeInUp my-3 text-white sm:text-lg">
                         {invoiceData?.attributes?.Invoice_data?.isCustomInvoice ? 'Bank' : 'Admin'} Fee: <span className="text-gray-300"> ${registrationFees.toFixed(2)}</span>
                        </p>

                        {/* if Discount */}
                        <p className="wow animate__animated animate__fadeInUp my-3 text-white sm:text-lg">
                            Discount: <span className="text-gray-300"> ${invoiceData?.attributes?.discount || '0'}.00</span>
                        </p>
                    </div>

                    {/* <div className="payment-Image wow animate__animated animate__fadeInIn my-3 flex h-[80%] w-[80%] justify-center ">
                        <img alt="Blurred Ego Payment Image" src="/assets/images/invicepayment.png " />
                    </div> */}
                </div>
            </div>
            <div className="AppWrapper">
                {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <PaymentForm invoiceId={invoiceId} />
                    </Elements>
                )}
            </div>
            <div></div>
        </div>
        </>
    );
}

const SubmitButton = ({ processing, children, disabled }) => (
    <button className={`SubmitButton ${processing ? 'SubmitButton--processing' : ''}`} type="submit" disabled={processing || disabled}>
        {processing ? 'Processing...' : children}
    </button>
);

const ErrorMessage = ({ children }) => (
    <div className="ErrorMessage" role="alert">
        <svg width="16" height="16" viewBox="0 0 17 17">
            <path fill="#FFF" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z" />
            <path
                fill="#ff0000"
                d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 Z"
            />
        </svg>
        {children}
    </div>
);
