import React, { useState, useEffect } from "react";
import { Task } from "@/types/task";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task | null;
};

const TaskFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Pending" | "In Progress" | "Completed">(
    "Pending"
  );

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setStatus(initialTask.status as any);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
    }
  }, [initialTask]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const task: Task = {
      id: initialTask?.id ?? "",
      title,
      description,
      status,
      createdAt: initialTask?.createdAt ?? new Date().toISOString(),
    };
    onSave(task);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialTask ? "Edit Task" : "Add New Task"}
        </h2>
        <input
          type="text"
          className="w-full mb-3 p-2 rounded bg-slate-800 text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-3 p-2 rounded bg-slate-800 text-white"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="w-full mb-4">
          <label
            htmlFor="task-status"
            className="block mb-1 text-sm text-slate-300"
          >
            Status
          </label>
          <select
            id="task-status"
            className="w-full p-2 rounded bg-slate-800 text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            {initialTask ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
