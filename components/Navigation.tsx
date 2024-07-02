import Link from "next/link";

const links = [
  { href: "/cabins", label: "Cabins" },
  { href: "/about", label: "About" },
  { href: "/account", label: "Guest area" },
];

export default function Navigation() {
  return (
    <nav className="z-10 text-xl mt-3">
      <ul className="flex gap-16 items-center">
        {links.map(({ href, label }) => (
          <li key={`${href}`}>
            <Link
              href={href}
              className="hover:text-accent-400 hover:underline transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
