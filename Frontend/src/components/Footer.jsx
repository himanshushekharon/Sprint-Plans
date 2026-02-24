import React, { memo } from 'react';
import { Layers, Github, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = memo(() => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <Layers className="logo-icon" size={24} />
              <span>Sprint Plans</span>
            </div>
            <p>Building the future of project management, one sprint at a time.</p>
            <div className="social-links">
              <a href="https://linkedin.com/in/himanshu-shekhar-38342029a/?skipRedirect=true" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
              <a href="https://github.com/himanshushekharon" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Workflow</a>
              <a href="#">Integrations</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Help Center</a>
              <a href="#">Community</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Sprint Plans Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
