/** @type {import('next').NextConfig} */

// const imageU
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['localhost', 'localhost:1337'],
    },
};

module.exports = nextConfig;
