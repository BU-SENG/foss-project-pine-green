// Mock data for the campus news system

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  department: string;
  level?: string;
  avatar?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Academic' | 'Event' | 'Sport' | 'Student Affairs' | 'Urgent' | 'General' | 'Administrative';
  department: string;
  author: User;
  publishedAt: Date;
  priority: 'normal' | 'high' | 'urgent';
  isBookmarked?: boolean;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  type: 'news' | 'event' | 'urgent' | 'system';
  message: string;
  timestamp: Date;
  isRead: boolean;
  relatedNewsId?: string;
}




// here 





// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@campus.edu',
    role: 'lecturer',
    department: 'Computer Science',
    avatar: '👩‍🏫',
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@campus.edu',
    role: 'lecturer',
    department: 'Engineering',
    avatar: '👨‍🏫',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@campus.edu',
    role: 'lecturer',
    department: 'Business',
    avatar: '👩‍💼',
  },
  {
    id: '4',
    name: 'Campus Admin',
    email: 'admin@campus.edu',
    role: 'admin',
    department: 'Administration',
    avatar: '👨‍💻',
  },
  {
    id: '6',
    name: 'Dr. James Anderson',
    email: 'james.anderson@campus.edu',
    role: 'lecturer',
    department: 'Medicine',
    avatar: '👨‍⚕️',
  },
  {
    id: '7',
    name: 'Prof. Amara Okafor',
    email: 'amara.okafor@campus.edu',
    role: 'lecturer',
    department: 'Science',
    avatar: '👩‍🔬',
  },
  {
    id: '8',
    name: 'Dr. David Kim',
    email: 'david.kim@campus.edu',
    role: 'lecturer',
    department: 'Arts',
    avatar: '👨‍🎨',
  },
  {
    id: '9',
    name: 'Prof. Fatima Hassan',
    email: 'fatima.hassan@campus.edu',
    role: 'lecturer',
    department: 'Engineering',
    avatar: '👩‍🏫',
  },
  {
    id: '10',
    name: 'Dr. Robert Williams',
    email: 'robert.williams@campus.edu',
    role: 'lecturer',
    department: 'Business',
    avatar: '👨‍💼',
  },
  {
    id: '11',
    name: 'Student Affairs Officer',
    email: 'affairs@campus.edu',
    role: 'admin',
    department: 'Student Affairs',
    avatar: '👥',
  },
];

export const currentUser: User = {
  id: '5',
  name: 'Alex Thompson',
  email: 'alex.thompson@student.campus.edu',
  role: 'student',
  department: 'Computer Science',
  level: '300 Level',
  avatar: '👨‍🎓',
};

// Mock News Items
export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Final Examination Timetable Released',
    excerpt: 'The examination timetable for the 2024/2025 academic session has been published. Students are advised to check their exam schedules.',
    content: `The examination timetable for the 2024/2025 academic session has been officially released. All students are required to check their individual exam schedules on the student portal.\n\nKey Points:\n- Exams begin on January 15th, 2025\n- No exam clashes reported\n- Special arrangements available for students with disabilities\n- Contact the Exams Office for any queries\n\nPlease ensure you arrive at least 30 minutes before your scheduled exam time.`,
    category: 'Academic',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-20T10:30:00'),
    priority: 'urgent',
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'Campus Tech Fest 2025 - Call for Participation',
    excerpt: 'Join us for the biggest technology event of the year! Showcase your projects, attend workshops, and network with industry professionals.',
    content: `We are excited to announce the Campus Tech Fest 2025, scheduled for February 10-12, 2025.\n\nEvent Highlights:\n- Project exhibitions from all departments\n- Industry expert keynotes\n- Hands-on workshops on AI, Web3, and Cloud Computing\n- Startup pitch competition with cash prizes\n- Networking sessions\n\nRegistration opens January 5th. Don't miss this opportunity to showcase your innovations!`,
    category: 'Event',
    department: 'Computer Science',
    author: mockUsers[0],
    publishedAt: new Date('2024-12-19T14:20:00'),
    priority: 'high',
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Library Extended Hours During Exam Period',
    excerpt: 'The university library will operate 24/7 starting next week to support students during the examination period.',
    content: `To support our students during the upcoming examination period, the main campus library will extend its operating hours.\n\nNew Schedule (Jan 8-31):\n- Open 24 hours, 7 days a week\n- All study rooms available for booking\n- Free coffee and snacks from 10 PM - 6 AM\n- Silent zones strictly enforced\n\nPlease bring your student ID for after-hours access.`,
    category: 'Student Affairs',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-18T09:15:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'Inter-Departmental Football Championship',
    excerpt: 'The annual inter-departmental football tournament kicks off next month. Team registration is now open!',
    content: `Get ready for the most anticipated sporting event of the semester! The Inter-Departmental Football Championship returns.\n\nTournament Details:\n- Registration deadline: January 10th\n- Tournament dates: January 20-27\n- Venue: Main Sports Complex\n- Cash prizes for top 3 teams\n- Trophy for the winning department\n\nContact the Sports Council to register your team.`,
    category: 'Sport',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-17T16:45:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'New Software Engineering Course Launch',
    excerpt: 'The Computer Science department is launching a new advanced course on Software Engineering best practices.',
    content: `We are pleased to announce the launch of a new elective course: Advanced Software Engineering (CSC 401).\n\nCourse Overview:\n- Instructor: Dr. Sarah Johnson\n- Credits: 3 units\n- Prerequisites: CSC 301, CSC 302\n- Topics: Design patterns, microservices, DevOps, testing strategies\n- Limited to 50 students\n\nRegistration opens on January 3rd on the student portal.`,
    category: 'Academic',
    department: 'Computer Science',
    author: mockUsers[0],
    publishedAt: new Date('2024-12-16T11:00:00'),
    priority: 'normal',
    isBookmarked: true,
  },
  {
    id: '6',
    title: 'Emergency: Campus Water Supply Interruption',
    excerpt: 'There will be a temporary water supply interruption tomorrow from 8 AM to 2 PM due to maintenance work.',
    content: `URGENT NOTICE\n\nDue to essential maintenance work on the main water pipeline, there will be a temporary interruption to water supply across campus.\n\nDetails:\n- Date: December 22, 2024\n- Time: 8:00 AM - 2:00 PM\n- Affected areas: All campus buildings\n- Water tankers will be stationed at strategic locations\n\nWe apologize for any inconvenience. Please plan accordingly.`,
    category: 'Urgent',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-21T07:00:00'),
    priority: 'urgent',
    isBookmarked: false,
  },
  {
    id: '7',
    title: 'Career Fair 2025 - Meet Top Employers',
    excerpt: 'Over 50 companies will be on campus for recruitment. Prepare your resumes and dress professionally!',
    content: `The annual Career Fair is back! This is your chance to meet potential employers and explore career opportunities.\n\nEvent Details:\n- Date: February 5-6, 2025\n- Time: 9 AM - 5 PM\n- Venue: University Auditorium\n- Participating companies: Tech giants, startups, consulting firms\n- Free CV review sessions\n- Mock interview workshops\n\nParticipating Companies Include:\n- Google, Microsoft, Amazon\n- Local tech startups\n- Banking and finance firms\n- NGOs and public sector organizations\n\nRegister early to secure your spot!`,
    category: 'Event',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-15T13:30:00'),
    priority: 'high',
    isBookmarked: false,
  },
  {
    id: '8',
    title: 'Engineering Design Competition Winners',
    excerpt: 'Congratulations to the winners of this year\'s Engineering Design Competition. Innovative solutions to real-world problems!',
    content: `We are proud to announce the winners of the 2024 Engineering Design Competition.\n\n1st Place: Solar-Powered Water Purification System\nTeam: Innovation Squad (Mechanical Engineering)\nPrize: $5,000\n\n2nd Place: Smart Traffic Management AI\nTeam: Code Crafters (Computer Engineering)\nPrize: $3,000\n\n3rd Place: Eco-Friendly Building Materials\nTeam: Green Engineers (Civil Engineering)\nPrize: $2,000\n\nThank you to all participants for your creativity and hard work!`,
    category: 'Academic',
    department: 'Engineering',
    author: mockUsers[1],
    publishedAt: new Date('2024-12-14T15:20:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '9',
    title: 'Medical School Open Day - January 20th',
    excerpt: 'Prospective students are invited to tour our state-of-the-art medical facilities and meet faculty members.',
    content: `Join us for the Medical School Open Day on January 20th, 2025.\n\nEvent Schedule:\n- 9:00 AM: Welcome & Registration\n- 10:00 AM: Campus Tour\n- 11:30 AM: Meet the Faculty Panel\n- 1:00 PM: Lunch & Networking\n- 2:30 PM: Q&A Session\n- 4:00 PM: Closing Remarks\n\nRSVP required. Limited spots available.`,
    category: 'Event',
    department: 'Medicine',
    author: mockUsers[5],
    publishedAt: new Date('2024-12-13T08:00:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '10',
    title: 'Scholarship Applications Now Open',
    excerpt: 'The Dean\'s Merit Scholarship for outstanding students is now accepting applications for the 2025 academic year.',
    content: `Applications are now open for the prestigious Dean\'s Merit Scholarship.\n\nEligibility:\n- Minimum CGPA of 3.5\n- Active participation in campus activities\n- Strong academic record\n- Leadership qualities\n\nAward: Full tuition coverage + $2,000 stipend\nDeadline: February 1st, 2025\n\nSubmit your application through the student portal.`,
    category: 'Academic',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-12T10:00:00'),
    priority: 'high',
    isBookmarked: true,
  },
  {
    id: '11',
    title: 'Student Union Elections - Candidate Nominations',
    excerpt: 'Nominations are now open for Student Union executive positions. Make your voice heard!',
    content: `The Student Union invites nominations for the following positions:\n\n- President\n- Vice President\n- General Secretary\n- Financial Secretary\n- Social Director\n\nNomination Period: December 23 - January 5\nCampaign Period: January 6 - 17\nElection Day: January 18, 2025\n\nAll students in good academic standing are eligible.`,
    category: 'Student Affairs',
    department: 'All Departments',
    author: mockUsers[10],
    publishedAt: new Date('2024-12-11T14:30:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '12',
    title: 'Campus WiFi Upgrade Scheduled',
    excerpt: 'Network infrastructure upgrade will bring faster internet speeds across all campus locations.',
    content: `We are upgrading campus WiFi infrastructure to provide better connectivity.\n\nUpgrade Details:\n- Speed increase: 100 Mbps → 500 Mbps\n- New access points in all buildings\n- Better coverage in outdoor areas\n- Rollout: January 10-15, 2025\n\nMinor interruptions expected during installation. Thank you for your patience.`,
    category: 'Administrative',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-10T09:45:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '13',
    title: 'Art Exhibition: "Voices of Tomorrow"',
    excerpt: 'Student art exhibition showcasing paintings, sculptures, and digital art. Opening reception this Friday!',
    content: `The Department of Arts presents "Voices of Tomorrow" - a student art exhibition.\n\nFeatured Works:\n- Contemporary paintings\n- Abstract sculptures\n- Digital art installations\n- Photography collections\n\nOpening Reception: December 27, 6 PM\nExhibition Runs: December 27 - January 31\nLocation: Campus Art Gallery\nEntry: Free for all`,
    category: 'Event',
    department: 'Arts',
    author: mockUsers[7],
    publishedAt: new Date('2024-12-09T11:20:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '14',
    title: 'URGENT: Campus Security Alert',
    excerpt: 'Report suspicious activities immediately. Security patrols have been increased campus-wide.',
    content: `SECURITY ALERT\n\nRecent reports of suspicious activities near the North Gate. Campus security has been notified and patrols increased.\n\nSafety Reminders:\n- Travel in groups after dark\n- Keep valuables secure\n- Report suspicious persons/activities: 0800-SECURITY\n- Use well-lit pathways\n- Emergency number: 911\n\nYour safety is our priority.`,
    category: 'Urgent',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-08T18:00:00'),
    priority: 'urgent',
    isBookmarked: false,
  },
  {
    id: '15',
    title: 'Business School Entrepreneurship Workshop',
    excerpt: 'Learn from successful entrepreneurs and develop your business ideas. Limited seats available!',
    content: `Join our intensive Entrepreneurship Workshop led by successful alumni and industry experts.\n\nWorkshop Modules:\n- Idea validation & market research\n- Business model development\n- Fundraising strategies\n- Pitch presentation skills\n\nDates: January 12-14, 2025\nTime: 2 PM - 6 PM daily\nVenue: Business School Auditorium\nRegistration Fee: $50 (includes materials)\n\nEarly bird discount: Register by Dec 30!`,
    category: 'Event',
    department: 'Business',
    author: mockUsers[2],
    publishedAt: new Date('2024-12-07T13:15:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '16',
    title: 'Science Department Research Symposium',
    excerpt: 'Annual research symposium showcasing groundbreaking student and faculty research projects.',
    content: `The Department of Science presents its Annual Research Symposium.\n\nHighlights:\n- 30+ research presentations\n- Poster sessions\n- Keynote by Dr. Jane Cooper (Nobel Laureate)\n- Networking with researchers\n- Best presentation awards\n\nDate: February 8, 2025\nTime: 9 AM - 5 PM\nRegistration: Free but required\n\nAbstract submission deadline: January 15`,
    category: 'Academic',
    department: 'Science',
    author: mockUsers[6],
    publishedAt: new Date('2024-12-06T10:30:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '17',
    title: 'Basketball Championship Finals This Weekend',
    excerpt: 'Don\'t miss the thrilling finals of the inter-departmental basketball championship!',
    content: `The moment we\'ve all been waiting for - Championship Finals!\n\nFinals Match:\nEngineering Eagles vs Computer Science Coders\n\nDate: December 28, 2024\nTime: 4 PM\nVenue: Main Sports Arena\n\nCome support your department! Free entry for students.\n\nRefreshments and merchandise available.`,
    category: 'Sport',
    department: 'All Departments',
    author: mockUsers[10],
    publishedAt: new Date('2024-12-05T16:00:00'),
    priority: 'high',
    isBookmarked: false,
  },
  {
    id: '18',
    title: 'Mental Health Awareness Week',
    excerpt: 'Free counseling sessions, wellness workshops, and stress management seminars available all week.',
    content: `Student Affairs presents Mental Health Awareness Week.\n\nWeek Schedule:\nMonday: Stress Management Workshop\nTuesday: Free Counseling Sessions\nWednesday: Meditation & Yoga\nThursday: Nutrition & Wellness\nFriday: Mental Health Panel Discussion\n\nAll events are free and confidential.\nLocation: Student Wellness Center\nTime: Various (check schedule)\n\nYour mental health matters!`,
    category: 'Student Affairs',
    department: 'All Departments',
    author: mockUsers[10],
    publishedAt: new Date('2024-12-04T09:00:00'),
    priority: 'high',
    isBookmarked: true,
  },
  {
    id: '19',
    title: 'Hackathon 2025: Code for Impact',
    excerpt: '48-hour coding marathon with exciting challenges and prizes worth $10,000!',
    content: `Register now for Hackathon 2025: Code for Impact!\n\nChallenge Tracks:\n- AI & Machine Learning\n- Blockchain Solutions\n- EdTech Innovations\n- HealthTech Applications\n\nPrizes:\n1st: $5,000\n2nd: $3,000\n3rd: $2,000\n\nDate: February 21-23, 2025\nVenue: Computer Science Building\nTeam Size: 2-4 members\n\nRegister by January 31!`,
    category: 'Event',
    department: 'Computer Science',
    author: mockUsers[0],
    publishedAt: new Date('2024-12-03T12:00:00'),
    priority: 'high',
    isBookmarked: true,
  },
  {
    id: '20',
    title: 'Parking Permit Renewal Reminder',
    excerpt: 'All parking permits expire December 31st. Renew now to avoid penalties.',
    content: `REMINDER: Annual parking permit renewal is due.\n\nRenewal Information:\n- Deadline: December 31, 2024\n- Student Rate: $100/year\n- Staff Rate: $150/year\n- Online renewal available\n- Late fee after deadline: $50\n\nRenew via student portal or Campus Services office.\nNew parking stickers available from January 2.`,
    category: 'Administrative',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-12-02T08:30:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '21',
    title: 'Guest Lecture: AI Ethics and Society',
    excerpt: 'Renowned AI ethicist Dr. Marcus Webb discusses the societal implications of artificial intelligence.',
    content: `Special Guest Lecture Series\n\nSpeaker: Dr. Marcus Webb\nTopic: "AI Ethics and the Future of Society"\nBio: Leading AI ethicist, Author, Former Google AI Ethics Board member\n\nDiscussion Topics:\n- Bias in AI systems\n- Privacy concerns\n- Job automation ethics\n- Regulatory frameworks\n- Q&A session\n\nDate: January 25, 2025\nTime: 3 PM\nVenue: Main Auditorium\nFree admission`,
    category: 'Academic',
    department: 'Computer Science',
    author: mockUsers[0],
    publishedAt: new Date('2024-12-01T14:00:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '22',
    title: 'Campus Sustainability Initiative Launch',
    excerpt: 'New green campus program aims for zero waste by 2026. Get involved!',
    content: `Launching the Campus Sustainability Initiative!\n\nKey Programs:\n- Campus-wide recycling stations\n- Solar panel installations\n- Tree planting campaign (1000 trees)\n- Paperless administration\n- Bike-sharing program\n- Composting facilities\n\nVolunteer Opportunities:\nJoin our Green Team!\nOrientation: January 8, 2025\n\nTogether, we can make a difference!`,
    category: 'General',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-11-30T10:15:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '23',
    title: 'Study Abroad Fair - Explore Global Opportunities',
    excerpt: 'Representatives from 20+ international universities. Scholarships and exchange programs available.',
    content: `International Office presents the Study Abroad Fair!\n\nParticipating Countries:\n- USA, UK, Canada, Australia\n- Germany, France, Netherlands\n- Singapore, Japan, South Korea\n- And more!\n\nOpportunities:\n- Semester exchange programs\n- Full degree programs\n- Summer schools\n- Research internships\n- Scholarship information\n\nDate: January 30, 2025\nTime: 10 AM - 4 PM\nVenue: Student Center\n\nBring your transcripts!`,
    category: 'Event',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-11-29T11:45:00'),
    priority: 'normal',
    isBookmarked: false,
  },
  {
    id: '24',
    title: 'Medical Emergency: Blood Donation Drive',
    excerpt: 'URGENT: Blood bank critically low. Blood donation camp this week. Every donation saves lives!',
    content: `URGENT BLOOD DONATION APPEAL\n\nThe campus blood bank is critically low on all blood types.\n\nDonation Camp Details:\nDates: December 26-28, 2024\nTime: 9 AM - 5 PM daily\nLocation: Medical Center\n\nEligibility:\n- Age 18-65\n- Weight > 50kg\n- Good health\n\nBenefits:\n- Free health checkup\n- Certificate\n- Refreshments\n- Save up to 3 lives per donation\n\nWalk-ins welcome!`,
    category: 'Urgent',
    department: 'Medicine',
    author: mockUsers[5],
    publishedAt: new Date('2024-11-28T07:30:00'),
    priority: 'urgent',
    isBookmarked: false,
  },
  {
    id: '25',
    title: 'Alumni Networking Night',
    excerpt: 'Connect with successful alumni from various industries. Career advice, mentorship, and job opportunities!',
    content: `Join us for an evening of networking with distinguished alumni!\n\nFeatured Alumni:\n- Tech CEOs and founders\n- Medical professionals\n- Investment bankers\n- Entrepreneurs\n- Government officials\n\nEvent Format:\n- Speed networking sessions\n- Industry roundtables\n- One-on-one mentorship\n- Job opportunity board\n- Dinner & drinks\n\nDate: February 14, 2025\nTime: 6 PM - 9 PM\nVenue: Grand Hall\nDress Code: Business formal\n\nRegister by February 7!`,
    category: 'Event',
    department: 'All Departments',
    author: mockUsers[3],
    publishedAt: new Date('2024-11-27T15:00:00'),
    priority: 'normal',
    isBookmarked: false,
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    message: 'Emergency water supply interruption scheduled for tomorrow',
    timestamp: new Date('2024-12-21T07:05:00'),
    isRead: false,
    relatedNewsId: '6',
  },
  {
    id: '2',
    type: 'news',
    message: 'New announcement: Final Examination Timetable Released',
    timestamp: new Date('2024-12-20T10:35:00'),
    isRead: false,
    relatedNewsId: '1',
  },
  {
    id: '3',
    type: 'event',
    message: 'Campus Tech Fest 2025 registration opens in 2 weeks',
    timestamp: new Date('2024-12-19T14:25:00'),
    isRead: false,
    relatedNewsId: '2',
  },
  {
    id: '4',
    type: 'news',
    message: 'Library extended hours announced for exam period',
    timestamp: new Date('2024-12-18T09:20:00'),
    isRead: true,
    relatedNewsId: '3',
  },
  {
    id: '5',
    type: 'system',
    message: 'Your profile has been updated successfully',
    timestamp: new Date('2024-12-17T12:00:00'),
    isRead: true,
  },
  {
    id: '6',
    type: 'urgent',
    message: 'URGENT: Blood donation drive - Blood bank critically low',
    timestamp: new Date('2024-11-28T07:35:00'),
    isRead: false,
    relatedNewsId: '24',
  },
  {
    id: '7',
    type: 'urgent',
    message: 'Campus security alert: Increased patrols near North Gate',
    timestamp: new Date('2024-12-08T18:05:00'),
    isRead: true,
    relatedNewsId: '14',
  },
  {
    id: '8',
    type: 'event',
    message: 'Hackathon 2025 registration is now open!',
    timestamp: new Date('2024-12-03T12:10:00'),
    isRead: true,
    relatedNewsId: '19',
  },
  {
    id: '9',
    type: 'news',
    message: 'Scholarship applications now open - Apply by Feb 1st',
    timestamp: new Date('2024-12-12T10:05:00'),
    isRead: false,
    relatedNewsId: '10',
  },
  {
    id: '10',
    type: 'event',
    message: 'Mental Health Awareness Week starts tomorrow',
    timestamp: new Date('2024-12-03T17:00:00'),
    isRead: true,
    relatedNewsId: '18',
  },
  {
    id: '11',
    type: 'system',
    message: 'Your bookmark has been saved',
    timestamp: new Date('2024-12-01T09:15:00'),
    isRead: true,
  },
  {
    id: '12',
    type: 'news',
    message: 'Campus WiFi upgrade scheduled for January 10-15',
    timestamp: new Date('2024-12-10T09:50:00'),
    isRead: true,
    relatedNewsId: '12',
  },
  {
    id: '13',
    type: 'event',
    message: 'Basketball Championship Finals this weekend!',
    timestamp: new Date('2024-12-05T16:10:00'),
    isRead: false,
    relatedNewsId: '17',
  },
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Academic', icon: '📚', count: 12, color: 'bg-blue-500' },
  { id: '2', name: 'Events', icon: '🎉', count: 8, color: 'bg-purple-500' },
  { id: '3', name: 'Sports', icon: '⚽', count: 5, color: 'bg-green-500' },
  { id: '4', name: 'Student Affairs', icon: '👥', count: 7, color: 'bg-yellow-500' },
  { id: '5', name: 'Urgent', icon: '⚠️', count: 3, color: 'bg-red-500' },
  { id: '6', name: 'General', icon: '📢', count: 15, color: 'bg-gray-500' },
  { id: '7', name: 'Administrative', icon: '🏛️', count: 6, color: 'bg-indigo-500' },
];

// Mock Departments
export const mockDepartments: Department[] = [
  { id: '1', name: 'Computer Science', color: 'bg-primary', newsCount: 18 },
  { id: '2', name: 'Engineering', color: 'bg-secondary', newsCount: 14 },
  { id: '3', name: 'Medicine', color: 'bg-red-500', newsCount: 10 },
  { id: '4', name: 'Business', color: 'bg-green-500', newsCount: 12 },
  { id: '5', name: 'Arts', color: 'bg-purple-500', newsCount: 8 },
  { id: '6', name: 'Science', color: 'bg-blue-500', newsCount: 11 },
  { id: '7', name: 'All Departments', color: 'bg-gray-500', newsCount: 25 },
];
