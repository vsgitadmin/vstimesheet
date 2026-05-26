import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice= createSlice({
    name: "auth",

    initialState: {
        "token":null,
        "loggedin":false
    },

    reducers: {
        addUser: (state, action) => {
            state.token=action.payload.token
            state.loggedin=true
        },
        logout:(state,action)=>{
            state.user=null
            state.loggedin=false
        }
    }
})

export const {addUser,logout}=AuthSlice.actions
export default AuthSlice.reducer