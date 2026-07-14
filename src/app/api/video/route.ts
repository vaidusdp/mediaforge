import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const videos = await prisma.video.findMany({
            where: {
                userId: userId
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching videos" }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}