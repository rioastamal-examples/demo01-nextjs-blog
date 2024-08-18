import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

function PageMenu({ menus, currentPage }) {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  console.log('PageMenu menus =>', menus);
  let [defaultMenus, setDefaultMenus] = useState(menus);

  useEffect(() => {
    console.log('menus =>', menus);
    console.log('authStatus =>', authStatus);
    if (authStatus === 'configuring') {
      return undefined;
    }
    
    if (authStatus === 'unauthenticated') {
      // Add Sign In menu to the defaultMenuData
      defaultMenus = menus.slice();
      defaultMenus.push({
        href: '/login',
        label: 'Sign in',
      });
      setDefaultMenus(defaultMenus);

      console.log('useEffect unauthenticated =>', defaultMenus);

      return undefined;
    }

    if (authStatus === 'authenticated') {
      // Add Sign out menu to the defaultMenuData
      defaultMenus = menus.slice();
      const loggedInMenus = [
        { 'href': '#', 'label': ' | ' },
        { 'href': '/admin/profile', 'label': 'Profile' },
        { 'href': '/admin/posts/write', 'label': 'Write' },
        { 'href': '/admin/posts', 'label': 'My Posts' },
        { 'href': '/admin/media/upload', 'label': 'Media' },
        { 'href': '/logout', 'label': 'Sign out' },
      ];
      setDefaultMenus([...defaultMenus, ...loggedInMenus]);

      console.log('useEffect authenticated =>', defaultMenus);

      return undefined;
    }
  }, [authStatus]);

  return (
    <div className="nx-flex nx-grow nx-flex-wrap nx-items-center nx-justify-end nx-gap-3">
      {defaultMenus.map((menu) => (
        currentPage === menu.href ? (
          <span key={menu.href} className="nx-cursor-default dark:nx-text-gray-400 nx-text-gray-600">{menu.label}</span>
        ) : (
          <a key={menu.href} href={menu.href} className="nx-cursor-pointer">
            {menu.label}
          </a>
        )
      ))}
    </div>
  );
}

const defaultMenuData = [
  { href: '/', label: 'Home' },
  { href: '/photos', label: 'Photos' },
  { href: '/posts', label: 'Posts' },
];

export {
  PageMenu,
  defaultMenuData
};