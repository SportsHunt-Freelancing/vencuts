"use client";
import "./contact.css";
import { useState, useEffect } from "react";

import AnimatedH1 from "../components/AnimatedH1/AnimatedH1";
import AnimatedCopy from "../components/AnimatedCopy/AnimatedCopy";
import ParallaxImage from "../components/ParallaxImage/ParallaxImage";
import Footer from "../components/Footer/Footer";

import { ReactLenis } from "@studio-freight/react-lenis";

const Page = () => {
  const [bangaloreTime, setBangaloreTime] = useState("--:-- AM IST");

  useEffect(() => {
    const updateTimes = () => {
      const bangaloreOptions = {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const bangaloreFormatter = new Intl.DateTimeFormat("en-US", bangaloreOptions);
      setBangaloreTime(bangaloreFormatter.format(new Date()) + " IST");
    };

    updateTimes();

    const intervalId = setInterval(updateTimes, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ReactLenis root>
      <div className="page">
        <section className="contact-hero">
          <div className="container">
            <AnimatedH1 delay={0.85}>
              Collaborating with visionary brands, entrepreneurs, and investors
              to craft bold identities that inspire and leave a lasting mark.
            </AnimatedH1>
          </div>
        </section>

        <section className="contact-details">
          <div className="container">
            <div className="row">
              <div className="col">
                <AnimatedCopy>Let's Build</AnimatedCopy>
              </div>
              <div className="col">
                <div className="sub-col">
                  <AnimatedCopy>New Collaborations</AnimatedCopy>
                  <AnimatedCopy>hello@vencuts.io</AnimatedCopy>
                </div>
                <div className="sub-col">
                  <AnimatedCopy>Join Vencuts</AnimatedCopy>
                  <AnimatedCopy>jobs@vencuts.io</AnimatedCopy>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <AnimatedCopy>Bangalore</AnimatedCopy>
              </div>
              <div className="col">
                <div className="sub-col">
                  <AnimatedCopy>SG Palya</AnimatedCopy>
                  <AnimatedCopy>Bangalore, Karnataka</AnimatedCopy>
                  <AnimatedCopy>India</AnimatedCopy>
                </div>
                <div className="sub-col">
                  <AnimatedCopy>{bangaloreTime}</AnimatedCopy>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-banner">
          <div className="contact-banner-bg">
            <ParallaxImage src="/contact/banner.jpg" alt="" speed={0.2} />
          </div>

          <div className="contact-banner-cta">
            <AnimatedH1 animateOnScroll={true}>Let's build together</AnimatedH1>
          </div>
        </section>
      </div>

      <Footer />
    </ReactLenis>
  );
};

export default Page;
