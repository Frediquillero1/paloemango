import config from "@payload-config";
import { getPayload } from "payload";

// Define an array of categories, each with optional subcategories and color
const categories = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Business & Money",
    color: "#FFB347",
    slug: "business-money",
    subcategories: [
      { name: "Accounting", slug: "accounting" },
      {
        name: "Entrepreneurship",
        slug: "entrepreneurship",
      },
      { name: "Gigs & Side Projects", slug: "gigs-side-projects" },
      { name: "Investing", slug: "investing" },
      { name: "Management & Leadership", slug: "management-leadership" },
      {
        name: "Marketing & Sales",
        slug: "marketing-sales",
      },
      { name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
      { name: "Personal Finance", slug: "personal-finance" },
      { name: "Real Estate", slug: "real-estate" },
    ],
  },
  {
    name: "Software Development",
    color: "#7EC8E3",
    slug: "software-development",
    subcategories: [
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Development", slug: "mobile-development" },
      { name: "Game Development", slug: "game-development" },
      { name: "Programming Languages", slug: "programming-languages" },
      { name: "DevOps", slug: "devops" },
    ],
  },
  {
    name: "Writing & Publishing",
    color: "#D8B5FF",
    slug: "writing-publishing",
    subcategories: [
      { name: "Fiction", slug: "fiction" },
      { name: "Non-Fiction", slug: "non-fiction" },
      { name: "Blogging", slug: "blogging" },
      { name: "Copywriting", slug: "copywriting" },
      { name: "Self-Publishing", slug: "self-publishing" },
    ],
  },
  {
    name: "Other",
    slug: "other",
  },
  {
    name: "Education",
    color: "#FFE066",
    slug: "education",
    subcategories: [
      { name: "Online Courses", slug: "online-courses" },
      { name: "Tutoring", slug: "tutoring" },
      { name: "Test Preparation", slug: "test-preparation" },
      { name: "Language Learning", slug: "language-learning" },
    ],
  },
  {
    name: "Self Improvement",
    color: "#96E6B3",
    slug: "self-improvement",
    subcategories: [
      { name: "Productivity", slug: "productivity" },
      { name: "Personal Development", slug: "personal-development" },
      { name: "Mindfulness", slug: "mindfulness" },
      { name: "Career Growth", slug: "career-growth" },
    ],
  },
  {
    name: "Fitness & Health",
    color: "#FF9AA2",
    slug: "fitness-health",
    subcategories: [
      { name: "Workout Plans", slug: "workout-plans" },
      { name: "Nutrition", slug: "nutrition" },
      { name: "Mental Health", slug: "mental-health" },
      { name: "Yoga", slug: "yoga" },
    ],
  },
  {
    name: "Design",
    color: "#B5B9FF",
    slug: "design",
    subcategories: [
      { name: "UI/UX", slug: "ui-ux" },
      { name: "Graphic Design", slug: "graphic-design" },
      { name: "3D Modeling", slug: "3d-modeling" },
      { name: "Typography", slug: "typography" },
    ],
  },
  {
    name: "Drawing & Painting",
    color: "#FFCAB0",
    slug: "drawing-painting",
    subcategories: [
      { name: "Watercolor", slug: "watercolor" },
      { name: "Acrylic", slug: "acrylic" },
      { name: "Oil", slug: "oil" },
      { name: "Pastel", slug: "pastel" },
      { name: "Charcoal", slug: "charcoal" },
    ],
  },
  {
    name: "Music",
    color: "#FFD700",
    slug: "music",
    subcategories: [
      { name: "Songwriting", slug: "songwriting" },
      { name: "Music Production", slug: "music-production" },
      { name: "Music Theory", slug: "music-theory" },
      { name: "Music History", slug: "music-history" },
    ],
  },
  {
    name: "Photography",
    color: "#FF6B6B",
    slug: "photography",
    subcategories: [
      { name: "Portrait", slug: "portrait" },
      { name: "Landscape", slug: "landscape" },
      { name: "Street Photography", slug: "street-photography" },
      { name: "Nature", slug: "nature" },
      { name: "Macro", slug: "macro" },
    ],
  },
];

// seed - Seeds the database with the predefined categories and their subcategories
const seed = async () => {
  const payload = await getPayload({ config }); // Initialize Payload with the given config

  // Create admin tenant
  // This is the root tenant used to isolate super-admin resources.
  // All system-level or tenant-agnostic features should be scoped under this tenant.
  const adminTenant = await payload.create({
    collection: "tenants",
    data: {
      name: "admin", // Human-readable name of the tenant
      slug: "admin", // Used for routing or subdomain mapping
      stripeAccountId: "admin", // Placeholder Stripe account ID for the admin tenant
    },
  });

  // Create admin user
  // This user acts as the global super-admin for the platform.
  // Has elevated privileges and is linked to the admin tenant for top-level access.
  await payload.create({
    collection: "users",
    data: {
      email: "admin@demo.com", // Admin's login email
      password: "demo", // Admin's initial password (should be updated in production)
      roles: ["super-admin"], // Assign the highest-level role for unrestricted access
      username: "admin", // Username used for internal identification or display
      tenants: [
        {
          tenant: adminTenant.id, // Link the admin user to the admin tenant
        },
      ],
    },
  });

  // Loop through top-level categories
  for (const category of categories) {
    // Create the parent category entry
    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        color: category.color,
        parent: null, // Top-level category has no parent
      },
    });

    // If there are subcategories, create them and link to parent
    for (const subcategory of category.subcategories || []) {
      await payload.create({
        collection: "categories",
        data: {
          name: subcategory.name,
          slug: subcategory.slug,
          parent: parentCategory.id, // Link subcategory to parent
        },
      });
    }
  }
};

try {
  await seed(); // Run the seed function to populate the database
  console.log("Seeding completed successfully"); // Log success message
  process.exit(0); // Exit process with success code
} catch (error) {
  console.log("Error during seeding", error); // Log the error that occurred during seeding
  process.exit(1); // Exit process with failure code
}