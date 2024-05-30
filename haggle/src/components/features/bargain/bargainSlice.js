import { createSlice } from '@reduxjs/toolkit';

export const bargainSlice = createSlice({
    name: 'bargain',
    initialState: {
        value: 0,
    },
    reducers: {
        changeOfferi: (state) => {
            state.value += 1
        },

    },
})

export const { changeOfferi } = bargainSlice.actions
export default bargainSlice.reducer