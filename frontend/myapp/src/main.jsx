import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router';
import './index.css'
import App from './App.jsx'
import { Route } from 'lucide-react';

const router = createBrowserRouter(
  [
    {
    path: "/",
    element: App,
  },
  ]
);
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
