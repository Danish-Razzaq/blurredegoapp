'use client';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, AddressElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams } from 'next/navigation';
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
                return_url: `${FRONTEND_URL}/components/eventInvoice/InvoicePaymentStatus`, // Replace with your actual return URL
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

export default function InvoicePage({}) {
    const [clientSecret, setClientSecret] = useState(null);
    const params = useParams();
    const invoiceId = params?.slug;
    const [invoiceData, setInvoiceData] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const amount = Number(invoiceData?.invoiceAmount || 0);
    const discount = Number(invoiceData?.discount || 0);
    const adminBankFee = invoiceData?.bankFees || 0;

    const amountInDollars = amount + adminBankFee;
    // const amountInDollars = baseAmount ;

    useEffect(() => {
        // Fetch the client secret from the server
        const fetchClientSecret = async () => {
            const user = getUser(); // Make sure to import this utility function correctly
            try {
                const response = await fetch(`${apiUrl}/invoices/eventpay/${invoiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${user.jwt}`,
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
            try {
                // const response = await fetch(`${apiUrl}/event-participants/${invoiceId}`);
                const response = await axios.get(`${apiUrl}/event-participants?filters[event_taking_id][$eq]=${invoiceId}`);
                const data = response?.data?.data[0]?.attributes?.Invoice_data;
                console.log('data api ', data);
                if (response.status === 200 && data) {
                    setInvoiceData(data);
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
                    <Image className="wow  animate__animated animate__fadeIn mb-28 rounded-full" alt="Blurred Ego" src="/assets/imgs/template/logo.png " width={158} height={55} />
                    <div className="AppWrapperLeft">
                        <div>
                            <p className="wow animate__animated animate__fadeInUp -mb-2 font-bold text-gray-300 sm:text-lg">Total Amount:</p>

                            <h2 className="wow animate__animated animate__fadeInUp mb-3 text-white">USD : ${(amountInDollars * 1.03 || 1900).toFixed(2)}</h2>
                            <p className="wow animate__animated animate__fadeInUp my-3 text-white sm:text-lg">Includes</p>
                            <p className="wow animate__animated animate__fadeInUp my-3 text-white sm:text-lg">
                                Admin & Bank Fee: <span className="text-gray-300"> ${(adminBankFee || 30).toFixed(2)}</span>
                            </p>
                            <p className="wow animate__animated animate__fadeInUp my-3 text-white sm:text-lg">
                                Card Processing Fee (3%): <span className="text-gray-300"> ${(amountInDollars * 0.03 || 30).toFixed(2)} </span>
                            </p>

                            {/* if Discount */}
                            <p className="wow animate__animated animate__fadeInUp my-3 text-white sm:text-lg">
                                Discount Included: <span className="text-gray-300"> ${discount || '10.00'}</span>
                            </p>
                        </div>

                        {/* <div className="payment-Image wow animate__animated animate__fadeInIn my-3 flex h-[80%] w-[80%] justify-center ">
                        <img alt="Blurred Ego Payment Image" src="/assets/images/invicepayment.png " />
                    </div> */}
                    </div>
                </div>
                <div className="AppWrapper">
                    {/* {clientSecret && (
                        <Elements stripe={stripePromise} options={options}>
                            <PaymentForm invoiceId={invoiceId} />
                        </Elements>
                    )} */}
                    {/* dummy form look line atm card strpia  */}

                    <div class="flex min-h-screen items-center justify-center  text-white">
                        <div class="w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-lg">
                            <h2 class="mb-2 text-2xl font-semibold text-white">Complete Your Payment</h2>
                            <p class="mb-6 text-sm text-gray-300">Please enter your card details to complete the payment.</p>

                            <form>
                                <input type="text" placeholder="Cardholder Name" class="mb-4 w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <input type="text" placeholder="Card Number" class="mb-4 w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <div class="mb-4 flex gap-4">
                                    <input type="text" placeholder="MM/YY" class="w-1/2 rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <input type="text" placeholder="CVC" class="w-1/2 rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <button type="submit" class="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
                                    Pay Now
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
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
