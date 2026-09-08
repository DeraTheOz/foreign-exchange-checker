import { createBrowserRouter } from "react-router";
import { HomeLayout } from "../routes/home";
import { ErrorPage } from "../routes/error";
import { NotFoundPage } from "../routes/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
