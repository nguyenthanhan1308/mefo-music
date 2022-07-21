/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["https://dribbble.com"],
    },
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig
