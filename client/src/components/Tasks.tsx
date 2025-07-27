"use client";
import React, { useState } from "react";
import TaskFormModal from "@/components/TaskFormModal";
import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";
import { Pencil, Trash2 } from "lucide-react";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleSave = (task: Task) => {
    if (editingTask) {
      // Update existing task
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...task } : t)));
    } else {
      // Add new task
      setTasks((prev) => [
        ...prev,
        { ...task, id: uuidv4(), createdAt: new Date().toISOString() },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Your Tasks</h1>
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-700 p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-300">{task.description}</p>
              <span
                className={`text-sm font-medium ${
                  task.status === "Completed"
                    ? "text-green-400"
                    : task.status === "Pending"
                    ? "text-yellow-400"
                    : "text-blue-400"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(task)}
                title="Edit Task"
                aria-label="Edit Task"
                className="p-2 rounded hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition duration-200"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                title="Delete Task"
                aria-label="Delete Task"
                className="p-2 rounded hover:bg-slate-700 text-red-400 hover:text-red-300 transition duration-200"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialTask={editingTask}
      />
    </div>
  );
};

export default Tasks;
