import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { Vote, Share2 } from 'lucide-react';
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import modelsData from '../data/pages/models.json';
import { generateSlug } from './Voting';
import OtpModal from '../components/OtpModal';
import { submitVote, getVoteCount } from '../utils/voteHandling';

export default function ModelVote() {
  const { modelId } = useParams();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [voteCount, setVoteCount] = useState(0);
  const [isCounting, setIsCounting] = useState(true);
  
  const models = modelsData.models || [];
  const model = models.find(m => generateSlug(m.name) === modelId);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (model) {
      document.title = `Vote for ${model.name} | South India Queen`;
    } else {
      document.title = "South India Queen - Official Voting";
    }
  }, [model]);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!auth) return;
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setModalStep(2);
          setIsOtpModalOpen(true);
        }
      } catch (error) {
        console.error("Redirect Error:", error);
      }
    };
    checkRedirect();
  }, []);

  useEffect(() => {
    const fetchVotes = async () => {
      if (model) {
        setIsCounting(true);
        const count = await getVoteCount(modelId);
        setVoteCount(count);
        setIsCounting(false);
      }
    };
    fetchVotes();
  }, [model, modelId]);
  
  const handleVoteSubmit = async (user) => {
    try {
      await submitVote(user, modelId, model.name);
      setVoteCount(prev => prev + 1);
    } catch (error) {
      console.error("Error submitting vote:", error);
      throw error;
    }
  };

  if (!model) {
    return <Navigate to="/vote" replace />;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  
  const handleShare = async (e, platform) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vote for ${model.name}`,
          text: `Show your support for ${model.name}!`,
          url: currentUrl
        });
        return;
      } catch (err) {
        console.log('Share error:', err);
      }
    }
    
    if (platform === 'facebook') {
      window.open(fbShareUrl, '_blank');
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(currentUrl);
      alert('Link copied to clipboard! Paste it on your Instagram story or bio to gather support.');
    }
  };

  return (
    <div className="pt-20 pb-16 md:pt-32 md:pb-20 min-h-screen bg-brand-ivory">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-brand-beige"
        >
          <div className="md:w-1/2 h-[50vh] md:h-auto relative">
            <img 
              src={model.image} 
              alt={model.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent md:hidden"></div>
            <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
              <h1 className="text-3xl font-serif mb-1">{model.name}</h1>
              <p className="text-brand-gold font-sans text-xs uppercase tracking-wider">{model.title}</p>
            </div>
          </div>
          
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="hidden md:block mb-8">
              <p className="text-brand-bronze font-sans font-bold tracking-[0.2em] uppercase text-xs mb-2">
                Official Voting Page
              </p>
              <h1 className="text-4xl lg:text-5xl font-serif text-brand-black mb-3">{model.name}</h1>
              <p className="text-gray-500 font-sans text-sm uppercase tracking-wider mb-2">{model.title}</p>
              
              <div className="inline-flex items-center mt-2 px-4 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/20">
                <Vote size={16} className="text-brand-gold mr-2" />
                <span className="font-sans font-semibold text-brand-black">
                  {isCounting ? '...' : voteCount} <span className="font-normal text-gray-600">Votes</span>
                </span>
              </div>
            </div>

            <p className="text-gray-600 font-sans mb-8 leading-relaxed">
              Show your support for {model.name} by casting your vote. Every vote counts towards helping them achieve their goals in the upcoming event. Share this page on your social media to gather more support!
            </p>

            <div className="space-y-3">
              <div className="w-full p-4 mb-6 text-center bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-sm font-semibold text-gray-700">Voting for this contest has concluded.</p>
                <p className="text-xs text-gray-500 mt-1">Thank you to everyone who participated!</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={(e) => handleShare(e, 'facebook')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#1877F2] text-white font-medium text-sm rounded-xl hover:bg-[#1864D9] transition-all shadow-md group"
                >
                  <FaFacebookF className="mr-2 group-hover:scale-110 transition-transform" size={16} />
                  Facebook
                </button>

                <button 
                  onClick={(e) => handleShare(e, 'instagram')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white font-medium text-sm rounded-xl hover:opacity-90 transition-all shadow-md group"
                >
                  <FaInstagram className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                  Instagram
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {model && (
        <OtpModal 
          isOpen={isOtpModalOpen} 
          onClose={() => {
            setIsOtpModalOpen(false);
            setModalStep(1);
          }} 
          modelName={model.name}
          modelSlug={modelId}
          initialStep={modalStep}
          currentUser={currentUser}
          onSubmitSuccess={handleVoteSubmit}
        />
      )}
    </div>
  );
}
