import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import presidentImg from '../assets/president.png';
import vpImg from '../assets/vp.png';
import finSecImg from '../assets/fin sec.png';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

const VotingPage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Michael Osei', position: 'President', img: presidentImg, agenda: 'Innovation & Inclusivity for All.', votes: 0 },
    { id: 2, name: 'Sarah Ade', position: 'President', img: vpImg, agenda: 'Sustainable Development & Transparent Leadership.', votes: 0 },
    { id: 3, name: 'Daniel Chuks', position: 'Vice President', img: finSecImg, agenda: 'Bridging the gap between students and management.', votes: 0 },
  ]);

  const [hasVoted, setHasVoted] = useState(false);
  const [resultsReleased, setResultsReleased] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  // Form States
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch Voting Status & Results on Mount
  useEffect(() => {
    fetchVotingStatus();
  }, []);

  const fetchVotingStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vote/status`, { credentials: 'include' });
      const data = await response.json();
      
      if (data.success) {
        setHasVoted(data.has_voted);
        setResultsReleased(data.results_released);

        // If results are released, map the vote counts back into the candidates list
        if (data.results_released && data.results) {
          let tVotes = 0;
          setCandidates(prev => prev.map(c => {
            const resultMatch = data.results.find(r => r.candidate_id === c.id);
            const votes = resultMatch ? resultMatch.vote_count : 0;
            tVotes += votes;
            return { ...c, votes };
          }));
          setTotalVotes(tVotes);
        }
      }
    } catch (error) {
      console.error("Failed to fetch voting status:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Click on candidate card
  const handleInitiateVote = (candidate) => {
    setErrorMsg('');
    setSelectedCandidate(candidate);
    setShowConfirmModal(true);
  };

  // 2. User confirms they want to vote - Generate OTP via Email
  const handleConfirmVote = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/vote/generate-code`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setShowConfirmModal(false);
        setShowOtpModal(true); // Move to OTP step
      } else {
        setErrorMsg(data.error || 'Failed to send OTP code.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to reach the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. User submits OTP to cast final vote
  const handleVerifyAndCastVote = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) return;
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/vote/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: otpCode,
          candidateId: selectedCandidate.id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowOtpModal(false);
        setSuccessMsg(data.message);
        setHasVoted(true);
      } else {
        setErrorMsg(data.error || 'Invalid or expired code.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to cast vote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-emerald-400">Loading voting data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-yellow-500">
           <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <h1 className="text-4xl font-bold font-serif text-white mb-4">Voting is on Hold</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          The electoral process is currently paused for administrative review or maintenance. Please check back later for updates from the NUESA ACU electoral committee.
        </p>
        <button 
          onClick={() => navigate('/home')}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-10 rounded-full border border-gray-700 transition-all uppercase tracking-widest text-xs"
        >
          Return to Home
        </button>
      </div>

      {/* 
        PREVIOUS UI CODE ON HOLD (COMMENTED OUT)
        
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-2">Have your say</p>
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">NUESA ACU Elections</h1>
            ... and the rest of the candidates mapping ...
        </div>
      */}
    </div>
  );
};

export default VotingPage;
