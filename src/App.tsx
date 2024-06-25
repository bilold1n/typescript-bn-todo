import React, { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [todoList, setTodoList] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todoList");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    const updatedTodoList = [...todoList, newTodo];
    setTodoList(updatedTodoList);
    setInputValue("");
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
  };

  const handleDeleteTodo = (id: number) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      const updatedTodoList = todoList.filter((todo) => todo.id !== id);
      setTodoList(updatedTodoList);
      localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
    }
  };

  const handleToggleCompleted = (id: number) => {
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodoList(updatedTodoList);
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
  };

  return (
    <>
      <section className="container flex flex-col items-center justify-center mt-[20px] gap-5">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <form
          onSubmit={handleAddTodo}
          className="flex flex-col gap-3 w-[300px]"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type here"
            className="input input-bordered"
            required
          />
          <div className="flex justify-end">
            <button type="submit" className="btn btn-outline btn-info w-[70px]">
              Add
            </button>
          </div>
        </form>
        <ul className="mt-5 w-[300px] flex flex-col gap-3">
          {todoList.map((todo) => (
            <li
              style={{
                border: "1px solid #0004",
                borderRadius: "12px",
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              key={todo.id}
              className="py-2 p-3 flex justify-between items-center"
            >
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleCompleted(todo.id)}
                  className="mr-2"
                />
                <p>{todo.text}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="ml-2 text-red-500"
                  aria-label="Delete todo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="red"
                    viewBox="0 0 24 24"
                    stroke="none"
                  >
                    <path d="M3 6h18v2H3zm3 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6zm3-5h6v2H9V3z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default App;
