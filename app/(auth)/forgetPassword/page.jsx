'use client';
import axios from 'axios';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ErrorNotification, SuccessNotification } from '@/components/Toster/success';
import { useSearchParams, useParams } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
export default function ForgetPassword() {
    const searchParams = useSearchParams();
    const urlCode = searchParams.get('code'); // Extract the code from URL
    const [backLogin, setBackLogin] = useState(false);

    console.log('urlCode', urlCode);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmitPassword = async (data) => {
        if (data?.password !== data?.confirmPassword) {
            ErrorNotification('Password and Confirm Password do not match. Please try again.');
            return;
        }
        // Log form data to ensure it contains the expected values
        // console.log('Form Data:', data);

        // Ensure urlCode is not null or undefined
        if (!urlCode) {
            console.error('Error: Code is missing');
            ErrorNotification('Code is missing in the URL');
            return;
        }

        try {
            // Send POST request with the code included
            const response = await axios.post(`${apiUrl}/auth/reset-password`, {
                code: urlCode, 
                password: data.password,
                passwordConfirmation: data.confirmPassword,
            });
            if (response.status === 200) {
                console.log('Password reset response:', response);
                SuccessNotification('Password reset successful');
                // router.push('/login'); // Redirect to login page
                setBackLogin(true);
                reset(); // Optionally reset the form after success
            }
        }catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            ErrorNotification('Password reset failed - please try again');
        }
    };
    return (
        <section className="cnt-center section box-login">
            <div className="row align-items-center m-0">
                <div className="col-lg-6 lg:-mt-44">
                    <div className="box-login-left space-y-5 text-center">
                        <div className="box-form-login wow animate__animated animate__fadeIn">
                        {
                            backLogin ? (
                                <div className="mb-4  font-bold text-center">
                                <h2 className="color-brand-2 wow animate__animated animate__fadeIn mb-10">
                                Congratulations!
                            </h2>
                                    <p className="font-md color-grey-500 wow animate__animated animate__fadeIn mb-40">
                                    Your password has been successfully reset. <br/> Please log in to continue.
                                    </p>
                                    <Link className='btn btn-primary text-bold' href="/login">
                                 <IoMdArrowRoundBack className='inline-block w-8 h-8 mr-2'/>     Back to Login
                                    </Link>
                                </div>
                            ) :
                            <>
                        
                            <h2 className="color-brand-2 wow animate__animated animate__fadeIn mb-10">
                                Reset Password
                            </h2>
                            <p className="font-md color-grey-500 wow animate__animated animate__fadeIn mb-40 ">
                                 Enter your new password below to complete the reset process.<br/> Make sure it's strong and unique.
        
                            </p>
                            <form onSubmit={handleSubmit(onSubmitPassword)}>
                                <div className="mb-4 text-start font-bold">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">New Password<span className="text-red-500"> *</span></label>
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                        })}
                                        className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter new password"
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                                </div>

                                <div className="mb-4 text-start font-bold">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password<span className="text-red-500"> *</span></label>
                                    <input
                                        type="password"
                                        {...register('confirmPassword', {
                                            required: 'Confirm Password is required',
                                            validate: (value) => value === watch('password') || 'Passwords do not match',
                                        })}
                                        className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Confirm your password"
                                    />
                                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                                </div>

                                <button type="submit" className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    Update Password
                                </button>
                            </form>
                            </>
                        }
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="box-login-right">
                        {/* <div className="quote-shape shape-1" /> */}
                        <div className="box-info-bottom-img box-info-bottom-img-3 flex flex-col items-start" style={{ width: '291px' }}>
                            <div>
                                <p className="font-sm color-white">
                                    Blurred Ego (BE) unites independent freight forwarders globally, offering a network that enhances connectivity and delivers key resources for success in
                                    logistics.
                                </p>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
}
