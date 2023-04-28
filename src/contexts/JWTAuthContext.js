import { createContext, useReducer } from 'react';
import axios from 'axios';
// import { verify, JWT_SECRET } from 'src/utils/jwt';
import PropTypes from 'prop-types';

const initialAuthState = {
  isAuthenticated: false,
  isVisitor:false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isVisitor: false,
      user
    };
  },
  VISITOR_LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: false,
      isVisitor: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    isVisitor: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isVisitor: false,
      user
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  visitorLogin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {

  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       const accessToken = window.localStorage.getItem('accessToken');

  //       if (accessToken && verify(accessToken, JWT_SECRET)) {
  //         setSession(accessToken);

  //         const response = await axios.get('/api/account/personal');
  //         const { user } = response.data;

  //         dispatch({
  //           type: 'INITIALIZE',
  //           payload: {
  //             isAuthenticated: true,
  //             user
  //           }
  //         });
  //       } else {
  //         dispatch({
  //           type: 'INITIALIZE',
  //           payload: {
  //             isAuthenticated: false,
  //             user: null
  //           }
  //         });
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       dispatch({
  //         type: 'INITIALIZE',
  //         payload: {
  //           isAuthenticated: false,
  //           user: null
  //         }
  //       });
  //     }
  //   };

  //   initialize();
  // }, []);

  const login = async (username, password) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/sign-in`, {
      username,
      password
    });

    setSession(response.data.token);
    // delete response.data.token;
    // delete response.data.type;
    dispatch({
      type: 'LOGIN',
      payload: {
        user: response.data
      }
    });

  };

  const visitorLogin = async () => {
    setSession(null);
    dispatch({
      type: 'VISITOR_LOGIN',
      payload: {
        user: null
      }
    });

  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, username, password) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/sign-up`, {
      email,
      name,
      username,
      password
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        visitorLogin,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
