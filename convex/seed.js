import { action } from "./_generated/server";
import { api } from "./_generated/api";

/* ===========================
   SAMPLE EVENTS (MUST EXIST)
=========================== */
const SAMPLE_EVENTS = [
  {
    title: "React 19 Workshop: Master the New Features",
    description: `Join us for an intensive hands-on workshop diving deep into React 19's revolutionary features! 

In this session, you'll learn about:
- The new Actions API and how it simplifies form handling
- Server Components and their impact on performance
- The improved use() hook and its practical applications
- Asset loading improvements for better UX
- Migration strategies from React 18

Whether you're a seasoned React developer or just getting started, this workshop will equip you with the knowledge to build faster, more efficient applications. Bring your laptop and be ready to code!

Light refreshments will be provided. Limited seats available.`,
    category: "tech",
    tags: ["tech", "react", "javascript", "frontend"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=WeWork+Embassy+Golf+Links",
    address: "WeWork Embassy Golf Links, Domlur, Bangalore",
    capacity: 50,
    ticketType: "free",
    coverImage:
      "/images/react_workshop.png",
    themeColor: "#4c1d95",
  },
  {
    title: "AI & Machine Learning Meetup - Building with LLMs",
    description: `Explore the exciting world of Large Language Models and learn how to integrate them into your applications!

This meetup covers:
- Introduction to LLM APIs (OpenAI, Anthropic, Google)
- Prompt engineering best practices
- Building RAG applications
- Fine-tuning strategies
- Real-world use cases and demos

Network with fellow AI enthusiasts and developers. Q&A session included.

Pizza and drinks provided!`,
    category: "tech",
    tags: ["tech", "ai", "machine-learning", "llm"],
    city: "Hyderabad",
    state: "Telangana",
    venue: "https://maps.google.com/?q=T-Hub+Hyderabad",
    address: "T-Hub, IIIT Hyderabad Campus, Gachibowli",
    capacity: 100,
    ticketType: "free",
    coverImage:
      "/images/ai_meetup.png",
    themeColor: "#1e3a8a",
  },
  {
    title: "Indie Music Night - Acoustic Sessions",
    description: `An evening of soulful acoustic performances by indie artists from across India!

Featuring:
- 5 handpicked indie bands
- Unplugged performances
- Open mic session (limited slots)
- Meet & greet with artists

Experience the raw talent of upcoming musicians in an intimate setting. Perfect for music lovers who appreciate authentic, heartfelt performances.

Food and beverages available for purchase at the venue.`,
    category: "music",
    tags: ["music", "indie", "acoustic", "live"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=The+Habitat+Khar",
    address: "The Habitat, Khar West, Mumbai",
    capacity: 120,
    ticketType: "paid",
    ticketPrice: 499,
    coverImage:
      "/images/indie_music_night.png",
    themeColor: "#831843",
  },
  {
    title: "Startup Networking Breakfast",
    description: `Connect with fellow entrepreneurs, investors, and startup enthusiasts over breakfast!

What to expect:
- Speed networking sessions
- Pitch practice opportunities
- One-on-one mentor meetings
- Funding insights from VCs
- Success stories from local founders

This is your chance to expand your professional network, find potential co-founders, or get valuable feedback on your startup idea.

Continental breakfast included in registration.`,
    category: "business",
    tags: ["business", "networking", "startup", "entrepreneurship"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=91springboard+Gurgaon",
    address: "91springboard, Sector 44, Gurgaon",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 299,
    coverImage:
      "/images/startup_breakfast.png",
    themeColor: "#065f46",
  },
  {
    title: "Weekend Photography Walk - Street Stories",
    description: `Capture the vibrant streets of Delhi through your lens!

Join our photography walk covering:
- Chandni Chowk's bustling markets
- Hidden architectural gems
- Street food and portraits
- Golden hour shooting techniques
- Post-processing tips

Suitable for all skill levels. Bring your camera (phone cameras welcome too!). Our experienced photographer will guide you through composition techniques and storytelling through images.

Chai stops included along the way!`,
    category: "art",
    tags: ["art", "photography", "culture", "walking-tour"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=Red+Fort+Delhi",
    address: "Red Fort Metro Station Exit, Delhi",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 799,
    coverImage:
      "/images/street_photography_walk.png",
    themeColor: "#92400e",
  },
  {
    title: "Full Stack Development Bootcamp - Day 1",
    description: `Kickstart your journey to becoming a full-stack developer!

Day 1 covers:
- Setting up your development environment
- Git & GitHub fundamentals
- HTML5 & CSS3 essentials
- Introduction to JavaScript
- Building your first webpage

This is the first session of our 6-week bootcamp series. Perfect for beginners who want to break into tech. No prior coding experience required!

Laptop required. Course materials provided.`,
    category: "education",
    tags: ["education", "coding", "fullstack", "beginner"],
    city: "Pune",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Cummins+College+Pune",
    address: "Cummins College, Karve Nagar, Pune",
    capacity: 30,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    themeColor: "#7f1d1d",
  },
  {
    title: "Sunday Football Tournament",
    description: `5-a-side football tournament for amateur players!

Tournament details:
- 8 teams competing
- Round-robin + knockout format
- Prizes for top 3 teams
- Best player award
- Free jersey for all participants

Register as a team (5 players + 2 substitutes) or individually (we'll match you with a team).

Referee provided. Water and energy drinks available. Medical support on standby.`,
    category: "sports",
    tags: ["sports", "football", "tournament", "fitness"],
    city: "Chennai",
    state: "Tamil Nadu",
    venue: "https://maps.google.com/?q=Jawaharlal+Nehru+Stadium+Chennai",
    address: "JLN Stadium Indoor Complex, Chennai",
    capacity: 56,
    ticketType: "paid",
    ticketPrice: 350,
    coverImage: "/images/corporate_cricket.png",
    themeColor: "#065f46",
  },
  {
    title: "Healthy Cooking Workshop - Plant-Based Cuisine",
    description: `Learn to create delicious, nutritious plant-based meals!

Workshop includes:
- 5 complete recipes to master
- Ingredient selection tips
- Meal prep strategies
- Nutritional balancing
- Recipe booklet to take home

Our chef instructor will guide you through preparing a full plant-based meal from appetizer to dessert. All ingredients and cooking equipment provided.

Taste everything you cook! Great for health enthusiasts and curious foodies alike.`,
    category: "food",
    tags: ["food", "cooking", "health", "vegan"],
    city: "Kolkata",
    state: "West Bengal",
    venue: "https://maps.google.com/?q=Salt+Lake+Kolkata",
    address: "Community Kitchen, Salt Lake Sector V, Kolkata",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 1200,
    coverImage:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Morning Yoga & Meditation Retreat",
    description: `Start your weekend with peace and mindfulness!

Session includes:
- 60-minute Hatha Yoga practice
- 30-minute guided meditation
- Breathing techniques (Pranayama)
- Sound healing session
- Healthy breakfast

Suitable for all levels - modifications provided for beginners. Our certified instructor creates a welcoming space for everyone.

Yoga mats provided. Please wear comfortable clothing.`,
    category: "health",
    tags: ["health", "yoga", "meditation", "wellness"],
    city: "Jaipur",
    state: "Rajasthan",
    venue: "https://maps.google.com/?q=Central+Park+Jaipur",
    address: "Central Park, C-Scheme, Jaipur",
    capacity: 35,
    ticketType: "paid",
    ticketPrice: 450,
    coverImage: "/images/morning_yoga_retreat.png",
    themeColor: "#4c1d95",
  },
  {
    title: "Gaming Tournament - Valorant Championship",
    description: `Compete in the ultimate Valorant showdown!

Tournament format:
- 16 teams (5v5)
- Single elimination bracket
- Best of 3 matches
- Prize pool: ₹50,000
- Live streaming on Twitch

All skill levels welcome. Bring your own peripherals (mouse, headset). High-spec PCs and stable internet provided.

Energy drinks and snacks available. Exciting commentary and crowd interaction!`,
    category: "gaming",
    tags: ["gaming", "esports", "valorant", "tournament"],
    city: "Noida",
    state: "Uttar Pradesh",
    venue: "https://maps.google.com/?q=DLF+Mall+Noida",
    address: "Game Arena, DLF Mall of India, Noida",
    capacity: 80,
    ticketType: "paid",
    ticketPrice: 200,
    coverImage: "/images/valorant_tournament.png",
    themeColor: "#7f1d1d",
  },
  {
    title: "Women in Tech: Leadership Panel Discussion",
    description: `Inspiring stories and insights from women leaders in technology!

Panel features:
- CTOs from top startups
- Engineering managers from FAANG
- Successful tech entrepreneurs
- VC partners focusing on women-led startups

Topics covered:
- Breaking barriers in tech
- Building inclusive teams
- Work-life integration
- Career growth strategies
- Mentorship importance

Open to all genders. Q&A session and networking lunch included.`,
    category: "networking",
    tags: ["networking", "women-in-tech", "leadership", "career"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Google+Office+Bangalore",
    address: "Google Office, Old Airport Road, Bangalore",
    capacity: 40,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80",
    themeColor: "#831843",
  },
  {
    title: "Trekking to Triund - Weekend Adventure",
    description: `Experience the majestic Himalayas on this beginner-friendly trek!

Itinerary:
- Day 1: Dharamshala to Triund (9km trek)
- Overnight camping under stars
- Day 2: Sunrise view & descent

Package includes:
- Experienced trek leader
- Camping gear (tents, sleeping bags)
- All meals during trek
- First aid kit
- Photography assistance

Moderate fitness level required. Age 16+ recommended.

Transport from Delhi available at additional cost.`,
    category: "outdoor",
    tags: ["outdoor", "trekking", "adventure", "camping"],
    city: "Dharamshala",
    state: "Himachal Pradesh",
    venue: "https://maps.google.com/?q=McLeod+Ganj",
    address: "McLeod Ganj Main Square, Dharamshala",
    capacity: 20,
    ticketType: "paid",
    ticketPrice: 2500,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Community Clean-up Drive - Beach Edition",
    description: `Join hands to keep our beaches clean and beautiful!

Activity plan:
- Beach cleanup (2 hours)
- Waste segregation workshop
- Marine conservation talk
- Group photo session
- Certificate of participation

All cleaning materials provided. Wear comfortable clothes you don't mind getting dirty. Sunscreen and hat recommended.

Refreshments provided. A great way to give back to nature while meeting like-minded people!`,
    category: "community",
    tags: ["community", "environment", "volunteer", "beach"],
    city: "Goa",
    state: "Goa",
    venue: "https://maps.google.com/?q=Calangute+Beach+Goa",
    address: "Calangute Beach, North Goa",
    capacity: 100,
    ticketType: "free",
    coverImage: "/images/community_cleanup.png",
    themeColor: "#1e3a8a",
  },
  {
    title: "JavaScript Performance Optimization Masterclass",
    description: `Level up your JS skills with advanced performance techniques!

Topics covered:
- Memory management & garbage collection
- Event loop deep dive
- Web Workers & multithreading
- Code splitting strategies
- Bundle optimization with Webpack/Vite
- React performance patterns
- Profiling with Chrome DevTools

Intermediate JavaScript knowledge required. Bring your laptop with Node.js installed.

Code examples and cheat sheets provided.`,
    category: "tech",
    tags: ["tech", "javascript", "performance", "advanced"],
    city: "Ahmedabad",
    state: "Gujarat",
    venue: "https://maps.google.com/?q=IIM+Ahmedabad",
    address: "CIIE, IIM Ahmedabad Campus",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 999,
    coverImage:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
    themeColor: "#92400e",
  },
  {
    title: "Indie Game Dev Jam - 48 Hour Challenge",
    description: `Create a game from scratch in 48 hours!

Event highlights:
- Theme revealed at start
- Solo or team participation (max 4)
- Mentorship from industry devs
- Game engine workshops (Unity/Godot)
- Asset creation support
- Final showcase & judging

Prizes for:
- Best Overall Game
- Most Innovative Mechanic
- Best Art Style
- People's Choice

Sleeping bags welcome. Food and drinks provided throughout.`,
    category: "gaming",
    tags: ["gaming", "game-development", "hackathon", "indie"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Bangalore+International+Centre",
    address: "Bangalore International Centre, Domlur",
    capacity: 60,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage:
      "https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&q=80",
    themeColor: "#4c1d95",
  },
  {
    title: "AI Product Building Workshop - From Idea to MVP",
    description: `Learn to build AI-powered products from scratch in this hands-on workshop!

What you'll build:
- AI-powered customer support chatbot
- Intelligent document summarizer
- Smart recommendation engine prototype

Skills covered:
- Product ideation with AI capabilities
- API integration (OpenAI, Anthropic, Google)
- Prompt engineering for production
- UI/UX for AI products
- Deployment and scaling basics

Perfect for product managers, entrepreneurs, and developers looking to add AI to their toolkit. No prior ML experience needed - we focus on practical application!

Lunch and refreshments included. Bring your laptop!`,
    category: "tech",
    tags: ["tech", "ai", "product", "startup"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=Innov8+Cyber+Hub+Gurgaon",
    address: "Innov8 Coworking, Cyber Hub, DLF Cyber City, Gurgaon",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 1499,
    coverImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    themeColor: "#4c1d95",
  },


  {
    title: "Corporate Cricket Tournament - Season 3",
    description: `The biggest corporate cricket showdown in Gurgaon is back!

Tournament format:
- 12 corporate teams competing
- T10 format (10 overs per side)
- League stage + knockout rounds
- Professional umpires and scoring
- Live commentary

Prizes:
- Winner: ₹1,00,000 + Trophy
- Runner-up: ₹50,000
- Best Batsman, Bowler & Player awards

Register your company team (11 players + 4 substitutes). Individual registrations also open - we'll form mixed teams.

What's included:
- Professional cricket ground
- Match balls and equipment
- Refreshments throughout
- Team jerseys
- Photos & videos

Perfect for team building and corporate bonding!`,
    category: "sports",
    tags: ["sports", "cricket", "corporate", "tournament"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=Tau+Devi+Lal+Stadium+Gurgaon",
    address: "Tau Devi Lal Stadium, Sector 38, Gurgaon",
    capacity: 180,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
    themeColor: "#065f46",
  },
  {
    title: "Mindfulness & Stress Management for Professionals",
    description: `Combat workplace stress with evidence-based mindfulness techniques!

This workshop is designed for busy professionals who want to:
- Reduce anxiety and stress
- Improve focus and productivity
- Better manage work-life balance
- Build emotional resilience
- Enhance decision-making clarity

Session includes:
- Understanding stress response
- Guided meditation practice
- Breathing techniques for instant calm
- Mindful communication at work
- Creating daily wellness routines
- Apps and tools for continued practice

Led by a certified mindfulness coach with 10+ years of corporate wellness experience.

Yoga mats and meditation cushions provided. Wear comfortable clothing.

Healthy snacks and herbal teas included.`,
    category: "health",
    tags: ["health", "wellness", "mindfulness", "corporate"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=The+Yoga+Studio+Gurgaon",
    address: "The Yoga Studio, South City 2, Gurgaon",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 899,
    coverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
    themeColor: "#831843",
  },
  {
    title: "Pizza Palooza: A Slice of Heaven",
    description: `Join us for an evening of pizza making and tasting! Learn the secrets to crafting the perfect pizza dough and discover a variety of delicious toppings. You'll leave with new skills and a full stomach.`,
    category: "food",
    tags: ["food"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.app.goo.gl/YXJ5J2eCVWbskBSL9",
    address:
      "32nd Avenue - NH 48, Sector 15 Part 2, Sector 15, Gurgaon, Haryana 122001",
    capacity: 10,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NjkyNzJ8MHwxfHNlYXJjaHwxfHxwaXp6YXxlbnwwfHx8fDE3NjI5NTA5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    themeColor: "#831843",
  },

  {
    title: "WebAssembly: The Future of Web Performance",
    description: `Dive into the world of WebAssembly (Wasm) and learn how it's revolutionizing web performance!

Agenda:
- Introduction to Wasm
- Rust + Wasm workflow
- Porting legacy C++ code
- Browser support and polyfills
- Live coding session

Perfect for performance-minded developers.`,
    category: "tech",
    tags: ["tech", "webassembly", "rust", "performance"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Microsoft+Reactor+Bangalore",
    address: "Microsoft Reactor, Lavelle Road, Bangalore",
    capacity: 60,
    ticketType: "free",
    coverImage: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=1200&q=80",
    themeColor: "#2563eb",
  },
  {
    title: "Jazz Night Under the Stars",
    description: `A magical evening of smooth jazz and good vibes.

Featuring:
- The Delhi Jazz Quartet
- Guest Saxophonist from New Orleans
- Wine and Cheese tasting
- Open jam session

Dress code: Smart Casual.
Come relax and unwind with the finest tunes in the city.`,
    category: "music",
    tags: ["music", "jazz", "live", "nightlife"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=The+Piano+Man+Jazz+Club",
    address: "The Piano Man Jazz Club, Safdarjung Enclave, Delhi",
    capacity: 80,
    ticketType: "paid",
    ticketPrice: 1500,
    coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80",
    themeColor: "#7c2d12",
  },
  {
    title: "Pilates for Beginners - Core Strength",
    description: `Strengthen your core and improve flexibility with our introductory Pilates workshop.

What we'll cover:
- Basic mat exercises
- Breathing techniques
- Posture correction
- Myths about Pilates

Mats provided. Wear comfortable gym wear. No shoes required.`,
    category: "health",
    tags: ["health", "fitness", "pilates", "wellness"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=The+Yoga+House+Bandra",
    address: "The Yoga House, Bandra West, Mumbai",
    capacity: 15,
    ticketType: "paid",
    ticketPrice: 800,
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
    themeColor: "#be185d",
  },
  {
    title: "Hyderabad Street Food Walk",
    description: `Discover the culinary gems of the City of Pearls!

We will taste:
- Authentic Hyderabadi Biryani
- Double ka Meetha
- Irani Chai & Osmania Biscuits
- Halleem (seasonal)

Walking distance: 2km. Come with an empty stomach!`,
    category: "food",
    tags: ["food", "street-food", "culture", "walking-tour"],
    city: "Hyderabad",
    state: "Telangana",
    venue: "https://maps.google.com/?q=Charminar",
    address: "Charminar Main Gate, Hyderabad",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 600,
    coverImage: "/images/hyderabad_street_food.png",
    themeColor: "#ea580c",
  },
  {
    title: "Pottery & Clay Modeling Workshop",
    description: `Get your hands dirty and create something beautiful!

Session plan:
- Introduction to clay types
- Hand-building techniques (coil, pinch, slab)
- Wheel throwing basics
- Glazing demonstration

Take home your own handmade bowl or mug (after firing). All materials included.`,
    category: "art",
    tags: ["art", "craft", "pottery", "workshop"],
    city: "Pune",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Clay+Station+Pune",
    address: "Clay Station, Koregaon Park, Pune",
    capacity: 12,
    ticketType: "paid",
    ticketPrice: 1800,
    coverImage: "/images/pottery_workshop.png",
    themeColor: "#a16207",
  },
  {
    title: "Crypto & Web3 Summit 2024",
    description: `The largest gathering of crypto enthusiasts and Web3 builders in India.

Keynotes on:
- DeFi trends
- NFT utility beyond art
- DAO governance
- Regulatory landscape in India

Network with founders, VCs, and developers building the decentralized future.`,
    category: "business",
    tags: ["business", "crypto", "web3", "blockchain"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Sheraton+Grand+Bangalore",
    address: "Sheraton Grand, Whitefield, Bangalore",
    capacity: 200,
    ticketType: "paid",
    ticketPrice: 3500,
    coverImage: "/images/crypto_web3.png",
    themeColor: "#4f46e5",
  },
  {
    title: "Marathon Training Bootcamp",
    description: `Preparing for the Chennai Marathon? Train with the pros!

Program:
- Stamina building drills
- Proper running form analysis
- Nutrition for runners
- Injury prevention strategies

Join a community of motivated runners. Early morning sessions.`,
    category: "sports",
    tags: ["sports", "running", "marathon", "fitness"],
    city: "Chennai",
    state: "Tamil Nadu",
    venue: "https://maps.google.com/?q=Marina+Beach+Chennai",
    address: "Marina Beach Lighthouse, Chennai",
    capacity: 50,
    ticketType: "free",
    coverImage: "https://images.unsplash.com/photo-1552674605-46d536d2e681?w=1200&q=80",
    themeColor: "#059669",
  },
  {
    title: "Minecraft Build Battle - Creative Mode",
    description: `Show off your creativity in our timed Minecraft building competition!

Theme: "Future Cities"
Time limit: 2 hours

Judges will score based on:
- Creativity
- Detail
- adherence to theme
- Scale

BYOD (Bring Your Own Device). Server IP provided on registration.`,
    category: "gaming",
    tags: ["gaming", "minecraft", "esports", "competition"],
    city: "Noida",
    state: "Uttar Pradesh",
    venue: "https://maps.google.com/?q=Gaming+Cafe+Noida",
    address: "The Gaming Cafe, Sector 18, Noida",
    capacity: 30,
    ticketType: "paid",
    ticketPrice: 300,
    coverImage: "/images/minecraft_build_battle.png",
    themeColor: "#16a34a",
  },
  {
    title: "Digital Nomads & Freelancers Meetup",
    description: `Connect with the remote work community in Goa!

Discuss:
- Finding high-paying clients
- Managing time zones
- Tax hacks for freelancers
- Best co-working spots

Sunset drinks and networking afterwards.`,
    category: "networking",
    tags: ["networking", "freelance", "digital-nomad", "remote-work"],
    city: "Goa",
    state: "Goa",
    venue: "https://maps.google.com/?q=Nomad+Gao",
    address: "NomadGao Co-living, Anjuna, Goa",
    capacity: 40,
    ticketType: "free",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    themeColor: "#0891b2",
  },
  {
    title: "Desert Stargazing & Camping",
    description: `Escape the city lights and witness the Milky Way!

Experience:
- Camel safari to camp
- Telescope viewing session with astronomer
- Bonfire and folk music
- Rajasthani dinner
- Tent stay

A truly unforgettable night under the desert sky.`,
    category: "outdoor",
    tags: ["outdoor", "camping", "stargazing", "adventure"],
    city: "Jaipur",
    state: "Rajasthan",
    venue: "https://maps.google.com/?q=Amer+Fort",
    address: "Meeting point: Amer Fort Parking, Jaipur",
    capacity: 25,
    ticketType: "paid",
    ticketPrice: 3000,
    coverImage: "https://images.unsplash.com/photo-1534274988754-c6a60d2968dc?w=1200&q=80",
    themeColor: "#312e81",
  },
  {
    title: "Data Science 101 - Python & Pandas",
    description: `An introductory workshop on Data Science using Python.

Syllabus:
- Python basics refresh
- Pandas DataFrames
- Data cleaning and manipulation
- Basic visualization with Matplotlib
- Intro to Scikit-learn

Prerequisites: Basic programming knowledge.`,
    category: "education",
    tags: ["education", "data-science", "python", "tech"],
    city: "Kolkata",
    state: "West Bengal",
    venue: "https://maps.google.com/?q=Coworking+Space+Kolkata",
    address: "Smartworks, Victoria Park, Kolkata",
    capacity: 35,
    ticketType: "paid",
    ticketPrice: 999,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    themeColor: "#db2777",
  },
  {
    title: "Animal Shelter Volunteer Day",
    description: `Spend a day caring for rescued animals!

Activities:
- Walking dogs
- Grooming cats
- Cleaning enclosures
- Feeding time
- Playtime!

A heartwarming experience for all animal lovers. Donations in kind (food, blankets) are welcome.`,
    category: "community",
    tags: ["community", "volunteer", "animals", "charity"],
    city: "Gurgaon",
    state: "Haryana",
    venue: "https://maps.google.com/?q=Friendicoes+Gurgaon",
    address: "Friendicoes SPRuth, Sector 55, Gurgaon",
    capacity: 20,
    ticketType: "free",
    coverImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80",
    themeColor: "#ca8a04",
  },
  {
    title: "Salsa Social Night",
    description: `Put on your dancing shoes for a night of Latin rhythms!

Schedule:
- 7:00 PM: Beginner Salsa Workshop
- 8:00 PM: Bachata Basics
- 9:00 PM onwards: Open Social Dancing

No partner required. Smooth wooden floor, great AC, and amazing DJs.`,
    category: "music",
    tags: ["music", "salsa", "dance", "social"],
    city: "Mumbai",
    state: "Maharashtra",
    venue: "https://maps.google.com/?q=Raasta+Bombay",
    address: "Raasta Bombay, Khar, Mumbai",
    capacity: 100,
    ticketType: "paid",
    ticketPrice: 500,
    coverImage: "/images/salsa_social_night.png",
    themeColor: "#b91c1c",
  },
  {
    title: "Organic Gardening Workshop",
    description: `Grow your own vegetables at home!

Learn about:
- Soil preparation and composting
- Container gardening
- Pest management (organic way)
- Seasonal planting calendar

Starter kit included (seeds, pot, and soil mix).`,
    category: "outdoor",
    tags: ["outdoor", "gardening", "sustainability", "nature"],
    city: "Bangalore",
    state: "Karnataka",
    venue: "https://maps.google.com/?q=Lalbagh+Botanical+Garden",
    address: "Lalbagh Botanical Garden, Bangalore",
    capacity: 30,
    ticketType: "paid",
    ticketPrice: 1200,
    coverImage: "/images/organic_gardening.png",
    themeColor: "#15803d",
  },
  {
    title: "Advanced Chess Strategy Symposium",
    description: `Master the game of kings with Grandmaster insights.

Topics:
- Opening repertoire preparation
- Middlegame positional play
- Endgame complexities
- Psychological aspects of competition

Suitable for rated players (1500+ Elo). Bring your chess set.`,
    category: "education",
    tags: ["education", "chess", "strategy", "competition"],
    city: "Chennai",
    state: "Tamil Nadu",
    venue: "https://maps.google.com/?q=Chess+Academy+Chennai",
    address: "Chennai Chess Club, Mylapore, Chennai",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 2000,
    coverImage: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&q=80",
    themeColor: "#334155",
  },
  {
    title: "Stand-up Comedy Open Mic",
    description: `Laugh out loud with the city's funniest upcoming comics!

Format:
- 10 comics
- 5 minutes each
- 1 Host
- Infinite laughter

Want to perform? Sign up at the venue 30 mins before the show.`,
    category: "art",
    tags: ["art", "comedy", "standup", "entertainment"],
    city: "Delhi",
    state: "Delhi",
    venue: "https://maps.google.com/?q=Comedy+Club+Delhi",
    address: "Playground Comedy Studio, Hauz Khas Village, Delhi",
    capacity: 60,
    ticketType: "paid",
    ticketPrice: 299,
    coverImage: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&q=80",
    themeColor: "#c2410c",
  },
];

/* ===========================
   HELPERS
=========================== */
function getRandomFutureDate(minDays = 7, maxDays = 90) {
  const now = Date.now();
  const randomDays = Math.floor(Math.random() * (maxDays - minDays) + minDays);
  return now + randomDays * 24 * 60 * 60 * 1000;
}

function getEventEndTime(startTime) {
  return startTime + (Math.floor(Math.random() * 3) + 2) * 60 * 60 * 1000;
}

function generateSlug(title) {
  return (
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
    "-" +
    Date.now()
  );
}

/* ===========================
   ACTIONS
=========================== */
export const run = action({
  handler: async (ctx) => {
    // Clear existing events first to prevent duplicates
    await ctx.runMutation(api.seedMutations.clearAllEvents);

    const organizer = await ctx.runMutation(
      api.seedMutations.getOrCreateOrganizer
    );

    let count = 0;

    for (const eventData of SAMPLE_EVENTS) {
      const startDate = getRandomFutureDate();
      const endDate = getEventEndTime(startDate);

      const event = {
        ...eventData,
        slug: generateSlug(eventData.title),
        organizerId: organizer._id,
        organizerName: organizer.name,
        startDate,
        endDate,
        timezone: "Asia/Kolkata",
        locationType: "physical",
        country: "India",
        registrationCount: Math.floor(eventData.capacity * 0.6),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await ctx.runMutation(api.seedMutations.insertEvent, { event });
      count++;
    }

    return { success: true, count };
  },
});

export const clear = action({
  handler: async (ctx) => {
    const deleted = await ctx.runMutation(
      api.seedMutations.clearAllEvents
    );
    return { success: true, deleted };
  },
});
