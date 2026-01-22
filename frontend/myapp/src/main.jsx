import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import './index.css'
import App from './App.jsx'
import { Route } from 'lucide-react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import HomePage from './pages/HomePage';
import AuthenticationPage from './pages/AuthenticationPage';
import { store } from './app/store';
import PrivateRoute from './components/auth/PrivateRoute';
import IdeaGeneratorPage from './pages/IdeaGeneratorPage';
import Logout from './components/auth/Logout';
import SavedIdeasPage from './pages/SavedIdeasPage';
const router = createBrowserRouter([
  {
    element: <PrivateRoute />, //PROTECTED AREA
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/generate/idea", element: <IdeaGeneratorPage/>},
          { path: "/my/ideas", element: <SavedIdeasPage/> } 
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthenticationPage />,
    children: [
      { index: true, element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "logout", element: <Logout/>}
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    
  </StrictMode>,
)
