import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './States/AuthSlice'

export default configureStore({
    reducer: {
        auth: AuthSlice
    }
})