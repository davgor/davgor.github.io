import React from 'react';

const ContactMe: React.FC = () => {
  return (
    <div className="card mb-3 bg-transparent border-0" style={{ maxWidth: '100%' }}>
      <div className="row g-0 cardmargins">
        <div className="col-md-12 cardbackdrop">
          <div className="card-body">
            <h5 className="card-title">Contact me!</h5>
            <p className="card-text">
              I am always open to hearing about new job opportunities, so if you are reading this page and have any roles
              that match feel free to reach out.
            </p>
            <h6><b>Title's I will interview for:</b></h6>
            <ul>
              <li>Senior Software Developer In Test (SDET)</li>
              <li>Senior Automation Engineer</li>
              <li>Quality Assurance Manager</li>
              <li>Director of Quality Assurance</li>
            </ul>
            <h6><b>Methods of contact</b></h6>
            <ul>
              <li><b>Phone:</b> 515-864-6382 (preferred)</li>
              <li><b>Email:</b> davgor4@gmail.com</li>
              <li><a href="https://www.linkedin.com/in/davgor4/">linkedin.com/in/davgor4/</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
