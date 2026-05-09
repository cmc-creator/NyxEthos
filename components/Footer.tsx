import Logo from "./Logo";

const footerLinks = {
  Product: [
    { label: "Modules", href: "#modules" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About NyxCollective", href: "https://nyxcollectivellc.com" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "mailto:info@nyxethos.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "GDPR", href: "#" },
  ],
  Support: [
    { label: "Documentation", href: "#" },
    { label: "Status Page", href: "#" },
    { label: "Live Chat", href: "#" },
    { label: "Email Support", href: "mailto:info@nyxethos.com" },
  ],
};

export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-nyx-border bg-nyx-surface px-6 py-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block mb-4">
              <Logo size="sm" />
            </a>
            <p className="text-nyx-muted text-sm leading-relaxed mb-4">
              Modular HR software for growing teams. Built by{" "}
              <a
                href="https://nyxcollectivellc.com"
                className="text-nyx-text hover:text-nyx-blue-bright transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                NyxCollective LLC
              </a>
              .
            </p>
            <p className="text-nyx-muted text-xs">
              © {new Date().getFullYear()} NyxCollective LLC.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-nyx-white font-semibold text-sm mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-nyx-muted hover:text-nyx-text text-sm transition-colors duration-200"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-nyx-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-nyx-muted text-xs">
            NyxEthos is a product of NyxCollective LLC &mdash;{" "}
            <a
              href="https://nyxcollectivellc.com"
              className="hover:text-nyx-blue-bright transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              nyxcollectivellc.com
            </a>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-nyx-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
