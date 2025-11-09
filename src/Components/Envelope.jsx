import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import confetti from "canvas-confetti";
import "./Envelope.css";

export default function Envelope({ name = "Kathy & Leon" }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [letterOut, setLetterOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [letterZ, setLetterZ] = useState(2);

  // Flip envelope
  const { transform } = useSpring({
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { ...config.gentle, tension: 160, friction: 18 },
  });

  // Flap rotation
  const { flapRotation } = useSpring({
    flapRotation: flapOpen ? 170 : 0,
    config: { tension: 180, friction: 12 },
  });

  // Envelope back slide down
  const backSpring = useSpring({
    y: flapOpen ? 20 : 0,
    config: { tension: 150, friction: 15 },
  });

  // Envelope moves down when letter pops out
  const envelopeOffset = useSpring({
    y: letterOut ? 350 : 0,
    config: { tension: 150, friction: 15 },
  });

  // Letter pop-out along arc
  const letterSpring = useSpring({
    y: letterOut ? -105 : 0,
    x: letterOut ? 0 : 0,
    scale: letterOut ? 1 : 0.8,
    rotate: letterOut ? [0, -5, 5, -5, 5, 0] : 0,
    opacity: letterOut ? 1 : 0,
    config: { tension: 200, friction: 10 },
    onChange: (val) => {
      if (val.y > -50) setLetterZ(5);
      else setLetterZ(2);
    },
  });

  // Confetti trigger
  useEffect(() => {
    if (letterOut) {
      setShowConfetti(true);
      confetti({
        particleCount: 120,
        spread: 180,
        colors: ["#FFD700", "#FFFACD", "#FFC107"],
      });
      const timer = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [letterOut]);

// Auto-close flap 2 seconds after letter pops out
useEffect(() => {
  let timer;
  if (letterOut) {
    timer = setTimeout(() => {
      setFlapOpen(false); // only closes the flap
    }, 2000);
  }
  return () => clearTimeout(timer);
}, [letterOut]);

  // Click handler
  const handleClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setTimeout(() => setFlapOpen(true), 500);
      setTimeout(() => setLetterOut(true), 900);
    }
  };

  // Confetti pieces
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
    const size = Math.random() * 8 + 4;
    const left = Math.random() * 100 + "%";
    const delay = Math.random() * 500;
    const color = ["#FFD700", "#FFFACD", "#FFC107"][Math.floor(Math.random() * 3)];
    return (
      <div
        key={i}
        className="confetti-piece"
        style={{
          width: size,
          height: size,
          left,
          backgroundColor: color,
          animationDelay: `${delay}ms`,
        }}
      />
    );
  });

  return (
    <div className="envelope-wrapper" onClick={handleClick}>
      <animated.div
        className="envelope-scene"
        style={{
          transform: envelopeOffset.y.to((y) => `translateY(${y}px) ${transform.get()}`),
        }}
      >
        {/* FRONT */}
        <div className="envelope-face envelope-front">
          <img src="/assets/envelope-front.png" alt="Envelope Front" className="front-img" />
          <div className="envelope-name">{name}</div>
        </div>

        {/* BACK */}
        <div className="envelope-face envelope-back">
          <animated.div
            className="envelope-layers"
            style={{ transform: backSpring.y.to((y) => `translateY(${y}px)`) }}
          >
            <img src="/assets/inside_slip.png" alt="Envelope Interior" className="layer interior" />

            {/* Flap */}
            <animated.img
              src="/assets/front_slip.png"
              alt="Envelope Flap"
              className="layer flap"
              style={{
                transformOrigin: "top center",
                transform: flapRotation.to((r) => `rotateX(${r}deg)`),
              }}
            />

            {/* Letter */}
            <animated.div
              className="layer letter"
              style={{
                zIndex: letterZ,
                opacity: letterSpring.opacity,
                transform: letterSpring.y.to((y) => {
                  const x = letterSpring.x.get();
                  const scale = letterSpring.scale.get();
                  const rotate = letterSpring.rotate.get();
                  return `translate(${x}px, ${y}%) scale(${scale}) rotate(${rotate}deg)`;
                }),
              }}
            >
              <img src="/assets/letter.png" alt="Letter" style={{ width: "100%", display: "block" }} />
            </animated.div>

            {/* Envelope back images */}
            <img
              src="/assets/envelope-back.png"
              alt="Envelope Back"
              className="layer back-closed"
              style={{ opacity: flapOpen ? 0 : 1 }}
            />

            <img
              src="/assets/envelope_open.png"
              alt="Envelope Open"
              className="layer open"
              style={{ opacity: flapOpen ? 1 : 0 }}
            />
          </animated.div>
        </div>
      </animated.div>

      {/* Confetti */}
      {showConfetti && <div className="confetti-container">{confettiPieces}</div>}
    </div>
  );
}
