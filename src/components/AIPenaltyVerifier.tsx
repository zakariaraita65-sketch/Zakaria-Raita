import { useState, useRef, useCallback, useEffect, ChangeEvent } from 'react';
import { Camera, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AIPenaltyVerifierProps {
  onVerifySuccess: () => void;
  onVerifyFail: () => void;
  penaltyTaskDescription: string;
  penaltyAssignedAt?: string;
}

export default function AIPenaltyVerifier({ onVerifySuccess, onVerifyFail, penaltyTaskDescription, penaltyAssignedAt }: AIPenaltyVerifierProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check 30 minute lockout
  useEffect(() => {
     if (!penaltyAssignedAt) return;
     const assignedTime = new Date(penaltyAssignedAt).getTime();
     const unlockTime = assignedTime + 30 * 60 * 1000; // 30 mins
     
     const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((unlockTime - now) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) clearInterval(timer);
     }, 1000);

     return () => clearInterval(timer);
  }, [penaltyAssignedAt]);

  const isLockedOut = timeLeft > 0;
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isLockedOut) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setVerificationStatus('idle');
      setFeedback('');
    }
  };

  const verifyWithAI = async () => {
    if (!file) return;

    setIsVerifying(true);
    setVerificationStatus('idle');
    setFeedback('Analyzing evidence...');

    try {
      // Read the file as a base64 string
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Extract the base64 part
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          `You are an strict and impartial AI verifier for a habit-tracking system called "Shadow Leveler".
          The user was assigned a penalty task: "${penaltyTaskDescription}".
          They have uploaded an image/video as evidence that they completed this specific penalty task.
          Analyze the image and determine if it provides convincing evidence that the user performed the task.
          Respond in JSON format indicating 'verified' (boolean) and a brief 'reason' (string) explaining why.`,
          { inlineData: { data: base64Data, mimeType: file.type } },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verified: { type: Type.BOOLEAN, description: "True if the evidence strongly suggests the task was completed, false otherwise." },
              reason: { type: Type.STRING, description: "A brief, stern explanation (in character as the System) of the decision." }
            },
            required: ["verified", "reason"]
          }
        }
      });

      const jsonText = response.text?.trim() || "{}";
      const result = JSON.parse(jsonText);

      setFeedback(result.reason);
      
      if (result.verified) {
        setVerificationStatus('success');
        setTimeout(() => {
          onVerifySuccess();
        }, 3000);
      } else {
        setVerificationStatus('fail');
      }

    } catch (error: any) {
      console.error("AI Verification Error:", error);
      setVerificationStatus('fail');
      setFeedback("System error during analysis. " + (error.message || ""));
    } finally {
      setIsVerifying(false);
    }
  };


  return (
    <div className="flex flex-col gap-4 mt-6 p-4 border border-white/10 rounded-xl bg-black/40">
      <h3 className="text-xs font-mono tracking-widest text-system-neon uppercase">A.I. Evidence Verification</h3>
      
      <p className="text-sm text-white/70 italic">
        Task: <span className="text-white font-bold">{penaltyTaskDescription}</span>
      </p>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 bg-white/5 relative overflow-hidden group">
        
        {previewUrl ? (
          <div className="flex flex-col items-center gap-4 w-full">
            {file?.type.startsWith('video/') ? (
               <video src={previewUrl} className="max-h-64 rounded shadow-lg" controls />
            ) : (
               <img src={previewUrl} alt="Evidence" className="max-h-64 object-contain rounded shadow-lg" />
            )}
            
            <button 
              onClick={() => { setFile(null); setPreviewUrl(null); }}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-system-danger text-white rounded-full transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>
        ) : (
          <div 
             className="flex flex-col items-center gap-3 cursor-pointer text-white/50 group-hover:text-system-neon transition-colors"
             onClick={() => fileInputRef.current?.click()}
          >
             <Camera size={48} className="opacity-50" />
             <span className="text-sm font-mono uppercase text-center">Upload Photo/Video Evidence<br/>(Max 5MB)</span>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/mp4,video/quicktime"
          onChange={handleFileChange}
        />
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-3 rounded-lg text-sm font-mono ${verificationStatus === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-system-danger/20 text-system-danger border border-system-danger/30'}`}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={verifyWithAI}
        disabled={!file || isVerifying || verificationStatus === 'success' || isLockedOut}
        className={`w-full py-3 font-display font-black uppercase rounded-lg flex items-center justify-center gap-2 transition-all
          ${(!file || verificationStatus === 'success' || isLockedOut) ? 'bg-white/10 text-white/30 cursor-not-allowed' 
            : 'bg-system-neon/20 hover:bg-system-neon/40 text-system-neon border border-system-neon/50'}`}
      >
        {isVerifying ? (
          <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
        ) : verificationStatus === 'success' ? (
          <><CheckCircle size={18} /> Verified</>
        ) : isLockedOut ? (
          <>System Locked for {minutesLeft.toString().padStart(2, '0')}:{secondsLeft.toString().padStart(2, '0')}</>
        ) : (
          <><Upload size={18} /> Submit Evidence</>
        )}
      </button>
    </div>
  );
}
