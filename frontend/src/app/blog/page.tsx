import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog-posts';
import { LandingNav } from '@/components/landing/LandingNav';
import { Footer } from '@/components/landing/Footer';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — DeFi Trading Guides, Base Network, Crypto Education',
  description: '40+ expert articles on DeFi trading, perpetual futures, Base network, technical analysis, and crypto strategy. Learn to trade on BaseDEX.',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Platform':       'bg-blue-500/15 text-blue-400',
  'Trading Guide':  'bg-violet-500/15 text-violet-400',
  'Education':      'bg-emerald-500/15 text-emerald-400',
  'Risk Management':'bg-orange-500/15 text-orange-400',
  'Base Network':   'bg-cyan-500/15 text-cyan-400',
  'Technology':     'bg-indigo-500/15 text-indigo-400',
  'Asset Guide':    'bg-yellow-500/15 text-yellow-500',
  'Industry':       'bg-pink-500/15 text-pink-400',
  'Strategy':       'bg-teal-500/15 text-teal-400',
  'Comparison':     'bg-fuchsia-500/15 text-fuchsia-400',
  'Security':       'bg-red-500/15 text-red-400',
  'Roadmap':        'bg-lime-500/15 text-lime-400',
  'Institutional':  'bg-amber-500/15 text-amber-500',
  'Market Analysis':'bg-sky-500/15 text-sky-400',
  'Psychology':     'bg-rose-500/15 text-rose-400',
  'How-To':         'bg-purple-500/15 text-purple-400',
};

export default function BlogPage() {
  const featured = BLOG_POSTS.filter(p => p.featured);
  const categories = [...new Set(BLOG_POSTS.map(p => p.category))];

  return (
    <div className="min-h-screen bg-[#070710]">
      <LandingNav />
      <div className="pt-16">
        {/* Hero */}
        <div className="bg-[#08081a] border-b border-[#1e1e3a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              40+ Articles
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              The BaseDEX <span className="text-gradient">Knowledge Hub</span>
            </h1>
            <p className="text-[#6a6a8a] max-w-2xl mx-auto text-lg">
              Deep-dive guides on DeFi trading, perpetual futures, Base network, technical analysis, and everything you need to trade like a professional.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured */}
          <div className="mb-16">
            <h2 className="text-xl font-black text-white mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((post, i) => (
                <Link key={i} href={`/blog/${post.slug}`} className="panel overflow-hidden hover:border-[#2a2a4a] transition-all group flex flex-col">
                  <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/20 h-40 flex items-center justify-center">
                    <span className="text-6xl font-black text-gradient opacity-40">{post.category.slice(0,1)}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${CATEGORY_COLORS[post.category] ?? 'bg-[#1e1e3a] text-[#8888aa]'}`}>
                        {post.category}
                      </span>
                      <span className="text-[10px] text-[#3a3a5a]">{post.readTime} min read</span>
                    </div>
                    <h3 className="text-white font-bold leading-snug mb-2 group-hover:text-blue-400 transition-colors flex-1">
                      {post.title}
                    </h3>
                    <p className="text-[#4a4a6a] text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All posts by category */}
          {categories.map(cat => {
            const posts = BLOG_POSTS.filter(p => p.category === cat);
            return (
              <div key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${CATEGORY_COLORS[cat] ?? 'bg-[#1e1e3a] text-[#8888aa]'}`}>
                    {cat}
                  </span>
                  <span className="text-[#3a3a5a] text-xs">{posts.length} articles</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post, i) => (
                    <Link key={i} href={`/blog/${post.slug}`} className="panel p-5 hover:border-[#2a2a4a] transition-all group flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-[#3a3a5a]" />
                        <span className="text-[10px] text-[#3a3a5a]">{post.readTime} min</span>
                        <span className="text-[10px] text-[#2a2a4a]">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-[#4a4a6a] text-xs leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                      <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold mt-1">
                        Read <ArrowRight size={11} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
