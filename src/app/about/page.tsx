"use client";
import Image from "next/image";

const AboutPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center py-32">
      
      {/* アイコンも巨大化 (h-32 -> h-60) */}
      <div className="relative mb-10 h-60 w-60 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
        <Image
          src="/images/avatar.png"
          alt="icon"
          fill
          className="object-cover"
        />
      </div>

      {/* 文字も超巨大化 (text-xl -> text-8xl) */}
      <p className="text-8xl font-black text-gray-800 tracking-widest">
        デデドン
      </p>
      
    </main>
  );
};

export default AboutPage;