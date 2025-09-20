import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/home";
import { RedirectPage } from "./pages/redirect";
import { NotFoundPage } from "./pages/not-found";
import { RootLayout } from "./pages/layouts/root-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/:code",
        element: <RedirectPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
