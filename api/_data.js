/**
 * Single source of truth for stats, reviews, and portfolio videos shown on
 * the site. Edit the values below whenever you have real numbers or
 * testimonials, then commit and push, Vercel redeploys automatically.
 * Nothing in this file is ever sent to the browser directly, only the JSON
 * built from it (via stats.js/reviews.js/portfolio.js) is, so the raw data
 * here stays out of page source / dev tools Sources tab.
 *
 * Filename starts with an underscore so Vercel doesn't treat it as its own
 * API route, it's only ever imported by the other files in this folder.
 */

const STATS = [
  { label: "Videos delivered", value: 500, suffix: "+" },
  { label: "Average rating", value: 4.9, suffix: "/5" },
  { label: "Brands & creators served", value: 60, suffix: "+" },
  { label: "Avg. turnaround", value: 3, suffix: " days" },
  { label: "Repeat client rate", value: 78, suffix: "%" },
];

const PORTFOLIO = [
  { src: "active-face-boost-oil.mp4", caption: "Active Face Boost Oil", category: "Product" },
  { src: "avocado-nourishing-scalp.mp4", caption: "Avocado Nourishing Scalp Treatment", category: "Product" },
  { src: "blore-uv-face-product.mp4", caption: "Blore UV Face Protection", category: "Product" },
  { src: "elementre-product.mp4", caption: "Elementre Skincare", category: "Product" },
  { src: "express-collagen-products.mp4", caption: "Express Collagen", category: "Product" },
  { src: "leevs-vitamin-face-wash.mp4", caption: "Leevs Vitamin Face Wash", category: "Product" },
  { src: "medicube-collagen-capsule-cream.mp4", caption: "Medicube Collagen Capsule Cream", category: "Product" },
  { src: "neolife-treatment.mp4", caption: "NeoLife Treatment", category: "Product" },
  { src: "neol-skincare-product.mp4", caption: "NeoL Skincare", category: "Product" },
  { src: "ogee-skin-enhancer.mp4", caption: "Ogee Skin Enhancer", category: "Product" },
  { src: "ritual-face-serum.mp4", caption: "Ritual Face Serum", category: "Product" },
];

const REVIEWS = [
  {
    name: "Amara Chen",
    role: "Founder",
    rating: 5,
    quote: "The product launch video looked like it came from an agency ten times our budget. Turnaround was insanely fast.",
    result: "3.2x more add-to-carts in launch week",
    avatar: "avatar-amara-chen.png",
  },
  {
    name: "Daniel Osei",
    role: "Content Creator",
    rating: 5,
    quote: "I've tried a few AI video services and this is the first one that actually understood my brand voice from a single brief.",
    result: "Avg. watch time up 41%",
    avatar: "avatar-daniel-osei.png",
  },
  {
    name: "Priya Nathan",
    role: "Marketing Lead",
    rating: 5,
    quote: "We needed 12 product videos in a week for a seasonal campaign. Delivered on time, on brand, no revisions needed.",
    result: "12 videos delivered in 6 days",
    avatar: "avatar-priya-nathan.png",
  },
  {
    name: "Marcus Webb",
    role: "Independent Musician",
    rating: 4,
    quote: "Great value for a solo artist who can't afford a full production team. The revision process was smooth and easy.",
    result: "Music video used across 3 platforms",
    avatar: "avatar-marcus-webb.png",
  },
  {
    name: "Sofia Reyes",
    role: "Founder",
    rating: 5,
    quote: "Premium quality without the premium agency price tag. Our brand video became our top-performing ad creative.",
    result: "Lowered cost-per-view by 58%",
    avatar: "avatar-sofia-reyes.png",
  },
  {
    name: "Hana Whitfield",
    role: "Founder",
    rating: 5,
    quote: "Our product video felt like it was shot in a real studio with real models. Customers keep asking where we filmed it.",
    result: "Product page conversion up 2.4x",
    avatar: "avatar-hana-whitfield.png",
  },
  {
    name: "Julian Marsh",
    role: "Growth Lead",
    rating: 5,
    quote: "We send a brief on Monday and have a finished video by Thursday. That speed alone changed how often we can launch new ads.",
    result: "4 new ad creatives shipped per month",
    avatar: "avatar-julian-marsh.png",
  },
  {
    name: "Renee Castillo",
    role: "Independent Creator",
    rating: 5,
    quote: "I run my page solo and could never afford a videographer. Now every post looks like it has a full production team behind it.",
    result: "Follower growth tripled in 90 days",
    avatar: "avatar-renee-castillo.png",
  },
  {
    name: "Tobias Lindgren",
    role: "E-commerce Manager",
    rating: 4,
    quote: "Every revision request was handled quickly and without pushback. It's the easiest vendor relationship we have.",
    result: "Return rate dropped after clearer demo videos",
    avatar: "avatar-tobias-lindgren.png",
  },
];

module.exports = { STATS, PORTFOLIO, REVIEWS };
