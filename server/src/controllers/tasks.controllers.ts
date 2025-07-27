import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new Todo (Task)
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.params.userId;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        status,
        userId,
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Create Todo Error:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// Get all Todos for a specific user
export const getAllTodosForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const todos = await prisma.todo.findMany({
      where: { userId },
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error("Fetch Todos Error:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// Get Todos not belonging to a specific user
export const getTodosExcludingUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const todos = await prisma.todo.findMany({
      where: {
        NOT: {
          userId,
        },
      },
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error("Fetch Others' Todos Error:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// Update a specific Todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        status,
      },
    });

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Update Todo Error:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// Delete a specific Todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.todo.delete({
      where: { id },
    });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Delete Todo Error:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
