"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const query = searchParams.get("q");

  useEffect(() => {
    const fetchPosts = async () => {
      setPosts(null);
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (query) params.append("q", query);

      const response = await fetch(`/api/posts?${params.toString()}`);
      if (response.ok) {
        const postResponse: PostApiResponse[] = await response.json();
        setPosts(postResponse.map(raw => ({
          id: raw.id,
          title: raw.title,
          content: raw.content,
          coverImage: { url: raw.coverImageURL, width: 1000, height: 1000 },
          createdAt: raw.createdAt,
          categories: raw.categories.map(c => ({ id: c.category.id, name: c.category.name }))
        })));
      }
    };
    fetchPosts();
  }, [categoryId, query]);

  return (
    // 全体の幅を95%に設定し、最大幅を1400px程度に抑えて間延びを防ぐ
    <main className="mx-auto w-[95%] max-w-[1400px] py-10">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* 左側：メインコンテンツ (残りの幅すべて) */}
        <div className="w-full flex-1 min-w-0">
          <div className="mb-6 border-b-2 border-gray-100 pb-3">
            <h1 className="text-2xl font-bold text-gray-800">
              {categoryId ? "カテゴリ絞り込み" : query ? "検索結果" : "新着記事"}
            </h1>
          </div>

          {!posts ? (
            <div className="py-20 text-center text-gray-400">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              Loading...
            </div>
          ) : (
            // Gridをやめて縦並び(flex-col)にする
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <PostSummary key={post.id} post={post} />
              ))}
              {posts.length === 0 && (
                <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                  記事が見つかりませんでした。
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右側：サイドバー (300px固定) */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-8 lg:sticky lg:top-8">
          
          {/* 検索ボックス */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
              サイト内検索
            </h2>
            <form action="/" method="GET" className="relative">
              <input
                name="q"
                type="text"
                placeholder="キーワード..."
                defaultValue={query || ""}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
              />
              <button type="submit" className="absolute right-2 top-1.5 w-8 h-8 text-gray-400 hover:text-blue-600 transition-colors">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>

          {/* プロフィール */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b pb-2 text-left">
              PROFILE
            </h2>
            <div className="w-24 h-24 mx-auto mb-4 relative rounded-full border-2 border-gray-100 shadow-sm overflow-hidden">
              <Image src="/images/avatar.png" alt="Avatar" fill className="object-cover" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">くろばっぷ</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              情報系高専生です。ITを味方にして、人生にバフを。
            </p>
            <Link 
              href="/admin/posts" 
              className="inline-block text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors"
            >
              DASHBOARD
            </Link>
          </div>

        </aside>
      </div>
    </main>
  );
};

export default Page;