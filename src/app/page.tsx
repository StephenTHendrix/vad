'use client';

import { useState, useEffect } from "react";
import { CardContent } from "./components/Card";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { XCircle } from "lucide-react";
import Dexie, { Table } from "dexie";

const statuses = [
  "Step 1",
  "Step 2",
  "Step 3",
  "Step 4",
  "Step 5",
  "Step 6",
  "Step 7",
  "Step 8",
  "Step 9",
  "Step 10",
];

interface Task {
  id: string;
  name: string;
  status: string;
}

// Extend Dexie to define the tasks table
class KanbanDB extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super("KanbanDB");
    this.version(1).stores({
      tasks: "id, name, status",
    });
  }
}

// Initialize Dexie (IndexedDB wrapper)
const db = new KanbanDB("KanbanDB");
db.version(1).stores({ tasks: "id, name, status" });

const initialTasks = [
  { id: "1", name: "Task 1", status: "Step 1" },
  { id: "2", name: "Task 2", status: "Step 2" },
  { id: "3", name: "Task 3", status: "Step 3" },
  { id: "4", name: "Task 4", status: "Step 4" },
  { id: "5", name: "Task 5", status: "Step 5" },
  { id: "6", name: "Task 6", status: "Step 6" },
  { id: "7", name: "Task 7", status: "Step 7" },
  { id: "8", name: "Task 8", status: "Step 8" },
  { id: "9", name: "Task 9", status: "Step 9" },
  { id: "10", name: "Task 10", status: "Step 10" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await db.tasks.toArray();
      if (allTasks.length === 0) {
        await db.tasks.bulkAdd(initialTasks);
        setTasks(initialTasks);
      } else {
        setTasks(allTasks);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim() === "") return;
    const task = { id: Date.now().toString(), name: newTask, status: "Step 1" };
    await db.tasks.add(task);
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const deleteTask = async (id) => {
    await db.tasks.delete(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = async (id, newName) => {
    await db.tasks.update(id, { name: newName });
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, name: newName } : task))
    );
    setEditingTask(null);
  };

  const handleEditStatus = (index, newStatus) => {
    statuses[index] = newStatus;
    setEditingStatus(null);
  };

  const handleDragStart = (event) => {
    const taskId = event.currentTarget.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (event, status) => {
    const taskId = event.dataTransfer.getData("text/plain");
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    event.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {statuses.map((status, index) => (
        <div
          key={status}
          onDrop={(event) => handleDrop(event, status)}
          onDragOver={(event) => event.preventDefault()}
          className="space-y-2 p-4 bg-gray-100 rounded-lg drop-target"
        >
          {editingStatus === index ? (
            <Input
              defaultValue={status}
              onBlur={(e) => handleEditStatus(index, e.target.value)}
              autoFocus
            />
          ) : (
            <h2
              className="text-xl font-bold cursor-pointer"
              onClick={() => setEditingStatus(index)}
            >
              {status}
            </h2>
          )}
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <div
                key={task.id}
                data-task-id={task.id}
                draggable
                onDragStart={handleDragStart}
                className="relative p-2 cursor-pointer bg-white shadow-sm rounded-lg draggable"
              >
                <CardContent>
                  {editingTask === task.id ? (
                    <Input
                      defaultValue={task.name}
                      onBlur={(e) => handleEditTask(task.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p
                      className="cursor-pointer"
                      onClick={() => setEditingTask(task.id)}
                    >
                      {task.name}
                    </p>
                  )}
                  <XCircle
                    className="absolute top-2 right-2 w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => deleteTask(task.id)}
                  />
                </CardContent>
              </div>
            ))}
        </div>
      ))}
      <div className="mt-5 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex space-x-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task name"
          className="w-full max-w-md"
        />
        <Button onClick={addTask} className="px-4 py-2">
          Add
        </Button>
      </div>
    </div>
  );
}
