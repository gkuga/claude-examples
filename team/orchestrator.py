"""
Todo App Team Development Orchestrator

Claude Agent SDKを使って複数エージェントでTodoアプリをチーム開発する。

Phase 1-2: セットアップ（単一エージェント、直列）
Phase 3-6: ユーザーストーリー実装（複数エージェント、並列）
Phase 7:   検証（単一エージェント）

Usage:
    uv run python orchestrator.py
"""

import asyncio
import os
import sys
from pathlib import Path

# Claude Code内からの実行を許可（ネスト検出を回避）
os.environ.pop("CLAUDECODE", None)

from claude_agent_sdk import (
    query,
    ClaudeAgentOptions,
    AgentDefinition,
    AssistantMessage,
    ResultMessage,
    TextBlock,
)

# プロジェクトルート（claude-examples/）
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SPECS_DIR = PROJECT_ROOT / "specs" / "001-todo-app"
TODO_DIR = PROJECT_ROOT / "todo"


def load_spec(filename: str) -> str:
    """specsディレクトリからドキュメントを読み込む"""
    path = SPECS_DIR / filename
    if path.is_file():
        return path.read_text()
    # contracts/ ディレクトリ内のファイル
    path = SPECS_DIR / "contracts" / filename
    if path.is_file():
        return path.read_text()
    return ""


# 各エージェント共通のコンテキスト
SHARED_CONTEXT = f"""
## プロジェクト情報

- 作業ディレクトリ: {PROJECT_ROOT}
- ソースコード配置先: {TODO_DIR}
- 技術スタック: TypeScript 5.x (strict), React 19, Vite, Express.js, better-sqlite3, Vitest
- モノレポ構成: todo/frontend/, todo/backend/, todo/shared/

## APIコントラクト

{load_spec("api.md")}

## データモデル

{load_spec("data-model.md")}
"""


async def run_phase(name: str, prompt: str, agents: dict | None = None, max_turns: int = 50) -> str:
    """1つのPhaseを実行し、結果テキストを返す"""
    print(f"\n{'='*60}")
    print(f"  {name}")
    print(f"{'='*60}\n")

    result_text = ""
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob", "Agent"],
        max_turns=max_turns,
        permission_mode="bypassPermissions",
        cwd=str(PROJECT_ROOT),
    )
    if agents:
        options.agents = agents

    async for message in query(prompt=prompt, options=options):
        # エージェントのテキスト出力を表示
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        # 最終結果
        if isinstance(message, ResultMessage):
            result_text = message.result or ""
            cost = message.total_cost_usd or 0
            print(f"\n[{name}] 完了 (turns: {message.num_turns}, cost: ${cost:.4f})")

    return result_text


async def phase_setup():
    """Phase 1-2: プロジェクトセットアップ + 基盤構築"""
    plan = load_spec("plan.md")
    data_model = load_spec("data-model.md")

    prompt = f"""
あなたはTodoアプリのプロジェクトセットアップ担当です。

以下の実装計画に従って、Phase 1（Setup）とPhase 2（Foundational）のタスクをすべて実行してください。

{SHARED_CONTEXT}

## 実装計画（プロジェクト構造）

{plan}

## 実行するタスク

### Phase 1: Setup
- T001: todo/package.json にnpm workspacesを設定（workspaces: ["shared", "backend", "frontend"]）
- T002: todo/shared/src/types.ts と todo/shared/package.json を作成（データモデルのTypeScript型を実装）
- T003: todo/tsconfig.base.json を作成（strict: true）
- T004: todo/backend/package.json と todo/backend/tsconfig.json を作成（express, better-sqlite3, cors, vitest を依存に追加）
- T005: todo/frontend/package.json, tsconfig.json, vite.config.ts, index.html を作成（react, react-dom, vite, vitest を依存に追加）

### Phase 2: Foundational
- T006: todo/backend/src/db.ts — SQLite初期化、todosテーブル作成
- T007: todo/backend/src/index.ts — Expressサーバー（CORS, JSON middleware, port 3000）
- T008: todo/backend/src/routes/todos.ts — 空のルーターをエクスポート、サーバーに接続
- T009: todo/frontend/src/main.tsx と todo/frontend/src/App.tsx — Reactエントリポイント
- T010: todo/frontend/src/api/todos.ts — APIクライアントの骨格（空の関数）

## データモデル（型定義の参照用）

{data_model}

## 重要な注意事項
- npm install は todo/ ディレクトリで実行
- TypeScript strict mode を有効に
- vite.config.ts に /api へのプロキシ設定（target: http://localhost:3000）を含める
- Phase 2完了後、バックエンドとフロントエンドが起動可能な状態にすること
- 各タスク完了後にファイルが正しく作成されたか確認すること
"""
    return await run_phase("Phase 1-2: Setup + Foundation", prompt, max_turns=80)


async def phase_user_stories():
    """Phase 3-6: ユーザーストーリーを並列実装"""

    # --- Agent定義 ---
    agents = {
        "backend-engineer": AgentDefinition(
            description="バックエンドAPIの実装担当。Express routesとSQLiteクエリを担当する。",
            prompt=f"""あなたはバックエンドエンジニアです。Express.jsのAPIエンドポイントを実装します。

{SHARED_CONTEXT}

## 担当ファイル（これらのファイルのみ編集すること）
- todo/backend/src/routes/todos.ts
- todo/backend/src/db.ts（必要な場合のみ）

## 実装ルール
- better-sqlite3 を使用（同期API）
- SQLiteの completed は 0/1、APIレスポンスでは boolean に変換
- エラー時は適切なHTTPステータスコードを返す
- バリデーション: titleは空文字・空白のみ不可、最大200文字
""",
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
        ),

        "frontend-component-engineer": AgentDefinition(
            description="フロントエンドのReactコンポーネントとCSS担当。",
            prompt=f"""あなたはフロントエンドコンポーネントエンジニアです。ReactコンポーネントとCSSを実装します。

{SHARED_CONTEXT}

## 担当ファイル（これらのファイルのみ編集すること）
- todo/frontend/src/components/TodoForm.tsx
- todo/frontend/src/components/TodoList.tsx
- todo/frontend/src/components/TodoItem.tsx
- todo/frontend/src/components/FilterBar.tsx
- todo/frontend/src/components/*.module.css
- todo/frontend/src/App.tsx

## 実装ルール
- CSSモジュールを使用（*.module.css）
- コンポーネントはpropsで状態を受け取る（状態管理はhooksに委譲）
- 完了済みTodoは取り消し線（text-decoration: line-through）
- 空一覧時は「Todoがありません」を表示
- フィルターボタンはアクティブ状態をハイライト
""",
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
        ),

        "frontend-logic-engineer": AgentDefinition(
            description="フロントエンドのAPIクライアントとカスタムフック担当。",
            prompt=f"""あなたはフロントエンドロジックエンジニアです。APIクライアントとReact hooksを実装します。

{SHARED_CONTEXT}

## 担当ファイル（これらのファイルのみ編集すること）
- todo/frontend/src/api/todos.ts
- todo/frontend/src/hooks/useTodos.ts

## 実装ルール
- fetch APIを直接使用（外部ライブラリ不要）
- useTodos hookは useState でローカルステート管理
- フィルター状態も useTodos 内で管理
- filteredTodos を computed value として公開
- エラーハンドリングを含める
""",
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
        ),

        "test-engineer": AgentDefinition(
            description="テストコード担当。バックエンドAPI統合テストとフロントエンド単体テスト。",
            prompt=f"""あなたはテストエンジニアです。Vitestでテストを書きます。

{SHARED_CONTEXT}

## 担当ファイル（これらのファイルのみ編集すること）
- todo/backend/tests/todos.test.ts
- todo/frontend/tests/useTodos.test.ts

## 実装ルール
- Vitest を使用
- バックエンドテスト: supertest等は使わず、直接fetchでAPIを叩くか、routerを直接テスト
- フロントエンドテスト: useTodos hookのロジックをテスト
- テストは各CRUD操作をカバー（GET, POST, PATCH, DELETE）
- フィルタリングロジックのテストも含める
- テストデータは日本語を使用（「買い物に行く」等）
""",
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
        ),
    }

    prompt = f"""
あなたはTodoアプリ開発チームのテックリードです。
4人のエンジニア（サブエージェント）を指揮して、全ユーザーストーリーを並列に実装します。

## チームメンバー
1. **backend-engineer**: APIエンドポイント実装（routes/todos.ts）
2. **frontend-component-engineer**: Reactコンポーネント + CSS
3. **frontend-logic-engineer**: APIクライアント + useTodos hook
4. **test-engineer**: テストコード

## 実装するユーザーストーリー

### US1: Todoの作成と一覧表示 (P1 - MVP)
- GET /todos, POST /todos のAPIエンドポイント
- TodoForm, TodoList, TodoItem コンポーネント
- fetchTodos, addTodo のAPIクライアントとhook
- テスト

### US2: 完了/未完了切り替え (P2)
- PATCH /todos/:id のAPIエンドポイント
- TodoItem にチェックボックス連携、完了時の取り消し線
- toggleTodo のAPIクライアントとhook
- テスト

### US3: 削除 (P3)
- DELETE /todos/:id のAPIエンドポイント
- TodoItem に削除ボタン連携
- deleteTodo のAPIクライアントとhook
- 空一覧時の「Todoがありません」表示
- テスト

### US4: フィルタリング (P4)
- FilterBar コンポーネント（すべて/未完了/完了済み）
- useTodos にフィルター状態と filteredTodos
- App.tsx にFilterBar を接続
- テスト

## 指示
4つのエージェントを**すべて並列に**起動してください。各エージェントに担当するユーザーストーリーのタスクを明確に伝えてください。

全エージェントの作業が完了したら、todo/ ディレクトリで `npm install` を実行し、コンパイルエラーがないか確認してください。
"""
    return await run_phase(
        "Phase 3-6: User Stories (並列実装)",
        prompt,
        agents=agents,
        max_turns=100,
    )


async def phase_polish():
    """Phase 7: テスト実行と最終検証"""
    prompt = f"""
あなたはTodoアプリの最終検証担当です。

以下の作業を順番に実行してください。

1. todo/ ディレクトリで `npm install` を実行
2. TypeScriptのコンパイルエラーがないか確認（`npx tsc --noEmit` を各パッケージで実行）
3. テストを実行（`npm test` またはバックエンド・フロントエンド個別に）
4. テストが失敗した場合は修正
5. todo/package.json のscriptsに以下を追加（なければ）:
   - "dev:backend": バックエンド開発サーバー起動
   - "dev:frontend": フロントエンド開発サーバー起動
   - "dev": 両方を同時起動
   - "test": 全テスト実行
   - "build": ビルド

## プロジェクト情報
{SHARED_CONTEXT}

エラーがあればすべて修正し、最終的にテストがすべてパスする状態にしてください。
"""
    return await run_phase("Phase 7: Polish & Validation", prompt, max_turns=80)


async def main():
    print("""
╔══════════════════════════════════════════════╗
║  Todo App Team Development Orchestrator      ║
║  Claude Agent SDK × SpecKit                  ║
╚══════════════════════════════════════════════╝
""")

    # Phase 1-2: セットアップ（直列、ブロッキング）
    await phase_setup()

    # Phase 3-6: ユーザーストーリー（並列）
    await phase_user_stories()

    # Phase 7: 最終検証
    await phase_polish()

    print(f"""
{'='*60}
  全Phase完了！
{'='*60}

起動方法:
  cd {TODO_DIR}
  npm run dev

テスト:
  cd {TODO_DIR}
  npm test
""")


if __name__ == "__main__":
    asyncio.run(main())
