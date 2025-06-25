import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import Script from 'next/script';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* SEO and Meta Tags */}
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                {/* <meta name="description" content="Your page description here" /> */}
                <meta
                    name="keywords"
                    content="Blurred Ego, shipment, logistics, shipping, cargo, freight, transportation, delivery, parcel service, global shipping, international shipping, domestic shipping, logistics services, supply chain, goods transport, express delivery, warehousing, package shipping, shipping company, freight forwarding, door-to-door delivery, shipping solutions"
                />

                <meta name="google-site-verification" content="jC544qguhuwmWLXvsjsXTOLS9lHa2XDwlCUjKkSe9Oc" />
                <link rel="icon" href="/favicon.ico" />

                {/* Favicon and App Icons */}
                <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta
          name="msapplication-TileColor"
          content="#da532c"
        />
        <meta name="theme-color" content="#ffffff" />

                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />

                {/* Slick Carousel CSS */}
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />

                {/* Google Analytics tags */}
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-CNWQCCY15C" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-CNWQCCY15C');
                `}
                </Script>
            </head>

            <body>
                <ProviderComponent>{children}</ProviderComponent>
            </body>
        </html>
    );
}
