import React, { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string; // Todo yaratilgan vaqti
}

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [todoList, setTodoList] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todoList");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: getFormattedDate(), // Vaqtni qo'shish
    };
    const updatedTodoList = [newTodo, ...todoList];
    setTodoList(updatedTodoList);
    setInputValue("");
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
  };

  const handleDeleteTodo = (id: number) => {
    if (window.confirm("Siz bu todoni o'chirishni xohlaysizmi?")) {
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

  const handleEditTodo = (id: number, text: string) => {
    setIsEditing(id);
    setEditValue(text);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (id: number) => {
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: editValue, createdAt: getFormattedDate() }; // Matn va vaqtni yangilash
      }
      return todo;
    });
    setTodoList(updatedTodoList);
    setIsEditing(null);
    setEditValue("");
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
    setIsModalOpen(false);
  };

  const handleDeleteAllTodos = () => {
    if (window.confirm("Barcha todolarni o'chirishni xohlaysizmi?")) {
      setTodoList([]);
      localStorage.removeItem("todoList");
    }
  };

  return (
    <>
      <section className="container flex flex-col items-center justify-center mt-[20px] gap-5">
        <h1 className="text-2xl text-center font-bold">Todo List</h1>
        <div
          style={{ marginTop: "-40px" }}
          className=" flex items-center w-[600px] justify-end"
        >
          <button
            onClick={handleDeleteAllTodos}
            className="btn btn-outline btn-danger"
          >
            Delete all
          </button>
        </div>
        <div className="shadow-lg p-5 rounded-lg">
          <form
            onSubmit={handleAddTodo}
            className="flex gap-3 w-[600px] items-center bors"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Yozing"
              className="input input-bordered w-[90px] flex-grow"
              required
            />
            <button type="submit" className="btn btn-outline btn-info">
              Add Todo
            </button>
          </form>
          <ul className="mt-5 w-[600px] flex flex-col gap-3">
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
                <div className="flex gap-3 items-center w-full">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleCompleted(todo.id)}
                    className="mr-2 cursor-pointer"
                  />
                  <p className="flex-grow">{todo.text}</p>
                  <div className="text-gray-500 text-sm">{todo.createdAt}</div>
                  <button
                    onClick={() => handleEditTodo(todo.id, todo.text)}
                    className="ml-2 text-blue-500"
                    aria-label="Edit todo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M15.232 3.232a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-9.072 9.072a1 1 0 01-.45.262l-5 1.25a1 1 0 01-1.213-1.213l1.25-5a1 1 0 01.262-.45l9.072-9.072zM14.5 6.5L7 14v3h3l7.5-7.5-3-3z" />
                    </svg>
                  </button>
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
        </div>
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">Todoni tahrirlash</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(isEditing!);
                }}
                className="flex gap-3 items-center w-full"
              >
                <input
                  type="text"
                  required
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="input input-bordered w-full"
                />
                <button type="submit" className="btn btn-outline btn-info">
                  Saqlash
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
