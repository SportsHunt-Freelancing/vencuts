"use client";
import "./Footer.css";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Footer = () => {
  const logoRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success", "error", or null

  useGSAP(
    () => {
      if (!logoRef.current) return;

      const text = new SplitType(logoRef.current, {
        types: "chars",
        charClass: "footer-logo-char",
      });

      gsap.set(".footer-logo-char", {
        y: "100%",
        display: "inline-block",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: logoRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
        .to(".footer-logo-char", {
          y: "0%",
          stagger: 0.04,
          duration: 0.8,
          ease: "power2.out",
        });

      return () => {
        if (text) text.revert();
        ScrollTrigger.getAll()
          .filter((st) => st.vars.trigger === logoRef.current)
          .forEach((st) => st.kill());
      };
    },
    { scope: logoRef }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "" });
      } else {
        setSubmitStatus("error");
        console.error("Submission error:", data.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <div className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="col">
            <h3>Content delivered to your inbox</h3>
            <div className="subscribe-form">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {submitStatus === "success" && (
                <p className="form-message success">✓ Subscribed successfully!</p>
              )}
              {submitStatus === "error" && (
                <p className="form-message error">✗ Please fill in all fields</p>
              )}
            </div>
          </div>
          <div className="col">
            <div className="row">
              <div className="footer-socials">
                <a href="https://www.instagram.com/codegridweb/">Instagram</a>
                <a href="https://x.com/codegridweb">Twitter</a>
              </div>

              <div className="langs">
                <p>EN</p>
              </div>
            </div>

            <div className="row">
              <div className="location">
                <h3>Bangalore</h3>
                <p>SG Palya</p>
                <p>Bangalore, Karnataka</p>
                <p>India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-logo">
          <h1 ref={logoRef}>Vencuts</h1>
        </div>

        <div className="footer-copyright">
          <p>Vencuts &copy;2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
