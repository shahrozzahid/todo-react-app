import {useEffect, useState, useReducer} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TodoForm from  './components/TodoForm'
import TodoList from  './components/TodoList'
import {todoReducer, initialState} from './components/todoReducer'
import axiosClient from './api/axios';  // Import your secure Axios instance

/**
 *
 * @returns {*}
 * @constructor
/**
 *
 *
 * @return {*}
 */
function App() {

  const [todosAdd, dispatch] = useReducer(todoReducer, initialState);

  const [count, setCount]           = useState(0);
  const [todos, setTodos]           = useState(() => {
        const saved = localStorage.getItem("todos");
        return saved ? JSON.parse(saved) : todosAdd;
    });
  const [todoUpdate, settodoUpdate] = useState([]);
  const [darkMode, setDarkMode]     = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });
  const [filter, setFilter]         = useState("all"); // all, completed, pending
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTodosList, setFilteredTodosList] = useState(todos);

  const [todosapi, setTodosapi]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

    /**
     *
     * @param todo
     */
  const addTodo = (todo) => {
        setTodos(prev => {
            const exists = prev.some(t => t.id === todo.id);

            if (exists) {
                // UPDATE
                settodoUpdate([]);
                return prev.map(t =>
                    t.id === todo.id ? todo : t
                );
            } else {
                // ADD
                return [...prev, todo];
            }
        });
    };

    // const filteredTodos = todos.filter(todo => {
    //     if (filter === "all") return true;
    //     if (filter === "completed") return todo.completed;
    //     if (filter === "pending") return !todo.completed;
    // });


    useEffect(() => {
       localStorage.setItem("todos", JSON.stringify(todos));
        // console.log(todos)
    }, [todos]);
    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    // useEffect(() => {
    //     setFilteredTodosList(
    //         todos.filter(todo =>
    //             // todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    //             todo.title?.toLowerCase().includes(searchTerm.toLowerCase())
    //         )
    //     );
    // }, [todos, searchTerm]);

 const fetchTodos = async () => {
            try {
                // 1. Initialize the session/cookie handshake
                await axiosClient.get('/sanctum/csrf-cookie');
                // Axios automatically parses the JSON response
                const response = await axiosClient.get('/api/todos');
                setTodosapi(response.data?.data || []);
                setLoading(false);
                settodoUpdate([]);
            } catch (err) {
                setError("Failed to fetch todos. Please try again later.");
                setLoading(false);
            }
        };
    useEffect(() => {
        fetchTodos();
    }, []); // Empty array ensures this runs only once when component mounts


    if (loading) return <p>Loading todos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{
        backgroundColor: darkMode ? "#121212" : "#f0f0f0",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "20px",
        transition: "all 0.3s ease"
    }}>
        <button onClick={() => setDarkMode(prev => !prev)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <h1>Todo App {darkMode ? "(Dark Mode)" : "(Light Mode)"}</h1>
        <div style={{ marginTop: "20px" }}>
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("completed")}>Completed</button>
            <button onClick={() => setFilter("pending")}>Pending</button>
        </div>
        <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      <TodoForm onRefresh={fetchTodos} addTodo = {setTodosapi} todoUpdate={todoUpdate} dispatch={dispatch} todosAdd={todosAdd} todosapi={todosapi} ></TodoForm>
      <TodoList onRefresh={fetchTodos}  todos = {filteredTodosList} setTodos={setTodos} settodoUpdate={settodoUpdate} todosAdd={todosapi}></TodoList>

      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
        <div>
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
        </div>
    </div>
  )
}

export default App
