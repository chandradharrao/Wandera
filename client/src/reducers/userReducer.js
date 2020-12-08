export const initialState = null;

export const reducer = (state, action) => {
    if (action.type === "USER") {
        return action.payload;
    }
    /* When the user logs out and the session history is cleared */
    if (action.type === "CLEAR") {
        return null;
    }
    if(action.type === "UPDATEPIC"){
        return {
            ...state,
            pic:action.payload
        }
    }
    return state;
}
