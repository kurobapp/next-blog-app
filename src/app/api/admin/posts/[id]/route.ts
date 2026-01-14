import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { Post } from "@/generated/prisma/client";

// [GET] 管理用・記事詳細取得 (下書きも取得可能)
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// [PUT] 記事更新
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const { title, content, coverImageURL, categoryIds, isPublished } = await req.json();

    // 記事自体の更新
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        coverImageURL,
        isPublished, // 追加
      },
    });

    // カテゴリの更新 (一旦全削除して再登録する方式)
    await prisma.postCategory.deleteMany({
      where: { postId: id },
    });

    for (const categoryId of categoryIds) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: categoryId,
        },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
};

// [DELETE] 記事削除
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
};