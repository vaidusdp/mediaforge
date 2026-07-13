import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server"
import { error } from 'node:console';
import { prisma } from '@/lib/prisma';

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CoudinaryUploadResult {
    public_id: string,
    bytes: number,
    duration?: number,
    [key: string]: any
}

export async function POST(request: NextRequest) {
    const {userId} = await auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized Access"}, {status: 400});
    }

    try {
        if(
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ){
            return NextResponse.json({error: "Cloudinary Credentials Not Found"}, {status: 500})
        }
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const orignalSize = formData.get("originalSize") as string;

        if(!file){
            return NextResponse.json({error: "File Not Found"}, {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CoudinaryUploadResult>(
            (res, rej) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video", 
                        folder: "next-cloudinary-videos", 
                        transformation: [
                            {quality: "auto", fetch_format: "mp4"}
                        ]
                    },
                    (error, result) => {
                        if(error) rej(error);
                        else res(result as CoudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer);
            }
        )

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                orignalSize: orignalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0
            }
        })

        return NextResponse.json(video);
    } catch (error) {
        console.log("Upload Video Failed:", error);
        return NextResponse.json({error: "Upload Video failed"}, {status: 500});   
    } finally {
        await prisma.$disconnect();
    }
}