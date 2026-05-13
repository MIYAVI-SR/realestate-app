-- ============================================================
-- 不動産管理アプリ — Supabase スキーマ定義
-- Supabase Dashboard > SQL Editor で実行する
-- ============================================================

-- ----------------------------------------
-- 物件テーブルの作成
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,           -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent >= 0), -- 家賃（円）
  area        TEXT        NOT NULL,           -- エリア名（例: 渋谷区）
  floor_plan  TEXT        NOT NULL,           -- 間取り（例: 1LDK）
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- Row Level Security（RLS）の有効化
-- ※ RLSを有効にすると、ポリシーがない操作はすべて拒否される
-- ----------------------------------------
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------
-- RLS ポリシー設定
-- 「自分が登録した物件のみ」操作できるように制限する
-- ----------------------------------------

-- SELECT: 自分の物件のみ参照できる
CREATE POLICY "自分の物件のみ参照"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: 自分のuser_idでのみ登録できる
CREATE POLICY "自分の物件のみ登録"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分の物件のみ更新できる
CREATE POLICY "自分の物件のみ更新"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 自分の物件のみ削除できる
CREATE POLICY "自分の物件のみ削除"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------
-- ロール権限の付与
-- ※ SQLエディタで作成したテーブルは自動付与されないため明示的に設定する
-- authenticated = ログイン済みユーザーが使うロール
-- ----------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE properties TO authenticated;
