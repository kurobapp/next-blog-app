import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer"; // Footerをインポート

export const metadata: Metadata = {
  title: "NextBlogApp",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      {/* min-h-screen: 画面の高さいっぱいまで確保
         flex flex-col: 縦並びにする
      */}
      <body className="flex min-h-screen flex-col font-sans text-slate-800">
        <Header />
        
        {/* flex-1: 空きスペースを全部これ（本文）で埋める → フッターが下に押し出される */}
        <div className="flex-1 mx-auto mt-6 w-full max-w-7xl px-4">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;