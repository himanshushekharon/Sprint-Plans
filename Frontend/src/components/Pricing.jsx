import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "0",
    features: ["Personal dashboard", "Core task management", "2GB Storage", "Community support"],
    buttonText: "Start for Free",
    popular: false
  },
  {
    name: "Pro",
    price: "29",
    features: ["Unlimited projects", "Advanced AI features", "20GB Storage", "Priority support", "Custom workflows"],
    buttonText: "Join Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "99",
    features: ["Unlimited everything", "Dedicated account manager", "SSO & SAML", "Custom legal terms"],
    buttonText: "Contact Sales",
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2>Power up your <span className="accent-text">workflow</span></h2>
          <p>Choose the plan that's right for you. Scale as your needs grow.</p>
        </motion.div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="card-header">
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/mo</span>
                </div>
              </div>
              <ul className="features-list">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex}>
                    <Check size={18} className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={plan.popular ? 'btn-primary' : 'btn-secondary'}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .pricing {
          padding: 100px 0;
        }
        .pricing .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .pricing-card {
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }
        .pricing-card.popular {
          border-color: #6366f1;
          box-shadow: var(--card-shadow);
          transform: scale(1.05);
        }
        .popular-badge {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #6366f1;
          color: white;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .card-header h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .price {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .currency { font-size: 1.5rem; color: #94a3b8; }
        .amount { font-size: 3.5rem; font-weight: 800; color: white; }
        .period { color: #94a3b8; }
        
        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }
        .features-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #94a3b8;
        }
        .check-icon { color: #6366f1; flex-shrink: 0; }
        
        .pricing-card button {
          width: 100%;
        }

        @media (max-width: 992px) {
          .pricing-card.popular {
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default Pricing;
