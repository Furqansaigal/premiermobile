import React from 'react';

const TRUST_STATS = [
  { number: '5.0 ★', label: 'Google Profile Rating' },
  { number: '2024', label: 'Established' },
  { number: '4', label: 'Central TX Metros' },
  { number: '100%', label: 'Mobile Service' },
  { number: '500+', label: 'Vehicles Detailed' },
  { number: 'Fully Mobile', label: 'We Come To You' },
  { number: 'Premium', label: 'Detailing Products' },
];

const StatSet: React.FC<{ hidden?: boolean }> = ({ hidden = false }) => (
  <div className="stats-marquee__set" aria-hidden={hidden}>
    {TRUST_STATS.map((stat) => (
      <div className="stats-marquee__item" key={stat.label}>
        <span className="stats-marquee__number">{stat.number}</span>
        <span className="stats-marquee__label">{stat.label}</span>
      </div>
    ))}
  </div>
);

export const Stats: React.FC = () => {
  return (
    <section className="stats-marquee bg-surface-alt border-y border-border-subtle" aria-label="Premier Mobile trust highlights">
      <div className="stats-marquee__track">
        <StatSet />
        <StatSet hidden />
      </div>
    </section>
  );
};
