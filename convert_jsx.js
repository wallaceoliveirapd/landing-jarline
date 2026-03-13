const fs = require('fs');

const path = './old_index.html';
const html = fs.readFileSync(path, 'utf8');

const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.error("No body found");
  process.exit(1);
}

let bodyContent = bodyMatch[1];
// remove script and save the JS
const scriptMatch = bodyContent.match(/<script>([\s\S]*?)<\/script>/);
let jsContent = '';
if (scriptMatch) {
  jsContent = scriptMatch[1];
  bodyContent = bodyContent.replace(scriptMatch[0], '');
}

// Convert HTML to JSX
bodyContent = bodyContent
  .replace(/class=/g, 'className=')
  .replace(/for=/g, 'htmlFor=')
  .replace(/autoplay/g, 'autoPlay')
  .replace(/playsinline/g, 'playsInline')
  .replace(/muted/g, 'muted') // React still supports muted, but often requires autoPlay muted as boolean
  .replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}'); // convert comments

// SVG attributes
bodyContent = bodyContent
  .replace(/clip-path/g, 'clipPath')
  .replace(/stroke-linecap/g, 'strokeLinecap')
  .replace(/stroke-linejoin/g, 'strokeLinejoin')
  .replace(/stroke-width/g, 'strokeWidth')
  .replace(/fill-rule/g, 'fillRule')
  .replace(/clip-rule/g, 'clipRule')
  .replace(/viewbox/ig, 'viewBox');



// Self-closing tags fixes (rough approximation, assuming standard spacing)
bodyContent = bodyContent.replace(/<img(.*?[^\/])>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<source(.*?[^\/])>/g, '<source$1 />');
bodyContent = bodyContent.replace(/<input(.*?[^\/])>/g, '<input$1 />');
bodyContent = bodyContent.replace(/<br([^>]*)>/g, '<br$1 />');
bodyContent = bodyContent.replace(/<hr([^>]*)>/g, '<hr$1 />');
bodyContent = bodyContent.replace(/<textarea([^>]*?)><\/textarea>/g, '<textarea$1 />');
bodyContent = bodyContent.replace(/<textarea([^>]*?)>([^<]*?)<\/textarea>/g, '<textarea$1 defaultValue={"$2"} />'); // simplistic textarea


// Inline styles fixes
// style="background-image:url('assets/images/hero-bg.png')"
bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, styleString) => {
  const stylesObj = {};
  styleString.split(';').forEach(s => {
    if(!s.trim()) return;
    const [key, val] = s.split(':').map(str => str.trim());
    const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
    stylesObj[camelKey] = val.replace(/&quot;/g, '"');
  });
  return `style={${JSON.stringify(stylesObj)}}`;
});


const jsWrapped = `
"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Page() {

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Original javascript behavior adapted to be robust inside an effect
      // Will execute after full component mount
      
      ${jsContent.trim()}

    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      ${bodyContent.trim()}
    </>
  );
}
`;

fs.writeFileSync('./src/app/page.tsx', jsWrapped);
console.log("Converted successfully!");
