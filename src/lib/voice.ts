
export function speak(text: string) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a robotic/system voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.name.includes("Google") || 
    v.name.includes("Robot") || 
    v.name.includes("System")
  ) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.pitch = 0.8; // Slightly lower pitch for "robotic" feel
  utterance.rate = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}
