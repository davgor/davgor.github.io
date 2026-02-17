import React from 'react';
import BlogCard from '../components/BlogCard';

const ContactMe: React.FC = () => {
  return (
    <BlogCard
      title="Contact me!"
      content={[
        "I am always open to hearing about new job opportunities, so if you are reading this page and have any roles that match feel free to reach out.",
        { type: 'html', content: `<h6><b>Title's I will interview for:</b></h6><ul><li>Senior Software Developer In Test (SDET)</li><li>Senior Automation Engineer</li><li>Quality Assurance Manager</li><li>Director of Quality Assurance</li></ul>` },
        { type: 'html', content: `<h6><b>Methods of contact</b></h6><ul><li><b>Phone:</b> 515-864-6382 (preferred)</li><li><b>Email:</b> davgor4@gmail.com</li><li><a href="https://www.linkedin.com/in/davgor4/">linkedin.com/in/davgor4/</a></li></ul>` }
      ]}
    />
  );
};

export default ContactMe;
