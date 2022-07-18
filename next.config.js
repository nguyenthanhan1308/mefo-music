/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["https://dribbble.com"],
    },
};

module.exports = nextConfig
