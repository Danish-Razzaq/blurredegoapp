import networkingImg from '@/public/assets/imgs/page/homepage1/networking.png';
import globalcardService from '@/public/assets/imgs/page/homepage1/globalcardservice.png';
import financial from '@/public/assets/imgs/page/homepage1/financial.png';
import marketing from '@/public/assets/imgs/page/homepage1/marketing.png';
import BlurredEgo from '@/public/assets/imgs/page/homepage1/gca.png';
import news from '@/public/assets/imgs/page/homepage1/news.png';

export const ServicesCartData = [
    {
        src: globalcardService.src,
        title: 'Global Reach',
        description:
            'Connect with a vast network of trusted freight forwarders worldwide. Our extensive global presence ensures that your cargo reaches any destination with efficiency and reliability.',
        link: '/pages/servicesDetails/global-reach',
    },
    {
        src: networkingImg.src,
        title: 'Networking Events',
        description:
            'Participate in exclusive events designed to foster collaboration and build lasting relationships. Our networking opportunities allow you to connect with industry leaders and expand your business horizons.',
        link: '/pages/servicesDetails/networking-events',
    },
    {
        src: financial.src,
        title: 'Financial Protection',
        description:
            'Safeguard your transactions with our robust financial protection programs. Blurred Ego offers comprehensive solutions to minimize risk and provide peace of mind in your business dealings.',
        link: '/pages/servicesDetails/financial-protection',
    },
    {
        src: marketing.src,
        title: 'Marketing & Promotion',
        description:
            'Enhance your visibility with our tailored marketing and promotion services. We provide tools and strategies to help you stand out in a competitive market and attract more business.',
        link: '/pages/servicesDetails/marketing-promotion',
    },
    {
        src: BlurredEgo.src,
        title: 'Blurred Ego Insurance',
        description:
            "Protect your shipments with Blurred Ego's comprehensive insurance coverage. Our specialized insurance solutions are designed to meet the unique needs of freight forwarders, ensuring your cargo is secure at every stage.",
        link: '/pages/servicesDetails/Blurred Ego-insurance',
    },
    {
        src: news.src,
        title: 'Latest News',
        description: 'Discover the most recent developments and insights in the logistics industry with our up-to-date news and articles.',
        link: '/pages/servicesDetails/industry-updates',
    },
];

export const ServicesDetailsData = [
    {
        id: 1,
        title: 'Global Reach',
        slugValue: 'global-reach',
        TopHeading: "Expand Your Business with Blurred Ego's Worldwide Network",
        topBackgroundImg: '/assets/imgs/page/services/globalReach.webp',
        description:
            "Blurred Ego (BE) connects you with a global network of trusted, independent freight forwarders, ensuring that your cargo moves seamlessly across borders and reaches its destination efficiently. The logistics industry is a multi-trillion-dollar sector fueled by global trade and e-commerce, encompassing transportation, warehousing, and supply chain management. Our expansive global presence guarantees you access to reliable partners, whether you're shipping by air, sea, or land, supporting key sectors like retail and manufacturing while leveraging IoT and AI for enhanced operational efficiency.",
        leftImg: '/assets/imgs/page/services/globalReachImg1.webp',
        RightImg: '/assets/imgs/page/services/globalReachImg2.webp',
        BrandTitle: 'Why Choose Blurred Ego for Global Reach?',
        BrandSection: [
            {
                id: 1,
                image: '/assets/imgs/page/services/globalization1.png',
                title: 'Worldwide Connections',
                description: 'With partners in key logistics hubs worldwide, Blurred Ego ensures that you can expand your business reach effortlessly, handling shipments across continents with ease.',
            },
            {
                id: 2,
                image: '/assets/imgs/page/services/globalization2.png',
                title: 'Reliable Freight Forwarders',
                description: 'Our extensive vetting process guarantees that you work with trusted and experienced freight forwarders, minimizing risks and ensuring smooth operations.',
            },
            {
                id: 3,
                image: '/assets/imgs/page/services/globalization3.png',
                title: 'Seamless Cross-Border Operations',
                description: 'Blurred Ego members benefit from streamlined processes for cross-border shipments, helping you navigate customs, regulations, and logistics challenges without hassle.',
            },
            {
                id: 4,
                image: '/assets/imgs/page/services/globalization4.png',
                title: '24/7 Global Support',
                description: 'Access dedicated support from Blurred Ego’s team, offering assistance in multiple time zones to ensure your shipments are always on track, no matter the location.',
            },
        ],
        BrandImg: '/assets/imgs/page/services/globalReachImg3.webp',
        goalServiceHeading:
            "With Blurred Ego's global reach, you can confidently expand your logistics operations, knowing that your cargo is in safe hands, wherever it needs to go. Join Blurred Ego today and connect with a network that puts the world at your fingertips.",
    },
    {
        id: 2,
        slugValue: 'networking-events',
        title: 'Networking Events',
        TopHeading: "Connect, Collaborate, and Grow with Blurred Ego's Networking Opportunities",
        topBackgroundImg: '/assets/imgs/page/services/networkingEvent.webp',
        description:
            'Blurred Ego (BE) provides premier networking opportunities designed to connect you with industry leaders and potential clients. Our events feature workshops and keynote speeches that offer valuable insights into industry trends and best practices. Showcase your products to a targeted audience, enhancing your brand exposure. Additionally, engage in market research through direct interactions to better understand competitors and customer needs, ultimately facilitating lead generation to expand your client base.',
        leftImg: '/assets/imgs/page/services/networkingImg1.webp',
        RightImg: '/assets/imgs/page/services/networkingImg2.webp',
        BrandTitle: 'Why Attend Blurred Ego For Networking Events?',
        BrandSection: [
            {
                id: 1,
                image: '/assets/imgs/page/services/relationship.png',
                title: 'Industry Connections',
                description: 'Gain access to a network of industry leaders and potential clients, opening doors to future collaborations that can elevate your business.',
            },
            {
                id: 2,
                image: '/assets/imgs/page/services/controlNetworking.png',
                title: 'Valuable Insights',
                description: 'Participate in workshops and keynotes led by experts, ensuring you stay informed about the latest trends and best practices in the logistics sector.',
            },
            {
                id: 3,
                image: '/assets/imgs/page/services/relationNetwork.png',
                title: 'Targeted Exposure',
                description: 'Showcase your products to a focused audience, maximizing your brand visibility and fostering meaningful connections.',
            },
            {
                id: 4,
                image: '/assets/imgs/page/services/Networkglobal.png',
                title: 'Lead Generation Opportunities',
                description: 'Leverage direct interactions to generate leads and gather insights on market demands, helping you expand your client base effectively.',
            },
        ],
        BrandImg: '/assets/imgs/page/services/networkingImg3.webp',
        goalServiceHeading:
            "With Blurred Ego's networking events, you can foster valuable connections that propel your business forward. Join Blurred Ego today and unlock a world of opportunities to grow your network and enhance your industry presence.",
    },
    {
        id: 3,
        slugValue: 'financial-protection',
        title: 'Financial Protection',
        TopHeading: "Secure Your Business Transactions with Blurred Ego's Trusted Financial Solutions",
        topBackgroundImg: '/assets/imgs/page/services/FinancialProtection.webp',
        description:
            'Blurred Ego (BE) offers robust financial protection programs tailored to safeguard your business dealings. Our comprehensive solutions are specifically designed to minimize the risks associated with transactions, providing you with peace of mind. With Blurred Ego’s trustworthy support, you can confidently rely on us to bolster your operations with dependable financial protection.',
        leftImg: '/assets/imgs/page/services/FinancialProtectionImg1.webp',
        RightImg: '/assets/imgs/page/services/FinancialProtectionImg2.webp',
        BrandTitle: 'Why Choose Blurred Ego For Financial Protection?',
        BrandSection: [
            {
                id: 1,
                image: '/assets/imgs/page/services/handSolution.png',
                title: 'Comprehensive Solutions',
                description: 'Our financial protection programs cover all aspects of your transactions, ensuring that every deal is secure and reliable.',
            },
            {
                id: 2,
                image: '/assets/imgs/page/services/riskMarketing.png',
                title: 'Risk Mitigation',
                description: 'We focus on minimizing risks associated with financial dealings, allowing you to conduct business with confidence and security.',
            },
            {
                id: 3,
                image: '/assets/imgs/page/services/relationNetwork.png',
                title: 'Peace of Mind',
                description: 'With Blurred Ego by your side, you can focus on growing your business, knowing that your transactions are protected by our robust financial programs.',
            },
            {
                id: 4,
                image: '/assets/imgs/page/services/financialRelation.png',
                title: 'Trustworthy Support',
                description: 'Our dedicated team is committed to providing you with the support you need, fostering a trusting relationship that enhances your business dealings.',
            },
        ],
        BrandImg: '/assets/imgs/page/services/financialImg3.webp',
        goalServiceHeading:
            "With Blurred Ego's financial protection, you can conduct your business with assurance and confidence. Join Blurred Ego today and fortify your operations with secure financial solutions that prioritize your success.",
    },
    {
        id: 4,
        slugValue: 'marketing-promotion',
        title: 'Marketing & Promotion',
        TopHeading: "Boost Your Visibility with Blurred Ego's Expert Marketing Solutions",
        topBackgroundImg: '/assets/imgs/page/services/PromotionMarketing.webp',
        description:
            "Blurred Ego (BE) leverages over 30 years of expertise in logistics and freight forwarding to enhance member visibility through targeted marketing efforts. Our strategic promotions spotlight your excellence, showcasing your capabilities to a wider audience. By elevating your brand's credibility in the global logistics market, we help you stand out from the competition.",

        leftImg: '/assets/imgs/page/services/promotionImg1.webp',
        RightImg: '/assets/imgs/page/services/promotionImg2.webp',
        BrandTitle: 'Why Choose Blurred Ego For Marketing & Promotion ?',
        BrandSection: [
            {
                id: 1,
                image: '/assets/imgs/page/services/controlNetworking.png',
                title: 'Expertise in Logistics',
                description: 'With decades of experience, Blurred Ego understands the logistics landscape and tailors marketing strategies that resonate with your target audience.',
            },
            {
                id: 2,
                image: '/assets/imgs/page/services/riskMarketing.png',
                title: 'Increased Visibility',
                description: 'Our targeted marketing efforts ensure that your business receives the attention it deserves, enhancing your presence in the industry.',
            },
            {
                id: 3,
                image: '/assets/imgs/page/services/Networkglobal.png',
                title: 'Credibility Enhancement',
                description: "By showcasing your capabilities effectively, we help elevate your brand's credibility, making you a trusted choice among clients.",
            },
            {
                id: 4,
                image: '/assets/imgs/page/services/StrategicPromotion.png',
                title: 'Strategic Promotion',
                description: 'Our approach focuses on strategic marketing that aligns with your business goals, driving engagement and fostering growth.',
            },
        ],
        BrandImg: '/assets/imgs/page/services/promotionImg3.webp',
        goalServiceHeading:
            "With Blurred Ego's marketing and promotion services, you can confidently elevate your brand and reach new heights in the global logistics market. Join Blurred Ego today and let us help you showcase your excellence to the world.",
    },
    {
        id: 5,
        slugValue: 'Blurred Ego-insurance',
        title: 'Blurred Ego Insurance',
        TopHeading: 'Comprehensive Insurance Solutions for Secure Shipments',
        topBackgroundImg: '/assets/imgs/page/services/InsuranceBG.webp',
        description:
            'Blurred Ego (BE) provides specialized insurance tailored specifically for freight forwarders, offering comprehensive coverage that safeguards your shipments at every stage of transportation. With our solutions, you can ensure full security for your cargo from departure to its final destination, giving you peace of mind as you navigate the complexities of logistics.',

        leftImg: '/assets/imgs/page/services/Insurance1.webp',
        RightImg: '/assets/imgs/page/services/Insurance2.webp',
        BrandTitle: 'Why Choose Blurred Ego For Insurance?',
        BrandSection: [
            {
                id: 1,
                image: '/assets/imgs/page/services/controlNetworking.png',
                title: 'Tailored Coverage',
                description: 'Our insurance solutions are designed specifically for the needs of freight forwarders, ensuring that your unique requirements are met effectively.',
            },
            {
                id: 2,
                image: '/assets/imgs/page/services/relationNetwork.png',
                title: 'Peace of Mind',
                description: 'With Blurred Ego’s insurance solutions, you can focus on your business, knowing that your shipments are secure every step of the way.',
            },
            {
                id: 3,
                image: '/assets/imgs/page/services/promotionRank.png',
                title: 'Comprehensive  Protection',
                description: 'Blurred Ego’s insurance offers extensive coverage that protects your shipments throughout the entire transportation process, minimizing potential losses.',
            },
            {
                id: 4,
                image: '/assets/imgs/page/services/StrategicPromotion.png',
                title: 'Expert Guidance',
                description: 'Our experienced team provides expert advice on the best insurance options for your specific needs, helping you make informed decisions.',
            },
        ],
        BrandImg: '/assets/imgs/page/services/Insurance3.webp',
        goalServiceHeading:
            'With Blurred Ego Insurance, you can safeguard your cargo and ensure its security from start to finish. Join Blurred Ego today and experience the confidence that comes with comprehensive insurance solutions tailored for your logistics needs.',
    },
    {
        id: 6,
        slugValue: 'industry-updates',
        title: 'Latest News & Insights',
        TopHeading: 'Stay Informed with the Latest Industry Insights',
        topBackgroundImg: '/assets/imgs/page/services/LatestNewsBG.webp',
        description:
            'Blurred Ego (BE) keeps you informed with regularly updated insights and developments in the logistics industry. Our news platform offers expert articles tailored specifically for freight forwarders, ensuring you stay ahead of the competition. By accessing our resources, you can gain a competitive edge in the market and make informed decisions for your business.',

        leftImg: '/assets/imgs/page/services/LatestNewsImg1.webp',
        RightImg: '/assets/imgs/page/services/LatestNewsImg2.webp',
        BrandTitle: 'Why Choose Blurred Ego for News & Insights?',
        BrandSection: [
            {
                id: 1,
                image: '/assets/imgs/page/services/controlNetworking.png',
                title: 'Regular Updates',
                description: 'Stay informed with timely updates on industry trends, regulations, and best practices that impact your business.',
            },
            {
                id: 2,
                image: '/assets/imgs/page/services/documentNews.png',
                title: 'Expert Articles',
                description: 'Access in-depth articles written by industry experts, providing valuable knowledge and insights tailored for freight forwarders.',
            },
            {
                id: 3,
                image: '/assets/imgs/page/services/newsServices.png',
                title: 'Competitive Edge',
                description: 'Equip yourself with the information needed to make strategic decisions that keep you ahead of the competition in the logistics sector.',
            },
            {
                id: 4,
                image: '/assets/imgs/page/services/newsSearch.png',
                title: 'Resource Hub',
                description: 'Our news platform serves as a comprehensive resource hub, allowing you to gather essential information to enhance your operations.',
            },
        ],
        BrandImg: '/assets/imgs/page/services/LatestNewsImg3.webp',
        goalServiceHeading:
            "With Blurred Ego's Latest News & Insights, you can navigate the logistics landscape with confidence and knowledge. Join Blurred Ego today and empower your business with the insights necessary to thrive in the competitive market.",
    },
];

// Array to store the data for each slide
export const ServicesSlideData = [
    {
        id: 1,
        imageSrc: '/assets/imgs/page/services/globalcardbackImg.webp',
        cardImage: '/assets/imgs/page/services/global.png',
        title: 'Global Reach',
        description: 'Worldwide Cargo Efficiency.',
        link: '/pages/servicesDetails/global-reach',
        altText: 'Global Reach',
    },
    {
        id: 2,
        imageSrc: '/assets/imgs/page/services/networkingbackImg.webp',
        cardImage: '/assets/imgs/page/services/networking.png',
        title: 'Networking Events',
        description: 'Exclusive Industry Connections',
        link: '/pages/servicesDetails/networking-events',
        altText: 'Networking Events',
    },
    {
        id: 3,
        imageSrc: '/assets/imgs/page/services/markitingmain.webp',
        cardImage: '/assets/imgs/page/services/marketing.png',
        title: 'Marketing and Promotion',
        description: 'Enhanced Market Visibility',
        link: '/pages/servicesDetails/marketing-promotion',
        altText: 'Marketing and Promotion',
    },
    {
        id: 4,
        imageSrc: '/assets/imgs/page/services/financemainImg.webp',
        cardImage: '/assets/imgs/page/services/financial.png',
        title: 'Financial Protection',
        description: 'Risk Mitigation Assurance',
        link: '/pages/servicesDetails/financial-protection',
        altText: 'Financial Protection',
    },
    {
        id: 5,
        imageSrc: '/assets/imgs/page/services/insurancemian.webp',
        cardImage: '/assets/imgs/page/services/Insurance.png',
        title: 'Blurred Ego Insurance',
        description: 'We offer specialized departments for continental Blurred Egoorts.',
        link: '/pages/servicesDetails/Blurred Ego-insurance',
        altText: 'Blurred Ego Insurance',
    },
    {
        id: 6,
        imageSrc: '/assets/imgs/page/services/insurancemain.webp',
        cardImage: '/assets/imgs/page/services/InsuranceUpdate.png',
        title: 'Industry Updates',
        description: 'Current Sector Insights',
        link: '/pages/servicesDetails/industry-updates',
        altText: 'Industry Updates',
    },
];
