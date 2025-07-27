"use client";

import React, { useState } from "react";
import { Task } from "@/types/task";

interface Props {
  onSubmit: (task: Task) => void;
  initialData?: Task;
}

const TaskForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [status, setStatus] = useState<Task["status"]>(
    initialData?.status || "Pending"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: initialData?.id || crypto.randomUUID(),
      title,
      description,
      status,
    };
    onSubmit(task);
    setTitle("");
    setDescription("");
    setStatus("Pending");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded shadow"
    >
      <div>
        <label htmlFor="title" className="block mb-1 font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 font-medium">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Enter task description"
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="status" className="block mb-1 font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {initialData ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
