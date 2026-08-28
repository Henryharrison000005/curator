import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { login,register,logout as apiLogout } from '../../modules/auth/services/authenticationService';

export const Userlogin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try{
        const res = await login(credentials);
        return res;
    }catch(error){
        return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
});

export const UserRegister = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try{
        const res = await register(userData);
        return res;
    }catch(error){
        const d = error.response?.data;
        const validationMsg = d?.errors ? Object.values(d.errors).flat().join(' ') : null;
        return rejectWithValue(d?.message || validationMsg || error.message || 'Registration failed');
    }
});
export const UserLogout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    try{
        await apiLogout();
    }catch{
        // Even if the backend call fails, clear local session state
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(authSlice.actions.clearSession());
    return;
});
let storedUser = null;
let userItem = null;
try{
    userItem = localStorage.getItem('user');
    // Check if it's a valid string before parsing
    if (userItem && userItem !== 'undefined' && userItem !== 'null') {
        storedUser = JSON.parse(userItem);
    }
}
catch(error){
    console.error('Error parsing user from localStorage: ', error.message);
    storedUser = null;
}
const storedToken = localStorage.getItem('token');
// const storedUser = JSON.parse(localStorage.getItem('user'))

const initialState ={
  user:storedUser || null,
  token:storedToken || null,
  isAuthenticated:!!storedToken,
  loading:false,
  loginStatus:'idle',
  error:null
};
const authSlice = createSlice({
    name: 'authReducer',
    initialState,
    reducers:{
         logout:(state)=>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        clearSession:(state)=>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loginStatus = 'idle';
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        }
},
extraReducers: (builder) => {
    builder
  .addCase(Userlogin.pending,(state)=>{
    state.loginStatus = 'loading';
    state.error = null;
  })

  .addCase(Userlogin.fulfilled,(state,action)=>{
  //    if (!action.payload?.token) {
  //       state.loginStatus = "Failed";
  //       state.error = "Invalid credentials";
  //       state.isAuthenticated = false;
  //       return;
  //  }
    state.loginStatus = 'success';
    state.user = action.payload.user;
    state.token = action.payload.token;
    state.isAuthenticated = true;

     localStorage.setItem('user',JSON.stringify(action.payload.user));
     localStorage.setItem('token',action.payload.token);
  })

  .addCase(Userlogin.rejected,(state,action)=>{
    state.loginStatus = 'Failed';
     state.error = action.payload;
      state.isAuthenticated = false;
  })

  .addCase(UserRegister.pending,(state)=>{
    state.loginStatus = 'loading';
    state.error = null;
  })

  .addCase(UserRegister.fulfilled,(state,action)=>{
    state.loginStatus = 'success';
    state.error = null;
    state.isAuthenticated = false;
    state.user = action.payload.user || null;
    state.token = null;
  })

  .addCase(UserRegister.rejected,(state,action)=>{
    state.loginStatus = 'Failed';
     state.error = action.payload;
     state.isAuthenticated = false;
  })
}  
});

export default authSlice.reducer  
export const { logout } =  authSlice.actions 