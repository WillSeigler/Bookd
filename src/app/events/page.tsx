import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function EventsPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Discover performances and musical events near you</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Performance Type Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Performance Type</option>
            <option className="text-gray-700">Concert</option>
            <option className="text-gray-700">Recital</option>
            <option className="text-gray-700">Opera</option>
            <option className="text-gray-700">Musical Theater</option>
            <option className="text-gray-700">Jazz Performance</option>
            <option className="text-gray-700">Chamber Music</option>
            <option className="text-gray-700">Orchestra</option>
            <option className="text-gray-700">Solo Performance</option>
            <option className="text-gray-700">Open Mic</option>
            <option className="text-gray-700">Festival</option>
          </select>

          {/* Genre Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Genre</option>
            <option className="text-gray-700">Classical</option>
            <option className="text-gray-700">Jazz</option>
            <option className="text-gray-700">Blues</option>
            <option className="text-gray-700">Folk</option>
            <option className="text-gray-700">Rock</option>
            <option className="text-gray-700">Pop</option>
            <option className="text-gray-700">Country</option>
            <option className="text-gray-700">Electronic</option>
            <option className="text-gray-700">World Music</option>
            <option className="text-gray-700">Contemporary</option>
          </select>

          {/* Date Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Date</option>
            <option className="text-gray-700">Today</option>
            <option className="text-gray-700">This Week</option>
            <option className="text-gray-700">This Weekend</option>
            <option className="text-gray-700">Next Week</option>
            <option className="text-gray-700">This Month</option>
            <option className="text-gray-700">Next Month</option>
            <option className="text-gray-700">Custom Date Range</option>
          </select>

          {/* Location Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Location</option>
            <option className="text-gray-700">Within 5 miles</option>
            <option className="text-gray-700">Within 10 miles</option>
            <option className="text-gray-700">Within 25 miles</option>
            <option className="text-gray-700">Columbia, SC</option>
            <option className="text-gray-700">Charleston, SC</option>
            <option className="text-gray-700">Greenville, SC</option>
            <option className="text-gray-700">Charlotte, NC</option>
            <option className="text-gray-700">Atlanta, GA</option>
            <option className="text-gray-700">Virtual/Online</option>
          </select>

          {/* Venue Type Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Venue Type</option>
            <option className="text-gray-700">Concert Hall</option>
            <option className="text-gray-700">Theater</option>
            <option className="text-gray-700">Club/Bar</option>
            <option className="text-gray-700">Church</option>
            <option className="text-gray-700">University</option>
            <option className="text-gray-700">Museum</option>
            <option className="text-gray-700">Outdoor Venue</option>
            <option className="text-gray-700">Private Venue</option>
            <option className="text-gray-700">Community Center</option>
          </select>

          {/* Price Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Price</option>
            <option className="text-gray-700">Free</option>
            <option className="text-gray-700">Under $10</option>
            <option className="text-gray-700">$10 - $25</option>
            <option className="text-gray-700">$25 - $50</option>
            <option className="text-gray-700">$50 - $100</option>
            <option className="text-gray-700">Over $100</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Event Card 1 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M13.243 8.757a1 1 0 011.414 0A5.978 5.978 0 0116 12a5.978 5.978 0 01-1.343 3.243 1 1 0 11-1.414-1.414A3.982 3.982 0 0014 12a3.982 3.982 0 00-.757-2.243 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-700">Classical Concert</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Winter Symphony Concert</h3>
                <p className="text-sm text-gray-600">USC Symphony Orchestra</p>
              </div>
              <span className="text-sm font-medium text-green-600">Free</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 18, 2024 at 7:30 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Koger Center, Columbia SC
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Join us for an evening of beautiful classical music featuring works by Mozart, Beethoven, and contemporary composers.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">0.8 miles away</span>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Get Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Event Card 2 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-purple-700">Jazz Night</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Jazz at Blue Moon</h3>
                <p className="text-sm text-gray-600">Blue Moon Jazz Club</p>
              </div>
              <span className="text-sm font-medium text-green-600">$15</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 15, 2024 at 8:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Blue Moon Club, Columbia SC
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Live jazz performances featuring local musicians. Open mic session starts at 9:30 PM. Great atmosphere and drinks!
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">2.1 miles away</span>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Get Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Event Card 3 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-700">Music Festival</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Holiday Music Festival</h3>
                <p className="text-sm text-gray-600">Finlay Park</p>
              </div>
              <span className="text-sm font-medium text-green-600">Free</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 22, 2024 at 6:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Finlay Park, Columbia SC
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              A festive celebration featuring multiple artists, food trucks, and holiday music. Perfect for families and music lovers!
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">3.4 miles away</span>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Event Card 4 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-700">Opera</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">La Bohème</h3>
                <p className="text-sm text-gray-600">Columbia Opera Company</p>
              </div>
              <span className="text-sm font-medium text-orange-600">$45</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                January 5, 2025 at 7:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Drayton Hall Theater, Charleston SC
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Puccini's beloved opera about love, loss, and bohemian life in Paris. Sung in Italian with English supertitles.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">112 miles away</span>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Get Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Event Card 5 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-yellow-700">Open Mic</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Open Mic Night</h3>
                <p className="text-sm text-gray-600">The Art Bar</p>
              </div>
              <span className="text-sm font-medium text-green-600">Free</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Every Wednesday at 7:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                The Art Bar, Columbia SC
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Showcase your talent! All skill levels welcome. Sign up starts at 6:30 PM. Great supportive community of musicians.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">1.2 miles away</span>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Event Card 6 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-indigo-700">Masterclass</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Piano Masterclass</h3>
                <p className="text-sm text-gray-600">Dr. Sarah Chen</p>
              </div>
              <span className="text-sm font-medium text-orange-600">$25</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 20, 2024 at 2:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                USC School of Music
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Learn advanced techniques and interpretation from renowned pianist Dr. Sarah Chen. Open to advanced students and professionals.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">0.9 miles away</span>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}