import React, { useReducer, useEffect } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // You might check if the user has a valid token or session here
        // For example, you can call a method from your SDK to verify the token
        const isAuthenticated = await sdk.checkAuthentication();
    
        if (isAuthenticated) {
          // If authenticated, you might fetch user data, token, and role from the SDK
          const userData = await sdk.fetchUserData();
          const authToken = sdk.getAuthToken();
          const userRole = sdk.getUserRole();
    
          // Dispatch LOGIN action with user data, token, and role
          dispatch({ type: 'LOGIN', payload: { user: userData, token: authToken, role: userRole }});
        } else {
          // If not authenticated, dispatch logout action
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
