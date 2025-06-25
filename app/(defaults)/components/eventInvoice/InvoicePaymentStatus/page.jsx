'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/utils/helperFunctions';
import "./style.css"

const PaymentStatus = () => {
    const router = useRouter(); // Initialize useRouter

    const [status, setStatus] = useState('loading'); // 'loading', 'succeeded', 'failed'
    const [message, setMessage] = useState('');
    useEffect(() => {
        const fetchPaymentIntentStatus = async () => {
            const user = getUser(); // Retrieve the user's JWT or authentication token
            const getQueryParams = () => {
                const params = new URLSearchParams(window.location.search);
                return {
                    payment_intent: params.get('payment_intent'),
                    redirect_status: params.get('redirect_status'),
                };
            };

            const { payment_intent, redirect_status } = getQueryParams();

            // Validate the presence of necessary parameters
            if (!payment_intent || !redirect_status) {
                setStatus('failed');
                setMessage('Missing payment details.');
                return;
            }
            try {
                // Here, you are using `redirect_status` directly from the query parameters
                // Assuming you are using it to display a pre-determined status message
                if (redirect_status === 'succeeded') {
                    setStatus('succeeded');
                    setMessage('Your payment was successful. Thank you!');
                    router.push('/pages/events');

                } else if (redirect_status === 'processing') {
                    setStatus('processing');
                    setMessage('Your payment is processing. Please wait a moment.');
                } else if (redirect_status === 'failed') {
                    setStatus('failed');
                    setMessage('Your payment failed. Please try again or contact support.');
                } else {
                    throw new Error('Unknown status');
                }
            } catch (error) {
                setStatus('failed');
                setMessage(`An error occurred: ${error.message}`);
            }
        };

        fetchPaymentIntentStatus();
    }, []);

    return (
        <div className="PaymentStatus">
            {status === 'loading' && <p>Loading payment status...</p>}
            {status === 'succeeded' && (
                <div className="success-message">
                    <h2>Payment Successful!</h2>
                    <p>{message}</p>
                </div>
            )}
            {status === 'processing' && (
                <div className="processing-message">
                    <h2>Payment Processing</h2>
                    <p>{message}</p>
                </div>
            )}
            {status === 'failed' && (
                <div className="error-message">
                    <h2>Payment Failed</h2>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default PaymentStatus;
