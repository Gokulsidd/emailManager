const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     output: "standalone",
//     basePath: "/EmailManager",  // ✅ Ensure this matches IIS site path
//     assetPrefix: "/EmailManager/", // ✅ Ensures correct static file paths
//     trailingSlash: true, // ✅ Helps with IIS routing


//     turbopack: {},

//     async rewrites() {
//         return [
//             {
//                 source: "/_next/:path*",
//                 destination: "/EmailManager/_next/:path*", // ✅ Fix for static assets
//             },
//         ];
//     },
// };

// export default nextConfig;