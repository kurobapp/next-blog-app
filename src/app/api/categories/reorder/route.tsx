// src/app/api/admin/categories/reorder/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    // { id: "...", sortOrder: 0 }, { id: "...", sortOrder: 1 } ... の配列を受け取る
    const categories: { id: string; sortOrder: number }[] = await req.json();

    // トランザクションで一気に更新
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