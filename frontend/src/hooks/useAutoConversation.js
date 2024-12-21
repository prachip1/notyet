// src/hooks/useAutoConversation.js
import { useState, useCallback } from 'react';

export const useAutoConversation = () => {
  const [conversationStage, setConversationStage] = useState('initial');

  // Predefined conversation flows for different situations
  const conversationFlows = {
    grounding: [
      "Let's try something to help you feel more grounded.",
      "Can you tell me three things you can see right now?",
      "Good. Now, what are three things you can hear?",
      "Finally, can you feel three things touching your body right now? Like your feet on the ground?",
    ],
    breathing: [
      "Let's take some deep breaths together.",
      "Inhale slowly through your nose... 2... 3... 4...",
      "Now hold... 2... 3...",
      "And exhale through your mouth... 2... 3... 4...",
    ],
    silent: [
      "I'm here with you. You don't need to say anything.",
      "Just focus on your breathing.",
      "You're safe right now.",
      "This feeling will pass.",
    ]
  };

  const getNextPrompt = useCallback((flowType) => {
    if (!conversationFlows[flowType]) {
      return conversationFlows.grounding[0];
    }
    return conversationFlows[flowType][Math.floor(Math.random() * conversationFlows[flowType].length)];
  }, []);

  const handleSilence = useCallback((duration) => {
    if (duration > 10000) { // If silent for more than 10 seconds
      return getNextPrompt('silent');
    }
    return null;
  }, [getNextPrompt]);

  return {
    nextPrompt: getNextPrompt,
    handleSilence,
    setConversationStage,
    conversationStage,
    conversationFlows
  };
};