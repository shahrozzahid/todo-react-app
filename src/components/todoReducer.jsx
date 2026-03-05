

export const initialState = [];

export function todoReducer(state, action) {
    switch (action.type) {
        case "add":
            return {title: action.payload, completed : action.completed };
        case "delete":
            return state.filter(todo => todo.id !== action.payload);
        case "update":
            return state.map(todo =>
                todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
            );
        default:
            return state;
    }
}
