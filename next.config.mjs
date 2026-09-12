/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The app never routes any image through next/image or the built-in
    // Image Optimization API — disabling it closes that endpoint's attack
    // surface entirely (see GHSA-2xp9-vwfh-vxw4, unpatched on the Next 14
    // line at time of writing).
    unoptimized: true,
  },
};

export default nextConfig;
