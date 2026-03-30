import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'user';

interface UserState {
  userId: string | null;
  email: string | null;
  role: UserRole | null;
}

const initialState: UserState = {
  userId: null,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ userId: string; email: string; role: UserRole }>,
    ) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser: state => {
      state.userId = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
