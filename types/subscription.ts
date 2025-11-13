export type SubscriptionFrequency = "weekly" | "monthly" | "yearly";

export interface Subscription {
  id: string;
  name: string;
  description: string;
  icon: string;
  amount: number;
  frequency: SubscriptionFrequency;
  startDate: string; // ISO string
  nextBillingDate: string; // ISO string
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  color?: string; // For UI styling
}

export interface CreateSubscriptionInput {
  name: string;
  description: string;
  icon: string;
  amount: number;
  frequency: SubscriptionFrequency;
  startDate: string;
  color?: string;
}

export interface SubscriptionType {
  id: string;
  label: string;
  icon: string;
  color: string;
  category: "streaming" | "software" | "cloud" | "productivity" | "social" | "fitness" | "music" | "gaming" | "news" | "other";
}

// Predefined subscription types with icons and colors
export const SUBSCRIPTION_TYPES: SubscriptionType[] = [
  // Streaming Services
  {
    id: "netflix",
    label: "Netflix",
    icon: "netflix",
    color: "#E50914",
    category: "streaming",
  },
  {
    id: "hbo",
    label: "HBO Max",
    icon: "hbo",
    color: "#8B5CF6",
    category: "streaming",
  },
  {
    id: "disney-plus",
    label: "Disney+",
    icon: "disney",
    color: "#113CCF",
    category: "streaming",
  },
  {
    id: "amazon-prime",
    label: "Amazon Prime",
    icon: "amazon",
    color: "#FF9900",
    category: "streaming",
  },
  {
    id: "youtube-premium",
    label: "YouTube Premium",
    icon: "youtube",
    color: "#FF0000",
    category: "streaming",
  },
  {
    id: "hulu",
    label: "Hulu",
    icon: "hulu",
    color: "#1CE783",
    category: "streaming",
  },
  
  // Software & Productivity
  {
    id: "chatgpt",
    label: "ChatGPT Plus",
    icon: "robot",
    color: "#10A37F",
    category: "software",
  },
  {
    id: "github",
    label: "GitHub Pro",
    icon: "github",
    color: "#24292F",
    category: "software",
  },
  {
    id: "linkedin",
    label: "LinkedIn Premium",
    icon: "linkedin",
    color: "#0A66C2",
    category: "social",
  },
  {
    id: "microsoft-365",
    label: "Microsoft 365",
    icon: "microsoft-office",
    color: "#0078D4",
    category: "productivity",
  },
  {
    id: "adobe-creative",
    label: "Adobe Creative",
    icon: "adobe",
    color: "#FF0000",
    category: "software",
  },
  {
    id: "figma",
    label: "Figma",
    icon: "figma",
    color: "#F24E1E",
    category: "software",
  },
  
  // Cloud Storage
  {
    id: "google-drive",
    label: "Google Drive",
    icon: "google-drive",
    color: "#4285F4",
    category: "cloud",
  },
  {
    id: "dropbox",
    label: "Dropbox",
    icon: "dropbox",
    color: "#0061FF",
    category: "cloud",
  },
  {
    id: "icloud",
    label: "iCloud",
    icon: "apple-icloud",
    color: "#007AFF",
    category: "cloud",
  },
  
  // Music & Audio
  {
    id: "spotify",
    label: "Spotify",
    icon: "spotify",
    color: "#1DB954",
    category: "music",
  },
  {
    id: "apple-music",
    label: "Apple Music",
    icon: "apple",
    color: "#FA243C",
    category: "music",
  },
  {
    id: "audible",
    label: "Audible",
    icon: "book-open-variant",
    color: "#FF9500",
    category: "music",
  },
  
  // Fitness & Health
  {
    id: "gym",
    label: "Gym Membership",
    icon: "dumbbell",
    color: "#FF6B35",
    category: "fitness",
  },
  {
    id: "fitness-app",
    label: "Fitness App",
    icon: "heart-pulse",
    color: "#FF3B30",
    category: "fitness",
  },
  
  // Gaming
  {
    id: "xbox-gamepass",
    label: "Xbox Game Pass",
    icon: "microsoft-xbox",
    color: "#107C10",
    category: "gaming",
  },
  {
    id: "playstation-plus",
    label: "PlayStation Plus",
    icon: "sony-playstation",
    color: "#003791",
    category: "gaming",
  },
  {
    id: "nintendo-online",
    label: "Nintendo Online",
    icon: "nintendo-switch",
    color: "#E60012",
    category: "gaming",
  },
  
  // News & Media
  {
    id: "medium",
    label: "Medium",
    icon: "newspaper-variant",
    color: "#000000",
    category: "news",
  },
  {
    id: "newspaper",
    label: "Newspaper",
    icon: "newspaper",
    color: "#4A5568",
    category: "news",
  },
  
  // Other
  {
    id: "food-delivery",
    label: "Food Delivery",
    icon: "food-fork-drink",
    color: "#FF6B35",
    category: "other",
  },
  {
    id: "vpn",
    label: "VPN Service",
    icon: "shield-check",
    color: "#6366F1",
    category: "software",
  },
  {
    id: "custom",
    label: "Custom",
    icon: "cog",
    color: "#6B7280",
    category: "other",
  },
];

// Helper function to get subscription type by id
export const getSubscriptionType = (id: string): SubscriptionType | undefined => {
  return SUBSCRIPTION_TYPES.find(type => type.id === id);
};

// Helper function to calculate next billing date
export const calculateNextBillingDate = (startDate: Date, frequency: SubscriptionFrequency): Date => {
  const nextDate = new Date(startDate);
  
  switch (frequency) {
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;  
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
};

// Helper function to get frequency display text
export const getFrequencyText = (frequency: SubscriptionFrequency): string => {
  switch (frequency) {
    case "weekly":
      return "per week";
    case "monthly":
      return "per month";
    case "yearly":
      return "per year";
  }
};