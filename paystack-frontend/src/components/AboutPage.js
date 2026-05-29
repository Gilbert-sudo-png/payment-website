import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple helper to join classes dynamically
const clsx = (...classes) => classes.filter(Boolean).join(' ');

const AboutPage = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);

  // Reusable Component Data imitating the detailed structure requested
  const stats = [
    { label: 'Active Members', value: '500+' },
    { label: 'Departments', value: '4' },
    { label: 'Annual Events', value: '4' },
    { label: 'Years Active', value: '4' },
  ];

  const coreValues = [
    { title: 'Mission', desc: 'Empowering students to lead in engineering through excellence, leadership, and vision.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Innovation', desc: 'Encouraging creativity and problem-solving to build practical solutions for society.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { title: 'Community', desc: 'Fostering a sense of belonging and collaboration across all engineering disciplines.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Learning', desc: 'Promoting continuous academic growth and professional development opportunities.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  const departments = [
    {
      name: 'Mechanical Engineering',
      desc: 'The study of physical machines that may involve force and movement.',
      fullDesc: 'Mechanical Engineering at Ajayi Crowther University provides a robust foundation in the principles of mechanics, thermodynamics, and energy. Our state-of-the-art workshops allow students to explore machine design, robotics, and manufacturing processes, ensuring they are ready to lead in industrial innovation.',
      courses: ['Mechanics of Machines', 'Thermodynamics', 'Fluid Mechanics', 'Control Systems'],
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      images: [
        '/assets/mechanical/IMG_6905.JPG', '/assets/mechanical/IMG_6906.JPG', '/assets/mechanical/IMG_6907.JPG',
        '/assets/mechanical/IMG_6908.JPG', '/assets/mechanical/IMG_6909.JPG', '/assets/mechanical/IMG_6910.JPG',
        '/assets/mechanical/IMG_6915.JPG', '/assets/mechanical/IMG_7196.JPG'
      ]
    },
    {
      name: 'Civil Engineering',
      desc: 'Design, construction, and maintenance of the physical and naturally built environment.',
      fullDesc: 'Our Civil Engineering program focuses on building sustainable infrastructure for the future. From structural engineering to soil mechanics and highway design, students are trained to design and manage projects that shape our cities and preserve our environment.',
      courses: ['Theory of Structures', 'Soil Mechanics', 'Highway Engineering', 'Structural Design'],
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      images: [
        '/assets/civil/IMG_6893.JPG', '/assets/civil/IMG_6894.JPG', '/assets/civil/IMG_6895.JPG',
        '/assets/civil/IMG_6896.JPG', '/assets/civil/IMG_6897.JPG', '/assets/civil/IMG_6898.JPG',
        '/assets/civil/IMG_6914.JPG'
      ]
    },
    {
      name: 'Electrical Engineering',
      desc: 'Study, design, and application of equipment, devices, and systems which use electricity.',
      fullDesc: 'Electrical and Electronics Engineering at ACU covers the vast spectrum of power generation, telecommunications, and circuit design. Students engage in practical projects involving microprocessors, renewable energy, and digital signal processing.',
      courses: ['Circuit Theory', 'Microprocessors', 'Power Systems', 'Signals & Systems'],
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      images: [
        '/assets/electrical/IMG_6902.JPG', '/assets/electrical/IMG_7202.JPG', '/assets/electrical/IMG_7203.JPG',
        '/assets/electrical/IMG_7204.JPG', '/assets/electrical/IMG_7205.JPG', '/assets/electrical/IMG_7213.JPG',
        '/assets/electrical/IMG_7214.JPG', '/assets/electrical/IMG_7215.JPG'
      ]
    },
    {
      name: 'Computer Engineering',
      desc: 'Integrates fields of computer science and electronic engineering to develop hardware and software.',
      fullDesc: 'Computer Engineering combines the best of both hardware and software worlds. At ACU, we prepare students for the tech industry by teaching them how to build efficient computer systems, develop advanced software, and understand the intricacies of digital logic.',
      courses: ['Software Engineering', 'Data Structures', 'Digital Logic Design', 'AI & Machine Learning'],
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      images: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2940&auto=format&fit=crop'
      ]
    }
  ];

  return (
    <div className={clsx('min-h-screen', 'bg-gray-900', 'text-white', 'font-sans', 'overflow-x-hidden', 'pt-28', 'pb-20')}>

      {/* 1. Hero Section (Who We Are) */}
      <section className={clsx('container', 'mx-auto', 'px-6', 'max-w-7xl', 'mb-24')}>
        <div className={clsx('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-16', 'items-center')}>

          {/* Left Column: President Image / Feature Image */}
          <div className={clsx('relative', 'group')}>
            <div className={clsx('absolute', '-inset-1', 'bg-gradient-to-r', 'from-emerald-500', 'to-cyan-500', 'rounded-3xl', 'blur', 'opacity-30', 'group-hover:opacity-50', 'transition', 'duration-1000')}></div>
            <div className={clsx('relative', 'rounded-3xl', 'overflow-hidden', 'bg-gray-850', 'shadow-2xl', 'aspect-[4/5]', 'md:aspect-auto', 'md:h-[600px]', 'border', 'border-gray-700/50', 'flex', 'items-center', 'justify-center', 'bg-emerald-900/10')}>
              <img
                src="/assets/executives/FEMI.png"
                alt="Olawoyin Oluwafemi John - NUESA President"
                className={clsx('w-full', 'h-full', 'object-contain', 'object-bottom', 'scale-100', 'group-hover:scale-105', 'transition-transform', 'duration-700', 'pt-8')}
              />
              <div className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-gray-900', 'via-gray-900/10', 'to-transparent', 'opacity-90')}></div>
              <div className={clsx('absolute', 'bottom-10', 'left-10', 'right-10')}>
                <span className={clsx('bg-emerald-500', 'text-white', 'text-xs', 'font-bold', 'uppercase', 'tracking-widest', 'px-3', 'py-1', 'rounded-full', 'mb-3', 'inline-block')}>NUESA President</span>
                <h3 className={clsx('text-3xl', 'font-serif', 'font-bold', 'text-white', 'leading-tight')}>Olawoyin Oluwafemi John</h3>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Content */}
          <div className={clsx('flex', 'flex-col', 'justify-center')}>
            <h1 className={clsx('text-5xl', 'lg:text-7xl', 'font-bold', 'font-serif', 'mb-6', 'text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-emerald-400', 'to-cyan-400', 'leading-tight')}>
              Who We Are
            </h1>
            <p className={clsx('text-gray-400', 'text-lg', 'leading-relaxed', 'mb-6', 'font-light')}>
              The Nigerian Universities Engineering Students' Association (NUESA) at Ajayi Crowther University is the umbrella body representing the vibrant and innovative engineering student community.
            </p>
            <p className={clsx('text-gray-400', 'text-lg', 'leading-relaxed', 'mb-12', 'font-light')}>
              We are dedicated to fostering an environment where academic excellence seamlessly integrates with practical, hands-on experience, preparing our members to tackle the complex technological challenges of the 21st century.
            </p>

            {/* Stats Row */}
            <div className={clsx('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-8')}>
              {stats.map((stat, idx) => (
                <div key={idx} className={clsx('flex', 'flex-col', 'border-l-2', 'border-emerald-500/30', 'pl-4')}>
                  <span className={clsx('text-4xl', 'font-black', 'text-white', 'tracking-tight')}>{stat.value}</span>
                  <span className={clsx('text-sm', 'text-emerald-400', 'font-bold', 'uppercase', 'tracking-wider', 'mt-1')}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Values Section */}
      <section className={clsx('bg-gray-800/50', 'py-24', 'border-y', 'border-gray-700/50')}>
        <div className={clsx('container', 'mx-auto', 'px-6', 'max-w-7xl')}>
          <div className={clsx('text-center', 'mb-16')}>
            <h2 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-4', 'text-white')}>Our Core Values</h2>
            <div className={clsx('w-24', 'h-1', 'bg-gradient-to-r', 'from-emerald-500', 'to-cyan-500', 'mx-auto', 'rounded-full')}></div>
          </div>

          <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-8')}>
            {coreValues.map((value, idx) => (
              <div key={idx} className={clsx('bg-gray-900', 'border', 'border-gray-700', 'p-8', 'rounded-2xl', 'hover:-translate-y-2', 'transition-transform', 'duration-300', 'shadow-xl', 'group')}>
                <div className={clsx('w-14', 'h-14', 'bg-emerald-500/10', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'mb-6', 'text-emerald-400', 'group-hover:bg-emerald-500', 'group-hover:text-white', 'transition-colors', 'duration-300', 'border', 'border-emerald-500/20', 'group-hover:border-emerald-500')}>
                  <svg className={clsx('w-7', 'h-7')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className={clsx('text-2xl', 'font-bold', 'mb-3', 'text-white')}>{value.title}</h3>
                <p className={clsx('text-gray-400', 'leading-relaxed')}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Engineering Departments Grid */}
      <section className={clsx('container', 'mx-auto', 'px-6', 'max-w-7xl', 'py-24')}>
        <div className="mb-16">
          <h2 className={clsx('text-4xl', 'md:text-5xl', 'font-bold', 'font-serif', 'mb-4', 'text-white')}>Engineering Departments</h2>
          <h3 className={clsx('text-emerald-400', 'text-xl', 'font-medium', 'tracking-wide', 'uppercase')}>Our Academic Disciplines</h3>
          <p className={clsx('text-gray-500', 'mt-4', 'italic')}>Click on a department card to view more details and photos.</p>
        </div>

        <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-2', 'xl:grid-cols-4', 'gap-8')}>
          {departments.map((dept, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDept(dept)}
              className={clsx('bg-gray-800', 'border-t', 'border-r', 'border-b-4', 'border-l', 'border-gray-700', 'border-b-emerald-500', 'p-8', 'rounded-2xl', 'hover:bg-gray-700/80', 'hover:scale-[1.02]', 'cursor-pointer', 'transition-all', 'shadow-lg', 'flex', 'flex-col', 'h-full', 'group')}
            >
              <div className={clsx('flex', 'items-center', 'gap-4', 'mb-6')}>
                <div className={clsx('p-3', 'bg-gray-900', 'rounded-lg', 'text-emerald-400', 'group-hover:bg-emerald-500', 'group-hover:text-white', 'transition-colors')}>
                  <svg className={clsx('w-8', 'h-8')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={dept.icon} />
                  </svg>
                </div>
                <h3 className={clsx('text-xl', 'font-bold', 'text-white', 'leading-tight', 'group-hover:text-emerald-400', 'transition-colors')}>{dept.name}</h3>
              </div>
              <p className={clsx('text-gray-400', 'mb-8', 'flex-1')}>{dept.desc}</p>

              <div className={clsx('border-t', 'border-gray-700/50', 'pt-6')}>
                <h4 className={clsx('text-sm', 'font-bold', 'text-emerald-400', 'uppercase', 'tracking-wider', 'mb-4')}>Key Courses:</h4>
                <ul className="space-y-2">
                  {dept.courses.slice(0, 3).map((course, cIdx) => (
                    <li key={cIdx} className={clsx('flex', 'items-start', 'gap-2', 'text-sm', 'text-gray-300')}>
                      <svg className={clsx('w-4', 'h-4', 'text-emerald-500', 'shrink-0', 'mt-0.5')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {course}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={clsx('mt-8', 'flex', 'justify-end')}>
                <span className={clsx('text-emerald-400', 'text-xs', 'font-bold', 'uppercase', 'tracking-widest', 'flex', 'items-center', 'gap-1', 'group-hover:translate-x-1', 'transition-transform')}>
                  View Details <svg className={clsx('w-4', 'h-4')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Department Details Modal */}
      {selectedDept && (
        <div className={clsx('fixed', 'inset-0', 'z-[100]', 'flex', 'items-center', 'justify-center', 'p-4', 'md:p-8', 'bg-gray-950/90', 'backdrop-blur-md', 'overflow-hidden')}>
          <div className={clsx('bg-gray-900', 'border', 'border-gray-800', 'w-full', 'max-w-5xl', 'max-h-full', 'rounded-3xl', 'overflow-hidden', 'flex', 'flex-col', 'shadow-2xl', 'relative')}>

            {/* Modal Header */}
            <div className={clsx('p-6', 'md:p-8', 'border-b', 'border-gray-800', 'flex', 'justify-between', 'items-center', 'bg-gray-900', 'sticky', 'top-0', 'z-10')}>
              <div className={clsx('flex', 'items-center', 'gap-4')}>
                <div className={clsx('p-3', 'bg-emerald-500/10', 'rounded-xl', 'text-emerald-400')}>
                  <svg className={clsx('w-8', 'h-8')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={selectedDept.icon} />
                  </svg>
                </div>
                <h2 className={clsx('text-2xl', 'md:text-3xl', 'font-bold', 'font-serif', 'text-white')}>{selectedDept.name}</h2>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className={clsx('p-2', 'hover:bg-gray-800', 'rounded-full', 'text-gray-400', 'hover:text-white', 'transition-colors')}
              >
                <svg className={clsx('w-8', 'h-8')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className={clsx('p-6', 'md:p-10', 'overflow-y-auto', 'custom-scrollbar')}>
              <div className={clsx('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-12')}>

                {/* Text Side */}
                <div>
                  <h3 className={clsx('text-emerald-400', 'font-bold', 'uppercase', 'tracking-widest', 'text-sm', 'mb-4')}>About the Department</h3>
                  <p className={clsx('text-gray-300', 'text-lg', 'leading-relaxed', 'mb-8')}>{selectedDept.fullDesc}</p>

                  <h3 className={clsx('text-emerald-400', 'font-bold', 'uppercase', 'tracking-widest', 'text-sm', 'mb-4')}>Focus Courses</h3>
                  <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4', 'mb-8')}>
                    {selectedDept.courses.map((course, idx) => (
                      <div key={idx} className={clsx('flex', 'items-center', 'gap-3', 'bg-gray-800/50', 'p-4', 'rounded-xl', 'border', 'border-gray-700/30')}>
                        <div className={clsx('w-2', 'h-2', 'bg-emerald-500', 'rounded-full')}></div>
                        <span className={clsx('text-gray-200', 'font-medium')}>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Side */}
                <div>
                  <h3 className={clsx('text-emerald-400', 'font-bold', 'uppercase', 'tracking-widest', 'text-sm', 'mb-4')}>Department Gallery</h3>
                  <div className={clsx('grid', 'grid-cols-2', 'gap-4')}>
                    {selectedDept.images.map((img, idx) => (
                      <div key={idx} className={clsx('aspect-square', 'rounded-2xl', 'overflow-hidden', 'border', 'border-gray-700', 'bg-gray-800')}>
                        <img
                          src={img}
                          alt={`${selectedDept.name} ${idx}`}
                          className={clsx('w-full', 'h-full', 'object-cover', 'hover:scale-110', 'transition-transform', 'duration-500')}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop'; }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className={clsx('p-6', 'border-t', 'border-gray-800', 'bg-gray-900/50', 'flex', 'justify-end')}>
              <button
                onClick={() => setSelectedDept(null)}
                className={clsx('bg-gray-800', 'hover:bg-gray-700', 'text-white', 'font-bold', 'py-3', 'px-10', 'rounded-xl', 'transition-all')}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. President's Closing Message */}
      <section className={clsx('container', 'mx-auto', 'px-6', 'max-w-4xl', 'py-12', 'mb-12')}>
        <div className={clsx('bg-gradient-to-br', 'from-gray-800', 'to-gray-900', 'border', 'border-gray-700', 'p-12', 'rounded-[2.5rem]', 'relative', 'overflow-hidden', 'shadow-2xl')}>
          <div className={clsx('absolute', 'top-0', 'right-0', '-mt-8', '-mr-8', 'text-gray-700/30')}>
            <svg className={clsx('w-64', 'h-64')} fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
          </div>

          <div className={clsx('relative', 'z-10')}>
            <p className={clsx('text-2xl', 'md:text-3xl', 'text-white', 'font-serif', 'italic', 'leading-relaxed', 'mb-8')}>
              "Reformation: Sustaining Policies and Advancing Possibilities. Together, we are building an engineering community that leads with vision and executes with precision."
            </p>

            <div className={clsx('flex', 'flex-col', 'md:flex-row', 'md:items-center', 'justify-between', 'gap-6')}>
              <div>
                <p className={clsx('text-xl', 'font-bold', 'text-emerald-400')}>Olawoyin Oluwafemi John</p>
                <p className={clsx('text-gray-400', 'font-medium')}>President, NUESA ACU</p>
              </div>

              <button
                onClick={() => navigate('/home')}
                className={clsx('bg-emerald-500', 'hover:bg-emerald-400', 'text-white', 'font-bold', 'py-3', 'px-8', 'rounded-full', 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', 'transition-all', 'uppercase', 'tracking-wider', 'text-sm', 'whitespace-nowrap')}
              >
                Back to Portal
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
