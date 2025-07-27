"use client";
import { useEffect, useState } from "react";
import { getTodos, addTodo } from "@/lib/api";
import { io } from "socket.io-client";

interface Todo {
  id: number;
  content: string;
  completed: boolean;
}

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
);

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    loadTodos();

    socket.on("new-todo", (todo: Todo) => {
      setTodos((prev) => [todo, ...prev]);
    });

    return () => {
      socket.off("new-todo");
    };
  }, []);

  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data.reverse());
  };

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    await addTodo(newTodo);
    setNewTodo("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Collaborative To-Do</h1>
      <div className="flex mb-4">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a task"
          className="flex-grow border px-2 py-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="border-b py-1">
            {todo.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
