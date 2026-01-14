"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Twitterを削除し、Githubだけインポート
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-400 py-12 mt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 md:flex-row md:justify-between">
        
        {/* 左側: ロゴとコピーライト */}
        <div className="text-center md:text-left">
          <div className="text-2xl font-bold text-white mb-1">MyBlogApp</div>
          <div className="text-sm opacity-80">
            &copy; {new Date().getFullYear()} Kurobapp. All Rights Reserved.
          </div>
        </div>

        {/* 右側: Githubリンクのみ */}
        <div className="flex gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;