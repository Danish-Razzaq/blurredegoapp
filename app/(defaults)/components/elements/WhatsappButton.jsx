import Link from 'next/link';
import React from 'react';
import { IoLogoWhatsapp } from "react-icons/io5";
const WhatsappButton = () => {
    return (
        <Link 
            id="whatsapp" // ID for the link
            href="https://wa.me/85269327488" // WhatsApp link with your phone number
            style={{ position: 'fixed', zIndex: 2147483647, justifyContent: 'center', display: 'flex', alignItems: 'center',  }}
            target="_blank" // Opens link in a new tab
            rel="noopener noreferrer" // Security best practice for external links
        >
          <IoLogoWhatsapp size={40}/>
        </Link>
    );
};

export default WhatsappButton;
