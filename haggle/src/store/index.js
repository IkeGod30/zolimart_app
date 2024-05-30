import { configureStore } from '@reduxjs/toolkit';
// import bargainSlice from '../components/features/bargain/bargainSlice';
import bargainReducer from '../components/features/bargain/bargainSlice'

const store = configureStore({
    reducer: {
        bargain: bargainReducer,
        
    },
})

export { store }