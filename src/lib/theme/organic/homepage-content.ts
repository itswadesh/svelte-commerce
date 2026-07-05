import { defaultContent } from '../default/homepage-content.js'
import type { ThemeHomepageContent } from '../types.js'

export const organicContent: ThemeHomepageContent = {
  ...defaultContent,
  brandName: "Organic",
  description: "Fresh organic foods delivered to your doorstep. Shop from 14k+ product varieties with free delivery on orders over $50.",
  seoTitle: "Organic - Fresh Organic Foods at Your Doorsteps",
  hero: {
    badge: "100% Organic & Natural",
    titleLead: "Organic Foods",
    titleAccent: "at your",
    titleRest: "Doorsteps",
    text: "Shop fresh, certified organic groceries from local farms. Fruits, vegetables, dairy, and pantry essentials delivered fresh to your home.",
    primaryCta: "Start Shopping",
    secondaryCta: "Join Now",
    bgText: "ORGANIC",
    image: "",
    imageAlt: "Fresh organic groceries",
    stats: [
      { value: "14k", suffix: "+", label: "Product Varieties" },
      { value: "50k", suffix: "+", label: "Happy Customers" },
      { value: "1.2k", suffix: "+", label: "Stores Nationwide" },
      { value: "99", suffix: "%", label: "Satisfaction Rate" }
    ],
    floatingCards: [
      { tone: "g", icon: "flame", title: "Fresh Daily", text: "Farm to table" },
      { tone: "y", icon: "star", title: "4.9/5", text: "50k+ reviews" },
      { tone: "g", icon: "clock", title: "Same Day", text: "Free delivery" }
    ]
  },
  ticker: ["Fresh Fruits", "Organic Vegetables", "Dairy & Eggs", "Whole Grains", "Natural Juices", "Organic Snacks", "Farm Fresh Meat"],
  category: {
    label: "Category",
    titleLead: "Browse by",
    titleAccent: "Category",
    text: "Explore our wide range of organic product categories",
    emptyTitle: "No categories available",
    emptyText: "Categories will appear here when they are returned by the API."
  },
  about: {
    label: "About Us",
    titleLead: "Why Choose",
    titleAccent: "Organic",
    text: "We partner directly with certified organic farms to bring you the freshest, healthiest produce. Every product is carefully selected to meet our strict quality standards.",
    primaryImage: "",
    secondaryImage: "",
    primaryImageAlt: "Organic farm",
    secondaryImageAlt: "Fresh produce",
    experienceValue: "10+",
    experienceText: "Years of Organic Excellence",
    cta: "Learn More",
    features: [
      { tone: "g", icon: "leaf", title: "Farm Fresh", text: "Sourced directly from certified organic farms every morning." },
      { tone: "y", icon: "award", title: "100% Organic", text: "All products are certified organic and chemical-free." },
      { tone: "g", icon: "zap", title: "Fast Delivery", text: "Same-day delivery available for orders placed before noon." }
    ]
  },
  menu: { label: "Best Selling", titleLead: "Best Selling", titleAccent: "Products", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API.", cta: "View all products" },
  special: {
    label: "Special Offer",
    titleLead: "Get 25% Off",
    titleAccent: "First Purchase",
    text: "Sign up today and get 25% discount on your first order. Fresh organic produce delivered to your door.",
    cta: "Claim Offer",
    image: "",
    imageAlt: "Special organic offer",
    oldPrice: "",
    price: ""
  },
  gallery: { label: "Gallery", titleLead: "Fresh", titleAccent: "Produce", items: [] },
  history: { label: "Story", titleLead: "Our", titleAccent: "Journey", items: [] },
  chefs: { label: "Team", titleLead: "Our", titleAccent: "Farmers", items: [] },
  hours: { label: "Delivery Hours", titleLead: "We Deliver", titleAccent: "Daily", rows: [], orderTitle: "Order Online", orderText: "Fresh delivery every day", orderCta: "Shop Now", locationTitle: "Find Us", address: "", phone: "", email: "" },
  testimonials: { label: "Testimonials", titleLead: "What Our", titleAccent: "Customers Say", items: [] },
  reservation: { label: "Contact", titleLead: "Get in", titleAccent: "Touch", text: "", panelTitle: "Contact Info", panelText: "", hoursLabel: "Delivery Hours", phoneLabel: "Phone", groupLabel: "Bulk Orders", locationLabel: "Location", hours: "", phone: "", group: "", location: "", cta: "Submit" },
  blog: { label: "Our Blog", titleLead: "Recent", titleAccent: "Blog Posts", items: [] },
  newsletter: { label: "Stay Connected", titleLead: "Get 25% Discount on", titleAccent: "First Purchase", text: "Subscribe to our newsletter for exclusive deals and fresh arrivals.", cta: "Subscribe", privacy: "No spam, unsubscribe anytime." },
  footer: {
    columns: [
      {
        title: "Organic Shop",
        links: [
          { label: "Fresh Products", href: "/products" },
          { label: "Categories", href: "/categories" },
          { label: "New Arrivals", href: "/collections/new-arrivals" }
        ]
      },
      {
        title: "Help",
        links: [
          { label: "Contact Us", href: "/p/contact-us" },
          { label: "Delivery Info", href: "/p/shipping-policy" },
          { label: "Returns", href: "/p/return-policy" }
        ]
      }
    ]
  },
  contact: { label: "Contact", titleLead: "Contact", titleAccent: "Us", text: "", panelTitle: "Reach Out", panelText: "", addressLabel: "Address", phoneLabel: "Phone", emailLabel: "Email", hoursLabel: "Delivery Hours", address: "", phone: "", email: "", hours: "", cta: "Send Message" },
  defaultHome: { eyebrow: "Fresh & Organic", primaryCta: "Start Shopping", secondaryCta: "Browse Categories", featuredLabel: "Best Selling", featuredTitle: "Popular Products", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API." }
}
