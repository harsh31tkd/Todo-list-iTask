// import React hooks for state and lifecycle
import { useState, useEffect } from "react";
// your top navigation component
import Navbar from "./components/Navbar";
// icons for edit/delete buttons
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
// UUID generator for unique todo IDs
import { v4 as uuidv4 } from "uuid";

function App() {                              // start of the App component
  const [todo, setTodo] = useState("");       // single input text state (controlled input)
  const [todos, setTodos] = useState([]);     // array of todo objects [{id, text, isCompleted}]
  const [showFinished, setShowFinished] = useState(true); // toggle to show/hide completed items

  // run once on mount: load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos"); // read raw string from localStorage
    if (savedTodos) {                                  // if something was saved earlier
      setTodos(JSON.parse(savedTodos));               // parse JSON and put into state
    }
  }, []); // empty deps => runs only once after first render

  // persist todos to localStorage whenever `todos` changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos)); // save current todos as JSON string
  }, [todos]); // effect depends on `todos`

  const toggleFinished = (e) => {                 // handler for the "Show Finished" checkbox
    setShowFinished(e.target.checked);            // update the flag based on checkbox value
  };

  const handleAdd = () => {                       // handler for the Save button
    if (todo.trim() === "") return;               // ignore empty/whitespace-only input

    // append a new todo object with unique id and default isCompleted=false
    setTodos([...todos, { id: uuidv4(), text: todo, isCompleted: false }]);
    setTodo("");                                  // clear the input box
  };

  const handleDelete = (id) => {                  // delete a todo by id
    setTodos(todos.filter((item) => item.id !== id)); // keep all except the one to delete
  };

  const handleEdit = (id) => {                    // "edit" by moving text back to the input
    const t = todos.find((item) => item.id === id); // find the todo to edit
    if (!t) return;                                 // safety: if not found, do nothing
    setTodo(t.text);                                // put its text into input field for editing
    setTodos(todos.filter((item) => item.id !== id)); // remove old version from the list
  };

  const handleToggle = (id) => {                  // flip completion status of a todo
    setTodos(
      todos.map((item) =>
        item.id === id
          ? { ...item, isCompleted: !item.isCompleted } // toggle isCompleted for this item
          : item                                        // leave others unchanged
      )
    );
  };

  const handleChange = (e) => {                   // controlled input onChange
    setTodo(e.target.value);                      // update input text state
  };

  return (                                        // JSX UI returns here
    <>
      <Navbar />                                  {/* top bar component */}

      {/* main card/container */}
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        {/* title */}
        <h1 className="font-bold text-center text-3xl">
          iTask - Manage your todos at one place
        </h1>

        {/* input section */}
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex">
            {/* controlled text input bound to `todo` */}
            <input
              onChange={handleChange}               // updates `todo` as you type
              value={todo}                          // current text value
              type="text"
              className="w-full rounded-full px-5 py-1 border-2 border-gray-300"
              placeholder="Enter your todo here..."
            />
            {/* add button; disabled for very short text */}
            <button
              onClick={handleAdd}                   // creates/append a new todo
              disabled={todo.length <= 3}           // basic validation (min length 4)
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>

        {/* show finished toggle */}
        <div className="flex items-center mb-3">
          <input
            onChange={toggleFinished}               // toggles visibility of completed todos
            type="checkbox"
            checked={showFinished}                  // controlled by `showFinished` state
            className="mr-2"
          />
          <label>Show Finished Todos</label>
        </div>

        {/* thin divider */}
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>

        {/* list header */}
        <h2 className="text-2xl font-bold">Your Todos</h2>

        {/* todos list container */}
        <div className="todos space-y-2">
          {/* empty state message */}
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}

          {/* render todos; optionally hide completed when showFinished=false */}
          {todos
            .filter((item) => showFinished || !item.isCompleted) // if not showing finished, drop completed
            .map((item) => (                                   // map each todo to a row
              <div
                key={item.id}                                  // react list key
                className="todo flex items-center justify-between bg-white p-2 rounded-md shadow"
              >
                {/* left side: checkbox + text */}
                <div className="flex gap-5 items-center">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}                  // checkbox reflects completion
                    onChange={() => handleToggle(item.id)}      // toggles completion
                  />
                  <div
                    className={
                      item.isCompleted ? "line-through text-gray-500" : "" // style completed text
                    }
                  >
                    {item.text}                                  {/* todo text */}
                  </div>
                </div>

                {/* right side: action buttons */}
                <div className="buttons flex h-full items-center">
                  <button
                    onClick={() => handleEdit(item.id)}          // moves text back to input to edit
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <FaEdit />                                    {/* edit icon */}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}         // removes the todo
                    className="bg-red-600 hover:bg-red-800 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <AiFillDelete />                              {/* delete icon */}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App; // export default so other files (main.jsx) can render it
