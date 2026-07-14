import '../styles/MajorEvents.css';

export default function MajorEvents() {
  const events = [
    {
      id: 'nttts',
      title: 'National Train The Trainers Seminar (NTTTS)',
      description: 'National Train The Trainers Seminar is a prestigious, four-day residential training program focused on developing trainers within the Social Business Network organization. The program is a key step in becoming a certified National Trainer for Social Business Network. NTTTS aims to equip participants with the skills and knowledge necessary to effectively conduct training sessions and contribute to the SBN training culture.',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      bgColor: '#3A67B1',
      textColor: '#ffffff'
    },
    {
      id: 'author',
      title: 'Social Business Network Author',
      description: 'This program aims to prepare trainers who have already proven their talents in the training field for a new dimension of authoring of a training course. Social Business Network Author Course introduces techniques and tools to author training courses with detailed trainers’ instructions, participant’s handouts and visual aids that will enable other trainers to efficiently conduct the course.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      bgColor: '#0097D7',
      textColor: '#ffffff'
    },
    {
      id: 'nalanda',
      title: 'NALANDA',
      description: 'Nalanda is a premium leadership training program designed to enhance your skills and empower you to take on greater responsibilities both within and outside our organization. The training will cover essential leadership topics, including effective communication, decision-making, and team management. It is a fantastic opportunity for professional growth and development.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      bgColor: '#EDBE38',
      textColor: '#1a1a1a'
    },
    {
      id: 'able',
      title: 'Academy for Business Leadership & Excellence (ABLE)',
      description: 'In Social Business Network, ABLE stands for the Academy for Business Leadership & Excellence. It\'s a premier business training program designed to enhance entrepreneurial and leadership skills. The program aims to help individuals and businesses achieve their goals by providing a platform for development, networking, and growth Focus: ABLE focuses on developing business acumen, leadership skills, and personal growth. Target Audience: The program is designed for entrepreneurs, professionals, and individuals seeking to enhance their business and leadership capabilities. Key Components: ABLE includes training on various aspects of business, such as branding, wealth creation, networking, change management, and work-life balance.',
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
      bgColor: '#3A67B1',
      textColor: '#ffffff'
    },
    {
      id: 'jasmine',
      title: 'JASMINE (Jaycee Academy for Smart Initiative for Empowerment)',
      description: 'JASMINE stands for Members Academy of Smart Initiatives for Empowerment. It is a training program specifically designed for Young Members, the youth wing of SBN. JASMINE aims to empower young people by developing their life skills, leadership qualities, and confidence. Essentially, JASMINE is a platform within Social Business Network that focuses on nurturing the next generation of leaders through various activities, training sessions, and mentorship programs. It provides opportunities for young Members to learn, grow, and develop the skills necessary to become effective leaders and make a positive impact on society.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      bgColor: '#56BDA3',
      textColor: '#ffffff'
    },
    {
      id: 'tobip',
      title: 'TOBIP awards (Three Outstanding Business Industrialists And Professionals’)',
      description: 'Social Business Network, recognizes Three Outstanding Personalities in the field of Business, Industry, and Profession. It is a national-level award where Social Business Network selects three individuals for their exceptional contributions to their respective fields. The award aims to acknowledge and celebrate individuals who have made significant achievements and positive impacts in their domains.',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
      bgColor: '#3A67B1',
      textColor: '#ffffff'
    },
    {
      id: 'internationalism',
      title: 'Internationalism & Collaborations',
      description: 'In an increasingly interdependent world, members realize the need for international collaboration, understanding, tolerance and peace. Social Business Network provides members numerous opportunities to become involved in global issues. Through international conference, academies, programs, Twinning and business exchange. SBN concepts enables members to promote goodwill and attain a deeper understanding of global Challenges and opportunities, every year Social Business Network organize 5 Area Conferences and one World Congress. Attending the SBN Conferences is really a life time achievement of an individual.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
      bgColor: '#56BDA3',
      textColor: '#ffffff'
    },
    {
      id: 'jcsat',
      title: 'SBN SAT (SBN Scholarship & Aptitude Test)',
      description: 'In Social Business Network, SBN SAT, now rebranded as NLTS (National Level Talent Search), is a scholarship and aptitude test designed to identify and nurture young talent. It provides opportunities for awards, scholarships, and national recognition for young individuals. The program aims to empower young people to create positive change by offering leadership development opportunities. SBN SAT is more than just a test; it\'s a tool to shape the youth. It supports scholars with scholarships for higher education. The program is part of Social Business Network\'s efforts to develop leadership skills in young men and women in India. Social Business Network is a worldwide federation of young leaders and entrepreneurs.',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
      bgColor: '#0097D7',
      textColor: '#ffffff'
    },
    {
      id: 'toyp',
      title: 'TOYP Information',
      description: 'The Social Business Network Ten Outstanding Young Persons (SBN TOYP) program honors ten outstanding young people under the age of 40 each year. These individuals exemplify the spirit of the SBN Mission, and they serve as stellar examples of entrepreneurial spirit and ethical leadership. Whether through a business, scientific endeavors or their impact on society, these enterprising young leaders turn challenges into opportunities on a local and global level. The final ten TOYP nominees will be honored during the Social Business Network National Convention.',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      bgColor: '#56BDA3',
      textColor: '#ffffff'
    }
  ];

  return (
    <div className="major-events-page">

      <div className="events-container container">
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="event-card-container"
            style={{ 
              top: `calc(10vh + ${index * 30}px)` 
            }}
          >
            <div 
              className="event-card"
              style={{ 
                background: `linear-gradient(175deg, ${event.bgColor} 0%, ${event.bgColor} 100%)`, 
                color: event.textColor 
              }}
            >
              <h2 className="event-title">{event.title}</h2>
              <div className="event-body">
                <div className="event-text">
                  <p>{event.description}</p>
                  {event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-btn">
                      {event.title}
                    </a>
                  )}
                </div>
                <div className="event-image-wrapper">
                  <img src={event.image} alt={event.title} loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
