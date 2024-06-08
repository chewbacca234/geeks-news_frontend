/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.vox-cdn.com',
      's.yimg.com',
      'sethmlarson.dev',
      'huggingface.co',
      'cdn.arstechnica.net',
      'cdn.mos.cms.futurecdn.net',
      'img-cdn.tnwcdn.com',
      'www.ccn.com',
      'cdn.ccn.com',
      'lh3.googleusercontent.com',
      'raumet.com',
      'res.cloudinary.com',
      'media.wired.com',
      'techcrunch.com',
    ],
  },
};

module.exports = nextConfig;
