"use client";

import React, { useState } from "react";

export default function FloatingBall() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => window.open("https://fellou.ai", "_blank")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fellou-floating-ball"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#fff",
        borderRadius: isHovered ? "99px" : "50%",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        gap: "8px",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s ease",
        zIndex: 100000,
        width: isHovered ? "140px" : "28px",
        height: "28px",
        textAlign: "center",
        border: "2px solid #f4f4f4",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 152 152"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.72"
          d="M108.71 15.909C133.671 36.8541 134.337 77.1554 110.197 105.924C86.0565 134.694 46.2518 141.036 21.2904 120.091C-3.67096 99.1459 -4.33674 58.8446 19.8034 30.0755C43.9435 1.30644 83.7482 -5.03614 108.71 15.909ZM102.282 23.5694C81.8118 6.39315 48.2407 11.7425 27.4638 36.5034C6.68694 61.2643 7.24845 95.2543 27.7183 112.431C48.1882 129.607 81.7593 124.258 102.536 99.4966C123.313 74.7357 122.752 40.7457 102.282 23.5694Z"
          fill="url(#paint0_linear_34_1408)"
        />
        <path
          d="M116.986 29.3811C141.525 49.9712 143.286 88.2698 120.921 114.924C98.5561 141.577 60.5333 146.493 35.995 125.903C11.4567 105.313 9.69493 67.0139 32.06 40.3602C54.4252 13.7065 92.4479 8.79095 116.986 29.3811ZM110.558 37.0415C90.3987 20.1255 58.6488 24.2301 39.7205 46.788C20.7921 69.346 22.2632 101.326 42.4229 118.242C62.5825 135.158 94.3324 131.054 113.261 108.496C132.189 85.9377 130.718 53.9574 110.558 37.0415Z"
          fill="url(#paint1_linear_34_1408)"
        />
        <path
          d="M131.544 35.0694C155.71 55.3471 155.731 95.1074 131.591 123.876C107.451 152.646 68.291 159.529 44.1249 139.251C19.9589 118.974 19.9379 79.2135 44.078 50.4444C68.2182 21.6753 107.378 14.7917 131.544 35.0694ZM125.116 42.7299C105.505 26.2745 72.5526 32.067 51.7385 56.8723C30.9244 81.6776 30.9421 115.136 50.5528 131.591C70.1636 148.046 103.116 142.254 123.931 117.449C144.745 92.6433 144.727 59.1852 125.116 42.7299Z"
          fill="url(#paint2_linear_34_1408)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_34_1408"
            x1="108.71"
            y1="15.909"
            x2="21.2904"
            y2="120.091"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6401F8" stopOpacity="0.7" />
            <stop offset="0.465" stopColor="#FF9000" stopOpacity="0.42" />
            <stop offset="1" stopColor="#33B3FF" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_34_1408"
            x1="116.986"
            y1="29.381"
            x2="35.995"
            y2="125.903"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6401F8" stopOpacity="0.7" />
            <stop offset="0.465" stopColor="#FF9000" stopOpacity="0.42" />
            <stop offset="1" stopColor="#33B3FF" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_34_1408"
            x1="131.544"
            y1="35.0694"
            x2="44.1249"
            y2="139.251"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6401F8" />
            <stop offset="0.5" stopColor="#FF9000" />
            <stop offset="1" stopColor="#33B3FF" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="fellou-floating-ball-text"
        style={{
          display: isHovered ? "block" : "none",
          width: isHovered ? "100px" : "0px",
          transition: "width 0.3s ease",
          color: "#595561",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "20px",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        powered by fellou
      </div>
    </div>
  );
}
