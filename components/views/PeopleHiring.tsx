'use client';

import { ExternalLink, Copy } from 'lucide-react';
import LogoChip from '@/components/ui/LogoChip';
import { HIRING_POSTS } from '@/lib/data';

interface Props {
  search?: string;
}

export default function PeopleHiring({ search }: Props) {
  let posts = HIRING_POSTS;
  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter((p) => (p.text + p.name + p.company).toLowerCase().includes(q));
  }

  const xray = (p: (typeof HIRING_POSTS)[0]) =>
    'https://www.google.com/search?q=' + encodeURIComponent(`site:linkedin.com/posts "${p.company}" "hiring" "${p.role}"`);

  return (
    <div>
      <div className="section-head">
        <h2>{posts.length} people actively hiring</h2>
        <span className="muted" style={{ fontSize: 13 }}>Sourced from LinkedIn &ldquo;hiring&rdquo; posts</span>
      </div>
      <div className="job-grid">
        {posts.map((p, i) => (
          <div key={i} className="card post">
            <div className="post-head">
              <LogoChip name={p.name} size={40} />
              <div style={{ flex: 1 }}>
                <div className="post-name">{p.name}</div>
                <div className="post-title">{p.title} · {p.when} ago</div>
              </div>
            </div>
            <div className="post-text">{p.text}</div>
            <div className="post-foot">
              <span className="badge badge-accent">{p.role}</span>
              <a className="btn btn-sm" href={xray(p)} target="_blank" rel="noopener">
                <ExternalLink size={14} /> Open post
              </a>
              <button className="btn btn-sm btn-ghost">
                <Copy size={14} /> Draft reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
