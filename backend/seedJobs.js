const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const sampleJobs = [
  {
    title: 'Full Stack Developer',
    company: 'Tech Corp India',
    description: 'We are looking for a talented full stack developer to join our team. You will work on cutting-edge projects using modern technologies like React, Node.js, and MongoDB. This is an excellent opportunity to grow your skills and work with a dynamic team.',
    requirements: [
      '2+ years of experience in web development',
      'Strong proficiency in React and Node.js',
      'Experience with MongoDB or similar databases',
      'Good understanding of RESTful APIs',
      'Excellent problem-solving skills'
    ],
    responsibilities: [
      'Build scalable web applications',
      'Write clean, maintainable code',
      'Collaborate with cross-functional teams',
      'Participate in code reviews',
      'Contribute to technical documentation'
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Git'],
    category: 'IT',
    location: 'Mumbai',
    salary: '₹8-12 LPA',
    experience: '2-4 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Frontend Developer',
    company: 'Web Solutions Pvt Ltd',
    description: 'Join our frontend team and create beautiful, responsive user interfaces. Work with modern frameworks and tools to deliver exceptional user experiences.',
    requirements: [
      'Strong knowledge of React.js',
      'Experience with TailwindCSS or similar',
      'Understanding of responsive design',
      'Knowledge of JavaScript ES6+',
      'Familiarity with Git version control'
    ],
    responsibilities: [
      'Develop responsive web applications',
      'Create reusable UI components',
      'Optimize application performance',
      'Work closely with designers',
      'Ensure cross-browser compatibility'
    ],
    skills: ['React', 'TailwindCSS', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    category: 'IT',
    location: 'Bangalore',
    salary: '₹6-10 LPA',
    experience: '1-3 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Backend Developer',
    company: 'API Masters',
    description: 'Build robust backend systems and RESTful APIs. Work with cutting-edge technologies and contribute to scalable architecture.',
    requirements: [
      'Experience with Node.js and Express',
      'Strong database knowledge (SQL/NoSQL)',
      'Understanding of API design principles',
      'Knowledge of authentication mechanisms',
      'Experience with cloud platforms (AWS/Azure)'
    ],
    responsibilities: [
      'Design and develop RESTful APIs',
      'Optimize database queries',
      'Implement security best practices',
      'Write comprehensive tests',
      'Deploy and maintain applications'
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API', 'AWS'],
    category: 'IT',
    location: 'Pune',
    salary: '₹7-11 LPA',
    experience: '2-4 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Data Analyst',
    company: 'Analytics Inc',
    description: 'Analyze complex datasets and create actionable insights for business decisions. Work with modern data analysis tools and visualization platforms.',
    requirements: [
      'Proficiency in Python and SQL',
      'Experience with data visualization tools',
      'Strong analytical and problem-solving skills',
      'Knowledge of statistical methods',
      'Bachelor\'s degree in related field'
    ],
    responsibilities: [
      'Analyze large datasets',
      'Create data visualizations and dashboards',
      'Generate reports and insights',
      'Collaborate with stakeholders',
      'Identify trends and patterns'
    ],
    skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Pandas'],
    category: 'Data Science',
    location: 'Delhi',
    salary: '₹5-8 LPA',
    experience: '1-2 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'UI/UX Designer',
    company: 'Design Studio',
    description: 'Create stunning user experiences and interfaces. Work on diverse projects and bring creative ideas to life.',
    requirements: [
      'Proficiency in Figma and Adobe XD',
      'Strong portfolio demonstrating UX work',
      'Understanding of design principles',
      'Knowledge of user research methods',
      'Excellent communication skills'
    ],
    responsibilities: [
      'Design user interfaces and experiences',
      'Create wireframes and prototypes',
      'Conduct user research',
      'Collaborate with developers',
      'Maintain design systems'
    ],
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping'],
    category: 'Design',
    location: 'Mumbai',
    salary: '₹6-9 LPA',
    experience: '2-3 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Marketing Manager',
    company: 'Brand Boost',
    description: 'Lead marketing campaigns and drive brand growth. Work with a creative team to develop innovative marketing strategies.',
    requirements: [
      'Experience in digital marketing',
      'Knowledge of SEO and content marketing',
      'Strong leadership skills',
      'Data-driven decision making',
      'MBA or equivalent preferred'
    ],
    responsibilities: [
      'Plan and execute marketing campaigns',
      'Manage marketing team',
      'Analyze campaign metrics',
      'Develop marketing strategies',
      'Manage marketing budget'
    ],
    skills: ['Digital Marketing', 'SEO', 'Content Marketing', 'Social Media', 'Google Analytics', 'Leadership'],
    category: 'Marketing',
    location: 'Chandigarh',
    salary: '₹8-12 LPA',
    experience: '3-5 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloud Solutions Ltd',
    description: 'Implement and manage CI/CD pipelines. Automate infrastructure and ensure smooth deployment processes.',
    requirements: [
      'Experience with Docker and Kubernetes',
      'Knowledge of cloud platforms (AWS/GCP/Azure)',
      'Proficiency in scripting (Bash, Python)',
      'Understanding of CI/CD tools',
      'Experience with monitoring tools'
    ],
    responsibilities: [
      'Manage cloud infrastructure',
      'Implement CI/CD pipelines',
      'Automate deployment processes',
      'Monitor system performance',
      'Ensure security compliance'
    ],
    skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux'],
    category: 'IT',
    location: 'Hyderabad',
    salary: '₹10-15 LPA',
    experience: '3-5 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Mobile App Developer',
    company: 'AppTech Solutions',
    description: 'Develop cross-platform mobile applications using React Native. Create seamless mobile experiences for millions of users.',
    requirements: [
      'Experience with React Native',
      'Knowledge of iOS and Android platforms',
      'Understanding of mobile UI/UX',
      'Familiarity with mobile app deployment',
      'Strong JavaScript skills'
    ],
    responsibilities: [
      'Develop mobile applications',
      'Optimize app performance',
      'Integrate APIs and third-party services',
      'Fix bugs and improve functionality',
      'Publish apps to App Store and Play Store'
    ],
    skills: ['React Native', 'JavaScript', 'Redux', 'Firebase', 'iOS', 'Android'],
    category: 'IT',
    location: 'Bangalore',
    salary: '₹7-12 LPA',
    experience: '2-4 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Business Analyst',
    company: 'Consulting Group',
    description: 'Bridge the gap between business needs and technical solutions. Analyze requirements and provide strategic insights.',
    requirements: [
      'Strong analytical skills',
      'Experience with requirement gathering',
      'Knowledge of business processes',
      'Excellent communication skills',
      'Proficiency in Excel and SQL'
    ],
    responsibilities: [
      'Gather and document requirements',
      'Analyze business processes',
      'Create functional specifications',
      'Coordinate with stakeholders',
      'Identify improvement opportunities'
    ],
    skills: ['Business Analysis', 'SQL', 'Excel', 'JIRA', 'Documentation', 'Communication'],
    category: 'Business',
    location: 'Mumbai',
    salary: '₹6-10 LPA',
    experience: '2-4 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Python Developer',
    company: 'Tech Innovators',
    description: 'Develop scalable Python applications and work on exciting projects involving data processing and automation.',
    requirements: [
      'Strong Python programming skills',
      'Experience with Django or Flask',
      'Knowledge of databases',
      'Understanding of OOP concepts',
      'Familiarity with version control'
    ],
    responsibilities: [
      'Develop Python applications',
      'Write efficient algorithms',
      'Create RESTful APIs',
      'Optimize code performance',
      'Collaborate with team members'
    ],
    skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'REST API', 'Git'],
    category: 'IT',
    location: 'Noida',
    salary: '₹5-9 LPA',
    experience: '1-3 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Content Writer',
    company: 'Content Hub',
    description: 'Create engaging content for various digital platforms. Write blogs, articles, and marketing copy.',
    requirements: [
      'Excellent writing skills',
      'Knowledge of SEO principles',
      'Research capabilities',
      'Creative thinking',
      'Attention to detail'
    ],
    responsibilities: [
      'Write blog posts and articles',
      'Create marketing content',
      'Edit and proofread content',
      'Research industry topics',
      'Optimize content for SEO'
    ],
    skills: ['Content Writing', 'SEO', 'Research', 'WordPress', 'Grammar', 'Creativity'],
    category: 'Marketing',
    location: 'Remote',
    salary: '₹3-6 LPA',
    experience: '1-2 years',
    type: 'Full-time',
    status: 'open',
  },
  {
    title: 'Software Tester (QA)',
    company: 'Quality Assurance Ltd',
    description: 'Ensure software quality through comprehensive testing. Work with development teams to identify and fix bugs.',
    requirements: [
      'Experience in manual and automation testing',
      'Knowledge of testing frameworks',
      'Understanding of SDLC',
      'Attention to detail',
      'Good communication skills'
    ],
    responsibilities: [
      'Perform manual and automated testing',
      'Create test cases and scenarios',
      'Report and track bugs',
      'Verify bug fixes',
      'Ensure quality standards'
    ],
    skills: ['Manual Testing', 'Selenium', 'JIRA', 'Test Automation', 'API Testing', 'SQL'],
    category: 'IT',
    location: 'Pune',
    salary: '₹4-7 LPA',
    experience: '1-3 years',
    type: 'Full-time',
    status: 'open',
  }
];

// Connect to MongoDB and seed data
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');
    
    // Insert sample jobs
    const result = await Job.insertMany(sampleJobs);
    console.log(`✅ Successfully added ${result.length} sample jobs!`);
    
    console.log('\n📋 Jobs Added:');
    result.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - ${job.company} (${job.location})`);
    });
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });