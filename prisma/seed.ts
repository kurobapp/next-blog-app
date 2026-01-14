/* seed.ts: カテゴリの重複を含むテストデータの生成 */
import { prisma } from "@/lib/prisma";

const main = async () => {
  // 各テーブルから既存の全レコードを削除
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();

  // カテゴリデータの作成
  const c1 = await prisma.category.create({ data: { name: "プログラミング" } });
  const c2 = await prisma.category.create({ data: { name: "インターネット" } });
  const c3 = await prisma.category.create({ data: { name: "セキュリティ" } });

  // 投稿記事データ1: 単一カテゴリ（プログラミング）
  const p1 = await prisma.post.create({
    data: {
      title: "TypeScript入門",
      content: "TypeScriptの基本文法についての解説です。",
      coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-red.jpg",
      categories: {
        create: [{ categoryId: c1.id }],
      },
    },
  });

  // 投稿記事データ2: 単一カテゴリ（インターネット）
  const p2 = await prisma.post.create({
    data: {
      title: "Wi-Fi 7の解説",
      content: "最新の無線通信規格であるWi-Fi 7について紹介します。",
      coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-green.jpg",
      categories: {
        create: [{ categoryId: c2.id }],
      },
    },
  });

  // 投稿記事データ3: カテゴリの重複（プログラミング × セキュリティ）
  const p3 = await prisma.post.create({
    data: {
      title: "安全なコードの書き方",
      content: "脆弱性を作らないためのセキュアプログラミングの基礎です。",
      coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-yellow.jpg",
      categories: {
        create: [
          { categoryId: c1.id },
          { categoryId: c3.id },
        ],
      },
    },
  });

  // 投稿記事データ4: 全カテゴリの重複（プログラミング × インターネット × セキュリティ）
  const p4 = await prisma.post.create({
    data: {
      title: "Webアプリケーションの構築と運用",
      content: "開発から公開、セキュリティ対策までを網羅したガイドです。",
      coverImageURL: "https://w1980.blob.core.windows.net/pg3/cover-img-purple.jpg",
      categories: {
        create: [
          { categoryId: c1.id },
          { categoryId: c2.id },
          { categoryId: c3.id },
        ],
      },
    },
  });

  console.log("シードデータの作成に成功しました：");
  console.log({ p1: p1.title, p2: p2.title, p3: p3.title, p4: p4.title });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });