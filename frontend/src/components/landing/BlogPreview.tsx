import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog-posts';
import { ArrowRight, Clock, Tag } from 'lucide-react';

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
};

export function BlogPreview() {
  const featured = BLOG_POSTS.filter(p => p.featured).slice(0, 3);
  const recent   = BLOG_POSTS.filter(p => !p.featured).slice(0, 6);

  return (
    <section id="blog" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              Knowledge Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Learn to Trade Better
            </h2>
            <p className="text-[#6a6a8a] mt-2">40+ guides on DeFi, derivatives, and Base network.</p>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            View all posts <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured posts */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featured.map((post, i) => (
            <BlogCard key={i} post={post} />
          ))}
        </div>

        {/* Recent posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="panel p-4 hover:border-[#2a2a4a] transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${CATEGORY_COLORS[post.category] ?? 'bg-[#1e1e3a] text-[#8888aa]'}`}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#3a3a5a]">
                  <Clock size={10} /> {post.readTime}m
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2a2a4a] text-[#8888aa] hover:text-white hover:border-[#3a3a6a] hover:bg-white/5 transition-all font-semibold text-sm">
            View All 40 Articles <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[0] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="panel overflow-hidden hover:border-[#2a2a4a] transition-all group flex flex-col">
      <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/20 h-32 flex items-center justify-center">
        <span className="text-5xl font-black text-gradient opacity-50">{post.category.slice(0,1)}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${CATEGORY_COLORS[post.category] ?? 'bg-[#1e1e3a] text-[#8888aa]'}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#3a3a5a]">
            <Clock size={10} /> {post.readTime} min read
          </span>
        </div>
        <h3 className="text-white font-bold leading-snug mb-2 group-hover:text-blue-400 transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-[#4a4a6a] text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-1 mt-3 text-blue-400 text-xs font-semibold">
          Read article <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}
