'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../(defaults)/components/layout/Layout';
import Brand1Slider from '../../(defaults)/components/home/Brands';
import Link from 'next/link';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import JoinSuccessPopUp from '@/components/JoinSuccessPopUp';
import { ErrorNotification } from '@/components/Toster/success';
import { ToastContainer } from 'react-toastify';
// import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import { useDispatch } from 'react-redux';
import { isMemberManager, storeUser } from '@/utils/helperFunctions';
import { login } from '@/store/authSlice';

export default function Register() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch(); // Initialize useDispatch
    const [listOfCountries, setListOfCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState();
    const [listOfStates, setListOfStates] = useState([]);
    const [selectedState, setSelectedState] = useState();
    const [listOfCities, setListOfCities] = useState([]);
    const [successJoinPopUp, setSuccessJoinPopUp] = useState(false);
    const [countryCodeInput, setCountryCodeInput] = useState('');
    //show field of referred by gca
    const [showReferredByGca, setShowReferredByGca] = useState(false);
    // for loading utile request is in progress
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch('https://api.countrystatecity.in/v1/countries', {
            method: 'GET',
            headers: {
                'X-CSCAPI-KEY': 'aTRzTW5VekFyaUs0em5pd0FPRlNnYm5wY3lHcnNpU3l1RnFBdVhwUg==',
            },
        })
            .then((response) => response.json())
            .then((data) =>
                setListOfCountries(
                    data.map((item) => ({
                        value: item.name,
                        code: item.phonecode, // This gives us the country code
                        iso: item.iso2,
                    }))
                )
            )
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    useEffect(() => {
        if (!selectedCountry) return;

        fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`, {
            method: 'GET',
            headers: {
                'X-CSCAPI-KEY': 'aTRzTW5VekFyaUs0em5pd0FPRlNnYm5wY3lHcnNpU3l1RnFBdVhwUg==',
            },
        })
            .then((response) => response.json())
            .then((data) =>
                setListOfStates(
                    data.map((item) => ({
                        value: item.name,
                        iso: item.iso2,
                    }))
                )
            )
            .catch((error) => console.error('Error fetching states:', error));
    }, [selectedCountry]);

    useEffect(() => {
        if (!selectedState) return;

        fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`, {
            method: 'GET',
            headers: {
                'X-CSCAPI-KEY': 'aTRzTW5VekFyaUs0em5pd0FPRlNnYm5wY3lHcnNpU3l1RnFBdVhwUg==',
            },
        })
            .then((response) => response.json())
            .then((data) =>
                setListOfCities(
                    data.map((item) => ({
                        value: item.name,
                    }))
                )
            )
            .catch((error) => console.error('Error fetching cities:', error));
    }, [selectedState]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // username:'',
            fullName: '',
            countryCode: '',
            phoneNumber: '',
            email: '',
            country: '',
            state: '',
            city: '',
            website: '',
            password: '',
            confirmPassword: '',
            referredByGca: false,
            gcaMemberReferId: '',
        },
    });
    const router = useRouter();

    const onSubmit = async (data) => {
        data.username = data.email;

        if (data?.password !== data?.confirmPassword) {
            ErrorNotification('Password and Confirm Password do not match. Please try again.');
            return;
        }

        setIsLoading(true); // Start loading

        try {
            // Register the user
            const response = await axios.post(`${apiUrl}/auth/local/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // login user after registration success
                const loginData = {
                    identifier: data.email,
                    password: data.password,
                };

                const loginResponse = await axios.post(`${apiUrl}/auth/local`, loginData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const jwt = loginResponse.data.jwt;
                dispatch(login({ user: loginResponse.data.user, jwt }));
                storeUser(loginResponse.data);

                // redirect to site
                if (isMemberManager()) {
                    router.push('/dashboard');
                } else {
                    router.push('/member');
                }

                reset();
            }
        } catch (error) {
            if (error?.code === 'ERR_NETWORK') {
                ErrorNotification('Network error, please try again later.');
            } else if (error?.response?.data?.error?.message === 'Email or Username are already taken') {
                ErrorNotification('This email is already in use. Please try logging in.');
            } else {
                ErrorNotification('Something went wrong. Please try again later.');
            }
            console.log('error', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const onCheckboxChange = (e) => {
        setShowReferredByGca(e.target.checked);
    };

    return (
        <>
            <title> GCA | Register</title>
            <Layout>
                <section className="section box-login">
                    <div className="row align-items-center m-0 px-3">
                        <div className="col-lg-6">
                            <div className="box-login-left">
                                <div className="mb-10 text-center">
                                    <h2 className="wow animate__animated animate__fadeIn text-[#034460] lg:text-5xl">Create an Account</h2>
                                    <p className="font-md color-grey-500 wow animate__animated animate__fadeIn lg:px-12">
                                        Sign up now to access exclusive benefits and connect with a global community of independent freight forwarders.
                                    </p>
                                </div>
                                <div className="box-form-login wow animate__animated animate__fadeIn">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row justify-between">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <input className="form-control" type="text" placeholder="Full name" {...register('fullName', { required: 'Full name is required' })} />
                                                    {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        placeholder="Email Address*"
                                                        {...register('email', {
                                                            required: 'Email is required',
                                                            pattern: {
                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                message: 'Invalid email address',
                                                            },
                                                        })}
                                                    />
                                                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <div className="form-floating  w-fit">
                                                    <input
                                                        type="text"
                                                        className="form-control "
                                                        id="floatingInput"
                                                        placeholder="Country Code"
                                                        maxLength={4}
                                                        name="countryCode"
                                                        {...register('countryCode', {
                                                            required: true,
                                                            maxLength: 4,
                                                        })}
                                                        // style={{ width: '8rem' }}
                                                        value={countryCodeInput}
                                                        onChange={(e) => setCountryCodeInput(e.target.value)} // Set the input value
                                                        list="countryCodes" // Connect to the datalist
                                                    />
                                                    <label htmlFor="floatingInput " className="text-xs font-normal">
                                                        Country code*
                                                    </label>

                                                    {/* Datalist for country codes */}
                                                    <datalist id="countryCodes">
                                                        {listOfCountries
                                                            .filter(
                                                                (country) => country.code.startsWith(countryCodeInput) // Filter suggestions based on input
                                                            )
                                                            .map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.value} (+{country.code})
                                                                </option>
                                                            ))}
                                                    </datalist>
                                                    {errors.countryCode && <p className="text-red-500">Country code is required</p>}
                                                </div>

                                                <div className="col-8">
                                                    <div className="form-group">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Phone Number*"
                                                            {...register('phoneNumber', { required: 'Phone number is required' })}
                                                        />
                                                        {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <select className="form-control" {...register('country', { required: 'Country is required' })} onChange={(e) => setSelectedCountry(e.target.value)}>
                                                        <option value="">Select Country</option>
                                                        {listOfCountries.map((country) => (
                                                            <option key={country.iso} value={country.iso}>
                                                                {country.value}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {errors.country && <p className="text-red-500">{errors.country.message}</p>}
                                                </div>

                                                {/* <div className="form-group">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Country"
                                                    {...register('country', { required: 'Country is required' })}
                                                />
                                                {errors.country && (
                                                    <p className="text-red-500">{errors.country.message}</p>
                                                )}
                                            </div> */}
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <select className="form-control" {...register('state', { required: 'State is required' })} onChange={(e) => setSelectedState(e.target.value)}>
                                                        <option value="">Select State</option>
                                                        {listOfStates?.map((state) => (
                                                            <option key={state.iso} value={state.iso} placeholder="State">
                                                                {state.value}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {/* <input className="form-control" type="text" placeholder="State" {...register('state', { required: 'State is required' })} /> */}
                                                    {errors.state && <p className="text-red-500">{errors.state.message}</p>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="City"
                                                        {...register('city', { required: 'City is required' })}
                                                        list="cities"
                                                        onChange={(e) => {
                                                            // Fetch details for the city if needed
                                                        }}
                                                    />
                                                    <datalist id="cities">
                                                        {listOfCities?.map((city) => (
                                                            <option key={city.value} value={city.value} />
                                                        ))}
                                                    </datalist>

                                                    {/* <input className="form-control" type="text" placeholder="City" {...register('city', { required: 'City is required' })} /> */}
                                                    {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <input className="form-control" type="text" placeholder="Website" {...register('website', { required: 'Website is required' })} />
                                                    {errors.website && <p className="text-red-500">{errors.website.message}</p>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <input className="form-control" type="password" placeholder="Enter Your Password" {...register('password', { required: 'Password is required' })} />
                                                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        {...register('confirmPassword', {
                                                            required: 'Please confirm your password',
                                                        })}
                                                    />
                                                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="box-remember">
                                                        <label className="font-xs color-grey-900" htmlFor="rememberme">
                                                            <input id="rememberme" type="checkbox" {...register('referredByGca')} onChange={onCheckboxChange} />
                                                            Are you referred by a GCA member?
                                                        </label>
                                                    </div>
                                                </div>
                                                {showReferredByGca && (
                                                    <div className="relative  h-8  w-full min-w-[200px]">
                                                        <input type="text" {...register('gcaMemberReferId')} className=" input-Style peer w-full" placeholder="Enter Refer Id" />
                                                        <label className="input-style-label">Enter Refer Id</label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group mt-30">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="box-button-form-login">
                                                    <button className="btn btn-brand-1-big mr-20" type="submit">
                                                        Create Account
                                                    </button>
                                                </div>
                                                <div className="box-text-form-login">
                                                    <span className="font-xs color-grey-500">Already have an account? </span>
                                                    <Link className="font-xs color-brand-2" href="/login">
                                                        Sign In
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="box-login-right">
                                <div className="box-info-bottom-img box-info-bottom-img-3 -z-50 flex flex-col items-start">
                                    <div>
                                        <p className="font-sm color-white">
                                            Geo Cargo Alliance (GCA) unites independent freight forwarders globally, offering a network that enhances connectivity and delivers key resources for
                                            success in logistics.
                                        </p>
                                    </div>
                                    <div className="mt-30 wow animate__animated animate__fadeIn underline">
                                        <Link className="btn btn-link font-sm" href="#" style={{ color: 'white' }}>
                                            Read More
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
            </Layout>

            {successJoinPopUp && <JoinSuccessPopUp onClose={() => setSuccessJoinPopUp(false)} />}
            {isLoading && <Loading />}
            <ToastContainer />
        </>
    );
}
