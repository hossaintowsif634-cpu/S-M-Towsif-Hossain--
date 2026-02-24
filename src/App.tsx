import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Youtube, 
  ExternalLink, 
  Code2, 
  Palette, 
  Video, 
  MessageSquare, 
  Send, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Download,
  Smartphone,
  Globe,
  Layout,
  Star,
  CheckCircle2,
  Menu,
  Instagram,
  Twitter,
  Linkedin,
  Upload
} from 'lucide-react';

import { portfolioService } from './services/portfolioService';

// --- Types ---
interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  demoUrl: string;
  youtubeUrl: string;
  description: string;
}

interface Graphic {
  id: number;
  title: string;
  category: 'Branding' | 'UI/UX' | 'Social Media';
  image: string;
}

interface Review {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// --- Persistence Helper ---
const getInitialData = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

// --- Data ---
const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web Development",
    image: "https://picsum.photos/seed/shop/800/600",
    demoUrl: "#",
    youtubeUrl: "#",
    description: "A full-stack e-commerce solution with real-time inventory."
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    category: "UI/UX Design",
    image: "https://picsum.photos/seed/dash/800/600",
    demoUrl: "#",
    youtubeUrl: "#",
    description: "Modern analytics dashboard with dark mode support."
  },
  {
    id: 3,
    title: "Crypto Wallet App",
    category: "Mobile App",
    image: "https://picsum.photos/seed/crypto/800/600",
    demoUrl: "#",
    youtubeUrl: "#",
    description: "Secure cryptocurrency wallet with multi-chain support."
  }
];

const INITIAL_GRAPHICS: Graphic[] = [
  { id: 1, title: "Modern Logo Set", category: "Branding", image: "https://picsum.photos/seed/logo/800/800" },
  { id: 2, title: "App Interface", category: "UI/UX", image: "https://picsum.photos/seed/ui/800/800" },
  { id: 3, title: "Instagram Campaign", category: "Social Media", image: "https://picsum.photos/seed/social/800/800" },
  { id: 4, title: "Brand Identity", category: "Branding", image: "https://picsum.photos/seed/brand/800/800" },
  { id: 5, title: "Web Layout", category: "UI/UX", image: "https://picsum.photos/seed/web/800/800" },
  { id: 6, title: "Marketing Post", category: "Social Media", image: "https://picsum.photos/seed/market/800/800" },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "CEO, TechFlow",
    comment: "Towsif delivered an exceptional website that exceeded our expectations. His attention to detail is unmatched.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=alex"
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Marketing Director",
    comment: "The graphics gallery he created for our brand was stunning. Highly professional and creative.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: 3,
    name: "David Chen",
    role: "Founder, StartupX",
    comment: "Fast delivery and great communication. The chatbot integration works perfectly.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=david"
  }
];

const CHAT_QA = [
  { q: "What services do you offer?", a: "I offer Web Development, UI/UX Design, Graphic Design, and Video Editing services." },
  { q: "How can I contact you?", a: "You can reach me via the contact form below or directly on WhatsApp at +8801XXXXXXXXX." },
  { q: "Do you take custom projects?", a: "Yes! I love working on unique and challenging custom projects." },
  { q: "Where are you based?", a: "I am based in Bangladesh, working with clients globally." }
];

const INITIAL_CONTACT_INFO = {
  whatsapp: "01309823877",
  website: "bdfollow.shop",
  email: "Hussein.Tausif634@gmail.com",
  facebook: "https://facebook.com/bdfollow",
  instagram: "https://instagram.com/bdfollow",
  twitter: "https://twitter.com/tausif_hossain"
};

const INITIAL_ABOUT_DATA = {
  title: "Innovative Solutions for Modern Brands",
  description: "I am a multi-disciplinary designer and developer based in Bangladesh. Through bdfollow.shop, I help businesses scale their digital presence with cutting-edge technology and premium design aesthetics.",
  image: "https://picsum.photos/seed/towsif/800/800",
  experience: "5+",
  cv: "" // Base64 or URL
};

// --- Components ---

const ImageUpload = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label?: string }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] uppercase tracking-widest text-slate-500">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
          {value ? (
            <img src={value} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <Upload size={20} className="text-slate-600" />
          )}
        </div>
        <label className="cursor-pointer px-4 py-2 glass-card rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
          Choose Image
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

const Navbar = ({ isAdmin, onOpenDashboard, onReview, cvUrl }: { 
  isAdmin: boolean, 
  onOpenDashboard: () => void, 
  onReview: () => void,
  cvUrl?: string 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy-900/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <span className="text-cyan-neon">bd</span>
          <span className="text-white">follow.shop</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['About', 'Services', 'Skills', 'Projects', 'Gallery', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium hover:text-cyan-neon transition-colors">
              {item}
            </a>
          ))}
          
          <button 
            onClick={onReview} 
            className="px-6 py-2.5 bg-gradient-to-r from-gold-accent to-amber-500 text-navy-900 rounded-full text-sm font-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 transition-all flex items-center gap-2 animate-pulse"
          >
            <Star size={16} fill="currentColor" /> LEAVE A REVIEW
          </button>

          {isAdmin && (
            <button onClick={onOpenDashboard} className="text-sm font-bold text-cyan-neon flex items-center gap-1">
              <Layout size={14} /> Dashboard
            </button>
          )}
          
          {cvUrl && (
            <a href={cvUrl} download="CV_Towsif_Hossain" className="px-5 py-2 glass-card text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Download size={14} /> CV
            </a>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-navy-800 border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {['About', 'Services', 'Skills', 'Projects', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                {item}
              </a>
            ))}
            {isAdmin && (
              <button onClick={() => { onOpenDashboard(); setIsMenuOpen(false); }} className="text-lg font-bold text-cyan-neon text-left">
                Dashboard
              </button>
            )}
            {cvUrl && (
              <a href={cvUrl} download="CV_Towsif_Hossain" className="text-lg font-bold text-cyan-neon">
                Download CV
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
    <div className="absolute inset-0 gradient-bg opacity-30 pointer-events-none" />
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-neon/20 blur-[120px] rounded-full" />
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-neon/20 blur-[120px] rounded-full" />
    
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-gold-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 block">
          I Dare You To Give A Bad Review
        </span>
        <h1 className="text-6xl md:text-8xl mb-6 leading-tight">
          S M Towsif <span className="gradient-text">Hossain</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Crafting high-performance digital experiences with a focus on modern tech, 
          stunning visuals, and seamless user interaction.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-cyan-neon to-purple-neon rounded-full font-bold text-navy-900 hover:scale-105 transition-transform">
            View My Work
          </a>
          <a href="https://wa.me/8801XXXXXXXXX" target="_blank" className="px-8 py-4 glass-card font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Smartphone size={18} /> Let's Talk
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const About = ({ data }: { data: any }) => {
  const [showCV, setShowCV] = useState(false);

  return (
    <section id="about" className="py-24 bg-navy-800/50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden border-2 border-white/10 p-4">
            <img src={data.image} alt="Towsif" className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
          <div className="absolute -bottom-6 -right-6 glass-card p-6 neon-border-cyan">
            <div className="text-3xl font-bold text-cyan-neon">{data.experience}</div>
            <div className="text-xs uppercase tracking-widest text-slate-400">Years Experience</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl mb-6">{data.title.split(' ').slice(0, -2).join(' ')} <span className="text-cyan-neon">{data.title.split(' ').slice(-2).join(' ')}</span></h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {data.description}
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { icon: <Globe className="text-cyan-neon" />, title: "Global Reach", desc: "Clients from 15+ countries" },
              { icon: <CheckCircle2 className="text-purple-neon" />, title: "Quality First", desc: "Pixel-perfect execution" }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">{item.icon}</div>
                <div>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {data.cv && (
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCV(true)}
                className="px-6 py-3 bg-cyan-neon text-navy-900 font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
              >
                View CV Live
              </button>
              <a 
                href={data.cv} 
                download="CV_Towsif_Hossain"
                className="px-6 py-3 glass-card font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Download size={18} /> Download
              </a>
            </div>
          )}
        </motion.div>
      </div>

      {/* CV Live View Modal */}
      <AnimatePresence>
        {showCV && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-navy-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <div className="relative w-full h-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-4 bg-navy-900 flex justify-between items-center border-b border-white/10">
                <h3 className="text-xl font-bold text-white">CV <span className="text-cyan-neon">Preview</span></h3>
                <button onClick={() => setShowCV(false)} className="text-white hover:text-cyan-neon transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-slate-100 p-4 flex justify-center">
                {data.cv.startsWith('data:application/pdf') ? (
                  <iframe src={data.cv} className="w-full h-full border-none" title="CV PDF" />
                ) : (
                  <img src={data.cv} className="max-w-full h-auto shadow-lg" alt="CV Preview" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Skills = () => (
  <section id="skills" className="py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl mb-4">Technical <span className="text-purple-neon">Arsenal</span></h2>
        <p className="text-slate-400">The tools and technologies I use to bring ideas to life.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: "React / Next.js", level: 95, icon: <Code2 /> },
          { name: "Tailwind CSS", level: 98, icon: <Layout /> },
          { name: "UI/UX Design", level: 90, icon: <Palette /> },
          { name: "Video Editing", level: 85, icon: <Video /> },
          { name: "Node.js", level: 88, icon: <Globe /> },
          { name: "TypeScript", level: 92, icon: <Code2 /> },
          { name: "Figma", level: 95, icon: <Palette /> },
          { name: "Motion Design", level: 80, icon: <Star /> },
        ].map((skill, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass-card p-6 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-neon/20 transition-colors">
              {skill.icon}
            </div>
            <h4 className="font-bold mb-2">{skill.name}</h4>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                className="h-full bg-gradient-to-r from-cyan-neon to-purple-neon"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Projects = ({ data }: { data: Project[] }) => (
  <section id="projects" className="py-24 bg-navy-800/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-4xl mb-4">Featured <span className="text-cyan-neon">Projects</span></h2>
          <p className="text-slate-400">A selection of my recent development work.</p>
        </div>
        <a href="#" className="text-cyan-neon flex items-center gap-2 hover:underline">
          View All Projects <ChevronRight size={16} />
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {data.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a href={project.demoUrl} className="p-3 bg-cyan-neon text-navy-900 rounded-full hover:scale-110 transition-transform">
                  <ExternalLink size={20} />
                </a>
                <a href={project.youtubeUrl} className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
            <div className="p-6">
              <span className="text-xs font-mono text-purple-neon uppercase tracking-widest mb-2 block">{project.category}</span>
              <h3 className="text-xl mb-2">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{project.description}</p>
              <div className="flex gap-4">
                <button className="text-xs font-bold text-cyan-neon flex items-center gap-1 hover:underline">
                  Live Demo <ExternalLink size={12} />
                </button>
                <button className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:underline">
                  Case Study <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Gallery = ({ data }: { data: Graphic[] }) => {
  const [filter, setFilter] = useState<'All' | 'Branding' | 'UI/UX' | 'Social Media'>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredGraphics = filter === 'All' 
    ? data 
    : data.filter(g => g.category === filter);

  return (
    <section id="gallery" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Graphics <span className="text-gold-accent">Gallery</span></h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['All', 'Branding', 'UI/UX', 'Social Media'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat ? 'bg-cyan-neon text-navy-900' : 'glass-card hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredGraphics.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="aspect-square glass-card overflow-hidden cursor-pointer group relative"
                onClick={() => setSelectedImage(item.image)}
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-cyan-neon">{item.category}</span>
                    <h4 className="font-bold">{item.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy-900/95 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-cyan-neon">
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage} 
              className="max-w-full max-h-full rounded-2xl shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const VideoSection = () => (
  <section className="py-24 bg-navy-800/50">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-4xl mb-8">Video <span className="text-red-600">Showcase</span></h2>
      <div className="aspect-video rounded-3xl overflow-hidden glass-card neon-border-purple">
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
    </div>
  </section>
);

const Reviews = ({ data, onLeaveReview, hasSubmitted }: { data: Review[], onLeaveReview: () => void, hasSubmitted: boolean }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (data.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [data.length]);

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h2 className="text-4xl text-center md:text-left">Client <span className="text-cyan-neon">Testimonials</span></h2>
          {!hasSubmitted && (
            <button 
              onClick={onLeaveReview}
              className="px-6 py-3 glass-card border-cyan-neon/30 text-cyan-neon hover:bg-cyan-neon hover:text-navy-900 transition-all rounded-full font-bold flex items-center gap-2"
            >
              <Star size={18} /> Leave a Review
            </button>
          )}
        </div>
        
        {data.length > 0 ? (
          <div className="relative">
            <div className="flex justify-center">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="max-w-2xl glass-card p-12 text-center relative"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-navy-900 overflow-hidden">
                    <img src={data[active].avatar} alt={data[active].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-center gap-1 mb-6 mt-4">
                    {[...Array(data[active].rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-gold-accent text-gold-accent" />
                    ))}
                  </div>
                  <p className="text-xl italic text-slate-300 mb-8 leading-relaxed">
                    "{data[active].comment}"
                  </p>
                  <h4 className="text-lg font-bold">{data[active].name}</h4>
                  <p className="text-sm text-cyan-neon">{data[active].role}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4 mt-10">
              <button 
                onClick={() => setActive((prev) => (prev === 0 ? data.length - 1 : prev - 1))}
                className="p-3 glass-card hover:bg-white/10 rounded-full"
              >
                <ChevronLeft />
              </button>
              <button 
                onClick={() => setActive((prev) => (prev === data.length - 1 ? 0 : prev + 1))}
                className="p-3 glass-card hover:bg-white/10 rounded-full"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 glass-card">
            <p className="text-slate-400">No reviews yet. Be the first to leave one!</p>
          </div>
        )}
      </div>
    </section>
  );
};

const Contact = ({ data, onSendMessage }: { data: any, onSendMessage: (msg: any) => Promise<void> }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await onSendMessage(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Message sent successfully!');
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-navy-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl mb-6">Let's Build Something <span className="gradient-text">Legendary</span></h2>
            <p className="text-slate-400 mb-10">
              Have a project in mind? Reach out and let's discuss how we can 
              bring your vision to life with premium design and tech.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <Smartphone />, label: "WhatsApp", value: data.whatsapp, link: `https://wa.me/${data.whatsapp.replace(/\+/g, '')}` },
                { icon: <Globe />, label: "Website", value: data.website, link: `https://${data.website}` },
                { icon: <MessageSquare />, label: "Email", value: data.email, link: `mailto:${data.email}` },
                { icon: <Instagram />, label: "Instagram", value: "Follow on Instagram", link: data.instagram },
                { icon: <Twitter />, label: "Twitter", value: "Follow on Twitter", link: data.twitter },
                { icon: <Twitter />, label: "Facebook", value: "Follow on Facebook", link: data.facebook }
              ].map((item, i) => (
                <a key={i} href={item.link} target="_blank" className="flex items-center gap-4 p-4 glass-card hover:neon-border-cyan transition-all group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:text-cyan-neon transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="font-bold">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-neon transition-colors" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-neon transition-colors" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subject</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-neon transition-colors" 
                  placeholder="Project Inquiry" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                <textarea 
                  rows={4} 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-neon transition-colors" 
                  placeholder="Tell me about your project..." 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button 
                disabled={isSending}
                className="w-full py-4 bg-gradient-to-r from-cyan-neon to-purple-neon rounded-xl font-bold text-navy-900 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi there! I'm Towsif's AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuestion = (q: string, a: string) => {
    setMessages(prev => [
      ...prev, 
      { id: Date.now(), text: q, sender: 'user' },
      { id: Date.now() + 1, text: a, sender: 'bot' }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] glass-card overflow-hidden shadow-2xl flex flex-col h-[500px]"
          >
            <div className="p-4 bg-gradient-to-r from-cyan-neon to-purple-neon text-navy-900 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-navy-900/20 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <span className="font-bold">Chat with AI</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-cyan-neon text-navy-900 rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-navy-900/50">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Quick Questions</p>
              <div className="flex flex-wrap gap-2">
                {CHAT_QA.map((qa, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleQuestion(qa.q, qa.a)}
                    className="text-[10px] px-3 py-1.5 glass-card hover:bg-white/10 transition-colors"
                  >
                    {qa.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-neon to-purple-neon text-navy-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>
    </div>
  );
};

const Footer = () => (
  <footer className="py-12 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
        <span className="text-cyan-neon">bd</span>
        <span className="text-white">follow.shop</span>
      </div>
      
      <div className="flex gap-6">
        {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
          <a key={i} href="#" className="text-slate-400 hover:text-cyan-neon transition-colors">
            <Icon size={20} />
          </a>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        © {new Date().getFullYear()} S M Towsif Hossain. All rights reserved.
      </p>
    </div>
  </footer>
);

const INITIAL_SERVICE_DETAILS = {
  "Web Development": [
    { name: "Premium E-Commerce", image: "https://picsum.photos/seed/web1/600/400", link: "https://bdfollow.shop", tech: "Next.js, Tailwind" },
    { name: "SaaS Landing Page", image: "https://picsum.photos/seed/web2/600/400", link: "#", tech: "React, Framer Motion" },
    { name: "Agency Portfolio", image: "https://picsum.photos/seed/web3/600/400", link: "#", tech: "TypeScript, Vite" },
  ],
  "Video Editing": [
    { title: "Brand Storytelling", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnail: "https://picsum.photos/seed/vid1/600/400" },
    { title: "Commercial Promo", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnail: "https://picsum.photos/seed/vid2/600/400" },
    { title: "Event Highlights", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnail: "https://picsum.photos/seed/vid3/600/400" },
  ],
  "Graphics": [
    { title: "Logo Identity", image: "https://picsum.photos/seed/gfx1/600/400" },
    { title: "Marketing Banner", image: "https://picsum.photos/seed/gfx2/600/400" },
    { title: "UI Kit Design", image: "https://picsum.photos/seed/gfx3/600/400" },
  ],
  "Digital Branding": {
    before: "https://picsum.photos/seed/oldbrand/800/600?blur=5",
    after: "https://picsum.photos/seed/newbrand/800/600",
    performance: [
      { label: "Page Load Speed", before: "5.8s", after: "0.9s", trend: "up" },
      { label: "Google SEO Rank", before: "#45", after: "#3", trend: "up" },
      { label: "User Retention", before: "12%", after: "48%", trend: "up" },
    ]
  }
};

const Services = ({ data }: { data: any }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedService]);

  const renderDetail = () => {
    if (!selectedService) return null;

    if (selectedService === "Digital Branding") {
      const brandingData = data["Digital Branding"];
      return (
        <div className="space-y-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Before Transformation</p>
              <div className="rounded-2xl overflow-hidden border border-white/10 grayscale opacity-50">
                <img src={brandingData.before} alt="Before" className="w-full h-auto" />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-mono text-cyan-neon uppercase tracking-widest">After Premium Rebrand</p>
              <div className="rounded-2xl overflow-hidden border-2 border-cyan-neon/30 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                <img src={brandingData.after} alt="After" className="w-full h-auto" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h4 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Star className="text-gold-accent" /> Performance Metrics
            </h4>
            <div className="grid md:grid-cols-3 gap-8">
              {brandingData.performance.map((perf: any, i: number) => (
                <div key={i} className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-slate-400">{perf.label}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 line-through">{perf.before}</p>
                      <p className="text-2xl font-bold text-cyan-neon">{perf.after}</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                      Significant Improvement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const items = data[selectedService as keyof typeof INITIAL_SERVICE_DETAILS] as any[];
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group border border-white/5"
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={item.image || item.thumbnail} alt={item.name || item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-navy-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                {item.link || item.url ? (
                  <a 
                    href={item.link || item.url} 
                    target="_blank" 
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-neon text-navy-900 rounded-full font-bold hover:scale-110 transition-transform"
                  >
                    {selectedService === "Video Editing" ? <><Youtube size={18} /> Watch Video</> : <><ExternalLink size={18} /> Visit Site</>}
                  </a>
                ) : (
                  <div className="px-6 py-3 bg-white/10 text-white rounded-full font-bold">
                    Featured Project
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <h5 className="text-lg font-bold mb-2">{item.name || item.title}</h5>
              {item.tech && (
                <div className="flex flex-wrap gap-2">
                  {item.tech.split(',').map((t: string) => (
                    <span key={t} className="text-[10px] px-2 py-1 bg-white/5 rounded text-slate-400 font-mono uppercase tracking-widest">{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section id="services" className="py-24 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Premium <span className="text-gold-accent">Services</span></h2>
          <p className="text-slate-400">Tailored digital solutions for high-end brands.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Web Development", 
              desc: "High-performance, scalable web applications. Click to see my live projects.",
              icon: <Code2 className="text-cyan-neon" />
            },
            { 
              title: "Video Editing", 
              desc: "Professional cinematic editing and brand storytelling. Click for YouTube showcase.",
              icon: <Video className="text-purple-neon" />
            },
            { 
              title: "Digital Branding", 
              desc: "Complete brand transformation. Click to see Before/After & Performance stats.",
              icon: <Star className="text-gold-accent" />
            }
          ].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedService(service.title)}
              className="glass-card p-10 border-t-4 border-t-transparent hover:border-t-cyan-neon transition-all cursor-pointer group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 className="text-2xl mb-4">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6">{service.desc}</p>
              <div className="text-cyan-neon text-sm font-bold flex items-center gap-2">
                Launch Showcase <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full-screen Showcase Overlay */}
        <AnimatePresence>
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[150] bg-navy-900 overflow-y-auto"
            >
              <div className="min-h-screen flex flex-col">
                {/* Showcase Header */}
                <header className="sticky top-0 z-10 bg-navy-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-6">
                  <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedService(null)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <div>
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          <span className="text-cyan-neon">{selectedService}</span>
                          <span className="text-slate-500 font-light hidden md:inline">| Showcase</span>
                        </h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="px-6 py-2 glass-card rounded-full text-sm font-bold hover:bg-white/10 transition-all"
                    >
                      Back to Home
                    </button>
                  </div>
                </header>

                {/* Showcase Content */}
                <main className="flex-1 py-16 px-6">
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {renderDetail()}
                    </motion.div>
                  </div>
                </main>

                {/* Showcase Footer */}
                <footer className="py-12 border-t border-white/10 px-6">
                  <div className="max-w-7xl mx-auto text-center">
                    <p className="text-slate-500 text-sm mb-6">Interested in {selectedService} for your brand?</p>
                    <a 
                      href="#contact" 
                      onClick={() => setSelectedService(null)}
                      className="px-8 py-4 bg-cyan-neon text-navy-900 font-bold rounded-full hover:scale-105 transition-transform inline-block"
                    >
                      Start a Project
                    </a>
                  </div>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const AdminPanel = ({ data, onSave, onLogout, onClose }: { data: any, onSave: (newData: any) => void, onLogout: () => void, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('Projects');
  const [localData, setLocalData] = useState(data);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    if (activeTab === 'Messages') {
      fetchMessages();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const msgs = await portfolioService.getMessages();
      setMessages(msgs);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleUpdate = (path: string, value: any) => {
    const newData = { ...localData };
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setLocalData(newData);
  };

  const handleSave = () => {
    onSave(localData);
    alert('Changes saved successfully!');
  };

  const addItem = (tab: string) => {
    const newData = { ...localData };
    if (tab === 'Projects') {
      newData.projects.push({ id: Date.now(), title: 'New Project', category: 'Web Development', image: 'https://picsum.photos/800/600', demoUrl: '#', youtubeUrl: '#', description: 'Description here' });
    } else if (tab === 'Graphics') {
      newData.graphics.push({ id: Date.now(), title: 'New Graphic', category: 'Branding', image: 'https://picsum.photos/800/800' });
    } else if (tab === 'Reviews') {
      newData.reviews.push({ id: Date.now(), name: 'New Client', role: 'Role', comment: 'Review text', rating: 5, avatar: 'https://i.pravatar.cc/150' });
    }
    setLocalData(newData);
  };

  const removeItem = (tab: string, id: number) => {
    const newData = { ...localData };
    if (tab === 'Projects') newData.projects = newData.projects.filter((p: any) => p.id !== id);
    if (tab === 'Graphics') newData.graphics = newData.graphics.filter((g: any) => g.id !== id);
    if (tab === 'Reviews') newData.reviews = newData.reviews.filter((r: any) => r.id !== id);
    setLocalData(newData);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-navy-900 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto flex flex-col min-h-full">
        <div className="flex-1 glass-card p-8 mb-8">
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {['About', 'Projects', 'Graphics', 'Reviews', 'Services', 'Contact', 'Messages'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-cyan-neon text-navy-900' : 'glass-card'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'About' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-500">About Title</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-neon outline-none" value={localData.aboutData.title} onChange={(e) => handleUpdate('aboutData.title', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-500">Experience Years</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-neon outline-none" value={localData.aboutData.experience} onChange={(e) => handleUpdate('aboutData.experience', e.target.value)} />
                  </div>
                  <ImageUpload label="Profile Image" value={localData.aboutData.image} onChange={(val) => handleUpdate('aboutData.image', val)} />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-500">About Description</label>
                    <textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-neon outline-none" value={localData.aboutData.description} onChange={(e) => handleUpdate('aboutData.description', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-slate-500">CV File (PDF or Image)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        {localData.aboutData.cv ? <CheckCircle2 className="text-emerald-500" /> : <Download className="text-slate-600" />}
                      </div>
                      <label className="cursor-pointer px-4 py-2 glass-card rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                        Upload CV
                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => handleUpdate('aboutData.cv', reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Projects' && (
            <div className="space-y-8">
              <button onClick={() => addItem('Projects')} className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl hover:border-cyan-neon transition-colors text-cyan-neon font-bold">
                + Add New Project
              </button>
              {localData.projects.map((p: any, i: number) => (
                <div key={p.id} className="p-6 border border-white/10 rounded-xl space-y-4 relative">
                  <button onClick={() => removeItem('Projects', p.id)} className="absolute top-4 right-4 text-red-500"><X size={16} /></button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input className="bg-white/5 p-2 rounded border border-white/10" value={p.title} onChange={(e) => {
                      const newItems = [...localData.projects];
                      newItems[i].title = e.target.value;
                      handleUpdate('projects', newItems);
                    }} />
                    <select className="bg-navy-800 p-2 rounded border border-white/10" value={p.category} onChange={(e) => {
                      const newItems = [...localData.projects];
                      newItems[i].category = e.target.value;
                      handleUpdate('projects', newItems);
                    }}>
                      <option>Web Development</option>
                      <option>UI/UX Design</option>
                      <option>Mobile App</option>
                    </select>
                  </div>
                  <ImageUpload 
                    label="Project Image"
                    value={p.image} 
                    onChange={(val) => {
                      const newItems = [...localData.projects];
                      newItems[i].image = val;
                      handleUpdate('projects', newItems);
                    }} 
                  />
                  <textarea className="w-full bg-white/5 p-2 rounded border border-white/10" value={p.description} onChange={(e) => {
                    const newItems = [...localData.projects];
                    newItems[i].description = e.target.value;
                    handleUpdate('projects', newItems);
                  }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Graphics' && (
            <div className="space-y-8">
              <button onClick={() => addItem('Graphics')} className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl hover:border-cyan-neon transition-colors text-cyan-neon font-bold">
                + Add New Graphic
              </button>
              <div className="grid md:grid-cols-2 gap-6">
                {localData.graphics.map((g: any, i: number) => (
                  <div key={g.id} className="p-4 border border-white/10 rounded-xl flex gap-4 relative">
                    <button onClick={() => removeItem('Graphics', g.id)} className="absolute top-2 right-2 text-red-500"><X size={14} /></button>
                    <img src={g.image} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1 space-y-2">
                      <input className="w-full bg-white/5 p-2 rounded border border-white/10 text-sm" value={g.title} onChange={(e) => {
                        const newItems = [...localData.graphics];
                        newItems[i].title = e.target.value;
                        handleUpdate('graphics', newItems);
                      }} />
                      <select className="w-full bg-navy-800 p-2 rounded border border-white/10 text-xs" value={g.category} onChange={(e) => {
                        const newItems = [...localData.graphics];
                        newItems[i].category = e.target.value;
                        handleUpdate('graphics', newItems);
                      }}>
                        <option>Branding</option>
                        <option>UI/UX</option>
                        <option>Social Media</option>
                      </select>
                      <ImageUpload 
                        value={g.image} 
                        onChange={(val) => {
                          const newItems = [...localData.graphics];
                          newItems[i].image = val;
                          handleUpdate('graphics', newItems);
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="space-y-6">
              <button onClick={() => addItem('Reviews')} className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl hover:border-cyan-neon transition-colors text-cyan-neon font-bold">
                + Add New Review
              </button>
              {localData.reviews.map((r: any, i: number) => (
                <div key={r.id} className="p-6 border border-white/10 rounded-xl space-y-4 relative">
                  <button onClick={() => removeItem('Reviews', r.id)} className="absolute top-4 right-4 text-red-500"><X size={16} /></button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input className="bg-white/5 p-2 rounded border border-white/10" value={r.name} onChange={(e) => {
                      const newItems = [...localData.reviews];
                      newItems[i].name = e.target.value;
                      handleUpdate('reviews', newItems);
                    }} />
                    <input className="bg-white/5 p-2 rounded border border-white/10" value={r.role} onChange={(e) => {
                      const newItems = [...localData.reviews];
                      newItems[i].role = e.target.value;
                      handleUpdate('reviews', newItems);
                    }} />
                  </div>
                  <ImageUpload 
                    label="Avatar"
                    value={r.avatar} 
                    onChange={(val) => {
                      const newItems = [...localData.reviews];
                      newItems[i].avatar = val;
                      handleUpdate('reviews', newItems);
                    }} 
                  />
                  <textarea className="w-full bg-white/5 p-2 rounded border border-white/10" value={r.comment} onChange={(e) => {
                    const newItems = [...localData.reviews];
                    newItems[i].comment = e.target.value;
                    handleUpdate('reviews', newItems);
                  }} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Services' && (
            <div className="space-y-8">
              <div className="p-6 border border-white/10 rounded-xl space-y-4">
                <h4 className="font-bold text-cyan-neon">Digital Branding Before/After</h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <ImageUpload 
                    label="Before Image"
                    value={localData.serviceDetails['Digital Branding'].before} 
                    onChange={(val) => handleUpdate('serviceDetails.Digital Branding.before', val)} 
                  />
                  <ImageUpload 
                    label="After Image"
                    value={localData.serviceDetails['Digital Branding'].after} 
                    onChange={(val) => handleUpdate('serviceDetails.Digital Branding.after', val)} 
                  />
                </div>
              </div>

              {['Web Development', 'Video Editing', 'Graphics'].map(service => (
                <div key={service} className="p-6 border border-white/10 rounded-xl space-y-4">
                  <h4 className="font-bold text-cyan-neon">{service} Items</h4>
                  <div className="space-y-4">
                    {localData.serviceDetails[service].map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 p-2 bg-white/5 rounded relative">
                        <button onClick={() => {
                          const newData = { ...localData };
                          newData.serviceDetails[service] = newData.serviceDetails[service].filter((_: any, idx: number) => idx !== i);
                          setLocalData(newData);
                        }} className="absolute top-2 right-2 text-red-500"><X size={12} /></button>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input className="bg-navy-900 p-1 text-xs rounded border border-white/10" value={item.name || item.title} onChange={(e) => {
                            const newData = { ...localData };
                            if (item.name) newData.serviceDetails[service][i].name = e.target.value;
                            else newData.serviceDetails[service][i].title = e.target.value;
                            setLocalData(newData);
                          }} />
                          <input className="bg-navy-900 p-1 text-xs rounded border border-white/10" value={item.link || item.url} onChange={(e) => {
                            const newData = { ...localData };
                            if (item.link) newData.serviceDetails[service][i].link = e.target.value;
                            else newData.serviceDetails[service][i].url = e.target.value;
                            setLocalData(newData);
                          }} />
                        </div>
                        <div className="w-24">
                          <ImageUpload 
                            value={item.image || item.thumbnail} 
                            onChange={(val) => {
                              const newData = { ...localData };
                              if (item.image) newData.serviceDetails[service][i].image = val;
                              else newData.serviceDetails[service][i].thumbnail = val;
                              setLocalData(newData);
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => {
                      const newData = { ...localData };
                      const newItem = service === 'Video Editing' 
                        ? { title: 'New Video', url: '#', thumbnail: 'https://picsum.photos/600/400' }
                        : { name: 'New Item', image: 'https://picsum.photos/600/400', link: '#', tech: 'Tech' };
                      newData.serviceDetails[service].push(newItem);
                      setLocalData(newData);
                    }} className="w-full py-2 border border-dashed border-white/20 rounded text-xs text-slate-400 hover:text-white">
                      + Add Item to {service}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Contact' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'WhatsApp', key: 'whatsapp' },
                  { label: 'Website', key: 'website' },
                  { label: 'Email', key: 'email' },
                  { label: 'Facebook Link', key: 'facebook' },
                  { label: 'Instagram Link', key: 'instagram' },
                  { label: 'Twitter Link', key: 'twitter' }
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500">{field.label}</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-neon outline-none" 
                      value={localData.contactInfo[field.key]} 
                      onChange={(e) => handleUpdate(`contactInfo.${field.key}`, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-cyan-neon">Inquiry Messages</h4>
                <button onClick={fetchMessages} className="text-xs text-slate-400 hover:text-white underline">Refresh</button>
              </div>
              {isLoadingMessages ? (
                <div className="text-center py-12 text-slate-500">Loading messages...</div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white">{msg.name}</p>
                          <p className="text-xs text-slate-500">{msg.email}</p>
                        </div>
                        <p className="text-[10px] text-slate-600 uppercase">{new Date(msg.created_at).toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-bold text-cyan-neon">{msg.subject}</p>
                      <p className="text-sm text-slate-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-xl">
                  No messages found in database.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto py-8 border-t border-white/10">
          <h2 className="text-xl font-bold">Portfolio <span className="text-cyan-neon">Management</span></h2>
          <div className="flex gap-4">
            <button onClick={handleSave} className="px-6 py-2 bg-emerald-500 text-white rounded-full font-bold">Save Changes</button>
            <button onClick={onClose} className="px-6 py-2 glass-card text-white rounded-full font-bold">Close</button>
            <button onClick={onLogout} className="px-6 py-2 glass-card text-red-400 rounded-full font-bold">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackModal = ({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSubmit: (review: Review) => void
}) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isErratic, setIsErratic] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitButtonPos, setSubmitButtonPos] = useState({ x: 0, y: 0 });

  const handleRating = (r: number) => {
    setRating(r);
    setIsErratic(r < 3);
    if (r < 3 && r > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleHoverSubmit = () => {
    if (rating < 3 || rating === 0) {
      setSubmitButtonPos({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating >= 3) {
      const newReview: Review = {
        id: Date.now(),
        name: name || 'Anonymous User',
        role: 'Client',
        comment: comment || 'Excellent experience!',
        rating: rating,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || Date.now()}`
      };
      onSubmit(newReview);
      onClose();
      // Reset state
      setRating(0);
      setName('');
      setComment('');
      setSubmitButtonPos({ x: 0, y: 0 });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-navy-900/95 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-card p-10 w-full max-w-lg text-center relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-3xl font-bold mb-2">How was your <span className="text-cyan-neon">Experience?</span></h3>
            <p className="text-slate-400 mb-8">We value your feedback to improve our portfolio.</p>
            
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`transition-all duration-300 ${rating >= star ? 'text-gold-accent scale-125' : 'text-slate-700 hover:text-slate-500'}`}
                >
                  <Star size={40} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-8 mb-8">
              <button 
                onClick={() => handleRating(5)}
                className={`flex flex-col items-center gap-2 group transition-colors ${rating >= 3 ? 'text-cyan-neon' : 'text-slate-500'}`}
              >
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={32} />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest">Good</span>
              </button>
              <button 
                onClick={() => handleRating(1)}
                className={`flex flex-col items-center gap-2 group transition-colors ${rating > 0 && rating < 3 ? 'text-red-500' : 'text-slate-500'}`}
              >
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center group-hover:scale-110 transition-transform">
                  <X size={32} />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest">Bad</span>
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="text-left">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-2">Your Name</label>
                <input 
                  type="text"
                  placeholder="Enter your name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-cyan-neon outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="text-left">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-2">Your Review</label>
                <textarea 
                  placeholder="Tell us more about your experience..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-cyan-neon outline-none h-32 transition-all"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>

            <div className="relative h-16">
              <motion.button
                type="submit"
                onClick={handleSubmit}
                onMouseEnter={handleHoverSubmit}
                variants={shakeVariants}
                animate={rating < 3 ? { ...shakeVariants.shake, x: submitButtonPos.x, y: submitButtonPos.y } : { x: 0, y: 0 }}
                className={`px-12 py-4 rounded-full font-bold transition-all ${rating >= 3 ? 'bg-cyan-neon text-navy-900 shadow-[0_0_20px_rgba(0,242,255,0.4)] cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
              >
                {rating > 0 && rating < 3 ? "Bad reviews not accepted" : "Submit Feedback"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [portfolioData, setPortfolioData] = useState(() => ({
    projects: getInitialData('portfolio_projects', INITIAL_PROJECTS),
    graphics: getInitialData('portfolio_graphics', INITIAL_GRAPHICS),
    reviews: getInitialData('portfolio_reviews', INITIAL_REVIEWS),
    serviceDetails: getInitialData('portfolio_services', INITIAL_SERVICE_DETAILS),
    contactInfo: getInitialData('portfolio_contact', INITIAL_CONTACT_INFO),
    aboutData: getInitialData('portfolio_about', INITIAL_ABOUT_DATA)
  }));

  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('portfolio_isAdmin') === 'true');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(() => localStorage.getItem('portfolio_hasSubmittedReview') === 'true');
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });

  useEffect(() => {
    // Load data from Supabase
    const loadSupabaseData = async () => {
      try {
        const data = await portfolioService.getPortfolioData();
        if (data) {
          setPortfolioData(data);
        }
      } catch (err) {
        console.warn('Supabase load failed, using local/initial data', err);
      }
    };
    loadSupabaseData();

    const handlePopState = () => {
      if (!hasSubmittedReview) {
        setIsFeedbackOpen(true);
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasSubmittedReview]);

  const handleLogout = async () => {
    setIsAdmin(false);
    localStorage.removeItem('portfolio_isAdmin');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'bdfollo.shop' && loginForm.pass === '@Towsif123') {
      setIsAdmin(true);
      localStorage.setItem('portfolio_isAdmin', 'true');
      setIsAdminPanelOpen(true);
      setIsLoginOpen(false);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleFeedbackSubmit = async (newReview: Review) => {
    const updatedReviews = [newReview, ...portfolioData.reviews];
    const newData = { ...portfolioData, reviews: updatedReviews };
    setPortfolioData(newData);
    localStorage.setItem('portfolio_reviews', JSON.stringify(updatedReviews));
    setHasSubmittedReview(true);
    localStorage.setItem('portfolio_hasSubmittedReview', 'true');
    
    try {
      await portfolioService.savePortfolioData(newData);
    } catch (err) {
      console.error('Failed to sync review to Supabase', err);
    }
    
    alert('Thank you! Your review has been added to the showcase.');
  };

  const handleSaveData = async (newData: any) => {
    setPortfolioData(newData);
    localStorage.setItem('portfolio_projects', JSON.stringify(newData.projects));
    localStorage.setItem('portfolio_graphics', JSON.stringify(newData.graphics));
    localStorage.setItem('portfolio_reviews', JSON.stringify(newData.reviews));
    localStorage.setItem('portfolio_services', JSON.stringify(newData.serviceDetails));
    localStorage.setItem('portfolio_contact', JSON.stringify(newData.contactInfo));
    localStorage.setItem('portfolio_about', JSON.stringify(newData.aboutData));

    try {
      await portfolioService.savePortfolioData(newData);
      alert('Portfolio saved and synced to Supabase!');
    } catch (err) {
      console.error('Failed to sync to Supabase', err);
      alert('Saved locally, but Supabase sync failed. Check your configuration.');
    }
  };

  return (
    <div className="relative">
      {isAdmin && isAdminPanelOpen && (
        <AdminPanel 
          data={portfolioData} 
          onSave={handleSaveData} 
          onLogout={() => { setIsAdmin(false); setIsAdminPanelOpen(false); }} 
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}

      <Navbar 
        isAdmin={isAdmin} 
        onOpenDashboard={() => setIsAdminPanelOpen(true)} 
        onReview={() => setIsFeedbackOpen(true)}
        cvUrl={portfolioData.aboutData.cv} 
      />
      <Hero />
      <About data={portfolioData.aboutData} />
      <Services data={portfolioData.serviceDetails} />
      <Skills />
      <Projects data={portfolioData.projects} />
      <Gallery data={portfolioData.graphics} />
      <VideoSection />
      <Reviews 
        data={portfolioData.reviews} 
        onLeaveReview={() => setIsFeedbackOpen(true)}
        hasSubmitted={hasSubmittedReview}
      />
      <Contact data={portfolioData.contactInfo} onSendMessage={(msg) => portfolioService.saveMessage(msg)} />
      
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-cyan-neon">bd</span>
            <span className="text-white">follow.shop</span>
          </div>
          
          <div className="flex gap-6">
            {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
              <a key={i} href="#" className="text-slate-400 hover:text-cyan-neon transition-colors">
                <Icon size={20} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} S M Towsif Hossain.
            </p>
            {!isAdmin ? (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="text-[10px] uppercase tracking-widest text-slate-600 hover:text-cyan-neon transition-colors"
              >
                Manage Portfolio
              </button>
            ) : (
              <button 
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-[10px] uppercase tracking-widest text-cyan-neon font-bold"
              >
                Open Dashboard
              </button>
            )}
          </div>
        </div>
      </footer>

      <Chatbot />

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        onSubmit={handleFeedbackSubmit}
      />

      <AnimatePresence>
        {isLoginOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-navy-900/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-8 w-full max-w-md relative"
            >
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
              <h3 className="text-2xl font-bold mb-6 text-center">Admin <span className="text-cyan-neon">Login</span></h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500">Username</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-neon outline-none" 
                    value={loginForm.user}
                    onChange={(e) => setLoginForm({...loginForm, user: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-neon outline-none" 
                    value={loginForm.pass}
                    onChange={(e) => setLoginForm({...loginForm, pass: e.target.value})}
                  />
                </div>
                <button className="w-full py-4 bg-cyan-neon text-navy-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
                  Access Dashboard
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
