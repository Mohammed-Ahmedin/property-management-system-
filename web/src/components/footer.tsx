import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12 pb-24">
      <div className="c-px">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📍</span>
              <span className="font-bold text-foreground">BETE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for booking unique properties worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/properties"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Top Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Travel Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Safety
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow</h3>
            <div className="flex gap-4">
              <Link
                to="#"
                className="text-muted-foreground hover:text-primary transition-colors text-lg"
              >
                <Facebook />
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-primary transition-colors text-lg"
              >
                <Instagram />
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-primary transition-colors text-lg"
              >
                <MessageCircle />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 StayHub. All rights reserved.</p>
          <p>
            Made by
            <span> </span>
            <a
              href="https://simbatech.et/"
              className="underline underline-offset-2 text-foreground text-lg"
              target="_blank"
            >
              Simba tech
            </a>
          </p>
          {/* <link rel="stylesheet" href="https://simbatech.et/">https://simbatech.et/</link> */}
        </div>
      </div>
    </footer>
  );
}
