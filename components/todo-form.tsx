"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useTodoStore } from "@/store/todoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

export default function TodoForm() {
  const [newTodo, setNewTodo] = useState("");
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]); // ✅ untuk checklist
  const { todos, setTodos, filter, setFilter } = useTodoStore();
  const queryClient = useQueryClient();

  // 🟩 GET All Todos
  const { isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/todos");
      const data = res.data?.content?.entries ?? [];
      setTodos(data);
      return data;
    },
  });

  // 🟦 CREATE Todo
  const createMutation = useMutation({
    mutationFn: async (item: string) => {
      const res = await api.post("/todos", { item });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo berhasil ditambahkan!");
      setNewTodo("");
    },
    onError: () => toast.error("Gagal menambah todo."),
  });

  // 🟧 TOGGLE (Mark Done/Undone)
  const toggleMutation = useMutation({
  mutationFn: async (todo: any) => {
    const action = todo.isDone ? "UNDONE" : "DONE";
    try {
      const url = `/todos/${todo.id}`; 
      console.log("Toggling:", url, action);
      const res = await api.post(url, { action });
      return res.data;
    } catch (err: any) {
      console.error("Toggle error:", err?.response?.status, err?.response?.data, err?.config?.url);
      throw err;
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    toast.success("Status todo berhasil diubah!");
  },
  onError: () => toast.error("Gagal mengubah status todo."),
});


  // 🟥 DELETE Todo
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/todos/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setSelectedTodos([]); // reset checklist
      toast.success("Todo terpilih berhasil dihapus!");
    },
    onError: () => toast.error("Gagal menghapus todo."),
  });

  // 🟪 Filtered Todos
  const filteredTodos = Array.isArray(todos)
    ? todos.filter((todo) => {
        if (filter === "done") return todo.isDone;
        if (filter === "undone") return !todo.isDone;
        return true;
      })
    : [];

  // ✅ Handle checklist toggle
  const handleCheckboxChange = (id: string) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">My Todo List</h1>

        {/* 🟢 Input New Todo */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTodo.trim()) return;
            createMutation.mutate(newTodo);
          }}
          className="flex gap-2 mb-6"
        >
          <Input
            type="text"
            placeholder="Tambahkan todo baru..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Add
          </Button>
        </form>

        {/* 🟢 Filter Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          {["all", "done", "undone"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f as any)}
            >
              {f === "all" ? "Semua" : f === "done" ? "Selesai" : "Belum"}
            </Button>
          ))}
        </div>

        {/* 🟢 Todo List */}
        {isLoading ? (
          <p className="text-center text-gray-500">Memuat...</p>
        ) : filteredTodos.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada todo.</p>
        ) : (
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 bg-gray-50 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  {/* Checkbox hanya untuk memilih yang akan dihapus */}
                  <input
                    type="checkbox"
                    checked={selectedTodos.includes(todo.id)}
                    onChange={() => handleCheckboxChange(todo.id)}
                    className="cursor-pointer accent-red-500"
                  />
                  <span
                    className={`${
                      todo.isDone ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {todo.item}
                  </span>
                </div>

                {/* Button DONE / UNDONE */}
                <Button
                  size="sm"
                  variant={todo.isDone ? "secondary" : "default"}
                  onClick={() => toggleMutation.mutate(todo)}
                >
                  {todo.isDone ? "Undone" : "Done"}
                </Button>
              </li>
            ))}
          </ul>
        )}

        {/* 🗑️ Tombol hapus muncul jika ada todo yang dicentang */}
        {selectedTodos.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(selectedTodos)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus Todo Terpilih ({selectedTodos.length})
            </Button>
          </div>
        )}
      </div>
      <Toaster richColors />
    </div>
  );
}
