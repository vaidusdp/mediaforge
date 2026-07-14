# MediaForge 🚀

MediaForge is a high-performance, developer-ready, AI-powered media compression and social media image resizing platform built using Next.js, Prisma, Cloudinary, and Clerk. 

It was designed to help content creators compress large videos on the fly and crop images to social-ready aspect ratios instantly.

---

## 📸 Project Screenshots

### 1. Dashboard
![Dashboard](./public/dashboard.png)

### 2. Video Upload & Compression
![Upload Video](./public/upload-video.png)

### 3. Social Media Image Resizer
![Social Resize](./public/social-resize.png)

---

## ✨ Features

- **Authenticated Dashboard**: Dynamic routing protected by Clerk. Users can only view and manage their own uploads.
- **Smart Video Compression**: Upload video files (up to 70MB) to compress and optimize them dynamically via Cloudinary. Displays real-time file size comparison (Original vs. Compressed) and calculation of storage saved.
- **Hover Video Previews**: Hovering over any video card dynamically streams a short, optimized preview generated on the fly.
- **Social Media Image Resizer**: Instantly resize uploaded images into square, portrait, header, or cover formats suitable for Instagram, Twitter, and Facebook.
- **Safe & Fast UI**: Responsive dashboard built with custom lightweight Tailwind CSS styles and interactive micro-interactions (no bulky UI libraries).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Authentication**: [Clerk](https://clerk.com/)
- **Media Optimization & Storage**: [Cloudinary](https://cloudinary.com/) (next-cloudinary)
- **Database ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL via Neon)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the Project & Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Database Setup & Sync

Push the Prisma schema to the database and generate the client:

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action!

---

## 📦 Build for Production

To generate a fully optimized static and server-rendered production build:

```bash
npm run build
```

