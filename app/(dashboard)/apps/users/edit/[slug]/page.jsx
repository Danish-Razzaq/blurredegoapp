// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { ErrorNotification, SuccessNotification } from '@/components/Toster/success';
// import { ToastContainer } from 'react-toastify';
// import { useParams } from 'next/navigation';
// import { apiCaller } from '@/utils/api';
// import countryMapping from '@/components/countryNamesData';

// export default function Register() {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//     const [listOfCountries, setListOfCountries] = useState([]);
//     const [selectedCountry, setSelectedCountry] = useState();
//     const [listOfStates, setListOfStates] = useState([]);
//     const [selectedState, setSelectedState] = useState();
//     const [listOfCities, setListOfCities] = useState([]);
//     const [showReferredByBlurred Ego, setShowReferredByBlurred Ego] = useState(false);
//     const [user, setUser] = useState([]);
//     const { slug } = useParams();
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm();
//     // for loading utile request is in progress

//     // api call user register

//     const getUsers = async () => {
//         let result = await apiCaller('get', `users?filters[id][$eq]=${slug}`);
//         if (result.err) console.log('error', result.err);
//         else {
//             setUser(result);
//         }
//     };
//     // console.log('user', user);

//     useEffect(() => {
//         getUsers();
//     }, []);

//     useEffect(() => {
//         fetch('https://api.countrystatecity.in/v1/countries', {
//             method: 'GET',
//             headers: {
//                 'X-CSCAPI-KEY': 'aTRzTW5VekFyaUs0em5pd0FPRlNnYm5wY3lHcnNpU3l1RnFBdVhwUg==',
//             },
//         })
//             .then((response) => response.json())
//             .then((data) => setListOfCountries(data.map((item) => ({ value: item.name, iso: item.iso2 }))))
//             .catch((error) => console.error('Error fetching countries:', error));
//     }, []);

//     useEffect(() => {
//         if (!selectedCountry) return;

//         fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`, {
//             method: 'GET',
//             headers: {
//                 'X-CSCAPI-KEY': 'aTRzTW5VekFyaUs0em5pd0FPRlNnYm5wY3lHcnNpU3l1RnFBdVhwUg==',
//             },
//         })
//             .then((response) => response.json())
//             .then((data) => setListOfStates(data.map((item) => ({ value: item.name, iso: item.iso2 }))))
//             .catch((error) => console.error('Error fetching states:', error));
//     }, [selectedCountry]);

//     useEffect(() => {
//         if (!selectedState) return;

//         fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`, {
//             method: 'GET',
//             headers: {
//                 'X-CSCAPI-KEY': 'aTRzTW5VekFyaUs0em5pd0FPRlNnYm5wY3lHcnNpU3l1RnFBdVhwUg==',
//             },
//         })
//             .then((response) => response.json())
//             .then((data) => setListOfCities(data.map((item) => ({ value: item.name }))))
//             .catch((error) => console.error('Error fetching cities:', error));
//     }, [selectedState]);

//     useEffect(() => {
//         if (user.length > 0) {
//             // Set form values and dropdown selections based on user data
//             reset({
//                 fullName: user[0]?.fullName || '',
//                 phoneNumber: user[0]?.phoneNumber || '',
//                 email: user[0]?.email || '',
//                 country: user[0]?.country || '',
//                 state: user[0]?.state || '',
//                 city: user[0]?.city || '',
//                 website: user[0]?.website || '',
//                 password: user[0]?.password || '',
//                 confirmPassword: user[0]?.password || '',
//                 Blurred EgoMemberReferId: user[0]?.Blurred EgoMemberReferId || '',
//             });
//             setSelectedCountry(user[0]?.country || '');
//             setSelectedState(user[0]?.state || '');
//             setShowReferredByBlurred Ego(user[0]?.Blurred EgoMemberReferId?.length > 0);
//         }
//     }, [user, reset]);

//     const onSubmit = async (data) => {
//         data.username = data.email;

//         if (data?.password !== data?.confirmPassword) {
//             ErrorNotification('Password and Confirm Password do not match. Please try again.');
//             return;
//         }
//         try {
//             const response = await axios.put(`${apiUrl}/users/${slug}`, data, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             // const response = await apiCaller('put', `users/${slug}`, data);

//             console.log('response', response);

//             if (response.status === 200) {
//                 SuccessNotification('User Updated successfully!!');
//                 reset();
//             }
//         } catch (error) {
//             // Check if it's a network error
//             if (error?.code === 'ERR_NETWORK') {
//                 ErrorNotification('Network error, please try again later.');
//             }
//             // Handle other errors
//             else {
//                 ErrorNotification('Something went wrong. Please try again later.');
//             }
//             console.log('error', error);
//         }
//     };

//     const onCheckboxChange = (e) => {
//         setShowReferredByBlurred Ego(e.target.checked);
//     };

//     return (
//         <>
//             <title> User Edit</title>

//             <section className="section box-login">
//                 <div className="container-md lg:px-44 md:px-16">
//                     <div className="mb-24 text-center">
//                         <h2 className="wow animate__animated animate__fadeIn text-[#034460] lg:text-5xl">Edit User </h2>
//                     </div>
//                     <div className="box-form-login wow animate__animated animate__fadeIn sm:shadow sm:p-5">
//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             <div className="row justify-between space-y-5 ">
//                                 <div className="col-md-12 md:flex justify-between sm:space-y-0 space-y-5">
//                                 <div className="col-md-6 ">
//                                     <div className="relative h-11 min-w-[200px]">
//                                         <input className="input-Style peer w-full" type="text" placeholder="Full name" {...register('fullName', { required: 'Full name is required' })} />
//                                         <label className="input-style-label">
//                                         Full Name <span className="text-red-500"> *</span>
//                                     </label>
//                                         {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-5">
//                                     <div className="relative h-11 min-w-[200px]">
//                                         <input className="input-Style peer w-full" type="text" placeholder="Phone Number*" {...register('phoneNumber', { required: 'Phone number is required' })} />
//                                         <label className="input-style-label">
//                                         Phone Number <span className="text-red-500"> *</span>
//                                     </label>

//                                         {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="col-md-12">
//                                     <div className="relative h-11 min-w-[200px]">
//                                         <input
//                                             className="input-Style peer w-full"
//                                             type="email"
//                                             placeholder="Email Address*"
//                                             {...register('email', {
//                                                 required: 'Email is required',
//                                                 pattern: {
//                                                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                                     message: 'Invalid email address',
//                                                 },
//                                             })}
//                                         />
//                                         <label className="input-style-label">
//                                         Email Address <span className="text-red-500"> *</span>
//                                     </label>
//                                         {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-5">
//                                 <label htmlFor='country' className='font-normal'>
//                                         Country <span className="text-red-500"> *</span>
//                                     </label>
//                                     <div className="form-group">
//                                         <select
//                                               className="peer block w-full appearance-none border-b-2 border-gray-600  px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0"
//                                             {...register('country', { required: 'Country is required' })}
//                                             onChange={(e) => setSelectedCountry(e.target.value)}
//                                             value={selectedCountry || ''} // Set the selected value
//                                             id='country'
//                                         >
//                                             <option value="">Select Country</option>
//                                             {listOfCountries.map((country) => (
//                                                 <option key={country.iso} value={country.iso}>
//                                                     {country.value}
//                                                 </option>
//                                             ))}
//                                         </select> 
//                                         {errors.country && <p className="text-red-500">{errors.country.message}</p>}
//                                     </div>
//                                 </div>

//                                 <div className="col-md-4 ">
//                                     <div >
//                                         <label htmlFor='state' className='font-normal'>
//                                             State <span className="text-red-500"> *</span>
//                                         </label>
//                                         <select
//                                            className='peer block w-full appearance-none border-b-2 border-gray-600  px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0'
//                                             {...register('state', { required: 'State is required' })}
//                                             onChange={(e) => setSelectedState(e.target.value)}
//                                             value={selectedState || ''} // Set the selected value
//                                             id='state'
//                                         >
//                                             <option value="">Select State</option>
//                                             {listOfStates.map((state) => (
//                                                 <option key={state.iso} value={state.iso}>
//                                                     {state.value}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.state && <p className="text-red-500">{errors.state.message}</p>}
//                                     </div>
//                                 </div>

//                                 <div className="col-md-3 items-center flex">
//                                     <div className="relative h-11 min-w-[200px]">
//                                         <input
//                                             type="text"
//                                             className="input-Style peer w-full"
//                                             placeholder="City"
//                                             {...register('city', { required: 'City is required' })}
//                                             list="cities"
//                                             onChange={(e) => {
//                                                 // Fetch details for the city if needed
//                                             }}
//                                         />
//                                         <datalist id="cities">
//                                             {listOfCities?.map((city) => (
//                                                 <option key={city.value} value={city.value} />
//                                             ))}
//                                         </datalist>
//                                         <label className="input-style-label">
//                                         City <span className="text-red-500"> *</span>
//                                     </label>
//                                         {errors.city && <p className="text-red-500">{errors.city.message}</p>}
//                                     </div>
//                                 </div>

//                                 <div className="col-md-12">
//                                     <div className="relative h-11 min-w-[200px]">
//                                         <input className="input-Style peer w-full" type="text" placeholder="Website" {...register('website', { required: 'Website is required' })} />
//                                         <label className="input-style-label">
//                                         Website <span className="text-red-500"> *</span>
//                                     </label>

//                                         {errors.website && <p className="text-red-500">{errors.website.message}</p>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-12">
//                                     <div className="relative h-11 min-w-[200px]">
//                                         <input className="input-Style peer w-full" type="password" placeholder="Enter Your Password" {...register('password',
//                                             { required: 'Password is required',
//                                                 minLength: {
//                                                     value: 6,
//                                                     message: 'Password must be at least 8 characters',
//                                                 },
//                                             })} />
//                                         <label className="input-style-label">
//                                         Password <span className="text-red-500"> *</span>
//                                     </label>
//                                         {errors.password && <p className="text-red-500">{errors.password.message}</p>}

//                                     </div>
//                                 </div>
//                                 <div className="col-md-12">
//                                     <div className="relative h-11 min-w-[200px]">
//                                         <input className="input-Style peer w-full" type="password" placeholder="Confirm Password" {...register('confirmPassword',{
//                                             required: 'Confirm Password is required',
//                                             minLength: {
//                                                 value: 6,
//                                                 message: 'Password must be at least 8 characters',
//                                             },
//                                         })} />
//                                     <label className="input-style-label">
//                                         Confirm Password <span className="text-red-500"> *</span>
//                                     </label>
//                                     {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-12">
//                                     <div className="form-group">
//                                         <div className="box-remember">
//                                             <label className="font-xs color-grey-900" htmlFor="rememberme">
//                                                 <input
//                                                     id="rememberme"
//                                                     type="checkbox"
//                                                     onChange={onCheckboxChange}
//                                                     checked={showReferredByBlurred Ego} // This makes the checkbox controlled
//                                                 />
//                                                 Are you referred by a Blurred Ego member?
//                                             </label>
//                                         </div>
//                                     </div>
//                                     {showReferredByBlurred Ego && (
//                                         <div className="relative  h-8  form-group">
//                                             <input type="text" {...register('Blurred EgoMemberReferId')} className=" input-Style peer w-full" placeholder="Enter Refer Id" />
//                                             <label className="input-style-label">Enter Refer Id</label>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="form-group mt-30">
//                                 <div className="d-flex align-items-center justify-content-between">
//                                     <div className="box-button-form-login">
//                                         <button className="btn btn-brand-1-big mr-20" type="submit">
//                                             Update User Record
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </section>

//             <ToastContainer />
//         </>
//     );
// }
