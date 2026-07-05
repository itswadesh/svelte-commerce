import { defaultContent } from '../default/homepage-content.js'
import type { ThemeHomepageContent } from '../types.js'

export const limelightContent: ThemeHomepageContent = {
  ...defaultContent,
  brandName: "Limelight",
  description: "Lab grown diamond jewellery crafted for everyday shine, meaningful gifts, and modern celebrations.",
  seoTitle: "Buy Lab Grown Diamond Jewellery in India - Limelight Diamonds",
  seoImage: "/limelight/hero-1.jpg",
  hero: {
    badge: "Lab Grown Diamonds",
    titleLead: "Luxury",
    titleAccent: "That Ticks",
    titleRest: "Differently",
    text: "Shop lab grown diamond jewellery designed for refined everyday shine.",
    primaryCta: "Explore Now",
    secondaryCta: "Find a Store",
    bgText: "LIMELIGHT",
    image: "/limelight/hero-1.jpg",
    imageAlt: "Limelight lab grown diamond jewellery campaign",
    stats: [],
    floatingCards: []
  },
  ticker: ["Rings", "Earrings", "Pendants", "Bracelets", "Solitaire", "Necklaces", "Everyday Shine"],
  category: {
    label: "Shop by Category",
    titleLead: "Shop by",
    titleAccent: "Category",
    text: "Elevated designs, thoughtfully sculpted for life's most meaningful expressions.",
    emptyTitle: "No categories available",
    emptyText: "Categories will appear here when they are returned by the API."
  },
  about: {
    label: "Our Story",
    titleLead: "Our",
    titleAccent: "Story",
    text: "Founded in 2019, Limelight Lab Grown Diamonds has become India's largest lab grown diamond jewellery brand, with stores across 45+ cities. The brand offers luxury that is real, responsible, and accessible.",
    primaryImage: "/limelight/story-diamond.jpg",
    secondaryImage: "/limelight/store.jpg",
    primaryImageAlt: "Lab grown diamond close up",
    secondaryImageAlt: "Limelight store interior",
    experienceValue: "45+",
    experienceText: "Store locations across India",
    cta: "Know More",
    features: []
  },
  menu: { label: "Most in Demand", titleLead: "Most in", titleAccent: "Demand", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API.", cta: "Shop Now" },
  special: { label: "Find a Store", titleLead: "Find your favourite designs", titleAccent: "at a store nearby.", text: "Visit our exclusive brand stores across 45+ locations in India.", cta: "Find a Store", image: "/limelight/store.jpg", imageAlt: "Limelight store", oldPrice: "", price: "" },
  gallery: { label: "Campaigns", titleLead: "Limelight", titleAccent: "Collections", items: [] },
  history: { label: "Story", titleLead: "Our", titleAccent: "Journey", items: [] },
  chefs: { label: "Categories", titleLead: "Shop by", titleAccent: "Category", items: [] },
  hours: { label: "Store Visit", titleLead: "Book a", titleAccent: "Store Visit", rows: [], orderTitle: "Need Assistance", orderText: "Book store visit or request a call.", orderCta: "Book Store Visit", locationTitle: "Find Us", address: "Mumbai, Maharashtra", phone: "+91 91323 13985", email: "contact@limelightdiamonds.com" },
  testimonials: { label: "Trust", titleLead: "Limelight", titleAccent: "Trust", items: [] },
  reservation: { label: "Need Assistance", titleLead: "Book Store", titleAccent: "Visit", text: "Find your nearest Limelight store or request a call.", panelTitle: "Need Assistance", panelText: "", hoursLabel: "Hours", phoneLabel: "Phone", groupLabel: "Visit", locationLabel: "Location", hours: "", phone: "+91 91323 13985", group: "Book Store Visit", location: "India", cta: "Request a Call" },
  blog: { label: "FAQs", titleLead: "Frequently Asked", titleAccent: "Questions", items: [] },
  newsletter: { label: "Get Personalized Updates", titleLead: "Get Personalized", titleAccent: "Updates", text: "Get updated with latest offers and products.", cta: "Subscribe", privacy: "No spam, unsubscribe anytime." },
  footer: {
    logo: "/limelight/footer-logo.png",
    logoAlt: "Limelight Lab Grown Diamonds",
    assistance: {
      label: "Need Assistance",
      links: [
        { label: "Book Store Visit", href: "/store-locator" },
        { label: "Request a Call", href: "/contact" }
      ]
    },
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Shop All", href: "/products" },
          { label: "Rings", href: "/categories/rings" },
          { label: "Earrings", href: "/categories/earrings" },
          { label: "Pendants", href: "/categories/pendants" },
          { label: "Bracelets", href: "/categories/bracelets" },
          { label: "Solitaire", href: "/categories/solitaire" }
        ]
      },
      {
        title: "About",
        links: [
          { label: "About Limelight", href: "/pages/about-us" },
          { label: "The Sustainable Diamond", href: "/pages/sustainable-diamond" },
          { label: "Contact Us", href: "/contact" },
          { label: "Store Locator", href: "/store-locator" },
          { label: "FAQ", href: "/faqs" }
        ]
      },
      {
        title: "Policies",
        links: [
          { label: "Terms & Service", href: "/p/terms" },
          { label: "Privacy Policy", href: "/p/privacy-policy" },
          { label: "Return Policy", href: "/p/return-policy" },
          { label: "Shipping Policy", href: "/p/shipping-policy" },
          { label: "Exchange / Buyback", href: "/p/exchange-buyback" }
        ]
      },
      {
        title: "Connect",
        text: [
          "501, 5th Floor, DLH Plaza Cosmos, Swami Vivekananda Rd, Andheri West, Mumbai, Maharashtra - 400058",
          "+91 91323 13985",
          "contact@limelightdiamonds.com"
        ]
      }
    ],
    copyright: "(c) 2026 Limelight Lab Grown Diamonds Ltd. All Rights Reserved."
  },
  contact: { label: "Connect", titleLead: "Contact", titleAccent: "Limelight", text: "", panelTitle: "Corporate Office", panelText: "", addressLabel: "Address", phoneLabel: "Phone", emailLabel: "Email", hoursLabel: "Hours", address: "501, 5th Floor, DLH Plaza Cosmos, Swami Vivekananda Rd, Andheri West, Mumbai, Maharashtra - 400058", phone: "+91 91323 13985", email: "contact@limelightdiamonds.com", hours: "", cta: "Contact Us" },
  defaultHome: { eyebrow: "Lab Grown Diamonds", primaryCta: "Explore Now", secondaryCta: "Find a Store", featuredLabel: "Most in Demand", featuredTitle: "Lab Grown Diamond Jewellery", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API." }
}
