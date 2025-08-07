import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function GigsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Gigs</h1>
          <p className="text-gray-600 mt-1">Find and post music gig opportunities</p>
        </div>
        <button className="px-6 py-3 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
          Post New Gig
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Instrument Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Instrument</option>
            <option className="text-gray-700">Guitar</option>
            <option className="text-gray-700">Piano</option>
            <option className="text-gray-700">Violin</option>
            <option className="text-gray-700">Drums</option>
            <option className="text-gray-700">Saxophone</option>
            <option className="text-gray-700">Trumpet</option>
            <option className="text-gray-700">Oboe</option>
            <option className="text-gray-700">Bass</option>
            <option className="text-gray-700">Vocals</option>
            <option className="text-gray-700">Any Instrument</option>
          </select>

          {/* Duration Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Duration</option>
            <option className="text-gray-700">1-2 hours</option>
            <option className="text-gray-700">3-4 hours</option>
            <option className="text-gray-700">5-6 hours</option>
            <option className="text-gray-700">Full Day</option>
            <option className="text-gray-700">Multiple Days</option>
            <option className="text-gray-700">Ongoing</option>
          </select>

          {/* Genre Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Genre</option>
            <option className="text-gray-700">Classical</option>
            <option className="text-gray-700">Jazz</option>
            <option className="text-gray-700">Rock</option>
            <option className="text-gray-700">Pop</option>
            <option className="text-gray-700">Country</option>
            <option className="text-gray-700">Blues</option>
            <option className="text-gray-700">Folk</option>
            <option className="text-gray-700">Electronic</option>
            <option className="text-gray-700">Hip-Hop</option>
            <option className="text-gray-700">Wedding Music</option>
          </select>

          {/* Payment Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Payment</option>
            <option className="text-gray-700">$50-100</option>
            <option className="text-gray-700">$100-250</option>
            <option className="text-gray-700">$250-500</option>
            <option className="text-gray-700">$500-1000</option>
            <option className="text-gray-700">$1000+</option>
            <option className="text-gray-700">Negotiable</option>
            <option className="text-gray-700">Volunteer/Exposure</option>
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
            <option className="text-gray-700">Remote/Virtual</option>
          </select>

          {/* Gig Type Filter */}
          <select className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors focus:outline-none focus:ring-2" style={{backgroundColor: '#E8DFFF', color: '#7823E1', borderColor: '#7823E1', '--tw-ring-color': '#7823E1'} as React.CSSProperties}>
            <option className="text-gray-700">Gig Type</option>
            <option className="text-gray-700">Wedding</option>
            <option className="text-gray-700">Corporate Event</option>
            <option className="text-gray-700">Private Party</option>
            <option className="text-gray-700">Concert</option>
            <option className="text-gray-700">Recording Session</option>
            <option className="text-gray-700">Teaching</option>
            <option className="text-gray-700">Church Service</option>
            <option className="text-gray-700">Festival</option>
          </select>
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gig Card 1 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-pink-700">Wedding</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Classical Duo for Wedding Ceremony</h3>
                <p className="text-sm text-gray-600">Smith Wedding</p>
              </div>
              <span className="text-sm font-medium text-green-600">$450</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                January 15, 2025 at 2:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Riverbanks Botanical Garden, Columbia SC
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                2 hours (ceremony + cocktails)
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Looking for violin and cello duo for outdoor wedding ceremony. Classical and contemporary pieces. Music for 30-min ceremony and 1-hour cocktail reception.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Classical</span>
                <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">Wedding</span>
              </div>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Gig Card 2 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-700">Corporate Event</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Jazz Quartet for Corporate Gala</h3>
                <p className="text-sm text-gray-600">TechCorp Annual Meeting</p>
              </div>
              <span className="text-sm font-medium text-green-600">$800</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 20, 2024 at 6:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Columbia Metropolitan Convention Center
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                3 hours (dinner background music)
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Seeking professional jazz quartet for upscale corporate dinner. Smooth jazz, standards, and light contemporary. Professional attire required.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Jazz</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Corporate</span>
              </div>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Gig Card 3 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-yellow-700">Recording Session</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Session Guitarist Needed</h3>
                <p className="text-sm text-gray-600">Independent Artist Album</p>
              </div>
              <span className="text-sm font-medium text-green-600">$300</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 18, 2024 at 10:00 AM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Harmony Recording Studio, Columbia SC
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                4-6 hours (3 songs)
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Need experienced session guitarist for indie-folk album. Lead and rhythm parts for 3 songs. Must read charts and be comfortable with multiple takes.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Folk</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Recording</span>
              </div>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Gig Card 4 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-700">Church Service</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Substitute Organist Position</h3>
                <p className="text-sm text-gray-600">St. Matthew's Episcopal Church</p>
              </div>
              <span className="text-sm font-medium text-green-600">$150</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 22, 2024 at 10:00 AM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                St. Matthew's Church, Columbia SC
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                2 hours (service + rehearsal)
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Need substitute organist for Sunday morning service. Traditional hymns and liturgical music. Pipe organ experience preferred.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Sacred</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Church</span>
              </div>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Gig Card 5 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-700">Private Party</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Holiday Party Entertainment</h3>
                <p className="text-sm text-gray-600">Private Residence</p>
              </div>
              <span className="text-sm font-medium text-green-600">$400</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                December 21, 2024 at 7:00 PM
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Forest Acres, Columbia SC
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                3 hours (cocktails and dinner)
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Looking for solo pianist or small ensemble for intimate holiday party. Mix of holiday standards, jazz, and light classical. 25 guests.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Holiday</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Private</span>
              </div>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Gig Card 6 */}
        <div className="bg-white rounded-lg shadow-md border-2 border-[#7823E1] overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-indigo-700">Teaching</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Private Piano Instructor</h3>
                <p className="text-sm text-gray-600">Advanced Student</p>
              </div>
              <span className="text-sm font-medium text-green-600">$75/hr</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Weekly lessons starting January 2025
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Student's home, Lexington SC
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                1 hour weekly (ongoing)
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Seeking experienced piano instructor for advanced high school student preparing for college auditions. Classical focus with theory knowledge required.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Classical</span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">Teaching</span>
              </div>
              <button className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{backgroundColor: '#7823E1'}}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}