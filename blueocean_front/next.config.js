module.exports = {
  reactStrictMode: false,
  
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    }
  },
  images: {

    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_S3_URL,
      },]
  },
  //reactStrictMode: true,

  // async rewrites() {

  //   console.log("rewrites~~")
  //   return [
  //     {
  //       source: '/boa/:slug*',
  //       destination: '/api?target=:slug*',
  //     },

  //   ];
  // },

}