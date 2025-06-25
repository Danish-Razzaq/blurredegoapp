'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import StatsBanner from './MembersCounterBanner';
import WorldMap2 from '../../components/worldMap'


const WorldMap = () => {
    const [userData, setUsersData] = useState([]);
    const [members, setMembers] = useState([]);
    const [applicationData, setApplicationData] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // console.log("members data",members);
    // console.log("user data",userData);

    

    const fetchAllData = async () => {
        try {
          const [userResponse, applicationResponse, memberResponse] = await Promise.all([
            axios.get(`${apiUrl}/users`),
            axios.get(`${apiUrl}/custom-application-data`),
            axios.get(`${apiUrl}/custom-invoice-data`),
          ]);
    
          // Set the data from responses
          const fetchedUsers = userResponse?.data || [];
          const fetchedApplicationData = applicationResponse?.data?.data || [];
          const fetchedMembers = memberResponse?.data?.data || [];
          setApplicationData(fetchedApplicationData);
          setMembers(fetchedMembers);
    
          // Filter users whose emails match with the application data
          const filteredUsers = fetchedUsers.filter((user) =>
            fetchedApplicationData.some((app) => app.email === user.email)
          );
    
          setUsersData(filteredUsers);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchAllData(); // Fetch all data when the component mounts
      }, []);


   

    // Calculate unique countries and cities
    const uniqueCountries = [...new Set(userData.map((user) => user.country))].length;
    const uniqueCities = [...new Set(userData.map((user) => user.city))].length;

    // const arrayOfCountries = ["PK", "AF" ,"US"]

    const arrayOfCountries = userData.map((country) => country.country)

    return (
        <div className='worldMap flex   '>
            <div className="lg:w-full  bg-[#f3f0f0] p-6">
                <h2 className="color-brand-1 my-6 text-center font-bold">
                    Blurred Ego <span className="text-[#1F140F]">Network Coverage</span>
                </h2>
                <div className=" mx-auto lg:w-full text-center">
                <WorldMap2 arrayOfCountries={arrayOfCountries} applicationData={applicationData} />
                </div>
            </div>
            <div >
            <StatsBanner city={uniqueCities} country={uniqueCountries} Blurred EgoMembers={members.length}  />
            </div>
        </div>
    );
};

export default WorldMap;
