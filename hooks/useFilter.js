'use client';
import countryMapping from '@/components/countryNamesData';
import { getApplicationRecord } from '@/utils/helperFunctions';
import { useEffect, useState } from 'react';

const useFilter = (invoices, usersCityState) => {
    const [contactList, setContactList] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [listOfCountries, setListOfCountries] = useState([]);
    const [listOfCities, setListOfCities] = useState([]);
    const [countrySearch, setCountrySearch] = useState('');
    const [companySearch, setCompanySearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [searchMemberById, setSearchMemberById] = useState('');
    const [value, setValue] = useState('grid');

    const fetchData = async () => {
        await fetchUsersAndContacts();
    };

    // Check invoice status for a specific member based on email
    const checkInvoiceStatus = (memberEmail) => {
        return invoices.some((invoice) => invoice.attributes.email === memberEmail && invoice.attributes.received === true);
    };

    const fetchUsersAndContacts = async () => {
        // const usersResult = await apiCaller('get', 'users');
        // if (usersResult.err) {
        //     console.error('Error fetching users:', usersResult.err);
        // } else {
        //     setUsersCity(usersResult);
        // }

        const data = await getApplicationRecord();
        const contacts =
            data?.data
                ?.filter((item) => item.attributes.approved)
                .map((item) => {
                    const email = item.attributes.email;
                    // Find the city based on the email from usersCityState
                    const userCity = usersCityState.find((user) => user.email === email)?.city || ''; // Default to an empty string if no match

                    return {
                        id: item.id,
                        username: item.attributes.username,
                        companyName: item.attributes.companyName,
                        companyType: item.attributes.companyType,
                        companyLogo: item.attributes.companyLogo,
                        applicationMemberId: item.attributes.applicationMemberId || 'Not Assigned yet',
                        applicationDate: item.attributes.applicationDate || null,
                        country: getCountryName(item.attributes.country),
                        countryForFlag: item.attributes.country,
                        city: userCity, // Set city from usersCityState based on matching email
                        email: item.attributes.email,
                        countryCodeContactPerson1: item.attributes.countryCodeContactPerson1,
                        mobile1: item.attributes.mobile1,
                        mainOfficeAddress: item.attributes.mainOfficeAddress,
                        receivedInvoice: checkInvoiceStatus(item.attributes.email),
                        membershipType: item.attributes.membershipType,
                    };
                }) || [];

        // Filter contacts only if the invoice has been received
        const filteredContacts = contacts.filter((contact) => contact.receivedInvoice);

        setContactList(contacts);
        setFilteredItems(filteredContacts);
    };

    useEffect(() => {
        fetchData();
    }, [invoices]); // Fetch data whenever invoices change

    // Get country name
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
                        iso: item.iso2,
                    }))
                )
            )
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    // Fetch cities based on the selected country
    useEffect(() => {
        if (selectedCountry) {
            const countryCode = listOfCountries.find((country) => country.value === selectedCountry)?.iso;
            if (countryCode) {
                fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/cities`, {
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
            }
        } else {
            setListOfCities([]); // Clear cities when no country is selected
        }
    }, [selectedCountry, listOfCountries]);

    // Get country name from code
    const getCountryName = (code) => {
        return countryMapping[code?.toUpperCase()] || 'Unknown Country';
    };

    // Use the listOfCountries directly for the dropdown list
    const uniqueCountries = listOfCountries.map((country) => country.value);

    // Use the listOfCities directly for the dropdown list
    const uniqueCities = listOfCities.map((city) => city.value);

    // Filter users by the selected city to get the matching emails
    // const filteredUsersByCity =  usersCityState?.filter((user) => user.city === selectedCity);
    const filteredUsersByCity = usersCityState.length > 0 ? usersCityState.filter((user) => user.city === selectedCity) : [];

    // Get emails of the filtered users
    const filteredEmails = filteredUsersByCity.map((user) => user.email);

    // Filter contacts based on the filtered emails
    const applicationsForSelectedCity = contactList.filter((contact) => filteredEmails.includes(contact.email));

    const matchesCompany = contactList.filter((contact) => contact.companyName.toLowerCase().includes(companySearch.toLowerCase()));

    const matchMemberById = contactList?.filter((contact) => contact?.applicationMemberId?.toLowerCase().includes(searchMemberById?.toLowerCase()));

    // Filter contacts based on the selected city and company name
    const searchContacts = () => {
        const filtered = contactList.filter((item) => {
            const matchesCountry = selectedCountry ? item.country === selectedCountry : true;
            const matchesCity = selectedCity ? item.city === selectedCity : true;
            const matchesCountrySearch = item.country.toLowerCase().includes(countrySearch.toLowerCase());
            const matchesCompany = item.companyName.toLowerCase().includes(companySearch.toLowerCase());
            const matchMemberById = item.applicationMemberId.toLowerCase().includes(searchMemberById.toLowerCase());
            return matchesCountry && matchesCity && matchesCountrySearch && matchesCompany && matchMemberById;
        });
        setFilteredItems(filtered);
    };

    useEffect(() => {
        if (selectedCity) {
            setFilteredItems(
                applicationsForSelectedCity.filter((contact) => contact.companyName.toLowerCase().includes(companySearch.toLowerCase())) ||
                    matchesCompany.filter((contact) => contact.country.toLowerCase().includes(countrySearch.toLowerCase())) ||
                    matchMemberById.filter((contact) => contact.applicationMemberId.toLowerCase().includes(searchMemberById.toLowerCase()))
            );
        } else {
            searchContacts();
        }
    }, [countrySearch, companySearch, selectedCountry, selectedCity, contactList, usersCityState, searchMemberById, invoices]);

    // Handle changes in country selection
    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
        setSelectedCity(''); // Reset city when country changes
    };

    // Handle changes in city selection
    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    return {
        filteredItems,
        uniqueCountries,
        uniqueCities,
        countrySearch,
        companySearch,
        selectedCountry,
        selectedCity,
        handleCountryChange,
        handleCityChange,
        setCountrySearch,
        setCompanySearch,
        searchMemberById,
        setSearchMemberById,
        value,
        setValue,
    };
};

export default useFilter;
