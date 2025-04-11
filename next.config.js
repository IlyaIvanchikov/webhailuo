/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hailuo-image-algeng-data-us.oss-us-east-1.aliyuncs.com',
                pathname: '/**',
                port: '',
            },
        ],
        unoptimized: true, // This will allow the image to be served directly without optimization
    },
};

module.exports = nextConfig;
