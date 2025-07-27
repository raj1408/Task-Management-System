import { Router } from "express";
import {
    createTodo,
    getAllTodosForUser,
    getTodosExcludingUser,
    updateTodo,
    deleteTodo,
} from "../controllers/tasks.controllers";
import { verifyjwt } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Create a new Todo
router.post("/:userId", verifyjwt, createTodo);

// ✅ Get all Todos for a specific user
router.get("/:userId", verifyjwt, getAllTodosForUser);

// ✅ Get Todos not belonging to a specific user
router.get("/others/:userId", verifyjwt, getTodosExcludingUser);

// ✅ Update a specific Todo
router.put("/:id", verifyjwt, updateTodo);

// ✅ Delete a specific Todo
router.delete("/:id", verifyjwt, deleteTodo);

export default router;
