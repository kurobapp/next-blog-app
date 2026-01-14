"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faEye, 
  faEyeSlash, 
  faFilter, 
  faSort 
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import type { Category } from "@/app/_types/Category";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); // フィルタ用カテゴリ一覧
  const [fetchError, setFetchError] = useState<string | null>(null);

  // フィルタ・ソート用State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // 初回ロード時にカテゴリ一覧を取得（フィルタ用）
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  // 記事一覧の取得 (条件が変わるたびに実行)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPosts(null); // ロード中は一度クリア
        
        // クエリパラメータの作成
        const params = new URLSearchParams();
        params.append("sort", sortOrder);
        if (selectedCategoryId) {
          params.append("categoryId", selectedCategoryId);
        }

        // 管理用APIをパラメータ付きで叩く
        const requestUrl = `/api/admin/posts?${params.toString()}`;
        const res = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const apiResBody = (await res.json()) as PostApiResponse[];
        
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
            isPublished: body.isPublished,
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
  }, [selectedCategoryId, sortOrder]); // 依存配列に条件を追加

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  return (
    <main>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-2xl font-bold">投稿記事の管理</div>
        <Link
          href="/admin/posts/new"
          className={twMerge(
            "rounded-md px-5 py-2 font-bold text-center",
            "bg-blue-500 text-white hover:bg-blue-600",
          )}
        >
          新規作成
        </Link>
      </div>

      {/* フィルタ・ソート コントロールエリア */}
      <div className="mb-6 flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        
        {/* カテゴリフィルタ */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <FontAwesomeIcon icon={faFilter} /> カテゴリ絞り込み
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのカテゴリ</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 並び順ソート */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <FontAwesomeIcon icon={faSort} /> 並び順
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">新しい順 (降順)</option>
            <option value="asc">古い順 (昇順)</option>
          </select>
        </div>

      </div>

      {/* 記事一覧表示エリア */}
      {!posts ? (
        <div className="text-gray-500 py-10 text-center">
          <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="space-y-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} href={`/admin/posts/${post.id}`} className="block">
                <div
                  className={twMerge(
                    "border border-slate-400 p-3 rounded-md hover:bg-slate-100 transition-colors bg-white shadow-sm",
                    !post.isPublished && "bg-gray-50 border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-bold text-slate-900 truncate flex-1 mr-4">
                      {post.title}
                    </div>
                    
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

                  <div className="flex gap-2 flex-wrap">
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
            <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">
              条件に一致する記事が見つかりませんでした。
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Page;