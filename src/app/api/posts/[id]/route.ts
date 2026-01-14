import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// [GET] 公開用・記事詳細取得
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
            category: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    // 記事がない、または非公開の場合は 404
    if (!post || !post.isPublished) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};