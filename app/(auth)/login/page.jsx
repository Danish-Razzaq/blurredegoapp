'use client';
import Layout from '../../(defaults)/components/layout/Layout';
import Brand1Slider from '../../(defaults)/components/home/Brands';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { hasManagementAccess, storeUser } from '@/utils/helperFunctions';
import { login } from '@/store/authSlice';
import { useState } from 'react';
import { ErrorNotification, SuccessNotification } from '@/components/Toster/success';
import { ToastContainer } from 'react-toastify';
export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [forgetPasswordState, setForgetPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        // console.log(data);
        data.identifier = data.email;
        try {
            const response = await axios.post(`${apiUrl}/auth/local`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // console.log(response);

            // set into redux store
            const jwt = response.data.jwt;
            dispatch(login({ user: response.data.user, jwt }));

            if (response.data) {
                // console.log(jwt);
                storeUser(response.data);

                if (hasManagementAccess()) {
                    // Redirect user on successful Admin dashboard
                    router.push('/dashboard');
                } else {
                    // Redirect user on successful membership form
                    router.push('/member');
                }

                reset();
            }
        } catch (error) {
            alert('Invalid email or password');
        }
    };

    // forget password functionality

    const forgetPassword = async (data) => {
        try {
            const response = await axios.get(`${apiUrl}/users?filters[email][$eq]=${data?.email}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('status', response?.data[0]?.email);
            if (response?.data[0]?.email === data?.email) {
                try {
                    const response = await axios.post(
                        `${apiUrl}/auth/forgot-password`,
                        { email: data?.email },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    console.log('forget email send res', response);
                    SuccessNotification('Password reset link sent to your email');
                    reset();
                } catch (error) {
                    console.log(error);
                }

                // console.log('email found');
            } else {
                // console.log('email not found');
                ErrorNotification('Email not found. Please try again.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <title>Blurred Ego | Login</title>
            <section className="cnt-center section box-login">
                <div className="row align-items-center m-0">
                    <div className="col-lg-6 lg:-mt-44">
                        <div className="box-login-left space-y-5 text-center">
                            <h2 className="color-brand-2 wow animate__animated animate__fadeIn mb-3">{forgetPasswordState ? 'Forgot Password' : 'Login'}</h2>
                            <p className="font-md color-grey-500 wow animate__animated animate__fadeIn">
                                {forgetPasswordState
                                    ? 'Enter your email address and we will send you a link to reset your password'
                                    : ' Securely log in to manage your profile and access personalized features'}
                            </p>
                            <div className="box-form-login wow animate__animated animate__fadeIn">
                                {forgetPasswordState ? (
                                    <form onSubmit={handleSubmit(forgetPassword)}>
                                        <div className="form-group">
                                            <input
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                type="text"
                                                placeholder="Email"
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                        message: 'Invalid email format',
                                                    },
                                                })}
                                            />
                                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                        </div>
                                        <div className="form-group">
                                            <div className="d-flex justify-content-lg-end">
                                                <div className="box-forgotpass">
                                                    <div className="font-xs color-brand-2 cursor-pointer" onClick={() => setForgetPassword(false)}>
                                                        Back to Login
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group mt-4">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="box-button-form-login w-full">
                                                    <button className="btn btn-brand-1-big mr-20 w-full text-lg" type="submit">
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-group">
                                            <input
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                type="text"
                                                placeholder="Email"
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                        message: 'Invalid email format',
                                                    },
                                                })}
                                            />
                                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                type="password"
                                                placeholder="Enter Your Password"
                                                {...register('password', {
                                                    required: 'Password is required',
                                                })}
                                            />
                                            {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                        </div>
                                        <div className="form-group">
                                            <div className="d-flex justify-content-lg-end">
                                                <div className="box-forgotpass">
                                                    <div className="font-xs color-brand-2 cursor-pointer" onClick={() => setForgetPassword(true)}>
                                                        Forgot your password?
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group mt-4">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="box-button-form-login w-full">
                                                    <button className="btn btn-brand-1-big mr-20 w-full text-lg" type="submit">
                                                        Login
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="box-text-form-login my-2 text-start font-normal">
                                                <span className="font-xs color-grey-500">Don't Have an Account?</span>
                                                <Link className="font-xs color-brand-2" href="/register">
                                                    {' '}
                                                    Register Now
                                                </Link>
                                            </div>
                                        </div>
                                    </form>
                                )}
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
                                <div className="mt-30 wow animate__animated animate__fadeIn">
                                    <Link className="btn btn-link font-sm underline" href="#" style={{ color: 'white' }}>
                                        View Details
                                        <span className="bg-white">
                                            <svg
                                                style={{ color: 'black' }}
                                                className="icon-16 h-10 w-6 text-black"
                                                fill="black"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Brand1Slider />
            <ToastContainer />
        </Layout>
    );
}
