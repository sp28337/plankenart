export interface NavLink {
  href: string;
  label: string;
}

/** Main site navigation — single source of truth for Header, Mobile menu, and Footer. */
export const navLinks: NavLink[] = [
  { href: '/about',     label: 'О нас'     },
  { href: '/#services', label: 'Услуги'    },
  { href: '/materials', label: 'Материалы' },
  { href: '/objects',   label: 'Объекты'   },
  { href: '/#contacts', label: 'Контакты'  },
  { href: '/tags',      label: 'Теги'      },
];

/** Footer navigation — slightly different set (no hash anchors, has tags). */
export const footerLinks: NavLink[] = [
  { href: '/about',     label: 'О нас'     },
  { href: '/#services', label: 'Услуги'    },
  { href: '/materials', label: 'Материалы' },
  { href: '/objects',   label: 'Объекты'   },
  { href: '/tags',      label: 'Теги'      },
];
