import { Global } from "@emotion/react";
import React from "react";

export default function Fonts() {
  return (
    <Global
      styles={`
          /* copied from https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Rubik:ital,wght@0,300;0,500;1,300;1,500&display=swap */
          @font-face {
            font-family: 'Patua One';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/patuaone/v11/ZXuke1cDvLCKLDcimxB44_lu.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          
          @font-face {
            font-family: 'Rubik';
            font-style: italic;
            font-weight: 300;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/rubik/v11/iJWEBXyIfDnIV7nEnX661A.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          
          @font-face {
            font-family: 'Rubik';
            font-style: italic;
            font-weight: 500;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/rubik/v11/iJWEBXyIfDnIV7nEnX661A.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          
          @font-face {
            font-family: 'Rubik';
            font-style: normal;
            font-weight: 300;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/rubik/v11/iJWKBXyIfDnIV7nBrXw.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          
          @font-face {
            font-family: 'Rubik';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/rubik/v11/iJWKBXyIfDnIV7nBrXw.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
      `}
    />
  );
}
