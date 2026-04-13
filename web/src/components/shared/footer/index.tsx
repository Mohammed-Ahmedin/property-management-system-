import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Youtube, Instagram, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/hooks/api";

// TikTok SVG icon
const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
);

interface SiteConfig {
  siteName: string;
  logoUrl?: string;
  tagline?: string;
  youtube?: string;
  tiktok?: string;
  telegram?: string;
  instagram?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
}

export function Footer() {
  const [config, setConfig] = useState<SiteConfig>({ siteName: "Bete" });

  useEffect(() => {
    api.get("/site-config").then(res => setConfig(res.data)).catch(() => {});
  }, []);

  const socialLinks = [
    { href: config.youtube, icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
    { href: config.tiktok, icon: <TikTokIcon />, label: "TikTok" },
    { href: config.telegram, icon: <Send className="w-4 h-4" />, label: "Telegram" },
    { href: config.instagram, icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
  ].filter(s => s.href);

  return (
    <footer className="bg-[#1a4a2e] text-zinc-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt={config.siteName} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{config.siteName?.[0] || "B"}</span>
                </div>
              )}
              <span className="text-xl font-bold text-white">{config.siteName || "Bete"}</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              {config.tagline || "Discover and book the best properties across Ethiopia. From hotels to guest houses, find your perfect stay."}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-primary flex items-center justify-center transition-colors shrink-0"
                    aria-label={label}>
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2 text-sm">
              {["Hotels", "Guest Houses", "Apartments", "Resorts", "Villas", "Hostels"].map((t) => (
                <li key={t}>
                  <Link to={`/properties?type=${t.toUpperCase().replace(" ", "_")}`} className="hover:text-primary transition-colors">{t}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "All Properties", href: "/properties" },
                { label: "Nearby", href: "/nearby" },
                { label: "About Us", href: "/about" },
                { label: "Register Property", href: "/register" },
                { label: "My Bookings", href: "/account/bookings" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{config.contactAddress || "Bole, Addis Ababa, Ethiopia"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${config.contactPhone || "+251911000000"}`} className="hover:text-primary transition-colors">
                  {config.contactPhone || "+251 911 000 000"}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${config.contactEmail || "info@bete.et"}`} className="hover:text-primary transition-colors">
                  {config.contactEmail || "info@bete.et"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {config.siteName || "Bete"}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
