import {
  Users,
  Settings,
  LogOut,
  ListChecks,
  CalendarSync,
  TicketCheckIcon,
  NotepadText,
  NotepadTextDashed,
  Notebook,
} from "lucide-react";
import { Chart } from "../../svg/chart";
import { invertedChart } from "../../svg/invertedChart";

export const menuItems = [
  {
    title: "Dashboard",
    icon: Chart,
    href: "/",
  },
  {
    title: "Central Serviços Tomados",
    icon: invertedChart,
    href: "/servicos-tomados",
  },
  {
    title: "Serviços",
    icon: ListChecks,
    href: "/servicos",
  },
  {
    title: "Documentos Cadastrais",
    href: "/documentos-cadastrais",
    icon: Notebook,
    rules: ["admin", "tomador"],
  },
  {
    title: "Planejamento",
    href: "/planejamento",
    icon: CalendarSync,
  },
  {
    title: "Clientes e prestadores",
    icon: Users,
    href: "/pessoas",
  },
  {
    title: "Configurações",
    icon: Settings,
    subLinks: [
      {
        title: "Usuários",
        href: "/usuarios",
      },
      {
        title: "Listas",
        href: "/listas",
      },
      {
        title: "Registros",
        href: "/registros",
      },
      {
        title: "Sistema",
        href: "/sistema",
      },
      {
        title: "Etapas",
        href: "/etapas",
      },
      {
        title: "Assistentes",
        href: "/assistentes",
      },
      {
        title: "Doc",
        href: "/doc",
      },
    ],
  },
];
