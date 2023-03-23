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
import { Order } from './pages/order';
import { Products } from './pages/products';
import { CategoriesPage } from './pages/categories';
import { OrderDetailsPage } from './pages/order-details';
import ErrorPage from './pages/error-page';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { client } from '../api/api';
import { Authenticated } from './components/auth/authenticated';

export const queryClient = new QueryClient()

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: async () => {
      const auth = await client.authentication.reAuthenticate().catch(console.error)
      return auth?.user || null
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
        element: <Authenticated><Me /></Authenticated>,
      },
      {
        path: "order",
        element: <Authenticated><Order /></Authenticated>,
      },
      {
        path: "order/:orderId",
        element: <Authenticated><OrderDetailsPage /></Authenticated>
      },
      {
        path: "products",
        element: <Authenticated><Products /></Authenticated>,
      },
      {
        path: "categories",
        element: <Authenticated><CategoriesPage /></Authenticated>,
      },
    ],
  },
]);

const container = document.getElementById("app");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript


root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={true} />
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </QueryClientProvider>
);