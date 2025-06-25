import React from 'react';
import { usePathname } from 'next/navigation';

const MapSection = () => {
    const path = usePathname();

    // Check if the current path is the home page
    if (path === '/') {
        return (
            <div className="section bg-map d-block mt-12">
                <div className="cnt-center container">
                    <div className="box-newsletter">
                        <div className="box-map-2 wow animate__animated animate__fadeIn">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.8116997064826!2d114.191027!3d22.398455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340407f44453a4bb%3A0x7f28d92527d0f95f!2sWah%20Lok%20Industrial%20Centre!5e0!3m2!1sen!2s!4v1722426893203!5m2!1sen!2s"
                                height={420}
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Return null if the path is not the home page
    return null;
};

export default MapSection;
