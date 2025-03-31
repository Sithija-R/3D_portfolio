import { BrowserRouter } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  UnicornCanvas,
  StarsCanvas,
} from "./components";

const App = () => {
  const [shouldFall, setShouldFall] = useState(false);
  const feedbackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (feedbackRef.current) {
        const feedbackBottom =
          feedbackRef.current.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // FALL when Feedbacks is fully scrolled past (Contact starts)
        if (feedbackBottom < windowHeight) {
          setShouldFall(true);
        }

        // RISE when scrolling up above Feedbacks
        if (feedbackBottom > windowHeight * 0.9) {
          setShouldFall(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <div className="z-0 flex flex-col md:flex-row relative">
          <div className="flex-1">
           
            <div ref={feedbackRef}>
              <Feedbacks />
            </div>
            <Contact />
          </div>

          <div className="min-w-160 max-w-160 relative w-full  hidden lg:block">
            <UnicornCanvas shouldFall={shouldFall} />
          </div>
          <StarsCanvas/>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
