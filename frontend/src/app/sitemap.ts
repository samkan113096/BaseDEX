import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://basedex.fi';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,         lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/trade`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/blog`,  lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url:             `${base}/blog/${post.slug}`,
    lastModified:    new Date(post.date),
    changeFrequency: 'monthly',
    priority:        post.featured ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
