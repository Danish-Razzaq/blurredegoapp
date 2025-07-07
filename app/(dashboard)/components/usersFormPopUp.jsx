'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '@/store/usersSlice';

const UsersFormPopup = ({ show, setShow, setShowSuccessUserCreated }) => {
    const usersRecord = useSelector((state) => state?.users?.users);
    const dispatch = useDispatch();
    // for country state and city
    const [listOfCountries, setListOfCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState();
    const [listOfStates, setListOfStates] = useState([]);
    const [selectedState, setSelectedState] = useState();
    const [listOfCities, setListOfCities] = useState([]);
    const [role, setRole] = useState('');
    const [countryCodeInput, setCountryCodeInput] = useState('');

    // for env
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    //for countries and cites
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
    // for react hook form
    const {
        register,
        handleSubmit,
        reset,

        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            email: '',
            country: '',
            state: '',
            city: '',
            website: '',
            password: '',
            confirmPassword: '',
            referredByBlurredEgo: false,
        },
    });

    // for user create in dashboard
    const onSubmit = async (data) => {
        data.username = data.email;

        if (data.role === 'admin') {
            data.memberManager = true;
            data.hasManagementRole = false;
            data.regular = false;
        } else if (data.role === 'managment') {
            data.hasManagementRole = true;
            data.memberManager = false;
            data.regular = false;
        } else if (data.role === 'member') {
            data.regular = true;
            data.memberManager = false;
            data.hasManagementRole = false;
        }

        try {
            const responseData = await axios?.post(`${apiUrl}/auth/local/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (responseData.status === 200) {
                // console.log('User created successfully', responseData);
                setShowSuccessUserCreated(true);
                dispatch(setUsers([...usersRecord, responseData.data.user]));
                reset();
            }
            // showMessage('User created successfully', 'success');
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }

        reset();

        setShow(false);
    };

    return (
        <>
            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="mx-6 overflow-y-auto bg-white p-4  lg:w-1/2 h-[75%] ">
                        <div className="mb-3 flex items-center justify-between">
                            <div />
                            <h1 className="text-2xl ">Create User</h1>
                            <button onClick={() => setShow(false)} className="text-2xl">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} 
                   
                        >
                            <div className="row justify-between">
                                <div className="col-md-12 mb-1">
                                    <h4 className="color-brand-1">Personal Info</h4>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <input className="form-control" type="text" placeholder="Full name *" {...register('fullName', { required: 'Full name is required' })} />
                                        {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
                                    </div>
                                </div>

                                <div className="col-md-12 mb-4 ">
                                    <select className="form-control" {...register('role', { required: 'Role is required' })} onChange={(e) => setRole(e.target.value)}>
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="managment">Managment</option>
                                        <option value="member">Member</option>
                                    </select>

                                    {errors.role && <p className="text-red-500">{errors.role.message}</p>}
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
                                            <input className="form-control" type="text" placeholder="Phone Number*" {...register('phoneNumber', { required: 'Phone number is required' })} />
                                            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
                                        </div>
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
                                <div className="col-md-4">
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
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input className="form-control" type="text" placeholder="Company Name" {...register('companyName')} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input className="form-control" type="email" placeholder="Company Email " {...register('companyEmail')} />
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
                                        <input className="form-control" type="password" placeholder="Enter Your Password *" {...register('password', { required: 'Password is required' })} />
                                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <input
                                            className="form-control"
                                            type="password"
                                            placeholder="Confirm Password *"
                                            {...register('confirmPassword', {
                                                required: 'Please confirm your password',
                                            })}
                                        />
                                        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mt-30">
                                <div className="d-flex align-items-center justify-content-center">
                                    <div className="box-button-form-login">
                                        <button className="btn btn-outline-blue btn-lg-d mr-20 p-3 px-6" onClick={() => setShow(false)}>
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="box-button-form-login">
                                        <button className="btn btn-brand-1-big mr-20" type="submit">
                                            Create User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsersFormPopup;
