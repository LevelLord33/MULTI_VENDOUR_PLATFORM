import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChatbot } from '../contexts/ChatbotContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import {
  Bot, Send, Sparkles, Trash2, ArrowRight, ExternalLink,
  Copy, Check, Package, Tag, Truck, ShieldCheck, Store,
  HelpCircle, UserCheck, Layers, ChevronRight, Zap, RefreshCw,
  ShoppingBag, Megaphone, Box, AlertTriangle, FileText, DollarSign,
  PhoneCall, Key, Mic, MicOff, Volume2, VolumeX, Square, Radio, Headphones
} from 'lucide-react';
import '../styles/marketplace.css';

export default function HubAssistantPage({ defaultRole = null }) {
  const {
    messages,
    isTyping,
    activeRole,
    switchRole,
    clearHistory,
    sendMessage,
    // Voice Assistant APIs
    voiceMode,
    toggleVoiceMode,
    ttsEnabled,
    toggleTts,
    isSpeaking,
    speakingMessageId,
    speakMessage,
    stopSpeaking,
    isListening,
    interimTranscript,
    voiceStatusText,
    startListening,
    stopListening,
    cancelListening
  } = useChatbot();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputVal, setInputVal] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Strict context determination: Vendors only see Vendor Co-Pilot, customers only see Customer Concierge
  const isVendorContext = defaultRole === 'vendor' || user?.type === 'vendor' || user?.role === 'vendor' || window.location.pathname.startsWith('/vendor');
  const targetRole = isVendorContext ? 'vendor' : 'customer';

  useEffect(() => {
    if (activeRole !== targetRole) {
      switchRole(targetRole);
    }
  }, [targetRole, activeRole, switchRole]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    const text = (inputVal || interimTranscript || '').trim();
    if (!text || isTyping) return;
    const wasVoice = Boolean(isListening || interimTranscript);
    if (isListening) {
      stopListening();
    }
    setInputVal('');
    sendMessage(text, activeRole, { isVoice: wasVoice });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const customerLaunchers = [
    { icon: <Package size={16} />, title: 'Track My Order', prompt: 'Track my recent order status and delivery courier' },
    { icon: <Tag size={16} />, title: 'Active Coupons & Deals', prompt: 'Show active discount coupons and promo codes' },
    { icon: <Key size={16} />, title: 'Doorstep Delivery OTP', prompt: 'How does doorstep Cash on Delivery OTP work?' },
    { icon: <RefreshCw size={16} />, title: '7-Day Return Policy', prompt: 'What is the return and replacement policy?' },
    { icon: <Truck size={16} />, title: 'Free Shipping Threshold', prompt: 'What are the shipping charges and delivery time?' },
    { icon: <ShieldCheck size={16} />, title: 'Brand Warranty & Invoices', prompt: 'Are products covered by manufacturer brand warranty?' },
    { icon: <Sparkles size={16} />, title: 'Top Electronics Deals', prompt: 'Recommend top rated electronics under 5000' },
    { icon: <PhoneCall size={16} />, title: 'Customer Support Helpline', prompt: 'What is the customer support phone number and helpline?' }
  ];

  const vendorLaunchers = [
    { icon: <Package size={16} />, title: 'Add Physical Product', prompt: 'How do I add a new physical product with SKU, HSN, and GST?' },
    { icon: <Truck size={16} />, title: 'Order Fulfillment & AWB', prompt: 'How do I process orders, print labels, and assign courier waybill?' },
    { icon: <DollarSign size={16} />, title: 'Vendor Plans & Fees', prompt: 'What are the vendor subscription plans and commission rates?' },
    { icon: <Zap size={16} />, title: 'Payouts & T+3 Settlement', prompt: 'When will I receive payouts and how does bank settlement work?' },
    { icon: <FileText size={16} />, title: 'GST Tax Invoices & Twilio', prompt: 'How do GST invoices and automated Twilio WhatsApp alerts work?' },
    { icon: <Megaphone size={16} />, title: 'Marketing & Store Coupons', prompt: 'How can I create promotional coupons and boost listings?' },
    { icon: <Box size={16} />, title: 'Smart Inventory Alerts', prompt: 'How do inventory alerts work to prevent out-of-stock penalties?' },
    { icon: <AlertTriangle size={16} />, title: 'Disputes & Return Defense', prompt: 'How do vendors handle customer returns and dispute claims?' },
    { icon: <Store size={16} />, title: 'Storefront Customization', prompt: 'How do I customize my store banner, logo, and operating hours?' }
  ];

  const currentLaunchers = targetRole === 'vendor' ? vendorLaunchers : customerLaunchers;

  // Markdown-like text renderer
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return lines.map((line, idx) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const withCode = formatted.replace(
        /`([^`]+)`/g,
        '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-family:monospace;font-weight:700;color:var(--primary);">$1</code>'
      );

      if (line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 8, margin: '4px 0' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: withCode.replace(/^(\s*)[•*]\s*/, '') }} />
          </div>
        );
      }

      if (line.trim().startsWith('> ')) {
        return (
          <div
            key={idx}
            style={{
              padding: '8px 12px',
              margin: '8px 0',
              borderLeft: '3px solid var(--primary)',
              background: 'rgba(79, 70, 229, 0.08)',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.88rem'
            }}
            dangerouslySetInnerHTML={{ __html: withCode.replace(/^>\s*/, '') }}
          />
        );
      }

      if (!line.trim()) {
        return <div key={idx} style={{ height: 8 }} />;
      }

      return (
        <div key={idx} style={{ margin: '3px 0' }} dangerouslySetInnerHTML={{ __html: withCode }} />
      );
    });
  };

  const isCustomerOrVendorSignedIn = !!user && (
    user.type === 'customer' ||
    user.type === 'vendor' ||
    user.role === 'customer' ||
    user.role === 'vendor'
  );

  if (!isCustomerOrVendorSignedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
          <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', background: 'var(--surface)', borderRadius: 20, padding: '40px 32px', border: '1px solid var(--border)', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 72, height: 72, margin: '0 auto 20px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(124, 58, 237, 0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
              🤖
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--text-primary)' }}>
              Sign In Required to Access HubBot
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 28px' }}>
              HubBot Voice & AI Concierge is exclusively enabled for our signed-in customers and verified merchants. Please sign in to your customer or merchant account to chat!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, fontWeight: 700 }}
              >
                🔑 Customer Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/vendor/login')}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, fontWeight: 700 }}
              >
                🏪 Vendor Sign In
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '24px 20px', maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* ── TOP HERO HEADER & ROLE TOGGLE BAR ── */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 20,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Bot size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Vendor Hub AI Assistant
                </h1>
                <span
                  style={{
                    background: activeRole === 'vendor' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                    color: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999
                  }}
                >
                  {activeRole === 'vendor' ? 'Vendor Co-Pilot' : 'Customer Concierge'}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {activeRole === 'vendor'
                  ? 'Professional merchant assistance for product listings, order fulfillment, commission, and payouts.'
                  : 'Instant 24/7 shopping assistant for order tracking, OTP security, verified coupons, and product advice.'}
              </p>
            </div>
          </div>

          {/* Context-Locked Role Badge (No overlap between Customer and Vendor) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: targetRole === 'vendor' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(79, 70, 229, 0.1)',
                border: targetRole === 'vendor' ? '1px solid #10B981' : '1px solid var(--primary)',
                padding: '7px 16px',
                borderRadius: 12,
                fontSize: '0.82rem',
                fontWeight: 700,
                color: targetRole === 'vendor' ? '#047857' : 'var(--primary)'
              }}
            >
              {targetRole === 'vendor' ? <Store size={15} color="#10B981" /> : <ShoppingBag size={15} color="var(--primary)" />}
              <span>{targetRole === 'vendor' ? 'Vendor Co-Pilot Session' : 'Customer Concierge Session'}</span>
            </div>

            {/* Voice Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleVoiceMode}
              title={voiceMode ? "Speech-to-Speech Voice Assistant Active (Click to Exit)" : "Turn on Speech-to-Speech (STS) Voice Assistant"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                border: voiceMode ? '1.5px solid #818CF8' : '1px solid var(--border)',
                background: voiceMode ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'var(--surface-2)',
                color: voiceMode ? 'white' : 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: voiceMode ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              {voiceMode ? <Radio size={14} className="voice-orb-active" /> : <Mic size={14} />}
              <span>{voiceMode ? '🎙️ Voice Active' : '🎙️ Voice Mode'}</span>
            </button>

            {/* TTS Mute/Unmute */}
            <button
              type="button"
              onClick={toggleTts}
              title={ttsEnabled ? "Read Aloud (TTS) Enabled - Click to Mute" : "Read Aloud (TTS) Muted - Click to Unmute"}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: ttsEnabled ? 'rgba(79, 70, 229, 0.1)' : 'var(--surface-2)',
                border: ttsEnabled ? '1px solid var(--primary)' : '1px solid var(--border)',
                color: ttsEnabled ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {ttsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
            </button>

            <button
              type="button"
              onClick={clearHistory}
              title="Reset Conversation"
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Trash2 size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ── MAIN WORKSPACE: SIDEBAR + CHAT STREAM ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Left Sidebar: Quick Topics & Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Persona Overview Card */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{activeRole === 'vendor' ? '🏪' : '🛍️'}</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {activeRole === 'vendor' ? 'Vendor Co-Pilot Deck' : 'Customer Help Desk'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {activeRole === 'vendor'
                  ? 'Get accurate checklists for inventory listings, GST tax calculations, order packing, courier waybills, and dispute arbitration.'
                  : 'Search verified products, track shipments with live courier waybills, find active promo codes, and understand OTP protection.'}
              </p>
            </div>

            {/* Quick Launch Actions */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 14,
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-muted)',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Sparkles size={13} color="var(--primary)" />
                <span>Recommended Topics</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentLaunchers.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(item.prompt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 10,
                      background: 'var(--surface-2)',
                      border: '1px solid transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
                      e.currentTarget.style.background = 'var(--surface)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.background = 'var(--surface-2)';
                    }}
                  >
                    <span style={{ color: activeRole === 'vendor' ? '#10B981' : 'var(--primary)' }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>{item.title}</span>
                    <ChevronRight size={13} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Direct Links */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Direct Platform Portals
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/shop')}
                style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: '0.8rem' }}
              >
                <ShoppingBag size={14} />
                <span>Customer Marketplace</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate(user?.type === 'vendor' ? '/vendor/dashboard' : '/vendor/login')}
                style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: '0.8rem' }}
              >
                <Store size={14} />
                <span>Vendor Merchant Dashboard</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/stores')}
                style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: '0.8rem' }}
              >
                <Layers size={14} />
                <span>Explore Verified Stores</span>
              </button>
            </div>
          </div>

          {/* Right Main Chat Panel */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              height: '75vh',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}
          >
            {/* Messages Feed */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                background: 'var(--surface)'
              }}
            >
              {/* ── SPEECH-TO-SPEECH (STS) VOICE ASSISTANT STAGE ── */}
              {voiceMode && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(139, 92, 246, 0.12) 100%)',
                    border: '1.5px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 16,
                    padding: '20px 24px',
                    marginBottom: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 12,
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                      <Radio size={16} className={isSpeaking || isListening ? "voice-orb-active" : ""} />
                      <span>SPEECH-TO-SPEECH (STS) CONVERSATIONAL VOICE ASSISTANT</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={toggleVoiceMode}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Exit Voice Mode
                    </button>
                  </div>

                  {/* Pulsing Interactive Voice Orb */}
                  <div 
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else if (isListening) {
                        stopListening();
                      } else {
                        startListening((t) => {
                          if (t && t.trim()) {
                            sendMessage(t, activeRole, { isVoice: true });
                          }
                        });
                      }
                    }}
                    className={isListening ? "voice-mic-active" : isSpeaking ? "voice-orb-active" : ""}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: isListening 
                        ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                        : isSpeaking 
                        ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                        : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isListening 
                        ? '0 4px 25px rgba(239, 68, 68, 0.5)'
                        : '0 4px 25px rgba(79, 70, 229, 0.45)',
                      transition: 'all 0.2s ease'
                    }}
                    title={isSpeaking ? "Tap to interrupt speech" : isListening ? "Listening... Tap to stop" : "Tap to speak now"}
                  >
                    {isListening ? (
                      <Mic size={32} />
                    ) : isSpeaking ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 28 }}>
                        <div className="voice-wave-bar" />
                        <div className="voice-wave-bar" />
                        <div className="voice-wave-bar" />
                        <div className="voice-wave-bar" />
                        <div className="voice-wave-bar" />
                      </div>
                    ) : (
                      <Headphones size={30} />
                    )}
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {isListening ? '🎙️ Listening... Speak your query aloud' : isSpeaking ? '🔊 HubBot is speaking...' : isTyping ? '⚡ Thinking...' : 'Ready — Speak now or tap orb to start'}
                  </div>
                  {interimTranscript && (
                    <div style={{ fontSize: '0.84rem', color: 'var(--primary)', fontStyle: 'italic', maxWidth: '85%' }}>
                      "{interimTranscript}..."
                    </div>
                  )}
                </div>
              )}

              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isBot ? 'flex-start' : 'flex-end',
                      maxWidth: '85%',
                      alignSelf: isBot ? 'flex-start' : 'flex-end'
                    }}
                  >
                    {/* Sender Identity */}
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {isBot ? (
                        <>
                          <Bot size={13} color="var(--primary)" />
                          <span style={{ fontWeight: 700 }}>
                            {msg.role === 'vendor' ? 'HubBot Vendor Co-Pilot' : 'HubBot Concierge'}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontWeight: 700 }}>You</span>
                      )}
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Speech Bubble */}
                    <div
                      style={{
                        padding: '14px 18px',
                        borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        background: isBot ? 'var(--surface-2)' : 'var(--primary)',
                        color: isBot ? 'var(--text-primary)' : 'white',
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: isBot ? '1px solid var(--border)' : 'none',
                        wordBreak: 'break-word'
                      }}
                    >
                      {renderFormattedText(msg.text)}
                    </div>

                    {/* TTS Read Aloud / Stop Button for Bot Messages */}
                    {isBot && (
                      <button
                        type="button"
                        onClick={() => speakMessage(msg.id, msg.text)}
                        title={speakingMessageId === msg.id ? "Stop voice playback" : "Listen aloud (Text-to-Speech)"}
                        style={{
                          background: speakingMessageId === msg.id ? 'rgba(79, 70, 229, 0.14)' : 'none',
                          border: speakingMessageId === msg.id ? '1px solid var(--primary)' : 'none',
                          color: speakingMessageId === msg.id ? 'var(--primary)' : 'var(--text-muted)',
                          borderRadius: 8,
                          padding: '3px 8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          marginTop: 6,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <Square size={11} fill="currentColor" />
                            <span>Stop Playing</span>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 12, marginLeft: 3 }}>
                              <div className="voice-wave-bar" style={{ width: 2, animationDuration: '0.7s' }} />
                              <div className="voice-wave-bar" style={{ width: 2, animationDuration: '0.5s' }} />
                              <div className="voice-wave-bar" style={{ width: 2, animationDuration: '0.9s' }} />
                            </div>
                          </>
                        ) : (
                          <>
                            <Volume2 size={13} />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* ── ACTION CARDS ── */}
                    {isBot && msg.actionCards?.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: msg.actionCards.length > 1 ? 'repeat(auto-fit, minmax(220px, 1fr))' : '1fr',
                          gap: 10,
                          marginTop: 10,
                          width: '100%'
                        }}
                      >
                        {msg.actionCards.map((card, cIdx) => {
                          if (card.type === 'order_card') {
                            return (
                              <div
                                key={cIdx}
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 12,
                                  padding: '12px 14px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.84rem' }}>
                                    Order #{card.orderId}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.7rem',
                                      padding: '2px 8px',
                                      borderRadius: 6,
                                      fontWeight: 800,
                                      background: card.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                                      color: card.status === 'Delivered' ? '#10B981' : 'var(--primary)'
                                    }}
                                  >
                                    {card.status}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                                  {card.courierPartner} • Waybill: <code style={{ fontWeight: 700 }}>{card.trackingNumber}</code>
                                </div>
                                {card.deliveryOtp && (
                                  <div
                                    style={{
                                      padding: '4px 8px',
                                      background: 'rgba(16, 185, 129, 0.1)',
                                      borderRadius: 6,
                                      fontSize: '0.75rem',
                                      color: '#059669',
                                      fontWeight: 700,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      marginBottom: 8
                                    }}
                                  >
                                    <span>Doorstep OTP:</span>
                                    <code style={{ fontSize: '0.9rem', letterSpacing: 2 }}>{card.deliveryOtp}</code>
                                  </div>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => navigate('/shop/orders')}
                                  style={{ width: '100%', fontSize: '0.76rem', gap: 6 }}
                                >
                                  <span>View in My Orders</span>
                                  <ExternalLink size={12} />
                                </button>
                              </div>
                            );
                          }

                          if (card.type === 'coupon_card') {
                            const isCopied = copiedCode === card.code;
                            return (
                              <div
                                key={cIdx}
                                style={{
                                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                                  border: '1px dashed var(--primary)',
                                  borderRadius: 12,
                                  padding: '12px 14px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                  <span
                                    style={{
                                      background: 'var(--primary)',
                                      color: 'white',
                                      padding: '2px 8px',
                                      borderRadius: 6,
                                      fontSize: '0.76rem',
                                      fontWeight: 800
                                    }}
                                  >
                                    {card.discountType === 'percentage' ? `${card.discountValue}% OFF` : `₹${card.discountValue} OFF`}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(card.code)}
                                    style={{
                                      background: isCopied ? '#10B981' : 'var(--surface)',
                                      color: isCopied ? 'white' : 'var(--primary)',
                                      border: isCopied ? 'none' : '1px solid var(--primary)',
                                      padding: '3px 8px',
                                      borderRadius: 6,
                                      fontSize: '0.74rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                    <span>{isCopied ? 'Copied!' : card.code}</span>
                                  </button>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                                  {card.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                  {card.description || `Min order: ₹${(card.minOrderValue || 0).toLocaleString('en-IN')}`}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                  <button
                                    type="button"
                                    onClick={() => navigate('/shop/cart')}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--primary)',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <span>Apply in Cart</span>
                                    <ArrowRight size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          if (card.type === 'product_card') {
                            return (
                              <div
                                key={cIdx}
                                onClick={() => navigate(`/shop/product/${card.id}`)}
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 12,
                                  padding: '10px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                              >
                                <img
                                  src={card.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                                  alt={card.name}
                                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                                    {card.name}
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                    ₹{(card.price || 0).toLocaleString('en-IN')} • In Stock
                                  </div>
                                </div>
                                <ArrowRight size={14} color="var(--primary)" />
                              </div>
                            );
                          }

                          if (card.type === 'navigation_card') {
                            return (
                              <div
                                key={cIdx}
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 12,
                                  padding: '12px 14px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                                      {card.title}
                                    </span>
                                    {card.badge && (
                                      <span
                                        style={{
                                          fontSize: '0.68rem',
                                          fontWeight: 800,
                                          padding: '1px 6px',
                                          borderRadius: 4,
                                          background: 'var(--surface-2)',
                                          color: 'var(--primary)'
                                        }}
                                      >
                                        {card.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {card.description}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => navigate(card.link)}
                                  style={{
                                    width: '100%',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    background: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                                    borderColor: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6
                                  }}
                                >
                                  <span>{card.buttonText}</span>
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}

                    {/* Quick Reply Chips */}
                    {isBot && msg.quickReplies?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {msg.quickReplies.map((reply, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => sendMessage(reply)}
                            style={{
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              borderRadius: 20,
                              padding: '4px 11px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all 0.15s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
                              e.currentTarget.style.color = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <span>{reply}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 12, width: 'fit-content' }}>
                  <Bot size={15} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>HubBot is composing professional guidance...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '14px 20px',
                background: 'var(--surface-2)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={isListening && interimTranscript ? interimTranscript : inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? (interimTranscript || '🎙️ Listening... Speak your question now')
                    : isSpeaking
                    ? '🔊 HubBot is speaking...'
                    : activeRole === 'vendor'
                    ? 'Ask or speak about product listings, courier waybills, commissions, payouts, GST invoices...'
                    : 'Ask or speak about live order tracking, delivery OTP, active coupons, 7-day returns, products...'
                }
                disabled={isTyping}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: isListening ? '1.5px solid #EF4444' : '1px solid var(--border)',
                  background: isListening ? 'rgba(239, 68, 68, 0.05)' : 'var(--surface)',
                  color: isListening ? '#DC2626' : 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
              />

              {/* Mic / Voice Input STT Button */}
              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening((speechText) => {
                      if (speechText && speechText.trim()) {
                        setInputVal(speechText.trim());
                        sendMessage(speechText.trim(), activeRole, { isVoice: true });
                      }
                    });
                  }
                }}
                title={isListening ? "Listening... click to stop" : "Speak to HubBot (Voice Input / STT)"}
                className={isListening ? "voice-mic-active" : ""}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: isListening ? '1px solid #EF4444' : '1px solid var(--border)',
                  background: isListening ? '#EF4444' : 'var(--surface)',
                  color: isListening ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  transition: 'all 0.15s ease',
                  boxShadow: isListening ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none'
                }}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? 'Stop' : 'Voice'}</span>
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={(!inputVal.trim() && !interimTranscript.trim()) || isTyping}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: (!inputVal.trim() && !interimTranscript.trim()) || isTyping ? 'not-allowed' : 'pointer',
                  opacity: (!inputVal.trim() && !interimTranscript.trim()) || isTyping ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <span>Send</span>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            © {new Date().getFullYear()} <strong>Vendor Hub</strong>. Multi-Vendor Physical Marketplace & AI Operations Assistant.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Verified 4-Digit OTP Protection</span>
            <span>•</span>
            <span>BlueDart & Delhivery Logistics</span>
            <span>•</span>
            <span>100% Physical Tax Invoices</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
