import { createBrowserRouter } from "react-router";
import { HomeLayout } from "../routes/home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
  },
]);
