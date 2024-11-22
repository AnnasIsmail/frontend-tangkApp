import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  useMaterialTailwindController,
  setOpenSidenav,
  setRoleNow,
} from '@/context';

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, roleNow, user } = controller;
  const navigate = useNavigate();
  const sidenavRef = useRef(null); // Gunakan ref untuk elemen Sidenav

  const sidenavTypes = {
    dark: 'bg-gradient-to-br from-gray-800 to-gray-900',
    white: 'bg-white shadow-sm',
    transparent: 'bg-transparent',
  };

  const handleChangeRole = (newRole) => {
    navigate('/dashboard/home');
    setRoleNow(dispatch, newRole);
  };

  // Fungsi untuk mendeteksi klik di luar sidenav
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidenavRef.current && !sidenavRef.current.contains(event.target)) {
        setOpenSidenav(dispatch, false); // Tutup sidenav
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  return (
    <aside
      ref={sidenavRef} // Tambahkan referensi pada elemen Sidenav
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? 'translate-x-0' : '-translate-x-80'
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === 'dark' ? 'white' : 'blue-gray'}
          >
            {brandName}
          </Typography>
        </Link>
        {/* <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton> */}
      </div>
      <div className="m-4">
        <div className="mb-4">
          <Typography
            variant="small"
            color={sidenavType === 'dark' ? 'white' : 'blue-gray'}
            className="font-medium uppercase mb-2"
          >
            Role
          </Typography>
          <Select
            value={roleNow}
            onChange={(value) => handleChangeRole(value)}
            className="text-white"
          >
            {user.role.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </div>

        {routes.map(
          ({ layout, title, pages }, key) =>
            title !== 'auth pages' && (
              <ul key={key} className="mb-4 flex flex-col gap-1">
                {title && (
                  <li className="mx-3.5 mt-4 mb-2">
                    <Typography
                      variant="small"
                      color={sidenavType === 'dark' ? 'white' : 'blue-gray'}
                      className="font-black uppercase opacity-75"
                    >
                      {title}
                    </Typography>
                  </li>
                )}
                {pages.map(
                  ({ icon, name, path, role }) =>
                    (!role || role === roleNow) && (
                      <li key={name}>
                        <NavLink to={`/${layout}${path}`}>
                          {({ isActive }) => (
                            <Button
                              variant={isActive ? 'gradient' : 'text'}
                              color={
                                isActive
                                  ? sidenavColor
                                  : sidenavType === 'dark'
                                  ? 'white'
                                  : 'blue-gray'
                              }
                              className="flex items-center gap-4 px-4 capitalize"
                              fullWidth
                            >
                              {icon}
                              <Typography
                                color="inherit"
                                className="font-medium capitalize"
                              >
                                {name}
                              </Typography>
                            </Button>
                          )}
                        </NavLink>
                      </li>
                    )
                )}
              </ul>
            )
        )}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: '/img/TangkApp_logo_pattern.png',
  brandName: 'TangkApp',
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = '/src/widgets/layout/sidenav.jsx';

export default Sidenav;
