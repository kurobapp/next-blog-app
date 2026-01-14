# Next.js Blog App

Next.js (App Router) を使用して構築されたブログアプリケーションだ。
一般ユーザー向けの閲覧機能と、管理者向けの投稿・カテゴリ管理機能を備えている。

## 機能一覧

### 公開画面 (Public)
- **記事一覧表示**: 投稿された記事の一覧を閲覧できる。
- **検索機能**: キーワードによる記事の検索が可能（タイトル・本文など）。
- **カテゴリ絞り込み**: 特定のカテゴリに紐付いた記事のみを表示できる。
- **ページネーション/ローディング**: 非同期による記事取得と読み込み中の表示。

### 管理画面 (Admin)
- **認証**: Supabase Auth を利用したログイン機能。
- **記事管理**: 記事の新規作成、編集、削除。
- **カテゴリ管理**: カテゴリの作成、編集、並び替え（dnd-kitを使用）。
- **画像管理**: 記事のカバー画像の設定（URL指定）。

## 技術スタック

### フロントエンド / フレームワーク
- **Next.js 15**: App Router, Server Actions, API Routes
- **React 19**
- **TypeScript**: 静的型付け
- **Tailwind CSS**: スタイリング
- **FontAwesome**: アイコン表示

### バックエンド / データベース
- **Prisma**: ORM (PostgreSQL)
- **Supabase**: 認証 (Auth), データベースホスティング (PostgreSQL)
- **PostgreSQL**: リレーショナルデータベース

### その他ライブラリ
- **dnd-kit**: ドラッグ&ドロップによる並び替え（カテゴリ管理等）
- **Isomorphic DOMPurify**: コンテンツのサニタイズ

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd next-blog-app

```

### 2. 依存関係のインストール

```bash
npm install

```

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の変数を設定する。
Supabaseのプロジェクト設定およびデータベースの接続情報を入力すること。

```env
# Database (Prisma / Supabase connection)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_SUPABASE_ANON_KEY]"

```

### 4. データベースのマイグレーション

Prismaのスキーマをデータベースに反映させる。

```bash
npx prisma migrate dev --name init

```

必要に応じてシードデータを投入する（`prisma/seed.ts` がある場合）。

```bash
npx prisma db seed

```

### 5. 開発サーバーの起動

```bash
npm run dev

```

ブラウザで `http://localhost:3000` にアクセスして確認する。

## スクリプト

* `npm run dev`: 開発サーバーを起動 (Turbopack有効)
* `npm run build`: 本番用にビルド
* `npm run start`: ビルドされたアプリケーションを起動
* `npm run lint`: ESLintによるコードチェック

## ディレクトリ構成 (主要部分)

* `src/app`: Next.js App Routerのページコンポーネント
* `(public)`: 一般公開ページ
* `admin`: 管理画面ページ（認証ガードあり）
* `api`: API Routes


* `src/_components`: 共通コンポーネント
* `src/_hooks`: カスタムフック (useAuth等)
* `src/_types`: 型定義
* `src/lib`: Prismaクライアントのインスタンス化
* `src/utils`: Supabaseクライアント等のユーティリティ
* `prisma`: Prismaスキーマ定義およびマイグレーションファイル
