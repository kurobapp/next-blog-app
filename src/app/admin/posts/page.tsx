"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPenToSquare, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // アイコン追加
import { twMerge } from "tailwind-merge";
import AdminPostSummary from "@/app/_components/AdminPostSummary";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null); // エラー表示用State

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // ★ここを変更！ 公開用API(/api/posts)ではなく、管理用API(/api/admin/posts)を使う
        const requestUrl = "/api/admin/posts";
        const res = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const apiResBody = (await res.json()) as PostApiResponse[];
        
        // 型変換
        setPosts(
          apiResBody.map((body) => ({
            id: body.id,
            title: body.title,
            content: body.content,
            coverImage: {
              url: body.coverImageURL,
              width: 1000,
              height: 1000,
            },
            createdAt: body.createdAt,
            categories: body.categories.map((c) => ({
              id: c.category.id,
              name: c.category.name,
            })),
            isPublished: body.isPublished, // ★ここも追加（Post型定義にもisPublishedが必要かも）
          }))
        );
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? `記事一覧の取得に失敗しました: ${error.message}`
            : `予期せぬエラーが発生しました ${error}`;
        console.error(errorMsg);
        setFetchError(errorMsg);
      }
    };

    fetchPosts();
  }, []);

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  if (!posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-2xl font-bold">投稿記事の管理</div>
        <Link
          href="/admin/posts/new"
          className={twMerge(
            "rounded-md px-5 py-1 font-bold",
            "bg-blue-500 text-white hover:bg-blue-600",
          )}
        >
          新規作成
        </Link>
      </div>

      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/admin/posts/${post.id}`} className="block">
              <div
                className={twMerge(
                  "border border-slate-400 p-3 rounded-md hover:bg-slate-100 transition-colors bg-white shadow-sm",
                  !post.isPublished && "bg-gray-50 border-gray-300" // 下書きなら少しグレーにする
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl font-bold text-slate-900 truncate flex-1 mr-4">
                    {post.title}
                  </div>
                  
                  {/* 公開/非公開バッジ */}
                  <div className={twMerge(
                    "text-xs font-bold px-2 py-1 rounded-full border flex items-center gap-1 shrink-0",
                    post.isPublished 
                      ? "text-green-700 bg-green-50 border-green-200" 
                      : "text-gray-500 bg-gray-100 border-gray-200"
                  )}>
                    <FontAwesomeIcon icon={post.isPublished ? faEye : faEyeSlash} />
                    {post.isPublished ? "公開中" : "下書き"}
                  </div>
                </div>

                <div className="text-sm text-slate-500 mb-2">
                  {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                </div>

                <div className="flex gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category.id}
                      className="rounded border border-slate-400 px-2 py-0.5 text-xs font-bold text-slate-500 bg-white"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">記事がありません。</div>
        )}
      </div>
    </main>
  );
};

export default Page;