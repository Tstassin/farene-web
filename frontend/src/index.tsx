import { createRoot } from 'react-dom/client';
import { Home } from "./home";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Register } from "./components/auth/register";
import { Login } from "./components/auth/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from '@chakra-ui/react'
import { Order } from './pages/order';
import { Products } from './pages/products';
import { CategoriesPage } from './pages/categories';
import { OrderDetailsPage } from './pages/order-details';
import ErrorPage from './pages/error-page';
import { client } from '../api/api';
import { AdminProtected, Protected } from './components/auth/authenticated';
import { Layout } from './components/layout';
import { ResetPassword } from './components/auth/reset-password';
import { ExportPage } from './pages/export';
import { PromoteUserPage } from './pages/promote';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';

export const queryClient = new QueryClient()

export const router = createBrowserRouter([
  {
    element: <Layout />,
    loader: async () => {
      const auth = await client.authentication.reAuthenticate().catch(console.error)
      if (auth) queryClient.setQueryData(['authentication'], auth)
      return auth?.user || null
    },
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/order",
        element: <Protected><Order /></Protected>,
      },
      {
        path: "/order/:orderId",
        element: <Protected><OrderDetailsPage /></Protected>
      },
      {
        path: "/products",
        element: <AdminProtected><Products /></AdminProtected>,
      },
      {
        path: "/categories",
        element: <AdminProtected><CategoriesPage /></AdminProtected>,
      },
      {
        path: "/export",
        element: <AdminProtected><ExportPage /></AdminProtected>,
      },
      {
        path: "/promote",
        element: <AdminProtected><PromoteUserPage /></AdminProtected>,
      },
    ]
  }
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