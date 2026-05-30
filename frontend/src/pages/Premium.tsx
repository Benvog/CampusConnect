import { useState } from 'react';
import { Link } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground.js';
import { 
  ChevronLeft,
  Sparkles,
  Check,
  X,
  Zap,
  Crown,
  Star,
  CreditCard,
  Shield,
  Heart
} from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 'KES 0',
    period: '/month',
    description: 'Basic matching experience',
    icon: Star,
    color: 'from-gray-500 to-gray-600',
    popular: false,
    features: [
      { text: '15 swipes per day', included: true },
      { text: 'See who liked you', included: false },
      { text: 'Unlimited likes', included: false },
      { text: 'Priority matching', included: false },
      { text: 'Read receipts', included: false },
      { text: 'Incognito mode', included: false },
      { text: 'Advanced filters', included: false },
      { text: 'Profile boost', included: false },
    ]
  },
  {
    id: 'campus_plus',
    name: 'CampusPlus',
    price: 'KES 299',
    period: '/month',
    description: 'Unlimited swiping experience',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      { text: 'Unlimited swipes', included: true },
      { text: 'See who liked you', included: true },
      { text: 'Unlimited likes', included: true },
      { text: 'Priority matching', included: true },
      { text: 'Read receipts', included: true },
      { text: 'Incognito mode', included: false },
      { text: 'Advanced filters', included: false },
      { text: 'Profile boost', included: false },
    ]
  },
  {
    id: 'campus_pro',
    name: 'CampusPro',
    price: 'KES 599',
    period: '/month',
    description: 'The ultimate campus experience',
    icon: Crown,
    color: 'from-teal-400 to-cyan-500',
    popular: false,
    features: [
      { text: 'Unlimited swipes', included: true },
      { text: 'See who liked you', included: true },
      { text: 'Unlimited likes', included: true },
      { text: 'Priority matching', included: true },
      { text: 'Read receipts', included: true },
      { text: 'Incognito mode', included: true },
      { text: 'Advanced filters', included: true },
      { text: 'Profile boost', included: true },
    ]
  }
];

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState('campus_plus');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    // TODO: M-PESA integration
    setTimeout(() => {
      setIsProcessing(false);
      alert(`M-PESA payment flow would start here for ${planId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative pb-20">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-xl font-bold gradient-text">Upgrade</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-6 glow-purple">
            <Crown className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Unlock Your Campus Experience
          </h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Get unlimited swipes, see who likes you, and connect faster with CampusConnect Premium
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map(plan => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div 
                key={plan.id}
                className={`
                  glass-card relative overflow-hidden transition-all cursor-pointer
                  ${plan.popular ? 'md:scale-105 border-purple-400/30' : ''}
                  ${isSelected ? 'border-purple-500/50 glow-purple' : 'hover:border-white/20'}
                `}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Gradient Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-full blur-3xl`} />

                <div className="relative z-10 p-6">
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-white/50 text-sm">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/40">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-teal-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                            <X className="w-3 h-3 text-white/30" />
                          </div>
                        )}
                        <span className={feature.included ? 'text-white text-sm' : 'text-white/40 text-sm'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing}
                    className={`
                      w-full py-3 rounded-xl font-semibold transition-all
                      ${plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30' 
                        : 'bg-white/10 text-white hover:bg-white/20'}
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {isProcessing ? 'Processing...' : plan.id === 'free' ? 'Current Plan' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* M-PESA Info */}
        <div className="glass-card p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pay with M-PESA</h3>
              <p className="text-white/50 text-sm">Secure mobile payment for Kenya</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Shield className="w-4 h-4" />
            <span>Your payment is secure and encrypted</span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Frequently Asked</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time from your profile settings.' },
              { q: 'How does M-PESA payment work?', a: 'Enter your M-PESA number, receive an STK push notification, and confirm the payment.' },
              { q: 'What happens when I upgrade?', a: 'Your premium features activate immediately after payment confirmation.' },
              { q: 'Is there a refund policy?', a: 'We offer refunds within 7 days if you\'re not satisfied with CampusPlus or CampusPro.' },
            ].map((faq, idx) => (
              <div key={idx} className="glass-card p-4">
                <h4 className="font-semibold text-white mb-1">{faq.q}</h4>
                <p className="text-white/50 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm mb-4">
            Questions? Contact us at <span className="text-purple-400">support@campusconnect.co.ke</span>
          </p>
          <Link to="/dashboard" className="btn-secondary inline-flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Maybe Later
          </Link>
        </div>
      </main>
    </div>
  );
}
