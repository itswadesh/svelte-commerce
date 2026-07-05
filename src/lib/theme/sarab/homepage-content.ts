import { defaultContent } from '../default/homepage-content.js'
import type { ThemeHomepageContent } from '../types.js'

export const sarabContent: ThemeHomepageContent = {
  ...defaultContent,
  brandName: "Sarab",
  description: "Experience bold flavors crafted from premium ingredients. From crispy burgers to gourmet pizzas, every bite is made to be remembered.",
  seoTitle: "Sarab - Fast Food & Restaurant | Order Now",
  seoImage: "/sarab/banner-img.jpg",
  hero: {
    badge: "#1 Rated Fast Food Restaurant in New York",
    titleLead: "Delicious",
    titleAccent: "Fast Food",
    titleRest: "for Every Moment",
    text: "Experience bold flavors crafted from premium ingredients. From crispy burgers to gourmet pizzas, every bite is an adventure worth savoring.",
    primaryCta: "Explore Menu",
    secondaryCta: "Watch Our Story",
    bgText: "FOOD",
    image: "/sarab/banner-img.jpg",
    imageAlt: "Sarab signature burger",
    stats: [
      { value: "850", suffix: "+", label: "Happy Customers" },
      { value: "120", suffix: "+", label: "Menu Items" },
      { value: "15", suffix: "+", label: "Expert Chefs" },
      { value: "12", suffix: "yr", label: "Experience" }
    ],
    floatingCards: [
      { tone: "r", icon: "flame", title: "Hot Deal", text: "30% off today" },
      { tone: "y", icon: "star", title: "4.9/5", text: "2k+ reviews" },
      { tone: "g", icon: "clock", title: "20 min", text: "Fast delivery" }
    ]
  },
  ticker: ["Crispy Fried Chicken", "Gourmet Burgers", "Artisan Pizzas", "Fresh Wraps & Rolls", "Loaded Fries", "Ice Cream Shakes", "Grilled Sandwiches"],
  category: {
    label: "What We Offer",
    titleLead: "Browse by",
    titleAccent: "Category",
    text: "From sizzling burgers to exotic world cuisines - find your favourite in our menu",
    emptyTitle: "No categories available",
    emptyText: "Categories will appear here when they are returned by the API."
  },
  about: {
    label: "Our Story",
    titleLead: "We Invite You to Visit Our",
    titleAccent: "Food Restaurant",
    text: "Founded in 2012, Sarab began as a small corner joint with a big dream - to serve food that brings people together. Today we're proud to serve thousands of happy customers every week with the same passion that started it all.",
    primaryImage: "/sarab/about1.jpg",
    secondaryImage: "/sarab/about2.jpg",
    primaryImageAlt: "Sarab restaurant table spread",
    secondaryImageAlt: "Fresh Sarab dish",
    experienceValue: "12+",
    experienceText: "Years of Excellence",
    cta: "View full menu",
    features: [
      { tone: "r", icon: "leaf", title: "100% Fresh Ingredients", text: "We source locally and sustainably. Every ingredient is hand-picked daily for maximum freshness." },
      { tone: "y", icon: "award", title: "Award-Winning Recipes", text: "Our signature recipes have won national culinary awards 5 years in a row." },
      { tone: "g", icon: "zap", title: "Lightning-Fast Delivery", text: "Order online and get hot, fresh food at your door in under 25 minutes, guaranteed." }
    ]
  },
  menu: { label: "What's Cooking", titleLead: "Our Delicious", titleAccent: "Menu", emptyTitle: "No products available", emptyText: "Menu items will appear here when products are returned by the API.", cta: "Order from menu" },
  special: {
    label: "Limited Time Offer",
    titleLead: "Get 30% Off on",
    titleAccent: "Signature Burger",
    text: "Stack a fresh burger, loaded fries, and a premium shake into one quick combo while the kitchen timer is running.",
    cta: "Grab the deal",
    image: "/sarab/off-img.jpg",
    imageAlt: "Sarab weekend burger combo",
    oldPrice: "$24.99",
    price: "$17.49"
  },
  gallery: {
    label: "Our Gallery",
    titleLead: "Food That",
    titleAccent: "Looks Good",
    items: [
      { image: "/sarab/portfolio/work1.jpg", title: "Signature Burger" },
      { image: "/sarab/portfolio/work2.jpg", title: "Crispy Chicken" },
      { image: "/sarab/portfolio/work3.jpg", title: "Artisan Pizza" },
      { image: "/sarab/portfolio/work4.jpg", title: "Fresh Wraps" },
      { image: "/sarab/portfolio/work5.jpg", title: "Sweet Desserts" }
    ]
  },
  history: {
    label: "Our Journey",
    titleLead: "Restaurant",
    titleAccent: "History",
    items: [
      ["2012", "Humble Beginning", "Sarab opened as a tiny corner restaurant with a bold fast-food dream."],
      ["2016", "Signature Menu", "Our award-winning burgers, pizzas, and house sauces became local favorites."],
      ["2020", "Delivery Era", "We expanded online ordering with lightning-fast delivery and pickup."],
      ["2026", "Modern Restaurant", "Sarab now serves thousands of happy customers with the same handmade care."]
    ]
  },
  chefs: {
    label: "Expert Team",
    titleLead: "Meet Our",
    titleAccent: "Chefs",
    items: [
      { name: "Marco Bellini", role: "Executive Chef", image: "/sarab/chefs/1.jpg" },
      { name: "Ava Johnson", role: "Pastry Chef", image: "/sarab/chefs/2.jpg" },
      { name: "Kenji Mori", role: "Grill Master", image: "/sarab/chefs/3.jpg" },
      { name: "Sofia Green", role: "Sauce Specialist", image: "/sarab/chefs/4.jpg" }
    ]
  },
  hours: {
    label: "Opening Hours",
    titleLead: "We're Open",
    titleAccent: "For You",
    rows: [
      ["Monday - Tuesday", "Closed", false],
      ["Wednesday - Thursday", "09:00 AM - 10:00 PM", true],
      ["Friday", "09:00 AM - 11:00 PM", true],
      ["Saturday", "10:00 AM - 11:30 PM", true],
      ["Sunday", "11:00 AM - 09:00 PM", true]
    ],
    orderTitle: "Order Online",
    orderText: "Get hot food delivered in 25 minutes",
    orderCta: "Order Now",
    locationTitle: "Find Us",
    address: "42 Flavor Street, NY",
    phone: "+1 (800) 123-4567",
    email: "hello@sarabfood.com"
  },
  testimonials: {
    label: "Testimonials",
    titleLead: "What People",
    titleAccent: "Say",
    items: [
      { name: "Monica Wilber", role: "Regular Customer", image: "/sarab/testimonial/1.jpg", text: "The smash burger has crisp edges, a juicy center, and just enough heat. It has become our Friday night ritual." },
      { name: "Cameron Fox", role: "Food Blogger", image: "/sarab/testimonial/2.jpg", text: "Delivery arrived fast and everything was still hot. The portions are generous and the flavors feel properly crafted." },
      { name: "Priya Sharma", role: "Food Enthusiast", image: "/sarab/testimonial/3.jpg", text: "The truffle pasta was a surprise in the best way. Great service, bright flavors, and a menu that makes you want to return." }
    ]
  },
  reservation: {
    label: "Book a Table",
    titleLead: "Make a",
    titleAccent: "Reservation",
    text: "Reserve your table for a memorable dining experience. We recommend booking 24 hours in advance for weekend evenings.",
    panelTitle: "Contact Info",
    panelText: "We're happy to help you plan the perfect dining experience.",
    hoursLabel: "Opening Hours",
    phoneLabel: "Call for Booking",
    groupLabel: "Group Dining",
    locationLabel: "Location",
    hours: "Wed - Sun, 9 AM - 11 PM",
    phone: "+1 (800) 123-4567",
    group: "Special menus for 10+ guests",
    location: "42 Flavor Street, NY",
    cta: "Confirm Reservation"
  },
  blog: {
    label: "News & Updates",
    titleLead: "Our Latest",
    titleAccent: "Blog Posts",
    items: [
      { tag: "Food & Health", title: "Healthy Fast Food: A Myth or Beautiful Reality", date: "14", month: "Mar", image: "/sarab/blog/1.jpg" },
      { tag: "Food Science", title: "Is Fast Food Getting Healthier? Here's What We Found", date: "28", month: "Feb", image: "/sarab/blog/2.jpg" },
      { tag: "Recipes", title: "Innovative Hot Chickpeas Flake Crackin' Recipe at Home", date: "05", month: "Jan", image: "/sarab/blog/3.jpg" }
    ]
  },
  newsletter: { label: "Stay Connected", titleLead: "Subscribe & Get Exclusive", titleAccent: "Deals", text: "Get 15% off your first order plus early access to new menu items", cta: "Subscribe", privacy: "No spam, unsubscribe anytime." },
  footer: {
    columns: [
      {
        title: "Menu",
        links: [
          { label: "Order Online", href: "/products" },
          { label: "Categories", href: "/categories" },
          { label: "Special Offers", href: "/collections" }
        ]
      },
      {
        title: "Restaurant",
        links: [
          { label: "About Sarab", href: "/p/about-us" },
          { label: "Contact", href: "/p/contact-us" },
          { label: "Reservations", href: "/p/reservations" }
        ]
      },
      {
        title: "Visit",
        text: ["42 Flavor Street, Manhattan, New York, NY 10001", "+1 (800) 123-4567", "hello@sarabfood.com"]
      }
    ]
  },
  contact: {
    label: "Get In Touch",
    titleLead: "Contact",
    titleAccent: "Us",
    text: "Have a question, feedback, or want to plan a special event? We'd love to hear from you.",
    panelTitle: "Let's Talk",
    panelText: "We typically respond within 2 hours during business hours.",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Working Hours",
    address: "42 Flavor Street, Manhattan, New York, NY 10001",
    phone: "+1 (800) 123-4567",
    email: "hello@sarabfood.com",
    hours: "Wed - Sun: 9 AM - 11 PM",
    cta: "Send Message"
  }
}
