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
    title: "Pessoas",
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
