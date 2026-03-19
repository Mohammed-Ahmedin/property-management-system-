import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// shadcn/ui components (adjust paths if your project uses a different alias)
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// lucide icon (optional)
import { ArrowLeft, Home } from "lucide-react";

type NotFoundPageProps = {
  /** Optional: custom message to show under the title */
  message?: string;
};

export default function NotFoundPage({ message }: NotFoundPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration / visual */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          {/* Simple SVG illustration that is neutral and clear */}
          <svg
            width="320"
            height="240"
            viewBox="0 0 320 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-xs"
            aria-hidden
          >
            <rect
              x="8"
              y="24"
              width="304"
              height="192"
              rx="12"
              fill="#EFF6FF"
            />
            <rect x="36" y="56" width="248" height="8" rx="4" fill="#DBEAFE" />
            <rect x="36" y="80" width="200" height="8" rx="4" fill="#DBEAFE" />
            <rect x="36" y="104" width="160" height="8" rx="4" fill="#DBEAFE" />

            <g transform="translate(56,140)">
              <circle cx="32" cy="32" r="32" fill="#BFDBFE" />
              <rect
                x="80"
                y="8"
                width="110"
                height="48"
                rx="8"
                fill="#BFDBFE"
              />
              <text
                x="28"
                y="38"
                fontSize="18"
                fontFamily="Inter, Arial"
                fill="#0f172a"
                fontWeight="700"
              >
                404
              </text>
            </g>
          </svg>
        </motion.div>

        {/* Content card */}
        <Card className="shadow-md">
          <CardContent className="p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                Page not found
              </h1>

              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-xl">
                {message ??
                  "We couldn’t find the page you were looking for. It may have been moved or deleted."}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to homepage
                </Button>

                <Button
                  variant={"outline" as any}
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go back
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <label htmlFor="quick-search" className="sr-only">
                  Quick search
                </label>
                <Input
                  id="quick-search"
                  placeholder="Search the site — e.g. pricing, blog, docs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // naive search redirect — adjust to your search page
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value)
                        navigate(`/search?q=${encodeURIComponent(value)}`);
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const el = document.getElementById(
                      "quick-search"
                    ) as HTMLInputElement | null;
                    const q = el?.value.trim();
                    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
                  }}
                >
                  Search
                </Button>
              </div>

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                If you think this is an error,{" "}
                <button
                  className="underline"
                  onClick={() => navigate("/contact")}
                >
                  contact support
                </button>
                .
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
