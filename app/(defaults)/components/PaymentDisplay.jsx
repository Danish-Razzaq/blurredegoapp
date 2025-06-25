'use client';
import React, { useEffect, useRef, useState } from "react";
import { FaRegCreditCard } from "react-icons/fa"; 
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi"; 

const PaymentDisplay = ({ totalPaymentInUSD }) => {
  const prevAmountRef = useRef(totalPaymentInUSD); 
  const [isIncreasing, setIsIncreasing] = useState(null); 

  // Check if amount increases or decreases
  useEffect(() => {
    if (totalPaymentInUSD > prevAmountRef.current) {
      setIsIncreasing(true); 
    } else if (totalPaymentInUSD < prevAmountRef.current) {
      setIsIncreasing(false); 
    }
    prevAmountRef.current = totalPaymentInUSD; 
  }, [totalPaymentInUSD]); 

  if (totalPaymentInUSD === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-28 md:right-[5rem] md:top-[12.5rem] z-50">
      {/* Full Layout for Medium and Larger Screens */}
      <div
        className="bg-white shadow-2xl rounded-lg border-2 border-blue-500 p-3 md:w-fit transform transition-all duration-300 hover:scale-105 hidden md:block"
        style={{ borderLeft: "8px solid red" }}
      >
        {/* <div className="flex items-center justify-between mb-2">
          <FaRegCreditCard className="text-blue-600" size={32} />
          <div className="flex items-center">
            {isIncreasing ? (
              <FiTrendingUp className="text-green-500 mr-2" size={24} />
            ) : (
              <FiTrendingDown className="text-red-500 mr-2" size={24} />
            )}
          </div>
        </div> */}

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Amount</h3>
          <p className="text-2xl font-bold text-blue-600">
            {totalPaymentInUSD.toFixed(2)} USD
          </p>
        </div>

        {/* <div className="mt-1 border-t pt-2 text-center">
          <span className={`text-sm ${isIncreasing ? 'text-green-600' : 'text-red-600'}`}>
            {isIncreasing ? 'Payment Increasing' : 'Payment Decreasing'}
          </span>
        </div> */}
      </div>

      {/* Condensed Layout for Small Screens */}
      <div
        className="bg-white shadow-lg rounded-lg border-l-4 border-blue-500 p-2 flex items-center justify-between md:hidden"
      >
        <p className="text-lg font-bold text-blue-600">
          {totalPaymentInUSD.toFixed(2)} USD
        </p>
        <div className="ml-2">
          {isIncreasing ? (
            <FiTrendingUp className="text-green-500" size={20} />
          ) : (
            <FiTrendingDown className="text-red-500" size={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDisplay;
