import "dotenv/config";
import express from "express";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import { Tag, Status, Priority } from "../generated/prisma/enums"

const connectionString = `${process.env.DATABASE_URL}`;
console.log(process.env.DATABASE_URL);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = express();

//middleware
app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:5173"
// }))
app.use(cors({origin: "*"}));

app.get("/", (req, res) => {
  res.send("Todo App!");
});

async function connect() {
  await prisma.$connect();
}

connect();

// To fetch all tasks in database
app.get("/todos", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

app.get("/todos/:id", async (req, res) => {
  const todoId = parseInt(req.params.id);
  if (isNaN(todoId)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  try {
    const todo = await prisma.task.findUnique({
      where: { id: todoId },
      omit: { createdAt: true, updatedAt: true },
    });

    if (!todo) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

// dynamic routing


//to create a new task
app.post("/todos", async (req, res) => {
  const { title, description, priority, dueDate, tag } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: { title, description, priority, dueDate, tag },
      omit: { createdAt: true, updatedAt: true },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// to update a task
app.patch("/todos/:id", async (req, res) => {
  const todoId = parseInt(req.params.id, 10);

  if (isNaN(todoId)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const { title, description, priority, dueDate, status, completed } = req.body;

  try {
    const updated = await prisma.task.update({
      where: { id: todoId },
      data: {
        ...(title !== undefined && {title}),
        ...(description !== undefined && { description }),
        ...(priority !== undefined && {priority}),
        ...(dueDate !== undefined && {dueDate}),
        ...(status !== undefined && {status}),
        ...(completed !== undefined && {completed})
      },
      omit: { createdAt: true, updatedAt: true },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

//to delete a task
app.delete("/todos/:id", async (req, res) => {
  const todoId = parseInt(req.params.id, 10);

  if (isNaN(todoId)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  try {
    await prisma.task.delete({
      where: { id: todoId },
    });
    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// app.post('/tasks', (req, res) => { ... });
// app.put('/tasks/:id', (req, res) => { ... });
// app.patch('/tasks/:id', (req, res) => { ... });
// app.delete('/tasks/:id', (req, res) => { ... });

const PORT = process.env.PORT ?? 8000;
app.listen(PORT, () => {
  console.log(`server don start to dey listen on ${PORT}`);
});
