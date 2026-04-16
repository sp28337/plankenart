export interface NavLink {
  href: string;
  label: string;
}

/** Main site navigation — single source of truth for Header, Mobile menu, and Footer. */
export const navLinks: NavLink[] = [
  { href: '/about',     label: 'О нас'     },
  { href: '/#services', label: 'Услуги'    },
  { href: '/objects',   label: 'Объекты'   },
  { href: '/oils',      label: 'Масло'     },
  { href: '/materials', label: 'Материалы' },
  { href: '/tags',      label: 'Темы'      },
  { href: '#contacts',  label: 'Контакты'  },
];

/** Footer navigation — slightly different set (no hash anchors, has tags). */
export const footerLinks: NavLink[] = [
  { href: '/about',     label: 'О нас'     },
  { href: '/#services', label: 'Услуги'    },
  { href: '/objects',   label: 'Объекты'   },
  { href: '/oils',      label: 'Масло'     },
  { href: '/materials', label: 'Материалы' },
  { href: '/tags',      label: 'Темы'      },
];
