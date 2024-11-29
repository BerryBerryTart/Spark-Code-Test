import React, { FormEvent, useEffect, useState } from "react";
import "./App.css";
import Todo, { TodoType } from "./Todo";

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [titleState, setTitleState] = useState<string>("");
  const [descriptionState, setDescriptionState] = useState<string>("");

  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch("http://localhost:8080/");
        if (todos.status !== 200) {
          console.log("Error fetching data");
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log("Could not connect to server. Ensure it is running. " + e);
      }
    };

    fetchTodos();
  }, []);

  //Submit todo
  const submitTodo = async (e: FormEvent) => {
    e.preventDefault();

    const payload: TodoType = {
      title: titleState,
      description: descriptionState,
    };
    await fetch("http://localhost:8080/", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      //refresh state after submit
      .then((res: TodoType[]) => setTodos(res))
      .then(() => {
        //reset form state at the end
        setTitleState("");
        setDescriptionState("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo: TodoType) => (
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        ))}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={submitTodo}>
        <input
          placeholder="Title"
          name="title"
          autoFocus={true}
          onChange={(e) => setTitleState(e.target.value)}
          value={titleState}
          required
        />
        <input
          placeholder="Description"
          name="description"
          onChange={(e) => setDescriptionState(e.target.value)}
          value={descriptionState}
          required
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
