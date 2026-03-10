import { useTodos } from "./hooks/useTodos";
import FilterBar from "./components/FilterBar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const {
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    loading,
    error,
  } = useTodos();

  return (
    <div className="app-container">
      <h1 className="app-title">Todo App</h1>
      <FilterBar current={filter} onChange={setFilter} />
      <TodoForm onAdd={addTodo} />
      {loading ? (
        <p className="app-loading">読み込み中...</p>
      ) : error ? (
        <p className="app-error">{error}</p>
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      )}
    </div>
  );
}

export default App;
