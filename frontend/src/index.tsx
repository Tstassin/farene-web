import { createRoot } from 'react-dom/client';
import { App } from "./app";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Me } from "./pages/me";
import { Register } from "./components/auth/register";
import { Login } from "./components/auth/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from '@chakra-ui/react'
import { Logout } from './components/auth/logout';
import { Order } from './pages/order';

export const queryClient = new QueryClient()

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "me",
        element: <Me />,
      },
      {
        path: "order",
        element: <Order />,
      },
    ],
  },
]);

const container = document.getElementById("app");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript


root.render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </QueryClientProvider>
);