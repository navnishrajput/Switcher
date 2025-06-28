import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTwitter, 
  faGithub, 
  faLinkedin, 
  faInstagram,
  faFacebook
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 5px rgba(100, 255, 218, 0.5); }
  50% { text-shadow: 0 0 20px rgba(100, 255, 218, 0.8); }
  100% { text-shadow: 0 0 5px rgba(100, 255, 218, 0.5); }
`;

// Styled Components
const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
  color: #ccd6f6;
  padding: 4rem 5% 2rem;
  font-family: 'Calibre', 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
  margin-top: 5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #64ffda, transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: left;
`;

const FooterSection = styled.div`
  h3 {
    color: #64ffda;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 50%;
      height: 2px;
      background: #64ffda;
    }
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
    opacity: 0.9;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled.a`
  color: #ccd6f6;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  width: fit-content;

  &:hover {
    color: #64ffda;
    transform: translateX(5px);
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
`;

const SocialIcon = styled.a`
  color: #ccd6f6;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(100, 255, 218, 0.1);
  
  &:hover {
    color: #64ffda;
    background: rgba(100, 255, 218, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.8rem;
    border: 1px solid rgba(100, 255, 218, 0.3);
    background: rgba(10, 25, 47, 0.5);
    color: #ccd6f6;
    border-radius: 4px;
    font-family: inherit;

    &::placeholder {
      color: #8892b0;
    }

    &:focus {
      outline: none;
      border-color: #64ffda;
    }
  }

  button {
    padding: 0.8rem;
    background: #64ffda;
    color: #0a192f;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #52d1b2;
      transform: translateY(-2px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(100, 255, 218, 0.1);
  font-size: 0.9rem;
  opacity: 0.8;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>About MultiTool</h3>
          <p>
            MultiTool provides free, easy-to-use online tools for document conversion, 
            image editing, and more. Our mission is to simplify your digital workflow.
          </p>
          <SocialIcons>
            <SocialIcon href="#" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </SocialIcon>
            <SocialIcon href="#" aria-label="GitHub">
              <FontAwesomeIcon icon={faGithub} />
            </SocialIcon>
            <SocialIcon href="#" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} />
            </SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </SocialIcon>
            <SocialIcon href="#" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </SocialIcon>
          </SocialIcons>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLinks>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/pdf-tools">PDF Tools</FooterLink>
            <FooterLink href="/doc-tools">DOC Tools</FooterLink>
            <FooterLink href="/image-tools">Image Tools</FooterLink>
            <FooterLink href="/other-tools">Other Tools</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Resources</h3>
          <FooterLinks>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/sitemap">Sitemap</FooterLink>
            <FooterLink href="/api">API Documentation</FooterLink>
            <FooterLink href="/status">System Status</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Newsletter</h3>
          <p>Subscribe to get updates on new tools and features.</p>
          <NewsletterForm>
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </NewsletterForm>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
            support@multitool.com
          </p>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} MultiTool. All rights reserved.
        <div style={{ marginTop: '0.5rem' }}>
          Made with ❤️ by the MultiTool team
        </div>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;