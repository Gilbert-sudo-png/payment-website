import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

const POSITIONS = [
  { id: 'president', name: 'President', isContested: true },
  { id: 'vice_president', name: 'Vice President', isContested: false },
  { id: 'general_secretary', name: 'General Secretary', isContested: true },
  { id: 'assistant_general_secretary', name: 'Assistant General Secretary', isContested: false },
  { id: 'treasurer', name: 'Treasurer', isContested: false },
  { id: 'financial_secretary', name: 'Financial Secretary', isContested: true },
  { id: 'social_director', name: 'Social Director', isContested: false },
  { id: 'assistant_social_director', name: 'Assistant Social Director', isContested: false },
  { id: 'welfare_director', name: 'Welfare Director', isContested: false },
  { id: 'public_relation_officer', name: 'Public Relation Officer', isContested: false },
  { id: 'sports_director', name: 'Sports Director', isContested: true },
  { id: 'academic_officer', name: 'Academic Officer', isContested: false }
];

const CANDIDATES = [
  { id: 'pres_mbachu', name: 'Mbachu Princess Chidimma', position: 'president', img: '/candidates/mbachu-president.jpg' },
  { id: 'pres_petros', name: 'Petros-Mokelu Light', position: 'president', img: '/candidates/petros-president.jpg' },
  
  { id: 'vp_alabi', name: 'Alabi Emmanuel Akinbobola', position: 'vice_president', img: '/candidates/alabi-vp.jpg' },
  
  { id: 'gensec_olagunju', name: 'Olagunju Oladotun', position: 'general_secretary', img: '/candidates/olagunju-gensec.jpg' },
  { id: 'gensec_oloye', name: 'Oloye Samuel', position: 'general_secretary', img: '/candidates/oloye-gensec.jpg' },
  
  { id: 'asg_omobolaji', name: 'Omobolaji Praise', position: 'assistant_general_secretary', img: '/candidates/omobolaji-asg.jpg' },
  
  { id: 'treas_ayo', name: 'Ayo-Ajiboye Jeremiah Oluwaseyi', position: 'treasurer', img: '/candidates/ayo-treasurer.jpg' },
  
  { id: 'finsec_victor', name: 'Victor Oyedele', position: 'financial_secretary', img: '/candidates/victor-finsec.jpg' },
  { id: 'finsec_eludipo', name: 'Eludipo Gbenga', position: 'financial_secretary', img: '/candidates/eludipo-finsec.jpg' },
  
  { id: 'soc_olugbode', name: 'Olugbode Enoch Adedeji', position: 'social_director', img: '/candidates/olugbode-social.jpg' },
  
  { id: 'asoc_okwueze', name: 'Okwueze', position: 'assistant_social_director', img: '/candidates/okwueze-asoc.jpg' },
  
  { id: 'wel_gyang', name: 'Gyang Simi Tok', position: 'welfare_director', img: '/candidates/gyang-welfare.jpg' },
  
  { id: 'pro_ogbonna', name: 'Ogbonna Ogechi Joy', position: 'public_relation_officer', img: '/candidates/ogbonna-pro.jpg?v=2' },
  
  { id: 'sports_obi', name: 'Obi Emmanuel Chuka', position: 'sports_director', img: '/candidates/obi-sports.jpg' },
  { id: 'sports_ibe', name: 'Ibe Daniel', position: 'sports_director', img: '/candidates/ibe-sports.jpg' },
  
  { id: 'acad_kalu', name: 'Kalu Onyinyechi Offia', position: 'academic_officer', img: '/candidates/kalu-academic.jpg' }
];

const VotingPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Voting states
  const [hasVoted, setHasVoted] = useState(false);
  const [resultsReleased, setResultsReleased] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ballotUnlocked, setBallotUnlocked] = useState(false);
  
  // Selection state: maps position ID to selected candidate ID (e.g. 'pres_mbachu' or 'vp_alabi_yes')
  const [selections, setSelections] = useState({});

  // Verification states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch status on load
  useEffect(() => {
    fetchVotingStatus();
  }, []);

  const fetchVotingStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vote/status`, { credentials: 'include' });
      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      const data = await response.json();
      
      if (data.success) {
        setHasVoted(data.has_voted);
        setResultsReleased(data.results_released);
        if (data.results) {
          setResultsData(data.results);
        }

        // If they can vote, show the first confirmation modal immediately
        if (!data.has_voted && !data.results_released) {
          setShowConfirmModal(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch voting status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start the voting process - triggers OTP generation
  const handleInitiateVoting = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vote/generate-code`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      const data = await response.json();
      if (response.ok) {
        setShowConfirmModal(false);
        setShowOtpModal(true);
      } else {
        setErrorMsg(data.error || 'Failed to generate security code. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify OTP - unlocks ballot
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vote/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode }),
        credentials: 'include'
      });
      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      const data = await response.json();

      if (response.ok) {
        setBallotUnlocked(true);
        setShowOtpModal(false);
      } else {
        setErrorMsg(data.error || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to verify code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle selecting a candidate
  const handleSelect = (positionId, candidateId) => {
    setSelections(prev => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  // Submit all votes
  const handleSubmitBallot = async () => {
    // Collect all selected IDs
    const selectedIds = Object.values(selections);
    
    // Ensure all 12 positions are voted
    if (selectedIds.length < POSITIONS.length) {
      alert('Please vote for all positions before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vote/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: otpCode,
          candidateIds: selectedIds
        }),
        credentials: 'include'
      });
      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      const data = await response.json();

      if (response.ok) {
        setHasVoted(true);
        setSuccessMsg(data.message || 'Ballot submitted successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data.error || 'Failed to submit ballot. Try re-entering your OTP.');
        // Re-open OTP modal if verification failed
        if (data.error && data.error.includes('expired') || data.error.includes('code')) {
          setBallotUnlocked(false);
          setShowOtpModal(true);
        }
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to cast ballot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Total selected count
  const votedCount = Object.keys(selections).length;
  const progressPercent = Math.round((votedCount / POSITIONS.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-emerald-400 gap-4">
        <div className="w-12 h-12 border-4 border-t-emerald-400 border-r-transparent border-b-emerald-400 border-l-transparent rounded-full animate-spin"></div>
        <p className="font-sans font-bold tracking-widest text-xs uppercase animate-pulse">Loading election system...</p>
      </div>
    );
  }

  // SCREEN A: Results Released Dashboard
  if (resultsReleased) {
    return (
      <div className="min-h-screen bg-gray-950 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full -z-10"></div>
            <span className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase block mb-3">Official Announcement</span>
            <h1 className="text-4xl md:text-5xl font-black font-serif text-white mb-4 drop-shadow-lg leading-tight">Election Results Released</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
              The NUESA ACU Electoral Committee has published the final tally for the Academic Session. See results below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {POSITIONS.map(position => {
              const positionCandidates = CANDIDATES.filter(c => c.position === position.id);
              
              // Get total votes cast in this position
              let totalPositionVotes = 0;
              const resultsList = positionCandidates.map(c => {
                if (position.isContested) {
                  const match = resultsData.find(r => r.candidate_id === c.id);
                  const count = match ? match.vote_count : 0;
                  totalPositionVotes += count;
                  return { name: c.name, img: c.img, count };
                } else {
                  const yesMatch = resultsData.find(r => r.candidate_id === `${c.id}_yes`);
                  const noMatch = resultsData.find(r => r.candidate_id === `${c.id}_no`);
                  const yesCount = yesMatch ? yesMatch.vote_count : 0;
                  const noCount = noMatch ? noMatch.vote_count : 0;
                  totalPositionVotes += (yesCount + noCount);
                  return [
                    { name: `${c.name} (YES)`, img: c.img, count: yesCount, type: 'yes' },
                    { name: `${c.name} (NO)`, img: c.img, count: noCount, type: 'no' }
                  ];
                }
              }).flat();

              return (
                <div key={position.id} className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-gray-700/60 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-3xl"></div>
                  <h3 className="text-emerald-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-1">Office of the</h3>
                  <h2 className="text-xl font-bold font-serif text-white mb-6">{position.name}</h2>

                  <div className="space-y-6">
                    {resultsList.map((res, idx) => {
                      const percentage = totalPositionVotes > 0 ? Math.round((res.count / totalPositionVotes) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 font-medium">{res.name}</span>
                            <span className="text-emerald-400 font-bold">{res.count} {res.count === 1 ? 'vote' : 'votes'} ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-900">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                res.type === 'no' ? 'bg-red-500/80' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-800/40 text-right">
                    <span className="text-gray-500 text-[0.65rem] tracking-wider uppercase font-bold">Total votes: {totalPositionVotes}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/')} 
              className="bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-700 text-white font-bold py-3.5 px-8 rounded-full transition-all text-xs tracking-widest uppercase"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN B: Has Voted (and results not yet released)
  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-gray-900/30 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full -z-10"></div>
          
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold font-serif text-white mb-4">Ballot Submitted!</h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            Thank you for exercising your right to vote! Your selections have been securely recorded and finalized in the database. Results will be published by the Electoral Committee once the voting window closes.
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-4 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] uppercase tracking-widest text-xs"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // SCREEN C: Main ballot (Unlocked)
  if (ballotUnlocked) {
    return (
      <div className="min-h-screen bg-gray-950 pt-28 pb-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>
            <span className="text-emerald-400 text-xs font-black tracking-[0.3em] uppercase block mb-3">Academic Session Elections</span>
            <h1 className="text-3xl md:text-5xl font-black font-serif text-white mb-4">Electoral Ballot</h1>
            <p className="text-gray-400 max-w-lg mx-auto text-xs md:text-sm leading-relaxed">
              Make your selections for each office. Ensure you vote in every section to complete your ballot submission.
            </p>
          </div>

          {/* Progress Tracker Banner */}
          <div className="sticky top-24 z-30 max-w-3xl mx-auto mb-10">
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800/80 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block md:inline">Ballot Completion Status:</span>
                <span className="text-emerald-400 text-sm font-black tracking-wider ml-1">{votedCount} of {POSITIONS.length} offices selected</span>
              </div>
              <div className="w-full md:w-48 h-2.5 bg-gray-950 rounded-full overflow-hidden border border-gray-850/80 relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Voting Grid */}
          <div className="space-y-12">
            {POSITIONS.map((position) => {
              const positionCandidates = CANDIDATES.filter(c => c.position === position.id);
              const isSelected = selections[position.id];

              return (
                <div 
                  key={position.id} 
                  className={`bg-gray-950 border rounded-3xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden ${
                    isSelected 
                      ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.03)]' 
                      : 'border-gray-850 shadow-inner'
                  }`}
                >
                  {/* Glass indicator */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-850 pb-4 mb-8 gap-2">
                    <div>
                      <h3 className="text-emerald-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-1">Office of the</h3>
                      <h2 className="text-2xl font-black font-serif text-white">{position.name}</h2>
                    </div>
                    <div>
                      {isSelected ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[0.65rem] font-black tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          Selection Logged
                        </span>
                      ) : (
                        <span className="bg-gray-900/50 text-gray-500 border border-gray-850 text-[0.65rem] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                          Pending Vote
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Candidates Cards Layout */}
                  {position.isContested ? (
                    /* CONTESTED POSITIONS */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      {positionCandidates.map((candidate) => {
                        const isVoted = selections[position.id] === candidate.id;
                        
                        return (
                          <div 
                            key={candidate.id}
                            className={`bg-gray-900/30 border rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 group relative overflow-hidden ${
                              isVoted 
                                ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-500/[0.02]' 
                                : 'border-gray-800/80 hover:border-gray-700/60 hover:scale-[1.01]'
                            }`}
                          >
                            <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden mb-4 border border-gray-800 bg-gray-900 relative shadow-inner">
                              <img 
                                src={candidate.img} 
                                alt={candidate.name} 
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/160?text=No+Photo";
                                }}
                              />
                            </div>
                            <h4 className="text-base font-bold text-white mb-4">{candidate.name}</h4>
                            <button
                              onClick={() => handleSelect(position.id, candidate.id)}
                              className={`w-full font-black py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all ${
                                isVoted
                                  ? 'bg-emerald-500 text-gray-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                  : 'bg-gray-900/80 hover:bg-gray-850 text-gray-400 border border-gray-800 hover:text-white'
                              }`}
                            >
                              {isVoted ? 'Selected' : 'Vote'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* UNCONTESTED POSITIONS (YES / NO) */
                    <div className="max-w-md mx-auto">
                      {positionCandidates.map((candidate) => {
                        const currentVote = selections[position.id];
                        const isYes = currentVote === `${candidate.id}_yes`;
                        const isNo = currentVote === `${candidate.id}_no`;

                        return (
                          <div 
                            key={candidate.id}
                            className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-gray-750"
                          >
                            <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden mb-4 border border-gray-800 bg-gray-900 relative">
                              <img 
                                src={candidate.img} 
                                alt={candidate.name} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/160?text=No+Photo";
                                }}
                              />
                            </div>
                            <h4 className="text-base font-bold text-white mb-2">{candidate.name}</h4>
                            <p className="text-gray-500 text-xs tracking-wider uppercase font-semibold mb-6">Uncontested Candidate</p>
                            
                            <div className="grid grid-cols-2 gap-4 w-full">
                              <button
                                onClick={() => handleSelect(position.id, `${candidate.id}_yes`)}
                                className={`font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all ${
                                  isYes
                                    ? 'bg-emerald-500 text-gray-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    : 'bg-gray-950 hover:bg-gray-900 text-gray-400 border border-gray-850 hover:text-white'
                                }`}
                              >
                                Vote Yes
                              </button>
                              <button
                                onClick={() => handleSelect(position.id, `${candidate.id}_no`)}
                                className={`font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all ${
                                  isNo
                                    ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                    : 'bg-gray-950 hover:bg-gray-900 text-gray-400 border border-gray-850 hover:text-white'
                                }`}
                              >
                                Vote No
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Sticky Submit Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-xl border-t border-gray-850 py-5 px-6 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest block">Ballot Progress</span>
                <span className="text-white font-bold text-base">{votedCount} of {POSITIONS.length} completed</span>
              </div>
              <button
                onClick={handleSubmitBallot}
                disabled={votedCount < POSITIONS.length || isSubmitting}
                className={`w-full sm:w-auto font-black px-12 py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  votedCount === POSITIONS.length
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                    : 'bg-gray-900 text-gray-500 border border-gray-800 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-gray-950 border-r-transparent border-b-gray-950 border-l-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Official Ballot'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // SCREEN D: Initial state when modals are closed and ballot is locked
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-gray-900/30 backdrop-blur-xl border border-gray-850 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full -z-10"></div>
        <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-8 text-yellow-500">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold font-serif text-white mb-4">Ballot Locked</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          The voting ballot is currently locked. To start voting, you must request and verify a secure one-time authorization code sent to your registered Gmail address.
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              setErrorMsg('');
              setShowConfirmModal(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] uppercase tracking-widest text-xs"
          >
            Start Verification Process
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-900 hover:bg-gray-850 border border-gray-800 text-white font-bold py-4 rounded-xl transition-colors uppercase tracking-widest text-xs"
          >
            Go Back Home
          </button>
        </div>
      </div>

      {/* MODAL 1: Confirm Initiate Voting */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-fade-in">
            <h2 className="text-2xl font-black font-serif text-white mb-4 text-center">Proceed to Vote?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 text-center">
              You are about to start the NUESA ACU Electoral process. Clicking Yes will generate and send a secure 6-digit OTP code to your registered email address.
            </p>
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-6 text-center font-bold">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleInitiateVoting}
                disabled={isSubmitting}
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-t-gray-950 border-r-transparent border-b-gray-950 border-l-transparent rounded-full animate-spin"></div>
                ) : 'Yes, Send Code'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  navigate('/');
                }}
                disabled={isSubmitting}
                className="bg-gray-950 hover:bg-gray-900 border border-gray-850 text-gray-400 hover:text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Enter OTP Code */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-fade-in">
            <h2 className="text-2xl font-black font-serif text-white mb-4 text-center">Enter Security Code</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 text-center">
              We sent a 6-digit verification code to your email. Enter it below to unlock your ballot.
            </p>
            
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="0 0 0 0 0 0"
                className="w-full text-center bg-gray-950 border border-gray-850 rounded-xl py-4 text-3xl font-black tracking-[8px] text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                required
              />

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 text-center font-bold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="submit"
                  disabled={otpCode.length < 6 || isSubmitting}
                  className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:bg-gray-900 disabled:text-gray-650 disabled:border disabled:border-gray-850"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-t-gray-950 border-r-transparent border-b-gray-950 border-l-transparent rounded-full animate-spin"></div>
                  ) : 'Verify & Unlock'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    navigate('/');
                  }}
                  disabled={isSubmitting}
                  className="bg-gray-950 hover:bg-gray-900 border border-gray-850 text-gray-400 hover:text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;
