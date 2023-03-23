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
import { Products } from './pages/products';
import { CategoriesPage } from './pages/categories';
import { OrderDetailsPage } from './pages/order-details';
import ErrorPage from './pages/error-page';

export const queryClient = new QueryClient()

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
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
      {
        path: "order/:orderId",
        element: <OrderDetailsPage />
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
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