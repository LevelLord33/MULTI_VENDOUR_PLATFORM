/**
 * Advanced Voice & Speech Synthesis / Recognition Engine for HubBot
 * Supports:
 * - Robust Speech-to-Text (STT) via Web Speech API with silence auto-send & interim stream
 * - Text-to-Speech (TTS) via SpeechSynthesis with garbage-collection protection, sentence pacing & resume heartbeat
 * - Continuous Speech-to-Speech (STS) conversational loop
 * - Subtle Web Audio chimes for listening & completion feedback
 */

// Global registry to prevent V8 garbage collection of utterances during playback
if (typeof window !== 'undefined') {
  window.__hubbotUtterances = window.__hubbotUtterances || new Set();
}

export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
}

/**
 * Preload and cache natural voices across browsers
 */
let cachedVoices = [];
function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  cachedVoices = window.speechSynthesis.getVoices() || [];
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Clean and normalize text specifically for natural voice output
 */
export function cleanTextForSpeech(rawText) {
  if (!rawText) return '';

  return (
    rawText
      // Remove HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, ' ')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown links [Label](url) -> Label
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Convert Rupee sign to words
      .replace(/₹\s*([0-9,.]+)/g, '$1 rupees')
      .replace(/₹/g, ' rupees ')
      // Expand common acronyms for clean voice pronunciation
      .replace(/\bAWB\b/g, 'A W B')
      .replace(/\bOTP\b/g, 'O T P')
      .replace(/\bCOD\b/g, 'Cash on delivery')
      .replace(/\bGST\b/g, 'G S T')
      .replace(/\bHSN\b/g, 'H S N')
      .replace(/\bSKU\b/g, 'S K U')
      .replace(/\bETA\b/g, 'E T A')
      .replace(/\bNEFT\b/g, 'N E F T')
      .replace(/\bFAQ\b/gi, 'F A Q')
      .replace(/\bT\+3\b/g, 'T plus 3 days')
      // Remove markdown bold and italic markers
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove markdown headers
      .replace(/^#+\s+/gm, '')
      // Remove blockquote arrows
      .replace(/^>\s*/gm, '')
      // Remove bullet points and dashes
      .replace(/^[\s•*-]+\s*/gm, '')
      // Clean emojis that sound unnatural when spoken
      .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      // Replace table pipes with commas
      .replace(/\|/g, ', ')
      // Replace double dashes or hyphens
      .replace(/--+/g, ', ')
      // Replace multiple newlines with a period and space for breathing pauses
      .replace(/\n+/g, '. ')
      // Clean multiple punctuation and spaces
      .replace(/\.{2,}/g, '.')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Split long text into manageable sentences to prevent browser speech synthesis timeouts
 */
export function splitIntoSentences(cleanText) {
  if (!cleanText) return [];
  // Match sentence endings
  const rawSentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
  const results = [];

  for (let s of rawSentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if (trimmed.length > 160) {
      // Split by commas or semicolons
      const subParts = trimmed.split(/[,;]\s+/);
      for (let p of subParts) {
        if (p.trim()) results.push(p.trim());
      }
    } else {
      results.push(trimmed);
    }
  }

  return results.length > 0 ? results : [cleanText];
}

/**
 * Select the best available natural English voice
 */
export function getBestEnglishVoice() {
  if (!isSpeechSynthesisSupported()) return null;

  if (!cachedVoices || cachedVoices.length === 0) {
    loadVoices();
  }
  const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
  if (voices.length === 0) return null;

  return (
    voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online'))) ||
    voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Jenny') ||
          v.name.includes('Guy') ||
          v.name.includes('Aria') ||
          v.name.includes('Zira'))
    ) ||
    voices.find((v) => v.lang === 'en-IN') ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] ||
    null
  );
}

let activePlaybackController = null;
let speechHeartbeatTimer = null;

function startSpeechHeartbeat() {
  stopSpeechHeartbeat();
  // Chrome bug workaround: speechSynthesis stops firing events if not resumed periodically
  speechHeartbeatTimer = setInterval(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 4000);
}

function stopSpeechHeartbeat() {
  if (speechHeartbeatTimer) {
    clearInterval(speechHeartbeatTimer);
    speechHeartbeatTimer = null;
  }
}

/**
 * Stop any ongoing speech synthesis immediately
 */
export function stopSpeaking() {
  stopSpeechHeartbeat();
  if (!isSpeechSynthesisSupported()) return;
  try {
    if (activePlaybackController) {
      activePlaybackController.cancelled = true;
      activePlaybackController = null;
    }
    if (window.__hubbotUtterances) {
      window.__hubbotUtterances.clear();
    }
    window.speechSynthesis.cancel();
  } catch (err) {
    console.warn('stopSpeaking error:', err);
  }
}

/**
 * Speak text smoothly using chunked SpeechSynthesisUtterance with Chrome pause protection
 */
export function speakText(rawText, options = {}) {
  if (!isSpeechSynthesisSupported()) {
    if (options.onError) options.onError(new Error('SpeechSynthesis not supported'));
    return null;
  }

  stopSpeaking();

  const clean = cleanTextForSpeech(rawText);
  if (!clean) {
    if (options.onEnd) options.onEnd();
    return null;
  }

  const sentences = splitIntoSentences(clean);
  const voice = options.voice || getBestEnglishVoice();
  const rate = options.rate || 1.05;
  const pitch = options.pitch || 1.0;

  const controller = {
    cancelled: false,
    cancel() {
      this.cancelled = true;
      stopSpeaking();
    }
  };

  activePlaybackController = controller;

  let currentIndex = 0;

  if (options.onStart) {
    options.onStart();
  }

  startSpeechHeartbeat();

  const speakNext = () => {
    if (controller.cancelled || currentIndex >= sentences.length) {
      stopSpeechHeartbeat();
      if (activePlaybackController === controller) {
        activePlaybackController = null;
      }
      if (options.onEnd && !controller.cancelled) {
        options.onEnd();
      }
      return;
    }

    const sentence = sentences[currentIndex];
    const utterance = new SpeechSynthesisUtterance(sentence);
    if (voice) {
      utterance.voice = voice;
    } else {
      utterance.lang = 'en-US';
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pin to global set to prevent garbage collection
    if (window.__hubbotUtterances) {
      window.__hubbotUtterances.add(utterance);
    }

    utterance.onend = () => {
      if (window.__hubbotUtterances) {
        window.__hubbotUtterances.delete(utterance);
      }
      currentIndex++;
      speakNext();
    };

    utterance.onerror = (e) => {
      if (window.__hubbotUtterances) {
        window.__hubbotUtterances.delete(utterance);
      }
      // Ignore user-initiated cancel errors
      if (e.error === 'canceled' || e.error === 'interrupted') {
        return;
      }
      console.warn('SpeechSynthesis sentence error:', e);
      currentIndex++;
      speakNext();
    };

    try {
      // Ensure synthesizer is not in a paused state (Chrome quirk)
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to speak utterance:', err);
      if (options.onError) options.onError(err);
    }
  };

  // Small timeout after cancel() prevents Chromium audio glitch
  setTimeout(speakNext, 50);

  return controller;
}

/**
 * Speech Recognition factory with continuous listening & silence auto-detection
 */
export function createSpeechRecognizer({
  onResult,
  onInterim,
  onEnd,
  onError,
  lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US'
}) {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognitionClass();

  // continuous = true prevents Chrome from dropping connection on 1-second pause
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.lang = lang;
  recognizer.maxAlternatives = 1;

  let finalTranscript = '';
  let latestCapturedSpeech = '';
  let silenceTimer = null;
  let hasDispatchedResult = false;
  let isManualAbort = false;

  const resetSilenceTimer = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    // After 1800ms of silence after speech, finalize and trigger result automatically
    silenceTimer = setTimeout(() => {
      const speech = (finalTranscript + ' ' + latestCapturedSpeech).trim();
      if (speech && !hasDispatchedResult) {
        hasDispatchedResult = true;
        try {
          recognizer.stop();
        } catch {
          // ignore
        }
        if (onResult) {
          onResult(speech);
        }
      }
    }, 1800);
  };

  recognizer.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const item = event.results[i];
      const text = item[0].transcript;
      if (item.isFinal) {
        finalTranscript += text + ' ';
      } else {
        interim += text;
      }
    }

    latestCapturedSpeech = interim;
    const combined = (finalTranscript + ' ' + interim).trim();

    if (combined) {
      if (onInterim) {
        onInterim(combined);
      }
      resetSilenceTimer();
    }
  };

  recognizer.onerror = (event) => {
    // 'no-speech' is non-fatal if continuous is true or user paused
    if (event.error === 'no-speech') {
      const speech = (finalTranscript + ' ' + latestCapturedSpeech).trim();
      if (speech && !hasDispatchedResult) {
        hasDispatchedResult = true;
        if (onResult) onResult(speech);
      }
      return;
    }

    console.warn('SpeechRecognition error:', event.error);
    if (silenceTimer) clearTimeout(silenceTimer);

    if (onError && !isManualAbort) {
      onError(event);
    }
  };

  recognizer.onend = () => {
    if (silenceTimer) clearTimeout(silenceTimer);

    const speech = (finalTranscript + ' ' + latestCapturedSpeech).trim();

    if (speech && !hasDispatchedResult && !isManualAbort) {
      hasDispatchedResult = true;
      if (onResult) {
        onResult(speech);
      }
    }

    if (onEnd) {
      onEnd(speech);
    }
  };

  return {
    start() {
      finalTranscript = '';
      latestCapturedSpeech = '';
      hasDispatchedResult = false;
      isManualAbort = false;
      try {
        recognizer.start();
      } catch (err) {
        // Recognition already started or error
        console.warn('recognizer.start() error:', err);
      }
    },
    stop() {
      if (silenceTimer) clearTimeout(silenceTimer);
      const speech = (finalTranscript + ' ' + latestCapturedSpeech).trim();
      if (speech && !hasDispatchedResult) {
        hasDispatchedResult = true;
        if (onResult) {
          onResult(speech);
        }
      }
      try {
        recognizer.stop();
      } catch {
        // ignore
      }
    },
    abort() {
      isManualAbort = true;
      if (silenceTimer) clearTimeout(silenceTimer);
      try {
        recognizer.abort();
      } catch {
        // ignore
      }
    },
    getCapturedText() {
      return (finalTranscript + ' ' + latestCapturedSpeech).trim();
    }
  };
}

/**
 * Play gentle tone for listening feedback (zero external audio files needed)
 */
export function playChime(type = 'start') {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'start') {
      // Pleasant rising ding
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'end') {
      // Soft confirmation blip
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Audio context may require user interaction or be blocked
  }
}
