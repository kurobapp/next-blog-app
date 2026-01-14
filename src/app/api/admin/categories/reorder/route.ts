import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    // 画面から送られてきた「新しい並び順」のデータを受け取る
    // 例: [{ id: "カテゴリA", sortOrder: 0 }, { id: "カテゴリB", sortOrder: 1 }, ...]
    const categories: { id: string; sortOrder: number }[] = await req.json();

    // データベースを更新する
    // $transaction を使うことで、途中で失敗することなく一気に全件更新します
    await prisma.$transaction(
      categories.map((cat) =>
        prisma.category.update({
          where: { id: cat.id },
          data: { sortOrder: cat.sortOrder },
        })
      )
    );

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }
};