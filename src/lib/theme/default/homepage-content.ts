import type { ThemeHomepageContent } from '../types.js'

export const defaultContent: ThemeHomepageContent = {
  description: "Discover featured products, curated collections, and a smooth shopping experience.",
  hero: {
    badge: "Featured Store",
    titleLead: "Shop",
    titleAccent: "Fresh Finds",
    titleRest: "Every Day",
    text: "Discover featured products, curated collections, and a smooth shopping experience.",
    primaryCta: "Shop Products",
    secondaryCta: "Browse Categories",
    bgText: "SHOP",
    image: "",
    imageAlt: "Store featured visual",
    stats: [],
    floatingCards: []
  },
  ticker: [],
  category: {
    label: "Categories",
    titleLead: "Browse by",
    titleAccent: "Category",
    text: "Explore product categories from the store catalogue.",
    emptyTitle: "No categories available",
    emptyText: "Categories will appear here when they are returned by the API."
  },
  about: {
    label: "About",
    titleLead: "About",
    titleAccent: "Our Store",
    text: "A modern ecommerce storefront for curated products, smooth browsing, and secure checkout.",
    primaryImage: "",
    secondaryImage: "",
    primaryImageAlt: "Store image",
    secondaryImageAlt: "Store detail",
    experienceValue: "",
    experienceText: "",
    cta: "Shop Now",
    features: []
  },
  menu: { label: "Featured", titleLead: "Popular", titleAccent: "Products", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API.", cta: "Shop products" },
  special: { label: "Offer", titleLead: "Featured", titleAccent: "Deal", text: "", cta: "Shop offer", image: "", imageAlt: "Featured offer", oldPrice: "", price: "" },
  gallery: { label: "Gallery", titleLead: "Featured", titleAccent: "Looks", items: [] },
  history: { label: "Story", titleLead: "Our", titleAccent: "Journey", items: [] },
  chefs: { label: "Team", titleLead: "Meet Our", titleAccent: "Team", items: [] },
  hours: { label: "Hours", titleLead: "We Are", titleAccent: "Open", rows: [], orderTitle: "Order Online", orderText: "", orderCta: "Shop Now", locationTitle: "Find Us", address: "", phone: "", email: "" },
  testimonials: { label: "Testimonials", titleLead: "What People", titleAccent: "Say", items: [] },
  reservation: { label: "Contact", titleLead: "Get in", titleAccent: "Touch", text: "", panelTitle: "Contact Info", panelText: "", hoursLabel: "Opening Hours", phoneLabel: "Phone", groupLabel: "Group", locationLabel: "Location", hours: "", phone: "", group: "", location: "", cta: "Submit" },
  blog: { label: "Updates", titleLead: "Latest", titleAccent: "News", items: [] },
  newsletter: { label: "Stay Connected", titleLead: "Subscribe for", titleAccent: "Updates", text: "Subscribe for new arrivals, offers, and store updates.", cta: "Subscribe", privacy: "No spam, unsubscribe anytime." },
  footer: {
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Products", href: "/products" },
          { label: "Collections", href: "/collections" },
          { label: "Categories", href: "/categories" }
        ]
      },
      {
        title: "Support",
        links: [
          { label: "Contact Us", href: "/p/contact-us" },
          { label: "Shipping Policy", href: "/p/shipping-policy" },
          { label: "Return Policy", href: "/p/return-policy" }
        ]
      }
    ]
  },
  contact: { label: "Contact", titleLead: "Contact", titleAccent: "Us", text: "", panelTitle: "Let us talk", panelText: "", addressLabel: "Address", phoneLabel: "Phone", emailLabel: "Email", hoursLabel: "Working Hours", address: "", phone: "", email: "", hours: "", cta: "Send Message" },
  defaultHome: { eyebrow: "New season picks", primaryCta: "Shop Products", secondaryCta: "Browse Categories", featuredLabel: "Featured", featuredTitle: "Popular products", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API." }
}
