import { defaultContent } from '../default/homepage-content.js'
import type { ThemeHomepageContent } from '../types.js'

export const noorContent: ThemeHomepageContent = {
  ...defaultContent,
  brandName: "Noor",
  description: "Premium Indian designer wear with refined unstitched, luxury pret, and ready-to-wear collections.",
  seoTitle: "Noor - Indian Designer Dresses, Luxury Pret & Unstitched",
  seoImage: "/noor/hero.jpg",
  hero: {
    badge: "Premium Indian Designer Wear",
    titleLead: "New",
    titleAccent: "Arrivals",
    titleRest: "by Noor",
    text: "Explore refined occasion wear, embroidered unstitched suits, luxury pret, and ready-to-wear pieces.",
    primaryCta: "Shop New Arrivals",
    secondaryCta: "Explore Collections",
    bgText: "Noor",
    image: "/noor/hero.jpg",
    imageAlt: "Noor new collection campaign",
    stats: [],
    floatingCards: []
  },
  ticker: ["Unstitched", "Luxury Pret", "Pret", "New Arrivals", "Formals", "Ready to Wear", "Sale"],
  category: {
    label: "Shop by Category",
    titleLead: "Shop by",
    titleAccent: "Category",
    text: "Curated silhouettes for festive, formal, and everyday refined dressing.",
    emptyTitle: "No categories available",
    emptyText: "Categories will appear here when they are returned by the API."
  },
  about: {
    ...defaultContent.about,
    label: "About Noor",
    titleLead: "Indian Designer",
    titleAccent: "Wear",
    text: "Noor blends ornate embroidery, premium fabrics, and feminine silhouettes into collections designed for modern occasion dressing.",
    primaryImage: "/noor/spotted-zarnab.jpg",
    secondaryImage: "/noor/spotted-alizeh.jpg",
    primaryImageAlt: "Noor styled editorial",
    secondaryImageAlt: "Noor occasion wear editorial",
    cta: "Discover More"
  },
  menu: {
    label: "New Arrivals",
    titleLead: "New",
    titleAccent: "Arrivals",
    emptyTitle: "No products available",
    emptyText: "Products will appear here when they are returned by the API.",
    cta: "Shop all"
  },
  special: {
    label: "Featured Campaign",
    titleLead: "Premium Indian",
    titleAccent: "Designer Dress",
    text: "An editorial campaign for elevated seasonal dressing.",
    cta: "Shop Campaign",
    image: "/noor/single-banner.jpg",
    imageAlt: "Noor premium Indian designer dress campaign",
    oldPrice: "",
    price: ""
  },
  newsletter: {
    label: "Stay Connected",
    titleLead: "Subscribe for",
    titleAccent: "New Arrivals",
    text: "Get early access to new collections, restocks, and Noor updates.",
    cta: "Subscribe",
    privacy: "No spam, unsubscribe anytime."
  },
  footer: {
    logo: "/noor/logo.png",
    logoAlt: "Noor",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "New Arrivals", href: "/products" },
          { label: "Unstitched", href: "/categories/unstitched" },
          { label: "Luxury Pret", href: "/categories/luxury-pret" },
          { label: "Pret", href: "/categories/pret" }
        ]
      },
      {
        title: "Customer Care",
        links: [
          { label: "Contact Us", href: "/p/contact-us" },
          { label: "Shipping Policy", href: "/p/shipping-policy" },
          { label: "Exchange Policy", href: "/p/exchange-policy" },
          { label: "Privacy Policy", href: "/p/privacy-policy" }
        ]
      },
      {
        title: "Follow",
        links: [
          { label: "Instagram", href: "/" },
          { label: "Facebook", href: "/" }
        ]
      }
    ]
  },
  contact: {
    ...defaultContent.contact,
    label: "Customer Care",
    titleLead: "Contact",
    titleAccent: "Noor",
    text: "Reach out for order, shipping, or styling assistance.",
    address: "Delhi, India",
    phone: "+91",
    email: "care@noor.in"
  },
  defaultHome: {
    eyebrow: "Premium Indian Designer Wear",
    primaryCta: "Shop New Arrivals",
    secondaryCta: "Explore Collections",
    featuredLabel: "New Arrivals",
    featuredTitle: "Noor Designer Wear",
    emptyTitle: "No products available",
    emptyText: "Products will appear here when they are returned by the API."
  }
}
