import React from 'react';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {

  const pastProjects = [
    {
      id: 1,
      title: 'Findr Integration Platform',
      year: '2024',
      desc: 'Developed a dedicated roommate matching and real estate assistant integrated directly for student welfare.',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&h=400&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Garden Relaxation Bench',
      year: '2023',
      desc: 'Commissioned the construction of high-quality relaxation spots around the engineering quad.',
      img: 'https://images.unsplash.com/photo-1596404555896-da087ea28373?q=80&w=600&h=400&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Common Room Lounge',
      year: '2022',
      desc: 'Complete renovation of the engineering student lounge, including premium sofas and study lighting.',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&h=400&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Ventilation System',
      year: '2015',
      desc: 'Mass installation of industrial fans and AC units across all major lecture theaters.',
      img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&h=400&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden pt-28 pb-20">
      
      {/* 1. Hero Section */}
      <section className="container mx-auto px-6 max-w-7xl mb-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 text-white leading-tight">
            NUESA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Projects</span>
          </h1>
          <div className="w-24 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Leading by example. We focus on continuous innovation, academic elevation, and infrastructural support for the ultimate student welfare.
          </p>
        </div>
      </section>

      {/* 2. Ongoing Featured Project Section */}
      <section className="container mx-auto px-6 max-w-7xl mb-32">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-bold font-serif text-white">Ongoing Operations</h2>
        </div>
        
        <div className="bg-gray-800 border border-gray-700/60 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row group hover:border-emerald-500/30 transition-all duration-500 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] group-hover:bg-emerald-500/10 transition-colors"></div>
          
          <div className="md:w-1/2 relative overflow-hidden h-[400px] md:h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&h=800&auto=format&fit=crop" 
              alt="Engineering Hub"
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Nav Arrows Placeholder */}
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button className="w-12 h-12 rounded-full bg-gray-900/60 backdrop-blur text-white flex items-center justify-center hover:bg-emerald-500 transition-colors border border-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-gray-900/60 backdrop-blur text-white flex items-center justify-center hover:bg-emerald-500 transition-colors border border-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative bg-gray-800">
             <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 w-max mb-6">
                Featured Initiative
             </span>
             <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">The Modern Engineering Digital Hub</h3>
             <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
               Currently in development, this initiative seeks to completely digitize student records, seamlessly integrate payment and voting modules, and deploy high-speed access terminals in core locations around the faculty.
             </p>
             <Link to="/home" className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold px-8 py-4 rounded-full w-max shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center gap-3">
                Visit Project Space
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </Link>
          </div>
        </div>
      </section>

      {/* 3. Completed Achievements Section */}
      <section className="container mx-auto px-6 max-w-7xl pt-16 border-t border-gray-800 border-dashed">
        <div className="mb-16">
          <h2 className="text-4xl font-bold font-serif text-white mb-3">Our Engineering Achievements</h2>
          <p className="text-gray-400 text-lg font-light">Take a look at some of the projects we have completed in the past.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {pastProjects.map((project) => (
            <div key={project.id} className="bg-gray-800 border border-gray-700/50 rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(16,185,129,0.1)] transition-all duration-300 group flex flex-col">
              
              <div className="h-48 overflow-hidden relative border-b border-gray-700/50">
                <img 
                  src={project.img} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              </div>
              
              <div className="p-6 relative bg-gray-800 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3 leading-snug">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {project.desc}
                </p>
                
                <div className="flex justify-between items-end mt-auto">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-emerald-400 font-bold text-sm tracking-widest">{project.year}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProjectsPage;
