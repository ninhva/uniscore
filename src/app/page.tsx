"use client";

import React from "react";
import Match from "./components/match";

const Home = () => {
  return (
    <div className="match-container">
      <h3 className="main-title">Thông số</h3>
      <div className="highlight-score-container">
        <Match
          id="a8qv3rlgf03or1c"
          home={{ name: "MU", logo: "/images/mu.png" }}
          away={{ name: "Chelsea", logo: "/images/chelsea.png" }}
        />
      </div>
    </div>
  );
};

export default Home;
