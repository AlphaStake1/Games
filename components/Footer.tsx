import { Instagram, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { label: 'How to Play', href: '/how-to-play' },
    { label: 'Rules', href: '/rules' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '#contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Crypto Basics', href: '/crypto-basics' },
  ];

  // Custom X.com icon component
  const XIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  // Custom Telegram icon component
  const TelegramIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );

  const socialLinks = [
    { icon: XIcon, href: '#', label: 'Follow us on X' },
    { icon: Instagram, href: '#', label: 'Follow us on Instagram' },
    { icon: TelegramIcon, href: '#', label: 'Join our Telegram' },
  ];

  return (
    <footer className="bg-[#002244] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Football Squares</h3>
            <p className="text-[#96abdc] leading-relaxed mb-6">
              The ultimate destination for NFL squares games and fantasy football resources. 
              Join thousands of fans making every game more exciting.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#708090]">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-[#ed5925] fill-current" />
              <span>for football fans</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#96abdc] hover:text-[#ed5925] transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-[#004953] p-3 rounded-full hover:bg-[#ed5925] transition-all duration-200 hover:scale-110 transform"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-[#96abdc] text-sm leading-relaxed">
              Stay updated with the latest games, tips, and community highlights.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#004953] pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
            <p className="text-[#708090] text-sm">
              © 2024 Football Squares. All rights reserved.
            </p>
            <p className="text-[#708090] text-sm">
              This website is not affiliated with or endorsed by the National Football League.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;