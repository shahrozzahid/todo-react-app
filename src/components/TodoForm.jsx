import {useEffect, useState} from "react";
import axiosClient from '../api/axios';  // Import your secure Axios instance

/**
 *
 * @param addTodo
 * @param todoUpdate
 * @returns {*}
 * @constructor
 */
function TodoForm({onRefresh, addTodo, todoUpdate, dispatch,todosAdd, todosapi}) {

    const [InputValue, setInputValue] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!InputValue.trim()) return;
      const newTodo = {
            id        : (todoUpdate.id) ? todoUpdate.id : Date.now(),
            text      : InputValue,
            completed : (todoUpdate.completed) ? todoUpdate.completed : false
        };
    const newTodoData = {
            title: InputValue,
            completed: false
        };
        // addTodo(newTodo);
        try {
           await axiosClient.get('/sanctum/csrf-cookie');
        // Send POST request with the data object
        let response;
        if (todoUpdate.id) {
            // Use backticks ` and ${}
            response = await axiosClient.put(`/api/todos/${todoUpdate.id}`, newTodoData);

        } else {
            response = await axiosClient.post('/api/todos', newTodoData);
        }

        if (response.data.status) {
            // Update the UI immediately by adding the new todo to the existing state
            // dispatch({ type: "add_success", payload: response.data?.data || [] });
            // addTodo([...todosapi, response.data?.data || []]);
            setInputValue(""); // Clear input field
            onRefresh();
        }
    } catch (error) {
        console.error("Error creating todo:", error.response?.data);
        alert("Validation Error: " + error.response?.data?.message);
    }
        setInputValue("");

    };

    useEffect(() => {
        if (todoUpdate) {
            setInputValue(todoUpdate.title); // initialize input
        }
    }, [todoUpdate]);


return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h1>Todo App with Drag & Drop</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Todo:
                <input
                    type="text"
                    value={InputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </label>
            <button type="submit">Add</button>
        </form>
    </div>
)
}

export default TodoForm