"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      title: "Design Login Page",
      description: "Use dark mode and green accent",
      status: "In Progress",
      createdAt: new Date().toISOString(),
    },
  ]);

  const countByStatus = (status: string) =>
    tasks.filter((t) => t.status === status).length;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 dark:bg-slate-800 text-white">
        <header>
          <h1 className="text-3xl font-bold mb-6" tabIndex={0}>
            Task Dashboard
          </h1>
        </header>

        <section aria-labelledby="task-summary" className="mb-8">
          <h2 id="task-summary" className="sr-only">
            Task Summary Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskCard
              title="Pending"
              count={countByStatus("Pending")}
              color="yellow"
            />
            <TaskCard
              title="In Progress"
              count={countByStatus("In Progress")}
              color="blue"
            />
            <TaskCard
              title="Completed"
              count={countByStatus("Completed")}
              color="green"
            />
          </div>
        </section>

        <section
          aria-labelledby="task-list"
          className="bg-slate-900 rounded-lg p-4"
        >
          <h2 id="task-list" className="text-xl mb-4">
            Your Tasks
          </h2>

          {tasks.map((task) => (
            <article
              key={task.id}
              className="bg-slate-800 mb-3 p-4 rounded flex justify-between items-center"
              aria-labelledby={`task-${task.id}-title`}
              role="group"
              tabIndex={0}
            >
              <div>
                <h3
                  id={`task-${task.id}-title`}
                  className="text-lg font-semibold"
                >
                  {task.title}
                </h3>
                <p className="text-gray-400">{task.description}</p>
              </div>
              <span
                className={`text-sm font-bold ${
                  task.status === "Completed"
                    ? "text-green-400"
                    : task.status === "Pending"
                    ? "text-yellow-400"
                    : "text-blue-400"
                }`}
                aria-label={`Status: ${task.status}`}
              >
                {task.status}
              </span>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
