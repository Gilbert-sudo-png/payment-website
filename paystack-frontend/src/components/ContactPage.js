import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ContactPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-emerald-500 font-bold tracking-widest uppercase text-sm mb-2">Get in touch</p>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Contact & Feedback</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Have questions about your payments, or want to give feedback about the school and website? Reach out to us below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information & Socials */}
          <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Our Contact Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-400 font-semibold mb-1">Phone Number</h3>
                  <p className="text-lg">+234 800 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-400 font-semibold mb-1">Email Address</h3>
                  <p className="text-lg">support@nuesa-acu.com</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-700 my-8" />
            
            <h3 className="text-xl font-bold mb-4">Social Media</h3>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                {/* Facebook Icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.324-.597 1.324-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                {/* Twitter Icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                {/* Instagram Icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Send Feedback</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors"
                    defaultValue={user ? user.name : ''}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors"
                    defaultValue={user ? user.email : ''}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Subject</label>
                <select className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors">
                  <option>Website Feedback</option>
                  <option>Payment Issue</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Message</label>
                <textarea 
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors h-32 resize-none"
                  placeholder="Tell us what you think..."
                ></textarea>
              </div>
              <button 
                type="button" 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
