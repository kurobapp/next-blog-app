"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faGripVertical } from "@fortawesome/free-solid-svg-icons"; // アイコン追加
import { twMerge } from "tailwind-merge";
import type { Category } from "@/app/_types/Category";

// dnd-kit 関連のインポート
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ソート可能なリストアイテムコンポーネント
const SortableItem = ({ category }: { category: Category }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 flex items-center justify-between rounded-md border border-slate-400 p-2 bg-white"
    >
      <Link href={`/admin/categories/${category.id}`} className="text-blue-600 hover:underline">
        {category.name}
      </Link>
      
      {/* ドラッグ用ハンドル */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-slate-400 hover:text-slate-600 px-2"
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
    </div>
  );
};

const Page: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ドラッグ操作のセンサー設定（マウスとキーボードに対応）
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ドラッグ終了時の処理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        // 配列の並び順を変更
        const newItems = arrayMove(items, oldIndex, newIndex);

        // APIに新しい順序を保存
        saveOrder(newItems);

        return newItems;
      });
    }
  };

  // APIに保存する関数
  const saveOrder = async (items: Category[]) => {
    try {
      // id と index (sortOrder) のペアを作って送信
      const orderData = items.map((item, index) => ({
        id: item.id,
        sortOrder: index,
      }));

      await fetch("/api/admin/categories/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      console.error("並び順の保存に失敗しました", error);
    }
  };

  if (isLoading) return <div><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Loading...</div>;

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-2xl font-bold">カテゴリ管理</div>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          新規作成
        </Link>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="mb-2 text-sm text-gray-500">
          ※ 右側のアイコン <FontAwesomeIcon icon={faGripVertical} /> をドラッグして並び替えできます
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
              <SortableItem key={category.id} category={category} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
};

export default Page;