import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Star,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reservations", href: "#reservations" },
  { label: "Contact", href: "#contact" },
];

const MENU_CATEGORIES = [
  {
    id: "indian",
    label: "Indian",
    items: [
      {
        name: "Royal Lamb Biryani",
        desc: "Slow-cooked basmati rice, saffron, rose water, dum style",
        price: "₹850",
      },
      {
        name: "Butter Chicken Royale",
        desc: "Tender chicken in velvety tomato-cashew sauce, fenugreek",
        price: "₹620",
      },
      {
        name: "Dal Maharani",
        desc: "24-hour slow-cooked black lentils, cream, ghee",
        price: "₹380",
      },
      {
        name: "Paneer Shahi Kofta",
        desc: "Cottage cheese dumplings in Mughlai saffron gravy",
        price: "₹520",
      },
    ],
  },
  {
    id: "chinese",
    label: "Chinese",
    items: [
      {
        name: "Dim Sum Platter",
        desc: "Assorted steamed dumplings, har gow, shumai, truffle filling",
        price: "₹680",
      },
      {
        name: "Peking Duck",
        desc: "Crispy whole duck, mandarin pancakes, hoisin sauce",
        price: "₹1,850",
      },
      {
        name: "Hot & Sour Soup",
        desc: "Silken tofu, bamboo shoots, black fungus, aged vinegar",
        price: "₹320",
      },
      {
        name: "Kung Pao Lobster",
        desc: "Fresh lobster, Sichuan peppercorns, cashew, chili oil",
        price: "₹1,200",
      },
    ],
  },
  {
    id: "continental",
    label: "Continental",
    items: [
      {
        name: "Beef Wellington",
        desc: "Tenderloin, mushroom duxelles, prosciutto, puff pastry",
        price: "₹2,200",
      },
      {
        name: "Lobster Thermidor",
        desc: "Butter-poached lobster, tarragon cream, gruyère gratin",
        price: "₹2,800",
      },
      {
        name: "Truffle Risotto",
        desc: "Carnaroli rice, black truffle, parmigiano-reggiano",
        price: "₹950",
      },
      {
        name: "Rack of Lamb",
        desc: "Herb-crusted, rosemary jus, ratatouille, fondant potato",
        price: "₹1,650",
      },
    ],
  },
  {
    id: "beverages",
    label: "Beverages",
    items: [
      {
        name: "Royal Saffron Mocktail",
        desc: "Chilled saffron, rose, cardamom, elderflower tonic",
        price: "₹380",
      },
      {
        name: "Aged Single Malt",
        desc: "18-year Macallan Highland, served with hand-cut ice sphere",
        price: "₹2,400",
      },
      {
        name: "Champagne Rosé",
        desc: "Moët & Chandon Rosé Impérial, chilled",
        price: "₹8,500",
      },
      {
        name: "Masala Chai Ritual",
        desc: "Assam gold tea, fresh ginger, cardamom, served in brass kettle",
        price: "₹180",
      },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      {
        name: "Warm Chocolate Fondant",
        desc: "Valrhona dark chocolate, salted caramel, edible gold leaf",
        price: "₹480",
      },
      {
        name: "Gulab Jamun Soufflé",
        desc: "Rose water soufflé, pistachio cream, silver vark",
        price: "₹360",
      },
      {
        name: "Mango Kulfi Royale",
        desc: "Alphonso mango, cardamom, saffron, 24K gold dust",
        price: "₹320",
      },
      {
        name: "Crème Brûlée",
        desc: "Bourbon vanilla, caramelized crust, seasonal berries",
        price: "₹420",
      },
    ],
  },
];

const GALLERY_IMAGES = [
  {
    src: "/assets/generated/gallery-indian-curry.dim_800x600.jpg",
    alt: "Butter Chicken Royale",
    label: "Indian Cuisine",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/assets/generated/gallery-private-dining.dim_800x1000.jpg",
    alt: "Private Dining Room",
    label: "Private Dining",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/assets/generated/gallery-continental.dim_800x600.jpg",
    alt: "Continental Cuisine",
    label: "Continental",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/assets/generated/gallery-dining-room.dim_800x600.jpg",
    alt: "Dining Room",
    label: "The Ambiance",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/assets/generated/gallery-chinese-dimsum.dim_800x600.jpg",
    alt: "Chinese Dim Sum",
    label: "Chinese Cuisine",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/assets/generated/gallery-beverages.dim_800x600.jpg",
    alt: "Premium Beverages",
    label: "Curated Beverages",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/assets/generated/gallery-biryani.dim_800x600.jpg",
    alt: "Royal Biryani",
    label: "Royal Biryani",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/assets/generated/gallery-desserts.dim_800x600.jpg",
    alt: "Decadent Desserts",
    label: "Artisan Desserts",
    span: "col-span-1 row-span-1",
  },
];

// ─── Particle Component ───────────────────────────────────────────────────────

function GoldParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold-light"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: [-20, -80],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Gold Divider ─────────────────────────────────────────────────────────────

function GoldDivider({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
        <div className="w-2 h-2 rounded-full bg-gold" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
      </div>
      <h2 className="font-playfair text-4xl md:text-5xl text-cream mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-poppins text-sm tracking-[0.3em] uppercase text-gold">
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
        <div className="w-1 h-1 rounded-full bg-gold opacity-60" />
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
      </div>
    </motion.div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-rich-black/95 backdrop-blur-md border-b border-gold/20 py-3"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" data-ocid="nav.link" className="group">
          <div className="flex flex-col">
            <span className="font-playfair text-gold text-xl font-semibold tracking-[0.1em] leading-none">
              HOAZHAN
            </span>
            <span className="font-poppins text-cream/60 text-[10px] tracking-[0.4em] uppercase">
              Royal Dining
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid="nav.link"
              className="font-poppins text-xs tracking-[0.2em] uppercase text-cream/70 hover:text-gold transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Book CTA */}
        <a
          href="#reservations"
          data-ocid="nav.primary_button"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold font-poppins text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-rich-black transition-all duration-300"
        >
          <Calendar size={12} />
          Reserve
        </a>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gold p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-rich-black/98 border-t border-gold/20 py-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="flex flex-col items-center gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid="nav.link"
                  onClick={() => setMenuOpen(false)}
                  className="font-poppins text-sm tracking-[0.2em] uppercase text-cream/80 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src="/assets/generated/hero-royal-dining.dim_1920x1080.jpg"
          alt="Hoazhan Royal Dining Interior"
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-rich-black/70 via-rich-black/50 to-rich-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-rich-black/60 via-transparent to-rich-black/60" />
      {/* Vignette */}
      <div className="absolute inset-0 vignette-overlay" />
      {/* Gold shimmer overlay */}
      <div className="absolute inset-0 gold-shimmer opacity-30" />

      {/* Floating gold particles */}
      <GoldParticles />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity }}
      >
        {/* Pre-title */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-gold" />
          <span className="font-poppins text-gold text-xs tracking-[0.5em] uppercase">
            Est. 2018 · Mumbai
          </span>
          <div className="h-px w-12 bg-gold" />
        </motion.div>

        {/* Main title — split editorial style */}
        <motion.div variants={itemVariants}>
          <h1 className="font-playfair leading-none">
            <span
              className="block text-cream"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 9rem)",
                letterSpacing: "0.08em",
                textShadow: "0 0 60px rgba(201,168,76,0.15)",
              }}
            >
              HOAZHAN
            </span>
            <span
              className="block text-gold italic"
              style={{
                fontSize: "clamp(1.8rem, 4.5vw, 4rem)",
                letterSpacing: "0.25em",
                marginTop: "-0.15em",
              }}
            >
              Royal Dining
            </span>
          </h1>
        </motion.div>

        {/* Ornamental divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 my-7"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
          <Star size={12} className="text-gold fill-gold" />
          <div className="h-px w-8 bg-gold/40" />
          <Star size={8} className="text-gold fill-gold opacity-60" />
          <div className="h-px w-8 bg-gold/40" />
          <Star size={12} className="text-gold fill-gold" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="font-playfair italic text-cream/85 mb-10"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            letterSpacing: "0.05em",
          }}
        >
          Experience Royal Dining Like Never Before
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#reservations"
            data-ocid="hero.primary_button"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gold text-rich-black font-poppins text-xs tracking-[0.2em] uppercase font-semibold overflow-hidden transition-all duration-300 hover:shadow-gold hover:scale-105"
          >
            <span className="absolute inset-0 bg-gold-light translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <Calendar size={14} className="relative z-10" />
            <span className="relative z-10">Book a Table</span>
          </a>

          <a
            href="https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20order%20from%20Hoazhan%20Royal%20Dining"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="hero.secondary_button"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold font-poppins text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-rich-black transition-all duration-300 hover:shadow-gold-sm"
          >
            <SiWhatsapp size={14} />
            <span>Order on WhatsApp</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="font-poppins text-[10px] tracking-[0.3em] uppercase text-gold/60">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-4 bg-gold"
            animate={{ y: [0, 40] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section
      id="about"
      className="py-28 bg-rich-black relative overflow-hidden"
    >
      {/* Background decorative element */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-5 rounded-full"
        style={{
          background: "radial-gradient(circle, #C9A84C, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="relative">
            <img
              src="/assets/generated/about-restaurant.dim_900x700.jpg"
              alt="Hoazhan Royal Dining Entrance"
              className="w-full h-[500px] object-cover"
            />
            {/* Gold frame accent */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/30 -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-gold" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-gold" />
          </div>

          {/* Stats badge */}
          <motion.div
            className="absolute -bottom-8 left-8 bg-dark-brown border border-gold/40 px-6 py-5"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex gap-8">
              <div className="text-center">
                <div className="font-playfair text-3xl text-gold">6+</div>
                <div className="font-poppins text-[10px] tracking-widest uppercase text-cream/60">
                  Years
                </div>
              </div>
              <div className="w-px bg-gold/30" />
              <div className="text-center">
                <div className="font-playfair text-3xl text-gold">5</div>
                <div className="font-poppins text-[10px] tracking-widest uppercase text-cream/60">
                  Cuisines
                </div>
              </div>
              <div className="w-px bg-gold/30" />
              <div className="text-center">
                <div className="font-playfair text-3xl text-gold">50k+</div>
                <div className="font-poppins text-[10px] tracking-widest uppercase text-cream/60">
                  Guests
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          className="md:pl-8 pt-8 md:pt-0"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold" />
            <span className="font-poppins text-gold text-xs tracking-[0.35em] uppercase">
              Our Story
            </span>
          </div>

          <h2 className="font-playfair text-4xl md:text-5xl text-cream leading-tight mb-6">
            Where Royalty Meets
            <span className="block text-gold italic">Culinary Art</span>
          </h2>

          <p className="font-poppins text-cream/70 text-sm leading-relaxed mb-5">
            Founded in 2018 by Chef Arjun Mehta and Priya Hoazhan, our
            restaurant was born from a singular vision: to craft dining
            experiences worthy of royalty. Drawing inspiration from Mughal court
            kitchens, imperial Chinese banquets, and the finest European
            culinary traditions, we weave a tapestry of flavors that transcends
            borders.
          </p>

          <p className="font-poppins text-cream/70 text-sm leading-relaxed mb-8">
            Every ingredient is sourced with obsessive care — saffron from
            Kashmir, truffle from Périgord, Wagyu from Japan. Our kitchen is a
            stage where heritage recipes meet contemporary technique, producing
            dishes that tell stories through every bite.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: "🏆",
                label: "Award-Winning",
                desc: "Best Fine Dining 2023",
              },
              {
                icon: "👨‍🍳",
                label: "Master Chefs",
                desc: "12 culinary experts",
              },
              {
                icon: "🌿",
                label: "Farm to Table",
                desc: "Locally sourced, global quality",
              },
              {
                icon: "✨",
                label: "Private Events",
                desc: "Bespoke celebrations",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-3 border border-gold/10 hover:border-gold/30 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-poppins text-xs font-semibold text-cream">
                    {item.label}
                  </div>
                  <div className="font-poppins text-[11px] text-cream/50">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Menu Section ─────────────────────────────────────────────────────────────

function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("indian");
  const active = MENU_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <section
      id="menu"
      className="py-28 relative"
      style={{ background: "#0D0A05" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <GoldDivider title="Our Menu" subtitle="A journey of flavours" />

        {/* Category Tabs */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-12"
          data-ocid="menu.tab"
        >
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              data-ocid="menu.tab"
              className={`px-6 py-2.5 font-poppins text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-gold text-rich-black"
                  : "border border-gold/30 text-cream/60 hover:border-gold/60 hover:text-gold"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {active.items.map((item, i) => (
              <motion.div
                key={item.name}
                className="group flex items-start justify-between p-5 border border-gold/10 hover:border-gold/40 transition-all duration-300 hover:bg-gold/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                data-ocid={`menu.item.${i + 1}`}
              >
                <div className="flex-1 pr-4">
                  <h4 className="font-playfair text-lg text-cream mb-1 group-hover:text-gold transition-colors">
                    {item.name}
                  </h4>
                  <p className="font-poppins text-xs text-cream/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="font-playfair text-gold text-lg whitespace-nowrap pt-0.5">
                  {item.price}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* WhatsApp Order */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20order%20from%20your%20menu"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="menu.primary_button"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-poppins text-xs tracking-[0.2em] uppercase hover:bg-[#128C7E] transition-colors duration-300"
          >
            <SiWhatsapp size={16} />
            Order via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (lightboxIndex === null) return;
      const next =
        (lightboxIndex + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
      setLightboxIndex(next);
    },
    [lightboxIndex],
  );

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, navigate, closeLightbox]);

  const currentImage =
    lightboxIndex !== null ? GALLERY_IMAGES[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-28 bg-rich-black">
      <div className="max-w-7xl mx-auto px-6">
        <GoldDivider
          title="Gallery"
          subtitle="Moments of culinary excellence"
        />

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] gap-3">
          {GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={image.src}
              className={`relative overflow-hidden cursor-pointer group ${
                image.span
              }`}
              data-ocid={`gallery.item.${index + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-rich-black/0 group-hover:bg-rich-black/65 transition-all duration-400" />

              {/* Hover content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                <motion.div
                  className="flex items-center justify-center w-12 h-12 border border-gold text-gold mb-3"
                  whileHover={{ scale: 1.1 }}
                >
                  <Plus size={20} />
                </motion.div>
                <span className="font-poppins text-cream text-xs tracking-[0.25em] uppercase">
                  {image.label}
                </span>
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {currentImage && lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center lightbox-backdrop"
            style={{ backgroundColor: "rgba(10,10,10,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeLightbox}
            data-ocid="gallery.modal"
          >
            {/* Image container */}
            <motion.div
              className="relative max-w-5xl max-h-[85vh] mx-6"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage.src}
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="max-w-full max-h-[80vh] object-contain"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Caption */}
              <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-between">
                <span className="font-playfair italic text-cream/70 text-sm">
                  {currentImage.label}
                </span>
                <span className="font-poppins text-gold text-xs tracking-widest">
                  {lightboxIndex + 1} / {GALLERY_IMAGES.length}
                </span>
              </div>

              {/* Nav arrows */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                data-ocid="gallery.secondary_button"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 flex items-center justify-center border border-gold/50 text-gold hover:bg-gold hover:text-rich-black transition-all duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                data-ocid="gallery.secondary_button"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 flex items-center justify-center border border-gold/50 text-gold hover:bg-gold hover:text-rich-black transition-all duration-300"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>

            {/* Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              data-ocid="gallery.close_button"
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-gold/50 text-gold hover:bg-gold hover:text-rich-black transition-all duration-300"
              aria-label="Close lightbox"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Reservations Section ─────────────────────────────────────────────────────

function ReservationsSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section
      id="reservations"
      className="py-28"
      style={{ background: "#0D0A05" }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <GoldDivider
          title="Reserve a Table"
          subtitle="Plan your royal experience"
        />

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="text-center py-16 border border-gold/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              data-ocid="reservation.success_state"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-playfair text-2xl text-gold mb-3">
                Reservation Received
              </h3>
              <p className="font-poppins text-sm text-cream/60">
                Thank you, {form.name}. Our team will confirm your reservation
                at {form.phone} shortly.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="res-name"
                    className="block font-poppins text-xs tracking-[0.2em] uppercase text-cream/60 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="reservation.input"
                    className="w-full bg-transparent border border-gold/30 px-4 py-3 font-poppins text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="res-phone"
                    className="block font-poppins text-xs tracking-[0.2em] uppercase text-cream/60 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    data-ocid="reservation.input"
                    className="w-full bg-transparent border border-gold/30 px-4 py-3 font-poppins text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="res-date"
                    className="block font-poppins text-xs tracking-[0.2em] uppercase text-cream/60 mb-2"
                  >
                    <Calendar size={10} className="inline mr-1" />
                    Date
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, date: e.target.value }))
                    }
                    data-ocid="reservation.input"
                    className="w-full bg-transparent border border-gold/30 px-4 py-3 font-poppins text-sm text-cream focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="res-time"
                    className="block font-poppins text-xs tracking-[0.2em] uppercase text-cream/60 mb-2"
                  >
                    <Clock size={10} className="inline mr-1" />
                    Time
                  </label>
                  <input
                    id="res-time"
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, time: e.target.value }))
                    }
                    data-ocid="reservation.input"
                    className="w-full bg-transparent border border-gold/30 px-4 py-3 font-poppins text-sm text-cream focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="res-guests"
                    className="block font-poppins text-xs tracking-[0.2em] uppercase text-cream/60 mb-2"
                  >
                    <Users size={10} className="inline mr-1" />
                    Guests
                  </label>
                  <select
                    id="res-guests"
                    value={form.guests}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, guests: e.target.value }))
                    }
                    data-ocid="reservation.select"
                    className="w-full bg-[#0D0A05] border border-gold/30 px-4 py-3 font-poppins text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  data-ocid="reservation.submit_button"
                  className="w-full py-4 bg-gold text-rich-black font-poppins text-xs tracking-[0.3em] uppercase font-semibold hover:bg-gold-light transition-colors duration-300 hover:shadow-gold"
                >
                  Confirm Reservation
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-28 bg-rich-black">
      <div className="max-w-7xl mx-auto px-6">
        <GoldDivider title="Find Us" subtitle="Visit Hoazhan Royal Dining" />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value:
                    "12, Royal Heritage Lane, Bandra West\nMumbai, Maharashtra 400050",
                },
                {
                  icon: Phone,
                  label: "Reservations",
                  value: "+91 98765 43210",
                },
                { icon: Mail, label: "Email", value: "dine@hoazhan.com" },
                {
                  icon: Clock,
                  label: "Hours",
                  value:
                    "Lunch: 12:00 PM – 3:30 PM\nDinner: 7:00 PM – 11:30 PM",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <div className="font-poppins text-[10px] tracking-[0.25em] uppercase text-gold mb-1">
                      {item.label}
                    </div>
                    <div className="font-poppins text-sm text-cream/70 whitespace-pre-line">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-10 pt-8 border-t border-gold/20">
              <div className="font-poppins text-[10px] tracking-[0.3em] uppercase text-cream/40 mb-4">
                Follow Our Journey
              </div>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/hoazhanroyaldining"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.link"
                  className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-rich-black transition-all duration-300"
                >
                  <SiInstagram size={16} />
                </a>
                <a
                  href="https://facebook.com/hoazhanroyaldining"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.link"
                  className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-rich-black transition-all duration-300"
                >
                  <SiFacebook size={16} />
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.link"
                  className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-rich-black transition-all duration-300"
                >
                  <SiWhatsapp size={16} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            data-ocid="contact.map_marker"
          >
            <div className="relative h-80 md:h-full min-h-[320px] border border-gold/20 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.3027536698!2d72.83622!3d19.05961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8b2f9e57bb9%3A0x6d8e2a91e0d4cc2d!2sBandra%20West%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1702300000000"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "invert(90%) hue-rotate(200deg) saturate(0.3)",
                }}
                allowFullScreen
                loading="lazy"
                title="Hoazhan Royal Dining Location"
              />
              {/* Gold overlay border */}
              <div className="absolute inset-0 pointer-events-none border border-gold/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-brown border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="font-playfair text-gold text-xl tracking-[0.1em] mb-1">
              HOAZHAN
            </div>
            <div className="font-poppins text-[10px] tracking-[0.4em] uppercase text-cream/40">
              Royal Dining · Mumbai
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-poppins text-[11px] tracking-[0.15em] uppercase text-cream/40 hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            <a
              href="https://instagram.com/hoazhanroyaldining"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/40 hover:text-gold transition-colors"
            >
              <SiInstagram size={16} />
            </a>
            <a
              href="https://facebook.com/hoazhanroyaldining"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/40 hover:text-gold transition-colors"
            >
              <SiFacebook size={16} />
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/40 hover:text-gold transition-colors"
            >
              <SiWhatsapp size={16} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gold/10 text-center">
          <p className="font-poppins text-[11px] text-cream/30">
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating WhatsApp Button ─────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Hoazhan%20Royal%20Dining"
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.primary_button"
      className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-[#25D366] flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-colors duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5, type: "spring" }}
      aria-label="Chat on WhatsApp"
    >
      <SiWhatsapp size={24} className="text-white" />
    </motion.a>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-rich-black">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <GallerySection />
        <ReservationsSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
