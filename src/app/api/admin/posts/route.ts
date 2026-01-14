import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { Post } from "@/generated/prisma/client";

// リクエストボディの型定義
type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
  isPublished: boolean;
};

// [GET] 管理用・記事一覧取得 (検索・フィルタリング対応)
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "desc"; // "desc"(新しい順) または "asc"(古い順)
    const categoryId = searchParams.get("categoryId"); // カテゴリIDによる絞り込み

    // 検索条件の組み立て
    const whereCondition: any = {};
    
    // カテゴリが指定されていればフィルタリング条件に追加
    if (categoryId) {
      whereCondition.categories = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    const posts = await prisma.post.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        isPublished: true, // 公開ステータスも取得
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
        createdAt: sort === "asc" ? "asc" : "desc", // 並び順を適用
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
};

// [POST] 記事新規作成
export const POST = async (req: NextRequest) => {
  try {
    const requestBody: RequestBody = await req.json();
    const { title, content, coverImageURL, categoryIds, isPublished } = requestBody;

    // カテゴリの存在確認
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: "指定されたカテゴリのいくつかが存在しません" },
        { status: 400 },
      );
    }

    // 投稿記事テーブルにレコードを追加
    const post: Post = await prisma.post.create({
      data: {
        title,
        content,
        coverImageURL,
        isPublished,
      },
    });

    // 中間テーブルにレコードを追加
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
    return NextResponse.json(
      { error: "投稿記事の作成に失敗しました" },
      { status: 500 },
    );
  }
};