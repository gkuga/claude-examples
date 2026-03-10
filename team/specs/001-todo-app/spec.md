# Feature Specification: Todo App

**Feature Branch**: `001-todo-app`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Todoアプリ。CRUD操作、フィルタリング、SPA、認証不要。ソースコードはtodoディレクトリ。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Todoの作成と一覧表示 (Priority: P1)

ユーザーはテキスト入力欄にTodoのタイトルを入力し、追加ボタンを押すとTodoが一覧に表示される。ページを開くと既存のTodo一覧が表示される。

**Why this priority**: Todoアプリの最も基本的な機能。これがなければアプリとして成立しない。

**Independent Test**: Todoを1件作成し、一覧に表示されることを確認。ページ再読み込み後もデータが保持されていることを確認。

**Acceptance Scenarios**:

1. **Given** 空のTodo一覧, **When** ユーザーが「買い物に行く」と入力して追加ボタンを押す, **Then** 一覧に「買い物に行く」が未完了状態で表示される
2. **Given** Todoが3件存在する状態, **When** ページを開く, **Then** 3件すべてのTodoが一覧に表示される
3. **Given** テキスト入力欄が空の状態, **When** 追加ボタンを押す, **Then** Todoは追加されずエラーが表示される

---

### User Story 2 - Todoの完了/未完了の切り替え (Priority: P2)

ユーザーはTodo項目のチェックボックスをクリックして、完了状態と未完了状態を切り替えられる。完了したTodoは視覚的に区別される。

**Why this priority**: Todoの状態管理はアプリの核心機能。作成の次に重要。

**Independent Test**: 未完了のTodoをクリックして完了にし、再度クリックして未完了に戻せることを確認。

**Acceptance Scenarios**:

1. **Given** 未完了のTodo「買い物に行く」, **When** チェックボックスをクリックする, **Then** Todoが完了状態になり取り消し線が表示される
2. **Given** 完了済みのTodo「買い物に行く」, **When** チェックボックスをクリックする, **Then** Todoが未完了状態に戻り取り消し線が消える

---

### User Story 3 - Todoの削除 (Priority: P3)

ユーザーはTodo項目の削除ボタンをクリックして、不要なTodoを削除できる。

**Why this priority**: 完了/未完了の切り替えがあれば運用可能だが、削除によりリストを整理できる。

**Independent Test**: Todoを削除し、一覧から消えることを確認。

**Acceptance Scenarios**:

1. **Given** Todo「買い物に行く」が一覧にある, **When** 削除ボタンをクリックする, **Then** 「買い物に行く」が一覧から消える
2. **Given** Todoが1件だけある状態, **When** そのTodoを削除する, **Then** 一覧が空になり「Todoがありません」と表示される

---

### User Story 4 - フィルタリング (Priority: P4)

ユーザーはフィルターボタン（すべて/未完了/完了済み）を切り替えて、表示するTodoを絞り込める。

**Why this priority**: 便利な機能だが、P1-P3だけでアプリとして成立するため優先度は低い。

**Independent Test**: 完了・未完了のTodoが混在する状態で各フィルターを適用し、正しく絞り込まれることを確認。

**Acceptance Scenarios**:

1. **Given** 完了2件・未完了3件のTodoがある状態, **When** 「未完了」フィルターを選択, **Then** 未完了の3件のみ表示される
2. **Given** 完了2件・未完了3件のTodoがある状態, **When** 「完了済み」フィルターを選択, **Then** 完了済みの2件のみ表示される
3. **Given** フィルター「完了済み」が選択された状態, **When** 「すべて」フィルターを選択, **Then** 全5件が表示される

---

### Edge Cases

- 空文字やスペースのみでTodoを作成しようとした場合、追加を拒否する
- 非常に長いタイトル（500文字超）は切り詰めるか入力制限を設ける
- 同時に大量のTodo（100件以上）がある場合でも一覧表示が正常に動作する

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: ユーザーはテキスト入力からTodoを作成できなければならない（MUST）
- **FR-002**: 作成されたTodoはサーバーに永続化されなければならない（MUST）
- **FR-003**: ページ読み込み時にすべてのTodoを一覧表示しなければならない（MUST）
- **FR-004**: ユーザーはTodoの完了/未完了状態を切り替えられなければならない（MUST）
- **FR-005**: ユーザーはTodoを削除できなければならない（MUST）
- **FR-006**: ユーザーは「すべて」「未完了」「完了済み」でTodoをフィルタリングできなければならない（MUST）
- **FR-007**: 空のタイトルでのTodo作成を拒否しなければならない（MUST）
- **FR-008**: Todoのタイトルは最大200文字に制限しなければならない（MUST）
- **FR-009**: 認証は不要。すべてのユーザーが同じTodoリストを共有する（MUST）

### Key Entities

- **Todo**: Todoアイテム。属性：ID、タイトル（文字列、最大200文字）、完了状態（真偽値）、作成日時

### Assumptions

- 単一ユーザー想定（認証不要のため、全操作が同一リストに対して行われる）
- ソースコードはリポジトリルートの `todo/` ディレクトリ配下に配置する
- フィルタリングはフロントエンド側で実行（全件取得後にクライアントで絞り込む）
- ページネーションは不要（Todoの件数は数百件以下を想定）

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: ユーザーがTodoの作成を10秒以内に完了できる（入力から一覧反映まで）
- **SC-002**: 100件のTodoがある状態でページ読み込みが2秒以内に完了する
- **SC-003**: 完了/未完了の切り替えが即座に画面に反映される（1秒以内）
- **SC-004**: フィルター切り替えが即座に反映される（0.5秒以内）
- **SC-005**: すべてのCRUD操作がページ再読み込みなしで完了する（SPA要件）
