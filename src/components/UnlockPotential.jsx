import { Users, Globe, Target, Briefcase, Rocket } from 'lucide-react';
import '../styles/UnlockPotential.css';

const cards = [
  {
    icon: <Users size={24} />,
    iconColor: 'blue',
    title: 'Professional Development',
    description: 'Gain hands-on experience and become a confident business leader through mentorship and training programs.',
  },
  {
    icon: <Globe size={24} />,
    iconColor: 'purple',
    title: 'Global Networking',
    description: 'Connect with innovative entrepreneurs and professionals aged 18-40 across our worldwide chapters.',
  },
  {
    icon: <Target size={24} />,
    iconColor: 'orange',
    title: 'Skill Building',
    description: 'Master business strategy, entrepreneurship, digital marketing, and more with expert-led workshops.',
  },
  {
    icon: <Briefcase size={24} />,
    iconColor: 'green',
    title: 'Strategic Partnerships',
    description: 'Build meaningful B2B relationships and joint ventures that drive mutual business growth.',
  },
  {
    icon: <Rocket size={24} />,
    iconColor: 'red',
    title: 'Exciting Opportunities',
    description: 'Attend global trade summits, business conventions, and conferences to expand your horizons.',
  },
];

export default function UnlockPotential() {
  return (
    <section className="unlock-potential section-padding">
      <div className="container">
        <div className="section-header">
          <span className="sub-heading">Why Join Us?</span>
          <h2>Unlock your business potential and make an impact</h2>
        </div>
        <div className="up-cards-grid">
          {cards.map((card, index) => (
            <div key={index} className="up-card">
              <div className={`up-card-icon ${card.iconColor}`}>
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
