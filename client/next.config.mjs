/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://task-manager-seven-gamma.vercel.app/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
