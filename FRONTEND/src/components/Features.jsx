import React from 'react';
import { Zap, ShieldCheck, BarChart3, Database } from 'lucide-react';

const featureList = [
  {
    icon: <Zap size={24} />,
    title: "Tailwind CSS Enabled",
    description: "Utility-first styling for rapid custom UI design and glassmorphism themes."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "TanStack Query",
    description: "Automatic server caching, background data refetching, and state management."
  },
  {
    icon: <Database size={24} />,
    title: "GraphQL Client",
    description: "Lightweight, type-safe GraphQL queries integrated directly with React Query."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Developer Standards (rule.md)",
    description: "Enforced coding conventions and architectural patterns for SIH 2026."
  }
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <h2>Key Platform Stack</h2>
          <p>Designed for scalability, speed, and sleek visual appeal.</p>
        </div>
        
        <div className="features-grid">
          {featureList.map((item, idx) => (
            <div key={idx} className="feature-card">
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
