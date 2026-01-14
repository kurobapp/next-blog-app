"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFish, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";
import type { Category } from "@/app/_types/Category";

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("カテゴリ取得エラー", error);
      }
    };
    fetchCategories();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <header className="bg-slate-900 text-white shadow-md">
      {/* 画面幅の95%まで広げる */}
      <div className="mx-auto flex w-[95%] max-w-[1600px] items-center justify-between py-4">
        
        {/* ロゴとタイトル */}
        <Link href="/" className="flex items-center text-xl font-bold hover:text-blue-300 transition-colors">
          <FontAwesomeIcon icon={faFish} className="mr-2" />
          <span>MyBlogApp</span>
        </Link>

        {/* ナビゲーション（PC用） */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {/* カテゴリ一覧 */}
          <div className="flex gap-4 border-r border-slate-700 pr-6 mr-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?categoryId=${category.id}`}
                className="hover:text-blue-400 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <Link href="/about" className="hover:text-blue-400">About</Link>
          
          {!isLoading && (
            session ? (
              <button onClick={logout} className="flex items-center hover:text-red-400">
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-1" />
                Logout
              </button>
            ) : (
              <Link href="/login" className="flex items-center hover:text-green-400">
                <FontAwesomeIcon icon={faRightToBracket} className="mr-1" />
                Login
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;