/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mernspace-project-gyan.s3.ap-south-1.amazonaws.com'
            }
        ]
    }
};

export default nextConfig;
