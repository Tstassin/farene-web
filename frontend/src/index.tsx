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
import { AdminProtected, AdminProtectedOutlet, Protected } from './components/auth/authenticated';
import { Layout } from './components/layout';
import { ResetPassword } from './components/auth/reset-password';
import { ExportPage } from './pages/export';
import { PromoteUserPage } from './pages/promote';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { AdminPage } from './pages/admin-page';
import { Orders } from './pages/orders';
import { PlacesPage } from './pages/places';
import { DeliveryOptionsPage } from './pages/delivery-options';

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
      /* {
        path: "/order",
        element: <Protected><Order /></Protected>,
      },*/
      {
        path: "/order/:orderId",
        element: <Protected><OrderDetailsPage /></Protected>
      }, 
      {
        path: "/admin",
        element: <AdminProtectedOutlet />,
        children: [
          {
            path: '/admin/',
            element: <AdminPage />
          },
          {
            path: "/admin/products",
            element: <AdminProtected><Products /></AdminProtected>,
          },
          {
            path: "/admin/categories",
            element: <AdminProtected><CategoriesPage /></AdminProtected>,
          },
          {
            path: "/admin/places",
            element: <AdminProtected><PlacesPage /></AdminProtected>,
          },
          {
            path: "/admin/delivery-options",
            element: <AdminProtected><DeliveryOptionsPage /></AdminProtected>,
          },
          {
            path: "/admin/export",
            element: <AdminProtected><ExportPage /></AdminProtected>,
          },
          {
            path: "/admin/promote",
            element: <AdminProtected><PromoteUserPage /></AdminProtected>,
          },
          {
            path: "orders",
            element: <AdminProtected><Orders /></AdminProtected>,
          },
        ]
      },
    ]
  }
]);

const container = document.getElementById("app");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript


root.render(
  <QueryClientProvider client={queryClient}>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </QueryClientProvider>
);