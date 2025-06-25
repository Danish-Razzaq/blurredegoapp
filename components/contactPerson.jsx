'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const ContactPersonSection = ({ sectionNumber, register, errors, onRemove, onFileChange, selectedFiles, applicationPerson, changes, loadStyleOnChanges }) => {
    const pathname = usePathname();


    console.log('ContactPersonSection applicationPerson ==>', applicationPerson);
    console.log('sectionNumber ==>', sectionNumber);


    const fieldName = `contactPerson${sectionNumber}Picture`;
    const [fileError, setFileError] = useState('');
    const [listOfCountries, setListOfCountries] = useState([]);

    const urlImageDownload = process.env.NEXT_PUBLIC_BACKEND_URL;
    const isReviewEditPage = pathname.match('/reviewedit/'); // Check if on the reviewEdit page

    const isApplicationViewPage = pathname.startsWith('/apps/application/') && !pathname.includes('/edit'); // Check if on the application page
    const isApplicationEditRemoveRequiredCountryCode = pathname.startsWith('/apps/application/edit');
    // Determine whether to show the image or not based on the path
    const shouldShowImage = !pathname.match('/member');
    const shouldShowImageOnApp = pathname.match('/member')
    const imageUrl = shouldShowImage
        ? applicationPerson?.[fieldName]
            ? `${urlImageDownload}${applicationPerson[fieldName]}`
            : '/assets/images/contactPersonPicture.jpg' // Replace with a valid default image URL
        : null;

    // Check if the image URL is in selectedFiles, otherwise use a default image
     const imageUrlApplication = selectedFiles?.[`contactPerson${sectionNumber}Picture`] || '/assets/images/contactPersonPicture.jpg';
    
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

    return (
        <div>
            <h3 className="mb-1 text-2xl font-bold">Contact Person {sectionNumber}</h3>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {/* Name Field */}
                <div className="relative h-11 w-full min-w-[200px]">
                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `contactPerson${sectionNumber}`) : {}}
                        type="text"
                        {...register(`contactPerson${sectionNumber}`, { required: `Contact Person ${sectionNumber} is required` })}
                        className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                        placeholder={`Contact Person ${sectionNumber} Name`}
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                        Name <span className="text-red-500"> *</span>
                    </label>
                    {errors[`contactPerson${sectionNumber}`] && <p className="text-red-500">{errors[`contactPerson${sectionNumber}`].message}</p>}
                </div>

                {/* Designation Field */}
                <div className="relative h-11 w-full min-w-[200px]">
                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `designation${sectionNumber}`) : {}}
                        type="text"
                        {...register(`designation${sectionNumber}`, { required: 'Designation is required' })}
                        className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                        placeholder="Designation*"
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                        Designation <span className="text-red-500"> *</span>
                    </label>
                    {errors[`designation${sectionNumber}`] && <p className="text-red-500">{errors[`designation${sectionNumber}`].message}</p>}
                </div>

                {/* Company Name Field */}
                <div className="relative h-11 w-full min-w-[200px]">
                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `companyName${sectionNumber}`) : {}}
                        type="text"
                        {...register(`companyName${sectionNumber}`, { required: 'Company Name is required' })}
                        className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                        placeholder="Name of Applicant Company"
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                        Name of Applicant Company <span className="text-red-500"> *</span>
                    </label>
                    {errors[`companyName${sectionNumber}`] && <p className="text-red-500">{errors[`companyName${sectionNumber}`].message}</p>}
                </div>

                {/* Email Address Field */}
                <div className="relative h-11 w-full min-w-[200px]">
                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `email${sectionNumber}`) : {}}
                        type="email"
                        {...register(`email${sectionNumber}`, {
                            required: 'Email is required',
                            validate: (value) => !value || /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(value) || 'Invalid email format',
                        })}
                        className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                        placeholder="abc@gmail.com"
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                        Email Address <span className="text-red-500"> *</span>
                    </label>
                    {errors[`email${sectionNumber}`] && <p className="text-red-500">{errors[`email${sectionNumber}`].message}</p>}
                </div>

                {/* Main Office Address Field */}
                <div className="relative h-11 w-full min-w-[200px]">
                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `mainOfficeAddress${sectionNumber}`) : {}}
                        type="text"
                        {...register(`mainOfficeAddress${sectionNumber}`, { required: 'Address of Main Office is required' })}
                        className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                        placeholder="Address of Main Office"
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                        Address of Main Office <span className="text-red-500"> *</span>
                    </label>
                    {errors[`mainOfficeAddress${sectionNumber}`] && <p className="text-red-500">{errors[`mainOfficeAddress${sectionNumber}`].message}</p>}
                </div>

                {/* Office Field */}
                <div className="relative h-11 w-full min-w-[200px]">
                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `office${sectionNumber}`) : {}}
                        type="text"
                        {...register(`office${sectionNumber}`, { required: 'Office is required' })}
                        className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                        placeholder="Office"
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                        Office <span className="text-red-500"> *</span>
                    </label>
                    {errors[`office${sectionNumber}`] && <p className="text-red-500">{errors[`office${sectionNumber}`].message}</p>}
                </div>

                {/* Building Address Field */}
                <div className="relative h-11 w-full min-w-[200px]">
                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `buildingAddress${sectionNumber}`) : {}}
                        type="text"
                        {...register(`buildingAddress${sectionNumber}`, { required: 'Building Address is required' })}
                        className={`input-Style peer w-full  ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                        placeholder="Building Address"
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                        Building Address <span className="text-red-500"> *</span>
                    </label>
                    {errors[`buildingAddress${sectionNumber}`] && <p className="text-red-500">{errors[`buildingAddress${sectionNumber}`].message}</p>}
                </div>

                {/* Mobile Field */}
                <div className="flex gap-2">
                    <div className="relative h-11  w-fit">
                        <input
                            style={isReviewEditPage ? loadStyleOnChanges(changes, `countryCodeContactPerson${sectionNumber}`) : {}}
                            disabled={isReviewEditPage || isApplicationViewPage}
                            type="text"
                            className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                            id="floatingInput"
                            placeholder="Country Code"
                            maxLength={4}
                            required={!isApplicationEditRemoveRequiredCountryCode}
                            name="countryCode"
                            {...register(
                                `countryCodeContactPerson${sectionNumber}`,
                                isApplicationEditRemoveRequiredCountryCode
                                    ? {
                                          maxLength: 4,
                                      }
                                    : {
                                          required: true,
                                          maxLength: 4,
                                      }
                            )}
                            list="countryCodes" // Connect to the datalist
                        />
                        <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                            Country code <span className="text-red-500"> *</span>
                        </label>

                        {/* Datalist for country codes */}
                        <datalist id="countryCodes">
                            {listOfCountries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.value} (+{country.code})
                                </option>
                            ))}
                        </datalist>
                        {errors[`countryCodeContactPerson${sectionNumber}`] && <p className="text-red-500">Country code is required</p>}
                    </div>

                    <div className="relative h-11 w-full">
                        <input
                            style={isReviewEditPage ? loadStyleOnChanges(changes, `mobile${sectionNumber}`) : {}}
                            type="tel"
                            {...register(`mobile${sectionNumber}`, { required: 'Mobile is required' })}
                            className={`input-Style peer w-full ${isReviewEditPage || isApplicationViewPage ? 'rounded-md border border-gray-300 pl-1' : ''}`}
                            placeholder="+234 000 000 0000 "
                            disabled={isReviewEditPage || isApplicationViewPage}
                        />
                        <label className={`input-style-label ${isReviewEditPage ? 'label-move' : ''}`}>
                            Mobile <span className="text-red-500"> *</span>
                        </label>
                        {errors[`mobile${sectionNumber}`] && <p className="text-red-500">{errors[`mobile${sectionNumber}`].message}</p>}
                    </div>
                </div>
                {/* File Upload Section */}
                <div className="flex flex-col">
                    <div className="pb-1 text-sm text-gray-600">Upload the photograph for Contact Person {sectionNumber}</div>
                    {/* Only display the image if `shouldShowImage` is true */}
                    {shouldShowImage && imageUrl && (
                        <img
                            className="h-24 w-24 rounded-lg object-cover"
                            src={imageUrl}
                            alt={`Contact Person ${sectionNumber} Picture`}
                            width={96} // Set actual width to match the container size (h-24 = 96px)
                            height={96} // Set actual height to match the container size (w-24 = 96px)
                        />
                    )}
                    {/* Display the image only if shouldShowImage is true */}
                    {shouldShowImageOnApp && imageUrlApplication  && (<img className="h-24 w-24 rounded-lg object-cover" src={imageUrlApplication} alt={`Contact Person ${sectionNumber} Picture`} width={96} height={96} />)}

                    <input
                        style={isReviewEditPage ? loadStyleOnChanges(changes, `contactPerson${sectionNumber}Picture`) : {}}
                        type="file"
                        {...register(fieldName)}
                        onChange={(event) => {
                            const file = event.target.files[0];
                            const validTypes = ['image/png', 'image/jpeg'];

                            if (file && !validTypes.includes(file.type)) {
                                setFileError('Oops: Only PNG and JPEG file types are allowed.');
                                event.target.value = ''; // Clear the input
                            } else {
                                setFileError('');
                                onFileChange(event, fieldName); // Call the original onFileChange function
                            }
                        }}
                        className="mt-2 inline-block"
                        accept="image/png, image/jpeg"
                        disabled={isReviewEditPage || isApplicationViewPage}
                    />
                    {errors[fieldName] && <p className="text-red-500">{errors[fieldName].message}</p>}
                    {fileError && <p className="text-red-500">{fileError}</p>}
                </div>

                {/* Conditional Remove Button */}
                {isReviewEditPage || isApplicationViewPage
                    ? ''
                    : sectionNumber > 2 && (
                          <div className="relative flex w-full min-w-[200px] items-end justify-end">
                              <button onClick={() => onRemove(sectionNumber)} className="btn w-fit rounded-md bg-red-500 p-2 text-white">
                                  Hide Contact Person {sectionNumber}
                              </button>
                          </div>
                      )}
            </div>
        </div>
    );
};

export default ContactPersonSection;
