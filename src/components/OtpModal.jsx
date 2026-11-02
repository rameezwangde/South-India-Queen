import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, yahooProvider } from '../firebase';

export default function OtpModal({ isOpen, onClose, modelName, modelSlug, onSubmitSuccess, initialStep = 1 }) {
  const [step, setStep] = useState(initialStep); // 1: Login, 3: Success
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(initialStep);
        setError('');
      }, 300);
    } else {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const handleOAuthSignIn = async (provider) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (onSubmitSuccess) {
        await onSubmitSuccess(user);
        setStep(3);
        // Trigger confetti animation
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#000000', '#ffffff', '#b8860b'] // Brand colors: Gold, Black, White, Bronze
        });
      }
    } catch (err) {
      console.error("Sign-in / vote error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase. Please add it to Firebase Authentication > Settings > Authorized domains.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups or open in standard browser.');
      } else if (err.code) {
        setError(`${err.message} (${err.code})`);
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-brand-beige"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-brand-black transition-colors z-20"
            >
              <X size={24} />
            </button>

            <div className="p-8">
                <div className="text-center mb-8 mt-2">
                  <p className="text-brand-bronze font-sans font-bold tracking-[0.2em] uppercase text-xs mb-2">
                    Cast Your Vote
                  </p>
                  <h2 className="text-2xl font-serif text-brand-black mb-2">
                    Voting for {modelName}
                  </h2>
                  {step === 1 && <p className="text-gray-500 font-sans text-sm">Sign in to securely register your vote.</p>}
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    {error && <p className="text-red-500 text-sm mt-2 font-sans text-center">{error}</p>}
                    
                    <button 
                      onClick={() => handleOAuthSignIn(googleProvider)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4 gap-3"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                      {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>

                    <button 
                      onClick={() => handleOAuthSignIn(yahooProvider)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center py-3 bg-[#6001D2] text-white font-medium rounded-lg hover:bg-[#4a00a3] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-3 gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.87.5h2.15l2.97 4.1h.06L10.96.5h2.16L9 6.27V12h-2V6.27L2.87.5z"/>
                      </svg>
                      {isLoading ? 'Signing in...' : 'Sign in with Yahoo'}
                    </button>
                  </div>
                )}

              {step === 3 && (
                <div className="text-center py-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h3 className="text-xl font-serif text-brand-black mb-2">Vote Registered!</h3>
                  <p className="text-gray-500 font-sans mb-6">Thank you for supporting {modelName}. Your vote has been recorded successfully.</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-brand-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors w-full"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
