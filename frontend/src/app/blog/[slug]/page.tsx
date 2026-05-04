import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost, getRelatedPosts } from '@/data/blog-posts';
import { LandingNav } from '@/components/landing/LandingNav';
import { Footer } from '@/components/landing/Footer';
import { Clock, ArrowLeft, Tag } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title:       post.title,
    description: post.excerpt,
    keywords:    post.tags.join(', '),
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      type:        'article',
      publishedTime: new Date(post.date).toISOString(),
      tags:        post.tags,
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  // Simple markdown-to-HTML renderer (for the content)
  const html = renderMarkdown(post.content);

  return (
    <div className="min-h-screen bg-[#070710]">
      <LandingNav />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-[#08081a] border-b border-[#1e1e3a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#4a4a6a] hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-400">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#3a3a5a]">
                <Clock size={12} /> {post.readTime} min read
              </span>
              <span className="text-xs text-[#3a3a5a]">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-[#6a6a8a] text-lg leading-relaxed">{post.excerpt}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Article */}
            <article className="lg:col-span-3">
              <div
                className="prose-dark"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#1e1e3a]">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#0f0f22] border border-[#1e1e3a] rounded-full text-xs text-[#4a4a6a]">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* CTA */}
              <div className="panel p-5 sticky top-24">
                <h3 className="text-white font-bold mb-2 text-sm">Ready to Trade?</h3>
                <p className="text-[#4a4a6a] text-xs mb-4 leading-relaxed">
                  Apply what you've learned on BaseDEX — the leading perp DEX on Base.
                </p>
                <Link
                  href="/trade"
                  className="block text-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl text-white text-xs font-bold transition-all mb-2"
                >
                  Launch Trading App
                </Link>
                <Link href="/#faq" className="block text-center py-2 text-xs text-[#4a4a6a] hover:text-white transition-colors">
                  View FAQ →
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-white font-bold text-sm mb-3">Related Articles</h3>
                  <div className="space-y-3">
                    {related.map((r, i) => (
                      <Link key={i} href={`/blog/${r.slug}`} className="block panel p-3 hover:border-[#2a2a4a] transition-all">
                        <p className="text-xs font-semibold text-white hover:text-blue-400 transition-colors leading-snug">{r.title}</p>
                        <span className="text-[10px] text-[#3a3a5a] mt-1 block">{r.readTime} min read</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/`([^`]+)`/g,     '<code>$1</code>')
    .replace(/```[\w]*\n([\s\S]+?)```/g, '<pre>$1</pre>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ').map((c: string) => `<td>${c}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^\[([^\]]+)\]\(([^)]+)\)/gm, '<a href="$2">$1</a>')
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith('<') || line.trim() === '') return line;
      return `<p>${line}</p>`;
    })
    .replace(/\n{2,}/g, '\n');
}
