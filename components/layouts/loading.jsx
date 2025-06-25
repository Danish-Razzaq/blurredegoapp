import Image from 'next/image';
import React from 'react';
import Logo from '@/public/assets/imgs/template/logo.png';

const Loading = () => {
    return (
        <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">

       <Image src={Logo} alt="logo" width={130} height={130} />
        </div>
    );
};

export default Loading;
