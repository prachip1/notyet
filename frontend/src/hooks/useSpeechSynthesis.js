// src/hooks/useSpeechSynthesis.js
import { useState, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Initialize voices when available
  useCallback(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Load voices immediately if available
    loadVoices();

    // Chrome loads voices asynchronously, so we need this event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported');
        resolve();
        return;
      }

      // Cancel any ongoing speech
      cancelSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings
      utterance.rate = 1; // Normal speed
      utterance.pitch = 1; // Normal pitch
      utterance.volume = 1; // Full volume

      // Try to use a female English voice if available
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Google UK English Female')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setSpeaking(false);
        resolve();
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    });
  }, [voices]);

  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }, []);

  return {
    speak,
    speaking,
    cancelSpeech,
    pause,
    resume,
    voices
  };
};