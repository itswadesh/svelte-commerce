import type { ThemeHomepageContent } from '../types.js'
import { taxonomy } from '$lib/core/connectors/taxonomy'

export const defaultContent: ThemeHomepageContent = {
  description: "Discover featured products, curated collections, and a smooth shopping experience.",
  hero: {
    badge: "Featured Store",
    titleLead: "Shop",
    titleAccent: "Fresh Finds",
    titleRest: "Every Day",
    text: "Discover featured products, curated collections, and a smooth shopping experience.",
    primaryCta: "Shop Products",
    secondaryCta: `Browse ${taxonomy.many}`,
    bgText: "SHOP",
    image: "",
    imageAlt: "Store featured visual",
    stats: [],
    floatingCards: []
  },
  ticker: [],
  category: {
    label: taxonomy.many,
    titleLead: "Browse by",
    titleAccent: taxonomy.one,
    text: `Explore product ${taxonomy.manyLower} from the store catalogue.`,
    emptyTitle: `No ${taxonomy.manyLower} available`,
    emptyText: `${taxonomy.many} will appear here when they are returned by the API.`
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
  // Announcement bar above the nav; admin overrides merge over this (blank = keep default,
  // hideAnnouncement: true = bar off).
  header: {
    announcement: "Free shipping on your first order · Easy 7-day returns",
    announcementHref: "/products"
  },
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
        // Dedicated routes, not the /p/<slug> CMS variant: /p/return-policy never existed
        // and the other two duplicated a self-canonical page.
        title: "Support",
        links: [
          { label: "Contact Us", href: "/contact-us" },
          { label: "Shipping Policy", href: "/shipping-policy" },
          { label: "Refund Policy", href: "/refund-policy" },
          { label: "FAQs", href: "/faqs" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about-us" },
          { label: "Blog", href: "/blog" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms & Conditions", href: "/terms-and-conditions" }
        ]
      }
    ]
  },
  contact: { label: "Contact", titleLead: "Contact", titleAccent: "Us", text: "", panelTitle: "Let us talk", panelText: "", addressLabel: "Address", phoneLabel: "Phone", emailLabel: "Email", hoursLabel: "Working Hours", address: "", phone: "", email: "", hours: "", cta: "Send Message" },
  defaultHome: { eyebrow: "New season picks", primaryCta: "Shop Products", secondaryCta: `Browse ${taxonomy.many}`, featuredLabel: "Featured", featuredTitle: "Popular products", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API." },
  editorial: {
    hero: {
      eyebrow: "New Season",
      titleLead: "Considered goods for",
      titleAccent: "modern living",
      text: "A curated edit of pieces made to be kept — thoughtfully sourced, honestly priced, and ready to ship.",
      primaryCta: "Shop the collection",
      primaryHref: "/products",
      secondaryCta: `Explore ${taxonomy.manyLower}`,
      secondaryHref: "/products",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80&auto=format&fit=crop",
      imageAlt: "Editorial lifestyle photograph",
      note: "Free shipping on your first order · Easy 7-day returns"
    },
    marquee: ["Free shipping on your first order", "7-day easy returns", "Secure checkout", "New arrivals every week"],
    categories: {
      eyebrow: "Browse",
      title: `Shop by ${taxonomy.oneLower}`,
      viewAll: "View all",
      viewAllHref: "/products",
      tiles: [
        { label: "New Arrivals", href: "/products", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80&auto=format&fit=crop" },
        { label: "Best Sellers", href: "/products", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop" },
        { label: "Essentials", href: "/products", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80&auto=format&fit=crop" },
        { label: "The Edit", href: "/products", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80&auto=format&fit=crop" }
      ]
    },
    featured: { eyebrow: "Handpicked", title: "Featured pieces", viewAll: "View all", viewAllHref: "/products" },
    banner: {
      eyebrow: "The Lookbook",
      title: "Made to be lived in",
      text: "Pieces designed for the everyday — versatile, durable, and quietly beautiful. Discover the season's edit.",
      cta: "Discover more",
      href: "/products",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80&auto=format&fit=crop",
      imageAlt: "Lifestyle editorial photograph"
    },
    assurances: [
      { icon: "truck", title: "Free shipping", text: "On your qualifying orders" },
      { icon: "returns", title: "Easy returns", text: "7-day, hassle-free" },
      { icon: "shield", title: "Secure checkout", text: "Encrypted & protected" },
      { icon: "support", title: "Here to help", text: "Support when you need it" }
    ],
    newsletter: {
      eyebrow: "Stay in the loop",
      title: "First look, every drop",
      text: "Join for early access to new arrivals, private offers, and the occasional good idea.",
      cta: "Subscribe",
      privacy: "No spam. Unsubscribe anytime."
    }
  }
}
