'use client';
import React, { useEffect, useState } from 'react';
import MemberLayout from '../../(members)/layout';
import MemberShip from '../pages/membership/page';
import Loading from '@/components/layouts/loading';
import { apiCaller } from '@/utils/api';
import { getSingleApplicationRecord, getUser } from '@/utils/helperFunctions';
import { useDispatch } from 'react-redux';

const Member = () => {
  const [invoiceStatus, setInvoiceStatus] = useState(null); // Start with null to indicate loading state

  const user = getUser();

  const getInvoiceRecord = async () => {
    try {
      const invoice = await apiCaller('get', `invoices?filters[email][$eq]=${user?.email}&populate=*`);
      return invoice;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return null;
    }
  };

  

  const fetchData = async () => {
    const data = await getInvoiceRecord();
    const applicationCall =await getSingleApplicationRecord()
    
    if (data?.data?.[0]?.attributes?.received && !applicationCall?.data[0]?.attributes?.isDeleted) {
      setInvoiceStatus(true);
    } else {
      setInvoiceStatus(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  if (invoiceStatus === null) {
    // Return nothing or a loading indicator while the API call is in progress
    return <Loading />;
  }

  return (
    <>
    <title>Blurred Ego | Members</title>
      {/* {invoiceStatus ?  */}
      {/* <MemberLayout /> : */}
       <MemberShip />
       {/* } */}
    </>
  );
};

export default Member;
