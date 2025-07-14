import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/_layouts/main";
import { LoginPage } from "./pages/login";
import { AuthLayout } from "./components/_layouts/auth";
import { Home } from "./pages/home";
import { Aplicativos } from "./pages/aplicativos";
import { SistemaPage } from "./pages/sistema";
import { AlterarSenha } from "./pages/alterarSenha";
import { UsuariosPage } from "./pages/usuarios";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/aplicativos/:id/usuarios", element: <Aplicativos /> },
      { path: "/sistema", element: <SistemaPage /> },
      { path: "/usuarios", element: <UsuariosPage /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/first-login", element: <AlterarSenha /> },
    ],
  },
]);
