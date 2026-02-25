import { StrictMode } from "react";
import "./globals.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import UseQueryContext from "./context/use-query.context";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex flex-col w-full h-screen items-center justify-center">
        Hello World
      </div>
    ),
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <UseQueryContext>
      <RouterProvider router={router} />,
    </UseQueryContext>
  </StrictMode>,
);
