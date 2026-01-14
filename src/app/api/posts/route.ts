import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// [GET] /api/posts 記事一覧の取得（検索・カテゴリフィルタ対応・公開記事のみ）
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); // 検索キーワードを取得
    const categoryId = searchParams.get("categoryId"); // カテゴリIDを取得

    // 検索・フィルタリングの条件を組み立てる
    const whereCondition: any = {
      isPublished: true, // 追加: 非公開記事を除外
    };

    // キーワード検索が指定されている場合（タイトルまたは内容に含む）
    if (query) {
      whereCondition.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    // カテゴリフィルタが指定されている場合
    if (categoryId) {
      whereCondition.categories = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    const posts = await prisma.post.findMany({
      where: whereCondition, // 組み立てた条件を適用
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        coverImageURL: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
};