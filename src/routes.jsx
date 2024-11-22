import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CameraIcon
} from "@heroicons/react/24/solid";
import { Home, Tables, PetugasUkur, PetugasSPS, Users, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import ScanQR from "./pages/dashboard/scanQR";
import DetailBerkas from './pages/dashboard/detailBerkas';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

export const routes = [
  {
    layout: 'dashboard',
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: 'dashboard',
        path: '/home',
        element: <Home />,
      },
      {
        icon: <CameraIcon {...icon} />,
        name: 'Scan QR',
        path: '/scanQR',
        element: <ScanQR />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: 'Berkas Saya',
        path: '/berkas',
        element: <Tables />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: 'Petugas Ukur',
        path: '/petugas-ukur',
        element: <PetugasUkur />,
        role: 'Admin',
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: 'Petugas SPS',
        path: '/petugas-sps',
        element: <PetugasSPS />,
        role: 'Admin',
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: 'Users',
        path: '/users',
        element: <Users />,
        role: 'Admin',
      },
      {
        hide: true,
        path: '/berkas/:id',
        element: <DetailBerkas />,
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
    ],
  },
  {
    title: 'auth pages',
    layout: 'auth',
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: 'sign in',
        path: '/sign-in',
        element: <SignIn />,
      },
      // },
      // {
      //   icon: <RectangleStackIcon {...icon} />,
      //   name: "sign up",
      //   path: "/sign-up",
      //   element: <SignUp />,
      // },
    ],
  },
];

export default routes;
