"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFish, 
  faRightFromBracket, 
  faRightToBracket,
  // faHouse は不要になったので削除
} from "@fortawesome/free-solid-svg-icons";
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
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 md:px-8">
        
        {/* ロゴエリア */}
        <Link href="/" className="flex items-center text-3xl font-bold hover:text-blue-300 transition-colors">
          <FontAwesomeIcon icon={faFish} className="mr-3" />
          <span>MyBlogApp</span>
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center gap-6 text-base font-medium">
          
          {/* Homeリンクは削除しました */}

          {/* 【カテゴリ対策】
            1. max-w-[600px]: 幅を最大600pxに制限（これ以上広がらない）
            2. overflow-x-auto: はみ出たら横スクロール
            3. whitespace-nowrap: カテゴリ名が改行されないようにする
            4. [&::-webkit-scrollbar]:hidden: スクロールバーを隠して見た目を綺麗に
          */}
          <div className="flex items-center gap-6 border-r border-slate-700 pr-6 mr-2 max-w-[600px] overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
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

          <Link href="/about" className="hover:text-blue-400 flex-shrink-0">About</Link>
          
          {!isLoading && (
            session ? (
              <button onClick={logout} className="flex items-center hover:text-red-400 transition-colors flex-shrink-0">
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                Logout
              </button>
            ) : (
              <Link href="/login" className="flex items-center hover:text-green-400 transition-colors flex-shrink-0">
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
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