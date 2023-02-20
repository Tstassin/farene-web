import { createRoot } from 'react-dom/client';
import { App } from "./app";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Me } from "./pages/me";
import { Register } from "./components/auth/register";
import { Login } from "./components/auth/login";
import { client } from "../api/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from '@chakra-ui/react'
import { FeathersError } from "@feathersjs/errors/lib";

const queryClient = new QueryClient()

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      try {
        await client.authentication.reAuthenticate()
        return null
      }
      catch (error_) {
        const error = (error_ as FeathersError).toJSON()
        if (error.code === 401) {
          // Not authenticated, user is simply logged out
          return null
        }
        throw error_
      }
    },
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
        path: "me",
        element: <Me />,
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