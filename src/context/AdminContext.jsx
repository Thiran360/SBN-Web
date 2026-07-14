import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

const initialData = {
  heroSlides: [
    {
      id: 1,
      image: '/images/sbn_hero_networking.png',
      title: 'Empowering Entrepreneurs<br />for a Connected World',
      subtitle: 'Connect, collaborate, and grow your business with a global network.',
      cta: 'Explore Our Events',
      link: '/major-events'
    },
    {
      id: 2,
      image: '/images/sbn_hero_innovation.png',
      title: 'Build Partnerships,<br />Drive Innovation',
      subtitle: 'Step up, network boldly, and leave a lasting business legacy',
      cta: 'Join Now',
      link: '/join-sbn'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80',
      title: 'Fostering Global Partnerships<br />& Sustainable Growth',
      subtitle: 'Unite with industry leaders to expand your network, elevate your expertise, and drive meaningful economic impact worldwide.',
      cta: 'Become A Member',
      link: '/join-sbn'
    }
  ],
  welcomeData: {
    title: 'Welcome to Social Business Network',
    description: 'We are a vibrant community of entrepreneurs and professionals aged 18-40, active across multiple regions globally. SBN empowers passionate individuals to become capable business leaders and innovators. Through networking events, mentorship programs, and partnerships, we turn ideas into profitable ventures and create sustainable economic impact.',
    features: [
      'Empowering entrepreneurs since inception',
      'Active in multiple regions and cities',
      'Growing network of business chapters'
    ],
    statsNumber: '100+',
    statsText: 'chapters around the world',
    image: '/images/globe.png'
  },
  members: [
    { id: 1, name: "Aarav Sharma", location: "SBN Mumbai", joinDate: "2024-01-15", status: "Active" },
    { id: 2, name: "Priya Patel", location: "SBN Bangalore", joinDate: "2023-08-22", status: "Active" },
    { id: 3, name: "Rohan Desai", location: "SBN Delhi", joinDate: "2025-02-10", status: "Pending" }
  ],
  contactMessages: [
    { id: 1, name: "John Doe", email: "john@example.com", subject: "Membership Inquiry", message: "How do I join SBN?", date: "2026-06-18", read: false }
  ],
  membershipApplications: [
    { id: 1, firstName: "Alice", lastName: "Smith", email: "alice@example.com", phone: "+91 9876543210", profession: "Marketing Manager", chapter: "bangalore", message: "Excited to join the network!", date: "2026-06-19", status: "New" }
  ],
  memberNotifications: [
    { id: 1, title: "Welcome to SBN!", message: "We are glad to have you in our community. Check out our upcoming events.", date: "2026-06-20", read: false }
  ]
};

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('sbn_admin_auth') === 'true';
  });
  const [siteData, setSiteData] = useState(() => {
    const savedData = localStorage.getItem('sbn_site_data_v3');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  // Load from local/session storage on mount
  useEffect(() => {
    // Clean up old persistent login state if it exists
    if (localStorage.getItem('sbn_admin_auth')) {
      localStorage.removeItem('sbn_admin_auth');
    }

    const authStatus = sessionStorage.getItem('sbn_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    const savedData = localStorage.getItem('sbn_site_data_v3');
    if (savedData) {
      try {
        let parsed = JSON.parse(savedData);
        let changed = false;
        
        // Patch to remove bullet points and update hero image from user's existing data
        if (parsed.heroSlides) {
          parsed.heroSlides = parsed.heroSlides.map(slide => {
            let updatedSlide = { ...slide };
            
            // Update the first slide's image to the new custom generated networking image
            if (updatedSlide.id === 1 && updatedSlide.image.includes('unsplash')) {
              updatedSlide.image = '/images/sbn_hero_networking.png';
              changed = true;
            }

            // Update the second slide's image to the new custom generated innovation image
            if (updatedSlide.id === 2 && updatedSlide.image.includes('unsplash')) {
              updatedSlide.image = '/images/sbn_hero_innovation.png';
              changed = true;
            }

            if (updatedSlide.title && updatedSlide.title.includes('Connect • Collaborate')) {
              changed = true;
              updatedSlide.title = 'Fostering Global Partnerships<br />& Sustainable Growth';
              updatedSlide.subtitle = 'Unite with industry leaders to expand your network, elevate your expertise, and drive meaningful economic impact worldwide.';
            }
            return updatedSlide;
          });
        }
        
        setSiteData(parsed);
        
        if (changed) {
          localStorage.setItem('sbn_site_data_v3', JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Failed to parse site data");
      }
    } else {
      localStorage.setItem('sbn_site_data_v3', JSON.stringify(initialData));
    }
  }, []);

  const login = (username, password) => {
    // Hardcoded simple credentials for the static demo
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sbn_admin_auth', 'true');
      localStorage.removeItem('sbn_member_auth'); // Logout member if logging in as admin
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sbn_admin_auth');
  };

  const updateSiteData = (key, value) => {
    const newData = { ...siteData, [key]: value };
    setSiteData(newData);
    localStorage.setItem('sbn_site_data_v3', JSON.stringify(newData));
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, siteData, updateSiteData }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
