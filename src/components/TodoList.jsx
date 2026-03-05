import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosClient from '../api/axios';  // Import your secure Axios instance

/**
 *
 * @param todos
 * @param setTodos
 * @param settodoUpdate
 * @returns {*}
 * @constructor
 */
export default function TodoList({onRefresh, todos,setTodos,settodoUpdate, todosAdd }) {

    if ( todosAdd.length === 0 ) return <p>No Todos yet!</p>
    // Handle drag end
    const handleDragEnd = result => {
        if (!result.destination) return; // dropped outside the list
        const items = Array.from(todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTodos(items);
    };

    /**
     *
     * @param todo
     */
    function handleToggle(todo) {
        // setTodos(prev =>
        //     prev.map(todo =>
        //         todo.id === todo.id
        //             ? { ...todo, completed: !todo.completed }
        //             : todo
        //     )
        // );
        // setTodos(prev =>
        //     prev.filter(todo =>
        //         todo.id !== id
        //     )
        // );

        settodoUpdate(todo);
    }

    const handleDelete = async (id) => {
    try {
                    // 1. Initialize the session/cookie handshake
                    await axiosClient.get('/sanctum/csrf-cookie');
                    // Axios automatically parses the JSON response
                    const response = await axiosClient.delete(`/api/todos/${id}`);
                    onRefresh();

                } catch (err) {
                    console.error("Error creating todo:", err.response?.data);
                    alert("Validation Error: " + err.response?.data?.message);
                }
        };


    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="todos">
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ padding: 0, listStyle: "none" }}
                        >
                            {todosAdd.map((todo, index) => (
                                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                    {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                padding: "10px",
                                                marginBottom: "8px",
                                                backgroundColor: snapshot.isDragging ? "#ddd" : "#f0f0f0",
                                                borderRadius: "4px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                ...provided.draggableProps.style
                                            }}
                                        >
                      <span
                          onClick={() => handleToggle(todo)}
                          style={{
                              textDecoration: todo.completed ? "line-through" : "none",
                              cursor: "pointer",color:"black"
                          }}
                      >
                        {todo.title}
                      </span>
                                            <button onClick={() => handleDelete(todo.id)}>Delete</button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

        </div>
    )

}