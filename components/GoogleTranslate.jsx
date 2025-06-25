import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const LanguageSelector = () => {
    const scriptRef = useRef();
    const translateRef = useRef();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({
        name: 'English',
        code: 'en',
        flag: 'US',
    });

    useEffect(() => {
        // Check for the selected language in localStorage
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            const language = JSON.parse(savedLanguage);
            setSelectedLanguage(language);
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let timeoutId;

        function initTranslate() {
            if (!scriptRef.current) {
                const addScript = document.createElement('script');
                addScript.setAttribute('type', 'text/javascript');
                addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
                scriptRef.current = addScript;
                document.body.appendChild(addScript);
            }

            const style = document.createElement('style');
            style.textContent = `
        .goog-te-gadget {
          font-family: inherit !important;
        }
        .goog-te-gadget img {
          display: none !important;
        }
        .goog-te-gadget > span {
          display: none !important;
        }
        .goog-te-combo {
          opacity: 0 !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          cursor: pointer !important;
        }
        body {
          top: 0 !important;
        }
        .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
        .VIpgJd-ZVi9od-l4eHX-hSRGPd { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
             `;
            document.head.appendChild(style);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,es,fr,de,hi,zh-CN,ja,ko,ar,it,pt,ru,sv,da,el,hu, tr,pl',
                        autoDisplay: false,
                    },
                    'google_translate_element'
                );

                // Apply saved language after Google Translate initializes
                const select = document.querySelector('.goog-te-combo');
                if (select && selectedLanguage.code !== 'en') {
                    select.value = selectedLanguage.code;
                    select.dispatchEvent(new Event('change'));
                }
            };
        }

        initTranslate();

        return () => clearTimeout(timeoutId);
    }, [selectedLanguage.code]);

    const languages = [
        { code: 'en', name: 'English', flag: 'US' },
        { code: 'es', name: 'Spanish', flag: 'ES' },
        { code: 'fr', name: 'French', flag: 'FR' },
        { code: 'de', name: 'German', flag: 'DE' },
        { code: 'zh-CN', name: 'Chinese', flag: 'CN' },
        { code: 'ja', name: 'Japanese', flag: 'JP' },
        { code: 'ko', name: 'Korean', flag: 'KR' },
        { code: 'hi', name: 'Hindi', flag: 'IN' },
        { code: 'pl', name: 'Polish', flag: 'PL' },
        { code: 'ar', name: 'Arabic', flag: 'SA' },
        { code: 'it', name: 'Italian', flag: 'IT' },
        { code: 'pt', name: 'Portuguese', flag: 'PT' },
        { code: 'ru', name: 'Russian', flag: 'RU' },
        { code: 'sv', name: 'Swedish', flag: 'SE' },
        { code: 'da', name: 'Danish', flag: 'DK' },
        { code: 'el', name: 'Greek', flag: 'GR' },
        { code: 'hu', name: 'Hungarian', flag: 'HU' },
        { code: 'tr', name: 'Turkish', flag: 'TR' },
    ];

    const handleLanguageSelect = (language) => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = language.code;

            select.dispatchEvent(new Event('change'));

            // Save selected language to localStorage
            localStorage.setItem('selectedLanguage', JSON.stringify(language));
            window.location.reload();

            setSelectedLanguage(language);
            setIsOpen(false);
        }
    };


    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div className="flex cursor-pointer items-center gap-2 max-lg:flex-row-reverse" onClick={() => setIsOpen(!isOpen)}>
                {/* Flag and selected language */}
                <Image
                    title={`${selectedLanguage.name}`}
                    src={`/assets/images/flags/${selectedLanguage.flag}.svg`}
                    alt={selectedLanguage.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-cover"
                />
                <span className="ml-2 text-sm font-medium">{selectedLanguage.name}</span>
            </div>

            {isOpen && (
                <div className="absolute right-4 z-50 mt-3 w-fit  rounded-md bg-white px-4 shadow-lg ">
                    <div className="py-1">
                        <ul className="grid w-[280px] grid-cols-2 gap-2  font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                            {languages.map((language) => (
                                <div
                                    key={language.code}
                                    className="flex cursor-pointer items-center gap-2 py-2 text-sm text-gray-700  hover:bg-gray-100"
                                    onClick={() => handleLanguageSelect(language)}
                                >
                                    <Image src={`/assets/images/flags/${language.flag}.svg`} alt="flag" width={10} height={10} className="h-6 w-6 rounded-full object-cover" />
                                    {language.name}
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div id="google_translate_element" ref={translateRef} className="pointer-events-none absolute opacity-0" />
        </div>
    );
};

export default LanguageSelector;
