import {
  UsersRound,
  HandPlatter,
  Axe,
  Scan,
  Droplet,
  Fence,
  PhoneOutgoing,
} from "@lucide/astro";

type IconComponent = typeof UsersRound;

export interface NavLink {
  href: string;
  label: string;
  SvgIcon?: IconComponent;
}

export const navLinks: NavLink[] = [
  { href: "/about", label: "О нас", SvgIcon: UsersRound },
  { href: "/#services", label: "Услуги", SvgIcon: HandPlatter },
  { href: "/obrabotka-doski", label: "Обработка доски", SvgIcon: Axe },
  { href: "/objects", label: "Объекты", SvgIcon: Scan },
  { href: "/oils", label: "Масло", SvgIcon: Droplet },
  { href: "/materials", label: "Материалы", SvgIcon: Fence },
  { href: "#contacts", label: "Контакты", SvgIcon: PhoneOutgoing },
];

/** Footer navigation — slightly different set (no hash anchors, has tags). */
export const footerLinks: NavLink[] = [
  { href: '/about',           label: 'О нас'          },
  { href: '/#services',       label: 'Услуги'         },
  { href: '/obrabotka-doski', label: 'Обработка доски'},
  { href: '/objects',         label: 'Объекты'        },
  { href: '/oils',            label: 'Масло'          },
  { href: '/materials',       label: 'Материалы'      },
];
