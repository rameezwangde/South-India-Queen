import { motion } from 'framer-motion';
import { Crown, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import modelsData from '../data/pages/models.json';
import { getVoteCount } from '../utils/voteHandling';

const models = modelsData.models || [];

// Helper to create slug
export const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export default function Voting() {
  const [voteCounts, setVoteCounts] = useState({});
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    document.title = "South India Queen - Official Voting";
  }, []);

  useEffect(() => {
    const fetchAllVotes = async () => {
      setIsCounting(true);
      const counts = {};
      for (const model of models) {
        const slug = generateSlug(model.name);
        counts[slug] = await getVoteCount(slug);
      }
      setVoteCounts(counts);
      setIsCounting(false);
    };
    fetchAllVotes();
  }, []);

  const maxVotes = Math.max(...Object.values(voteCounts), 1);
  const sortedModels = [...models].sort((a, b) => {
    const votesA = voteCounts[generateSlug(a.name)] || 0;
    const votesB = voteCounts[generateSlug(b.name)] || 0;
    return votesB - votesA;
  });

  return (
    <div className="pt-6 pb-16 md:pt-8 md:pb-24 min-h-screen bg-[#FCFAf5] relative overflow-hidden font-sans">
      
      {/* --- UNIQUE BACKGROUND DESIGN --- */}
      {/* 1. Subtle Luxury Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* 2. Soft Gold Spotlights */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-brand-gold/15 blur-[120px] rounded-full rotate-[-45deg] pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-[#FFDF73]/10 blur-[100px] rounded-full rotate-[45deg] pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 mb-12 text-center mt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {modelsData.logoImage && (
            <img src={modelsData.logoImage} alt="Logo" className="w-48 h-48 rounded-full shadow-lg mb-6 object-cover" />
          )}
          <h1 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] mb-4 tracking-wider uppercase">
            {modelsData.pageTitleMain} <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-[#b5952f] to-brand-gold">{modelsData.pageTitleHighlight}</span> {modelsData.pageTitleSuffix}
          </h1>
          <p className="text-brand-gold tracking-[0.3em] uppercase text-xs md:text-sm mb-8 font-semibold">
            {modelsData.subtitle}
          </p>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed border-t border-brand-gold/20 pt-6 mb-6">
            {modelsData.introDescription}
          </p>
          
          {/* Time Frame Indicator */}
          {modelsData.timeFrameText && (
            <div className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-8 shadow-sm">
              <span className="relative flex h-2.5 w-2.5 mr-3">
                <span className="inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-brand-gold font-bold text-xs tracking-widest uppercase">
                {modelsData.timeFrameText}
              </span>
            </div>
          )}

          <div className="w-full flex justify-center">
            <button 
              onClick={() => document.getElementById('standings').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-gold text-white font-bold text-[11px] tracking-[0.2em] uppercase shadow-lg shadow-brand-gold/20 hover:bg-[#b5952f] transition-all hover:-translate-y-1"
            >
              View Live Standings
              <ChevronRight size={16} className="ml-2" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* --- UNIQUE CONTESTANT CARDS (Arched/Regal Style) --- */}
      <div className="container relative z-10 mx-auto px-4 md:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
        {models.map((model, idx) => {
          const slug = generateSlug(model.name);
          return (
            <motion.div 
              key={slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (idx % 4) * 0.15, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -10 }}
              className="group relative w-full max-w-[320px] flex flex-col rounded-t-[160px] rounded-b-3xl overflow-hidden border border-brand-gold/20 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-1.5"
            >
              {/* Image Container with Arch */}
              <div className="relative w-full aspect-[4/5] rounded-t-[156px] rounded-b-2xl overflow-hidden bg-white shrink-0">
                <img 
                  src={model.image} 
                  alt={model.name} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                />
              </div>

              {/* Content (Below Image) */}
              <div className="w-full pt-5 pb-4 px-4 flex flex-col items-center text-center flex-1">
                <h3 className="text-xl font-serif text-[#1a1a1a] mb-1 tracking-wide">{model.name}</h3>
                <p className="text-brand-gold/90 text-[9px] tracking-[0.2em] uppercase font-semibold mb-3">
                  {model.title}
                </p>
                
                <div className="inline-flex items-center justify-center px-4 py-1.5 bg-brand-gold/10 rounded-full mb-4">
                  <span className="text-brand-gold font-bold text-sm mr-1.5">
                    {isCounting ? '...' : (voteCounts[slug] || 0)}
                  </span>
                  <span className="text-brand-gold/80 text-[9px] uppercase tracking-wider font-medium">Votes</span>
                </div>
                
                <Link 
                  to={`/vote/${slug}`} 
                  className="mt-auto relative overflow-hidden w-full py-2.5 rounded-full border border-brand-gold/50 flex items-center justify-center group/btn transition-all duration-300 hover:bg-brand-gold bg-white"
                >
                  <span className="text-brand-gold group-hover/btn:text-white font-semibold text-[10px] tracking-[0.15em] uppercase z-10 transition-colors">
                    View Contestant
                  </span>
                  <ChevronRight size={14} className="ml-2 text-brand-gold group-hover/btn:text-white z-10 transition-colors" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- LEADERBOARD (Premium Pedestal Style) --- */}
      <div id="standings" className="container relative z-10 mx-auto px-4 md:px-8 mt-16 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <Sparkles className="text-brand-gold w-6 h-6 mb-4" />
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] mb-4 uppercase tracking-widest">{modelsData.leaderboardTitle || 'Live Standings'}</h2>
          <div className="w-px h-16 bg-gradient-to-b from-brand-gold to-transparent"></div>
        </motion.div>

        <div className="bg-white rounded-[40px] shadow-xl p-6 md:p-12 border border-brand-beige relative">
          
          {/* PODIUM GRAPHIC */}
          {sortedModels.length >= 3 && (
            <div className="flex justify-center items-end gap-2 sm:gap-6 md:gap-10 mb-16 pt-12 border-b border-gray-100 pb-16">
              {/* Rank 2 */}
              <div className="flex flex-col items-center w-1/3 max-w-[120px]">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-b from-gray-300 to-gray-100 shadow-lg mb-4 z-10">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                    <img src={sortedModels[1].image} alt={sortedModels[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">2</div>
                </div>
                <div className="w-full h-24 sm:h-32 bg-gradient-to-t from-gray-100 to-gray-50 rounded-t-lg border border-gray-200 border-b-0 flex flex-col items-center justify-start pt-4 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  <span className="font-serif text-[#1a1a1a] font-bold text-center leading-tight z-10 text-[10px] sm:text-base px-1">{sortedModels[1].name}</span>
                  <span className="text-gray-500 font-bold mt-1 z-10 text-xs sm:text-sm">{voteCounts[generateSlug(sortedModels[1].name)] || 0}</span>
                </div>
              </div>

              {/* Rank 1 */}
              <div className="flex flex-col items-center w-1/3 max-w-[140px]">
                <Crown className="text-brand-gold w-8 h-8 mb-2 drop-shadow-sm" strokeWidth={2} />
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-brand-gold to-[#FFDF73] shadow-xl mb-4 z-10">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white">
                    <img src={sortedModels[0].image} alt={sortedModels[0].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-gold text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">1</div>
                </div>
                <div className="w-full h-32 sm:h-44 bg-gradient-to-t from-brand-gold/10 to-brand-gold/5 rounded-t-lg border border-brand-gold/30 border-b-0 flex flex-col items-center justify-start pt-6 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  <span className="font-serif text-[#1a1a1a] font-bold text-center leading-tight z-10 text-[11px] sm:text-lg px-1">{sortedModels[0].name}</span>
                  <span className="text-brand-gold font-bold mt-2 z-10 text-sm sm:text-xl drop-shadow-sm">{voteCounts[generateSlug(sortedModels[0].name)] || 0}</span>
                </div>
              </div>

              {/* Rank 3 */}
              <div className="flex flex-col items-center w-1/3 max-w-[120px]">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-b from-[#cd7f32] to-[#e69f58] shadow-lg mb-4 z-10">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                    <img src={sortedModels[2].image} alt={sortedModels[2].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#cd7f32] text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">3</div>
                </div>
                <div className="w-full h-16 sm:h-24 bg-gradient-to-t from-[#cd7f32]/10 to-[#cd7f32]/5 rounded-t-lg border border-[#cd7f32]/20 border-b-0 flex flex-col items-center justify-start pt-4 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cd7f32 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  <span className="font-serif text-[#1a1a1a] font-bold text-center leading-tight z-10 text-[10px] sm:text-base px-1">{sortedModels[2].name}</span>
                  <span className="text-[#cd7f32] font-bold mt-1 z-10 text-xs sm:text-sm">{voteCounts[generateSlug(sortedModels[2].name)] || 0}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {sortedModels.slice(3).map((model, offsetIdx) => {
              const idx = offsetIdx + 3;
              const slug = generateSlug(model.name);
              const votes = voteCounts[slug] || 0;
              const percentage = maxVotes === 1 && Object.values(voteCounts).every(v => v === 0) 
                ? 0 
                : votes === 0 ? 0 : Math.max((votes / maxVotes) * 100, 2);

              const isTop3 = idx < 3;
              const rankColor = idx === 0 ? 'text-brand-gold' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-[#cd7f32]' : 'text-gray-500';
              const barGradient = idx === 0 ? 'from-brand-gold to-[#FFDF73]' : idx === 1 ? 'from-gray-300 to-gray-200' : idx === 2 ? 'from-[#cd7f32] to-[#e69f58]' : 'from-gray-300 to-gray-200';

              return (
                <div key={slug} className="relative flex flex-col md:flex-row md:items-center gap-6 group p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  {/* Rank & Image */}
                  <div className="flex items-center gap-6 md:w-1/3">
                    <div className={`w-10 text-2xl font-serif font-bold text-center ${rankColor} ${idx === 0 ? 'drop-shadow-sm' : ''}`}>
                      0{idx + 1}
                    </div>
                    <div className={`relative w-16 h-16 rounded-full p-[2px] ${isTop3 ? 'bg-gradient-to-b ' + barGradient : 'bg-gray-200'}`}>
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                        <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="font-serif text-lg tracking-wide text-[#1a1a1a]">
                      {model.name}
                    </div>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="flex-1 relative pl-16 md:pl-0">
                    <div className="h-[2px] bg-gray-200 w-full relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: idx * 0.1, ease: "easeOut" }}
                        className={`absolute top-1/2 -translate-y-1/2 h-[4px] rounded-full bg-gradient-to-r ${barGradient} ${idx === 0 ? 'shadow-sm' : ''}`}
                      />
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="pl-16 md:pl-0 md:w-28 text-left md:text-right flex items-baseline md:justify-end gap-2">
                    <span className={`text-3xl font-serif font-bold ${rankColor}`}>
                      {votes}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Votes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- SPONSORS ROW --- */}
      {modelsData.sponsors && modelsData.sponsors.length > 0 && (
        <div className="container relative z-10 mx-auto px-4 md:px-8 mt-24 mb-8">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-serif text-[#1a1a1a] mb-8 uppercase tracking-widest text-center opacity-70">Event Sponsors</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {modelsData.sponsors.map((sponsor, idx) => {
                if (!sponsor.logo) return null;
                const img = <img src={sponsor.logo} alt={sponsor.altText || 'Sponsor'} className="h-16 md:h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />;
                return sponsor.link ? (
                  <a key={idx} href={sponsor.link} target="_blank" rel="noopener noreferrer" className="block">
                    {img}
                  </a>
                ) : (
                  <div key={idx}>{img}</div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
