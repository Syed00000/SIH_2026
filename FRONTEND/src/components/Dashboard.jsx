import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphqlClient } from '../lib/graphqlClient';
import { Server, RotateCw, Globe } from 'lucide-react';

// Sample GraphQL Query
const GET_SAMPLE_DATA = gql`
  query GetCountries {
    countries(filter: { code: { in: ["IN", "US", "GB"] } }) {
      code
      name
      emoji
      capital
    }
  }
`;

export default function Dashboard() {
  // TanStack Query integrated with GraphQL Client
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['sampleCountries'],
    queryFn: async () => {
      try {
        return await graphqlClient.request(GET_SAMPLE_DATA);
      } catch (e) {
        // Fallback mock data if offline
        return {
          countries: [
            { code: 'IN', name: 'India', emoji: '🇮🇳', capital: 'New Delhi' },
            { code: 'US', name: 'United States', emoji: '🇺🇸', capital: 'Washington D.C.' },
            { code: 'GB', name: 'United Kingdom', emoji: '🇬🇧', capital: 'London' }
          ]
        };
      }
    }
  });

  return (
    <section id="dashboard" className="dashboard-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="text-3xl font-bold font-heading mb-2">TanStack Query & GraphQL Dashboard</h2>
          <p className="text-gray-400">Live data fetching with React Query & GraphQL Client</p>
        </div>

        <div className="glass-card dashboard-preview p-6 rounded-2xl border border-white/10 shadow-2xl">
          <div className="card-header flex justify-between items-center pb-4 mb-6 border-b border-white/10">
            <div className="card-title flex items-center gap-2 font-bold text-cyan-400">
              <Server size={20} /> System & Data Status
            </div>
            <span className="status-pill flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="status-dot w-2 h-2 rounded-full bg-emerald-400"></span> TanStack Query Active
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-400">
              <Globe size={18} /> GraphQL Query Result (Countries Endpoint)
            </h3>
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">Loading GraphQL data...</div>
            ) : error ? (
              <div className="p-4 text-center text-rose-400">Error fetching data</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.countries?.map((c) => (
                  <div key={c.code} className="bg-slate-800/60 p-4 rounded-xl border border-white/5 hover:border-indigo-500/40 transition">
                    <div className="text-2xl mb-1">{c.emoji}</div>
                    <div className="font-bold text-slate-100">{c.name}</div>
                    <div className="text-xs text-slate-400">Capital: {c.capital}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="card-footer flex justify-end">
            <button 
              className="btn btn-sm btn-secondary flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition" 
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RotateCw size={14} className={isFetching ? 'spin' : ''} />
              {isFetching ? 'Refetching...' : 'Refetch Query'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
