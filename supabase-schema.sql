-- 小熊记账 App - Supabase 数据库建表脚本
-- 在 Supabase Dashboard > SQL Editor 中执行

-- 1. 记录表
CREATE TABLE IF NOT EXISTS records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  category_id TEXT NOT NULL,
  note TEXT,
  record_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 预算表
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category_id TEXT NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category_id, month)
);

-- 3. 启用 RLS
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- 4. RLS 策略 - 用户只能访问自己的数据
CREATE POLICY "Users can manage own records" ON records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own budgets" ON budgets
  FOR ALL USING (auth.uid() = user_id);

-- 5. 创建索引提升查询性能
CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_date ON records(record_date);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, month);
