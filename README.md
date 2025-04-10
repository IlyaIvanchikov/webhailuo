# Image Generation App

A Next.js application that allows users to upload images and generate new ones using the Minimaxi API.

## Features

- User authentication
- Image upload
- Image generation with customizable parameters
- Responsive design
- Environment variable configuration

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_KEY=your_api_key_here
   NEXT_PUBLIC_USERNAME=your_username_here
   NEXT_PUBLIC_PASSWORD=your_password_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This application can be deployed to any hosting platform that supports Next.js and environment variables. Some recommended options:

1. Vercel (Recommended)
   - Create a Vercel account
   - Import your repository
   - Add environment variables in the project settings
   - Deploy

2. Netlify
   - Create a Netlify account
   - Import your repository
   - Add environment variables in the site settings
   - Deploy

3. Railway
   - Create a Railway account
   - Import your repository
   - Add environment variables in the project settings
   - Deploy

## Environment Variables

- `NEXT_PUBLIC_API_KEY`: Your Minimaxi API key
- `NEXT_PUBLIC_USERNAME`: Username for authentication
- `NEXT_PUBLIC_PASSWORD`: Password for authentication

## Technologies Used

- Next.js
- React
- TypeScript
- TailwindCSS
- Axios

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
