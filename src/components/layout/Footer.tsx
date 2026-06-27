import Link from "next/link";
import {
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const footerLinks = {
    Product: [
      { href: "/tools", label: "Tool Directory" },
      { href: "/compare", label: "Compare Tools" },
      { href: "/workflow", label: "Workflow Builder" },
      { href: "/tasks", label: "Task Library" },
    ],
    Resources: [
      { href: "/blog", label: "Blog" },
      { href: "/tool-graph", label: "Tool Graph" },
      { href: "/guides", label: "Guides" },
    ],
    Company: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-lg text-text-primary dark:text-white">
                Stack Hub
              </span>
            </Link>
            <p className="text-sm text-text-secondary dark:text-gray-400 max-w-xs">
              Your AI tool decision & workflow platform. Choose, combine, and use AI tools to complete tasks.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary dark:text-gray-400">
            © 2026 AI Stack Hub. All rights reserved.
          </p>
          <p className="text-sm text-text-secondary dark:text-gray-400 flex items-center gap-1">
            Made with <HeartIcon className="w-4 h-4 text-red-500" /> for AI enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
