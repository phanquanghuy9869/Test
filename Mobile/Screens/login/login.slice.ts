import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthsApi } from "../../api/endpoints";
import { RootState } from "../../app/store";
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthSate {
  isLogin: boolean;
  username: string | null;
  pending: boolean;
}
const initialState: AuthSate = {
  isLogin: false,
  username: null,
  pending: false,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (
    {
      username,
      password,
      remember,
    }: { username: string; password: string; remember: boolean },
    thunkApi
  ) => {
    const response = await AuthsApi.login(username, password, remember);
    if (response.status === 404) {
      return thunkApi.rejectWithValue("User không tồn tại!");
    }
    if (response.status === 401) {
      return thunkApi.rejectWithValue("User không hợp lệ!");
    }
    if (response.status !== 200) {
      return thunkApi.rejectWithValue(response.status);
    }
    return response.data;
  }
);

export const persistToken = createAsyncThunk(
  "persistToken",
  async ({
    accessToken,
    refreshToken
  }: { accessToken: string, refreshToken: string }) => {
    await AsyncStorage.setItem('@accessToken', accessToken);
    await AsyncStorage.setItem('@refreshToken', refreshToken);
  }
)

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMessage: (state, action: PayloadAction<boolean>) => {
      // state.messageVisible = action.payload;
    },
    resetAuthState: (state) => {
      state = initialState;
    },
    loginSuccess: (state, action) => {
      const payload = action.payload;
      state.username = payload.userName;
      state.pending = false;
      state.isLogin = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.pending = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        // state.token = action.payload?.accessToken;
        state.username = action.meta.arg.username;
        state.pending = false;
        state.isLogin = true;
        // state.messageVisible = true;
        // state.messageContent = "Đăng nhập thành công, redirecting ... ";
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.pending = false;
        state.isLogin = false;
        // state.messageVisible = true;
        // state.messageContent = action.error.message as string;
      });
  },
});

export const { toggleMessage, resetAuthState, loginSuccess } = authSlice.actions;

// export const selectMessageContent = (state: RootState) =>
//   state.auth.messageContent;
// export const selectMessageVisible = (state: RootState) =>
//   state.auth.messageVisible;
export const selectIsLogin = (state: RootState) => state.auth.isLogin;
export const selectUserName = (state: RootState) => state.auth.username;
// export const selectToken = (state:RootState) => state.auth.token;

export default authSlice.reducer;
