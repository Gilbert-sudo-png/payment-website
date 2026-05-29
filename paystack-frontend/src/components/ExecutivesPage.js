import React, { useState } from 'react';
import presidentImg from '../assets/president.png';
import vpImg from '../assets/vp.png';
import finSecImg from '../assets/fin sec.png';

// Simple helper to join classes dynamically
const clsx = (...classes) => classes.filter(Boolean).join(' ');

const ExecutivesPage = () => {
  const currentExecutives = [
    {
      id: 1,
      name: 'Olawoyin Oluwafemi John',
      position: 'President',
      department: 'Mechanical Engineering',
      level: '500 Level',
      bio: 'Dedicated to fostering unity, driving academic excellence, and representing the interests of all engineering students at NUESA ACU.',
      img: '/assets/executives/FEMI.png'
    },
    {
      id: 2,
      name: 'Samule Adeshina',
      position: 'Vice President',
      department: 'Civil Engineering',
      level: '400 Level',
      bio: 'Supporting strategic leadership and working to bridge the gap between academic theory and practical engineering experience.',
      img: '/assets/executives/Adeshina.png'
    },
    {
      id: 3,
      name: 'Adejumobi Emmanuel',
      position: 'Social Director',
      department: 'Civil Engineering',
      level: '500 Level',
      bio: 'Committed to balancing rigorous academics with vibrant campus life, organizing inclusive events that build a strong engineering community.',
      img: '/assets/executives/Emma.png'
    },
    {
      id: 4,
      name: 'Adeagbo Enoch',
      position: 'Academic Officer',
      department: 'Civil Engineering',
      level: '500 Level',
      bio: 'Driving academic empowerment through targeted tutorials, technical workshops, and provision of top-tier learning resources.',
      img: '/assets/executives/Enoch.png'
    },
    {
      id: 5,
      name: 'Nathaniel Olakunmi',
      position: 'General Secretary',
      department: 'Computer Engineering',
      level: '500 Level',
      bio: 'Ensuring seamless communication, administrative excellence, and absolute transparency between the executive council and the student body.',
      img: '/assets/executives/General.png'
    },
    {
      id: 6,
      name: 'Duyilemi Ifeoluwa',
      position: 'Senate President',
      department: 'Mechanical Engineering',
      level: '500 Level',
      bio: 'Upholding legislative integrity and democratic processes within NUESA, ensuring every student voice is represented and heard.',
      img: '/assets/executives/IFE.png'
    },
    {
      id: 7,
      name: 'Talabi Jemimah Ifeoluwaposimi',
      position: 'Treasurer',
      department: 'Computer Engineering',
      level: '300 Level',
      bio: 'Ensuring absolute transparency, integrity, and strict accountability in the management of NUESA ACU funds.',
      img: '/assets/executives/Jemma.png'
    },
    {
      id: 8,
      name: 'Kamsiyochi Wogu',
      position: 'Financial Secretary',
      department: 'Electrical Engineering',
      level: '500 Level',
      bio: 'Committed to precise financial record-keeping, budgeting, and working collaboratively to ensure the association’s fiscal health.',
      img: '/assets/executives/Kamsi.png'
    }
  ];

  // Mock data for Past Executives
  const pastSessions = ['2024-2025', '2023-2024', '2022-2023'];
  const [activeSession, setActiveSession] = useState(pastSessions[0]);

  const pastExecutivesData = {
    '2024-2025': [
      { id: 1, name: 'Mgbamoka Enoch G.', position: 'President', img: '/assets/24-25/IMG-20260528-WA0080.jpg' },
      { id: 2, name: 'Olawoyin Oluwafemi', position: 'Vice President', img: '/assets/24-25/IMG-20260528-WA0081.jpg' },
      { id: 3, name: 'Olanlokun Israel', position: 'Gen. Secretary', img: '/assets/24-25/IMG-20260528-WA0082.jpg' },
      { id: 4, name: 'Ogbonna Onyedikachi', position: 'Fin. Secretary', img: '/assets/24-25/IMG-20260528-WA0083.jpg' }
    ],
    '2023-2024': [
      { id: 1, name: 'AkinTiunde David Abiola', position: 'President', img: '/assets/23-24/IMG-20260528-WA0075.jpg' },
      { id: 2, name: 'Mgbamoka Enoch G.', position: 'Vice President', img: '/assets/23-24/IMG-20260528-WA0076.jpg' },
      { id: 3, name: 'Popoola Ayomikun O.', position: 'Gen. Secretary', img: '/assets/23-24/IMG-20260528-WA0077.jpg' },
      { id: 4, name: 'Bassey Paul Simon', position: 'Fin. Secretary', img: '/assets/23-24/IMG-20260528-WA0078.jpg' }
    ],
    '2022-2023': [
      { id: 1, name: 'Oluwaseun Ayo', position: 'President', img: '/assets/22-23/IMG-20260528-WA0073(2).jpg' }
    ]
  };

  return (
    <div className={clsx('min-h-screen', 'bg-gray-900', 'text-white', 'font-sans', 'overflow-x-hidden', 'pt-28', 'pb-20')}>

      {/* --- Current Executives Section --- */}
      <section className={clsx('container', 'mx-auto', 'px-6', 'max-w-7xl', 'mb-16', 'text-center')}>
        <p className={clsx('text-emerald-500', 'font-bold', 'tracking-widest', 'uppercase', 'text-sm', 'mb-3')}>Our Core Team</p>
        <h1 className={clsx('text-4xl', 'md:text-5xl', 'lg:text-6xl', 'font-bold', 'font-serif', 'mb-6', 'text-white')}>
          NUESA Leadership Team
        </h1>
        <p className={clsx('text-gray-400', 'text-lg', 'max-w-3xl', 'mx-auto', 'font-light', 'leading-relaxed')}>
          Meet the dedicated committee steering NUESA ACU forward. We are committed to fostering excellence,
          managing strategic growth, and representing the best interests of every engineering student.
        </p>
      </section>

      <section className={clsx('container', 'mx-auto', 'px-6', 'max-w-7xl', 'mb-32')}>
        <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-10')}>
          {currentExecutives.map((exec) => (
            <div
              key={exec.id}
              className={clsx('bg-gray-800', 'border', 'border-gray-700/60', 'rounded-3xl', 'overflow-hidden', 'shadow-lg', 'group', 'hover:-translate-y-2', 'hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)]', 'transition-all', 'duration-500', 'flex', 'flex-col')}
            >
              <div className={clsx('relative', 'h-[380px]', 'overflow-hidden', 'bg-emerald-900/20', 'flex', 'items-center', 'justify-center')}>
                <img
                  src={exec.img}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=Executive' }}
                  alt={exec.name}
                  className={clsx('w-full', 'h-full', 'object-contain', 'object-bottom', 'scale-100', 'group-hover:scale-105', 'transition-transform', 'duration-700', 'pt-8')}
                />
                <div className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-gray-900', 'via-gray-900/10', 'to-transparent', 'opacity-90')}></div>
                <div className={clsx('absolute', 'top-5', 'right-5', 'bg-emerald-500/90', 'backdrop-blur-sm', 'px-4', 'py-1.5', 'rounded-full', 'border', 'border-emerald-400/50', 'shadow-lg')}>
                  <span className={clsx('text-white', 'text-xs', 'font-bold', 'uppercase', 'tracking-wider')}>{exec.position}</span>
                </div>
              </div>

              <div className={clsx('p-8', 'flex-1', 'flex', 'flex-col', 'relative', 'bg-gray-800')}>
                <div className={clsx('flex', 'justify-between', 'items-start', 'mb-6')}>
                  <h3 className={clsx('text-2xl', 'font-bold', 'text-white', 'group-hover:text-emerald-400', 'transition-colors')}>
                    {exec.name}
                  </h3>
                </div>

                <div className={clsx('flex', 'items-center', 'gap-3', 'text-gray-400', 'text-sm', 'mb-2')}>
                  <svg className={clsx('w-4', 'h-4', 'text-emerald-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{exec.department}</span>
                </div>
                <div className={clsx('flex', 'items-center', 'gap-3', 'text-gray-400', 'text-sm', 'mb-6', 'pb-6', 'border-b', 'border-gray-700/50')}>
                  <svg className={clsx('w-4', 'h-4', 'text-emerald-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{exec.level}</span>
                </div>
                <p className={clsx('text-gray-400', 'text-sm', 'leading-relaxed', 'mb-6', 'flex-1', 'italic')}>
                  "{exec.bio}"
                </p>
                <div className={clsx('flex', 'justify-between', 'items-center', 'mt-auto')}>
                  <button className={clsx('w-10', 'h-10', 'rounded-full', 'bg-gray-900', 'border', 'border-gray-700', 'flex', 'items-center', 'justify-center', 'text-gray-400', 'hover:text-emerald-400', 'hover:border-emerald-500/50', 'transition-colors')}>
                    <svg className={clsx('w-4', 'h-4')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <span className={clsx('text-xs', 'font-bold', 'text-gray-500', 'uppercase', 'tracking-widest', 'group-hover:text-emerald-500/70', 'transition-colors')}>
                    View Profile
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Past Executives Archive Section --- */}
      <section className={clsx('bg-gray-800/50', 'py-24', 'border-t', 'border-gray-700/50')}>
        <div className={clsx('container', 'mx-auto', 'px-6', 'max-w-7xl')}>

          <div className={clsx('text-center', 'mb-16')}>
            <h2 className={clsx('text-3xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-4', 'text-white')}>Past Administrations</h2>
            <p className={clsx('text-gray-400', 'max-w-2xl', 'mx-auto')}>
              Honoring the legacy of our previous executive councils who paved the way for engineering excellence at NUESA ACU.
            </p>
          </div>

          {/* Academic Session Selector Tabs */}
          <div className={clsx('flex', 'flex-wrap', 'justify-center', 'gap-3', 'mb-12')}>
            {pastSessions.map(session => (
              <button
                key={session}
                onClick={() => setActiveSession(session)}
                className={`px-6 py-3 rounded-full font-bold text-sm tracking-widest transition-all duration-300 ${activeSession === session
                  ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-emerald-500/50 hover:text-white'
                  }`}
              >
                {session}
              </button>
            ))}
          </div>

          {/* Selected Session Gallery */}
          <div className={clsx('bg-gray-900', 'border', 'border-gray-700', 'rounded-3xl', 'p-8', 'md:p-12', 'shadow-2xl', 'relative', 'overflow-hidden')}>

            {/* Background absolute date watermark */}
            <div className={clsx('absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'text-[15vw]', 'font-black', 'text-gray-800/30', 'whitespace-nowrap', 'select-none', 'pointer-events-none', 'font-serif', 'italic')}>
              {activeSession}
            </div>

            {pastExecutivesData[activeSession].length === 1 ? (
              /* Single-photo/Group-photo layout (e.g. 2022-2023) */
              <div className="flex justify-center">
                <div className="group relative w-full max-w-4xl bg-gray-800/80 border border-gray-700 hover:border-emerald-500/60 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.2)]">
                  <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-900">
                    <img
                      src={pastExecutivesData[activeSession][0].img}
                      alt={`NUESA ACU ${activeSession} Administration`}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-750"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x600?text=Administration+Group+Photo'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end">
                    <div>
                      <h4 className="text-white font-bold text-xl md:text-2xl font-serif">Executive Council Group Photo</h4>
                      <p className="text-gray-400 text-sm mt-1">NUESA ACU Session Archive</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-block bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-sm rounded-full px-4 py-1.5 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        {activeSession} Session
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Multi-photo grid layout */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {pastExecutivesData[activeSession].map(pastExec => (
                  <div key={pastExec.id} className="group text-center bg-gray-800/80 border border-gray-700 hover:border-emerald-500/50 rounded-2xl transition-colors duration-300 shadow-xl overflow-hidden">
                    <div className="w-full aspect-square overflow-hidden bg-gray-900">
                      <img
                        src={pastExec.img}
                        alt={pastExec.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Photo'; }}
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="text-white font-bold text-base group-hover:text-emerald-400 transition-colors">{pastExec.name}</h4>
                      <p className="text-emerald-500/80 text-xs font-bold tracking-wider uppercase mt-1">{pastExec.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>

    </div>
  );
};

export default ExecutivesPage;
