import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog-posts';
import { ArrowRight, Clock } from 'lucide-react';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Platform':           { bg: 'rgba(59,130,246,0.12)',   text: '#60a5fa'  },
  'Trading Guide':      { bg: 'rgba(139,92,246,0.12)',   text: '#a78bfa'  },
  'Education':          { bg: 'rgba(16,185,129,0.12)',   text: '#34d399'  },
  'Risk Management':    { bg: 'rgba(249,115,22,0.12)',   text: '#fb923c'  },
  'Base Network':       { bg: 'rgba(6,182,212,0.12)',    text: '#22d3ee'  },
  'Technology':         { bg: 'rgba(99,102,241,0.12)',   text: '#818cf8'  },
  'Asset Guide':        { bg: 'rgba(234,179,8,0.12)',    text: '#facc15'  },
  'Industry':           { bg: 'rgba(236,72,153,0.12)',   text: '#f472b6'  },
  'Trading Strategy':   { bg: 'rgba(20,184,166,0.12)',   text: '#2dd4bf'  },
  'Technical Analysis': { bg: 'rgba(245,158,11,0.12)',   text: '#fbbf24'  },
  'Comparison':         { bg: 'rgba(168,85,247,0.12)',   text: '#c084fc'  },
  'Security':           { bg: 'rgba(239,68,68,0.12)',    text: '#f87171'  },
  'Institutional':      { bg: 'rgba(212,175,55,0.12)',   text: '#d4af37'  },
  'Roadmap':            { bg: 'rgba(34,211,238,0.12)',   text: '#67e8f9'  },
  'How-To':             { bg: 'rgba(74,222,128,0.12)',   text: '#86efac'  },
};

const DEFAULT_CAT = { bg: 'rgba(42,42,68,0.5)', text: '#8888aa' };

// Map categories to real cover images
const CATEGORY_IMAGES: Record<string, string> = {
  'Platform':           '/images/blog-platform.png',
  'Trading Guide':      '/images/blog-trading-guide.png',
  'Education':          '/images/blog-education.png',
  'Risk Management':    '/images/blog-risk-management.png',
  'Base Network':       '/images/blog-base-network.png',
  'Technology':         '/images/blog-technology.png',
  'Asset Guide':        '/images/blog-asset-guide.png',
  'Industry':           '/images/blog-industry.png',
  'Trading Strategy':   '/images/blog-trading-guide.png',
  'Technical Analysis': '/images/blog-technical-analysis.png',
  'Comparison':         '/images/blog-platform.png',
  'Security':           '/images/blog-risk-management.png',
  'Institutional':      '/images/blog-institutional.png',
  'Roadmap':            '/images/blog-base-network.png',
  'How-To':             '/images/blog-education.png',
};

export function BlogPreview() {
  const featured = BLOG_POSTS.filter(p => p.featured).slice(0, 3);
  const recent   = BLOG_POSTS.filter(p => !p.featured).slice(0, 6);

  return (
    <section id="blog" className="py-24 relative overflow-hidden" style={{ background: '#05050f' }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(42,42,85,0.8), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-blue-400 text-xs font-bold mb-5 uppercase tracking-wider"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              Knowledge Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              Learn to Trade Better
            </h2>
            <p className="text-[#6a7090]">40+ guides on DeFi, derivatives, and Base network.</p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
          >
            View all posts <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured posts */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {featured.map((post, i) => {
            const cat = CATEGORY_COLORS[post.category] ?? DEFAULT_CAT;
            return (
              <Link
                key={i}
                href={`/blog/${post.slug}`}
                style={{
                  background:   '#0d0d22',
                  border:       '1px solid rgba(26,26,53,1)',
                  borderRadius: '16px',
                  overflow:     'hidden',
                  display:      'flex',
                  flexDirection:'column',
                  transition:   'border-color 0.2s, transform 0.2s',
                }}
                className="hover:border-[#2a2a45] hover:-translate-y-1 group"
              >
                {/* Cover image */}
                <div className="h-36 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CATEGORY_IMAGES[post.category] ?? '/images/blog-platform.png'}
                    alt={post.category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(13,13,34,0.85) 100%)' }} />
                </div>
                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: cat.bg, color: cat.text }}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: '#4a5068' }}>
                      <Clock size={10} /> {post.readTime} min read
                    </span>
                  </div>
                  <h3 className="text-white font-bold leading-snug mb-2 group-hover:text-blue-400 transition-colors flex-1 text-sm">
                    {post.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: '#4a5068' }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold mt-auto">
                    Read article <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent posts compact grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {recent.map((post, i) => {
            const cat = CATEGORY_COLORS[post.category] ?? DEFAULT_CAT;
            return (
              <Link
                key={i}
                href={`/blog/${post.slug}`}
                style={{
                  background:   '#0a0a1e',
                  border:       '1px solid rgba(26,26,53,1)',
                  borderRadius: '12px',
                  padding:      '16px',
                  display:      'block',
                  transition:   'border-color 0.15s',
                }}
                className="hover:border-[#2a2a45] group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{ background: cat.bg, color: cat.text }}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: '#3a3e58' }}>
                    <Clock size={9} /> {post.readTime}m
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
              </Link>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          '8px',
              padding:      '12px 24px',
              borderRadius: '12px',
              border:       '1px solid rgba(42,42,72,1)',
              color:        '#8890a8',
              fontWeight:   '600',
              fontSize:     '14px',
              transition:   'all 0.2s',
            }}
            className="hover:text-white hover:border-[#3a3a6a] hover:bg-white/5"
          >
            View All 40 Articles <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
