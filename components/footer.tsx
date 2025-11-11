import { Github, MessageCircle, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#2A190F] py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image
                alt="Piña mascot"
                height={40}
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
                width={40}
              />
              <span className="font-bold text-xl">Ananá Payroll</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Web3 payroll automation built on trust, transparency, and smart
              contracts.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-white/70 transition-colors hover:text-white"
                  href="/features"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 transition-colors hover:text-white"
                  href="/pricing"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 transition-colors hover:text-white"
                  href="/security"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 transition-colors hover:text-white"
                  href="/roadmap"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-white/70 transition-colors hover:text-white"
                  href="/support"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Community</h3>
            <div className="flex gap-4">
              <a
                className="text-white/70 transition-colors hover:text-white"
                href="/twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                className="text-white/70 transition-colors hover:text-white"
                href="/api-reference"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                className="text-white/70 transition-colors hover:text-white"
                href="/blog"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-white/10 border-t pt-8 md:flex-row">
          <p className="text-sm text-white/50">
            © 2025 Ananá Payroll. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              className="text-white/50 transition-colors hover:text-white"
              href="/privacy-policy"
            >
              Privacy Policy
            </a>
            <a
              className="text-white/50 transition-colors hover:text-white"
              href="/terms-of-service"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
