/**
 * Text-to-Speech (TTS) engine using browser SpeechSynthesis API.
 * Supports language detection, slow-speed pronunciation, natural voice selection, and callbacks.
 */

export interface SpeechOptions {
  lang?: string;
  slow?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const list = this.synth.getVoices();
    if (list.length > 0) {
      this.voices = list;
      this.isVoicesLoaded = true;
    }
  }

  /**
   * Detect language tag based on script or course context.
   * e.g. Devanagari script for Hindi, Latin for English/Spanish.
   */
  detectLanguage(text: string, suggestedLang?: string): string {
    if (suggestedLang) return suggestedLang;

    // Check for Devanagari Unicode block (Hindi)
    if (/[\u0900-\u097F]/.test(text)) {
      return "hi-IN";
    }

    // Check for Spanish specific characters
    if (/[áéíóúüñ¿¡]/i.test(text)) {
      return "es-ES";
    }

    // Check for French specific characters
    if (/[àâçéèêëîïôûùüÿœæ]/i.test(text)) {
      return "fr-FR";
    }

    // Default to English
    return "en-US";
  }

  /**
   * Find best voice matching target language.
   */
  private getVoiceForLanguage(lang: string): SpeechSynthesisVoice | null {
    if (!this.voices.length && this.synth) {
      this.loadVoices();
    }
    const langPrefix = lang.split("-")[0].toLowerCase();

    // 1. Exact match with highest natural score
    const exact = this.voices.filter((v) => v.lang.toLowerCase() === lang.toLowerCase());
    if (exact.length > 0) {
      // Prioritize Google, Natural, or Premium voice if available
      const preferred = exact.find((v) => /natural|google|premium|enhanced/i.test(v.name));
      return preferred || exact[0];
    }

    // 2. Prefix match (e.g. "hi", "en", "es")
    const prefixMatch = this.voices.filter((v) =>
      v.lang.toLowerCase().startsWith(langPrefix)
    );
    if (prefixMatch.length > 0) {
      const preferred = prefixMatch.find((v) => /natural|google|premium|enhanced/i.test(v.name));
      return preferred || prefixMatch[0];
    }

    return null;
  }

  /**
   * Speak the given text with options.
   */
  speak(text: string, options: SpeechOptions = {}): boolean {
    if (!this.synth) {
      console.warn("SpeechSynthesis is not supported in this browser environment.");
      options.onError?.(new Error("Speech synthesis not supported"));
      return false;
    }

    try {
      // Cancel previous utterances so sounds don't overlap
      this.synth.cancel();

      // Clean up text if it contains surrounding quotes or punctuation artifacts
      const cleanText = text.replace(/^["'“”‘]+|["'“”‘]+$/g, "").trim();
      if (!cleanText) return false;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLang = this.detectLanguage(cleanText, options.lang);
      utterance.lang = targetLang;

      const bestVoice = this.getVoiceForLanguage(targetLang);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Speed: 0.72 for slow mode (Duolingo turtle icon), 0.95 for normal pleasant cadence
      utterance.rate = options.rate ?? (options.slow ? 0.68 : 0.92);
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        // "interrupted" / "canceled" errors happen normally when starting a new utterance
        if (e.error !== "canceled" && e.error !== "interrupted") {
          console.error("SpeechSynthesis error:", e);
        }
        options.onError?.(e);
      };

      this.synth.speak(utterance);
      return true;
    } catch (err) {
      console.error("Failed to speak text:", err);
      options.onError?.(err);
      return false;
    }
  }

  /**
   * Cancel any active speaking.
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechEngine = new SpeechEngine();
