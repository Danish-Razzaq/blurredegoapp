import React from 'react'

const JoinSuccessPopUp = ({ onClose }) => {
  return (
    <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div  id="popup-body" className="bg-white    rounded-lg shadow-lg container flex justify-between flex-col max-lg:mx-4  overflow-y-auto p-4 lg:h-[25%] lg:w-1/2">
                <span>

            <h6>Thank you for signing up!</h6>

            <p className="text-sm text-gray-500">A verification email has been sent to the email address you provided during the sign-up process. To complete your registration and gain access to your account, please click on the verification link in the email. If you don't see the email in your inbox, please remember to check your spam or junk folder as well.</p>
                </span>
            <div className="flex justify-center">


            <button onClick={onClose} className="btn btn-blue hover-up w-40 max-lg:mt-3">OK</button>
            </div>

        </div>
        </div>
  )
}

export default JoinSuccessPopUp