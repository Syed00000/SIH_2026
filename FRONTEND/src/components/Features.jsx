import React from 'react';
import { Zap, ShieldCheck, BarChart3 } from 'lucide-react';

const featureList = [
  {
    icon: <Zap size={24} />,
    title: "Vite Powered",
    description: "Instant server start and fast HMR for seamless frontend developer experience."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Modular Component Architecture",
    description: "Scalable folder structure with reusable React hooks and components."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Interactive Analytics",
    description: "Live visual tracking, state synchronization, and REST/GraphQL ready endpoints."
  }
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <h2>Key Features</h2>
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
