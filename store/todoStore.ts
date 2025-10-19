import { create } from "zustand";

export type Todo = {
  id: string;
  item: string;
  isDone: boolean;
  createdAt: string;
};

type TodoState = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  filter: "all" | "done" | "undone";
  setFilter: (filter: "all" | "done" | "undone") => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, isDone: !t.isDone } : t
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  filter: "all",
  setFilter: (filter) => set({ filter }),
}));
