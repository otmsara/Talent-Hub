"use client"

import type React from "react"
import { useEffect } from "react"

export const ResumePrintStyles: React.FC = () => {
  useEffect(() => {
    // Add print styles when component mounts
    const style = document.createElement("style")
    style.id = "resume-print-styles"
    style.innerHTML = `
      @media print {
        @page {
          size: letter;
          margin: 0.5in;
        }
        
        body * {
          visibility: hidden;
        }
        
        .resume-display, .resume-display * {
          visibility: visible;
        }
        
        .resume-display {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background-color: white !important;
          color: black !important;
          padding: 0.5in !important;
        }
        
        .resume-display h1 {
          color: #1e3a8a !important;
        }
        
        .resume-display h2 {
          color: #1e40af !important;
        }
        
        .resume-display a {
          color: #2563eb !important;
          text-decoration: none;
        }
        
        .resume-display .border-gray-700 {
          border-color: #e5e7eb !important;
        }
        
        .resume-display .text-gray-300,
        .resume-display .text-gray-400,
        .resume-display .text-gray-200 {
          color: #1f2937 !important;
        }
        
        .resume-display .text-blue-300,
        .resume-display .text-blue-400 {
          color: #1e40af !important;
        }
        
        .resume-display .bg-blue-900\/40,
        .resume-display .bg-gray-800 {
          background-color: #f3f4f6 !important;
          border-color: #d1d5db !important;
        }
        
        .resume-display .bg-blue-500,
        .resume-display .bg-blue-900 {
          background-color: #1e40af !important;
        }
        
        .no-print {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)

    // Clean up when component unmounts
    return () => {
      const styleElement = document.getElementById("resume-print-styles")
      if (styleElement) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  return null
}
