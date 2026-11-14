import { ChartNoAxesCombined, ShoppingBag, User } from "lucide-react";

export const topSummaryData = [
  {
    value: "2,20,000",
    title: "Total Users",
    icon: User,
  },
  {
    value: "12,300",
    title: "Total Orders",
    icon: ShoppingBag,
  },
  {
    value: "€ 323435",
    title: "Total Revenue",
    icon: ChartNoAxesCombined,
  },
  {
    value: "1000",
    title: "New Users This Month",
    icon: User,
  },
];

export const userOverviewData = [
  {
    value: "2,20,000",
    title: "Total Users",
    icon: User,
  },

  {
    value: "1000",
    title: "New Users This Month",
    icon: User,
  },
];

export const userMngData = [
  {
    id: "u001",
    username: "john_doe",
    email: "john@example.com",
    book_created: 12,
    ongoing_order: 3,
  },
  {
    id: "u002",
    username: "sara_ahmed",
    email: "sara@example.com",
    book_created: 5,
    ongoing_order: 1,
  },
  {
    id: "u003",
    username: "michael_smith",
    email: "michael@example.com",
    book_created: 20,
    ongoing_order: 7,
  },
  {
    id: "u004",
    username: "emily_brown",
    email: "emily@example.com",
    book_created: 7,
    ongoing_order: 0,
  },
  {
    id: "u005",
    username: "david_lee",
    email: "david@example.com",
    book_created: 11,
    ongoing_order: 2,
  },
  {
    id: "u006",
    username: "fatima_khan",
    email: "fatima@example.com",
    book_created: 3,
    ongoing_order: 1,
  },
  {
    id: "u007",
    username: "kevin_jones",
    email: "kevin@example.com",
    book_created: 17,
    ongoing_order: 4,
  },
  {
    id: "u008",
    username: "olivia_martin",
    email: "olivia@example.com",
    book_created: 9,
    ongoing_order: 2,
  },
  {
    id: "u009",
    username: "liam_wilson",
    email: "liam@example.com",
    book_created: 6,
    ongoing_order: 1,
  },
  {
    id: "u010",
    username: "sophia_clark",
    email: "sophia@example.com",
    book_created: 14,
    ongoing_order: 5,
  },
];

export const mockUser = {
  firstName: "Sourav",
  lastName: "Biebar",
  email: "rafioulhasan2@gmail.com",
  role: "USER",
};

export const sampleBook = {
  id: "ORD_9f3a12c7",
  bookName: "Adventures of Little Hero",
  childName: "Arif",
  childGender: "Male",
  childAge: 6,
  chapter: 12,
  bookPrice: 1200,
  shippingCost: 150,
  totalCost: 1350,
  orderId: "BH-2025-0001",
  status: "Pending",
};

export const customOrders = [
  {
    id: "#3472234",
    title: "The adventure of Rakib to the amazon jungle",
    name: "Rakib",
    age: 11,
    pages: 20,
    language: "English",
    orderDate: "10-12-2025",
    status: "Shipped",
    price: 30.0,
    currency: "€",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#123456",
    title: "The Great Adventure",
    name: "John",
    age: 25,
    pages: 150,
    language: "English",
    orderDate: "15-01-2024",
    status: "Delivered",
    price: 45.99,
    currency: "$",
    image:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#789012",
    title: "Learning React",
    name: "Sarah",
    age: 30,
    pages: 300,
    language: "Spanish",
    orderDate: "20-01-2024",
    status: "Processing",
    price: 29.99,
    currency: "€",
    image:
      "https://images.unsplash.com/photo-1581091215364-142d1f4d7b9e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#345678",
    title: "Mystery of the Lost City",
    name: "Alex",
    age: 28,
    pages: 220,
    language: "French",
    orderDate: "05-02-2024",
    status: "Cancelled",
    price: 35.5,
    currency: "£",
    image:
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#901234",
    title: "Space Exploration Guide",
    name: "Michael",
    age: 35,
    pages: 180,
    language: "German",
    orderDate: "12-03-2024",
    status: "Shipped",
    price: 42.75,
    currency: "$",
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=400&q=80",
  },
];

export const orderMngData = [
  {
    id: "1",
    username: "alice_w",
    email: "alice@example.com",
    book_type: "Fiction",
    price: 25.5,
    order_id: "#ORD1001",
    status: "Pending",
  },
  {
    id: "2",
    username: "bob_smith",
    email: "bob@example.com",
    book_type: "Science",
    price: 40,
    order_id: "#ORD1002",
    status: "Shipped",
  },
  {
    id: "3",
    username: "charlie_m",
    email: "charlie@example.com",
    book_type: "Biography",
    price: 30,
    order_id: "#ORD1003",
    status: "Delivered",
  },
  {
    id: "4",
    username: "diana_r",
    email: "diana@example.com",
    book_type: "Fantasy",
    price: 28.75,
    order_id: "#ORD1004",
    status: "Cancelled",
  },
  {
    id: "5",
    username: "eric_j",
    email: "eric@example.com",
    book_type: "History",
    price: 35,
    order_id: "#ORD1005",
    status: "Pending",
  },
  {
    id: "6",
    username: "fiona_l",
    email: "fiona@example.com",
    book_type: "Romance",
    price: 22.5,
    order_id: "#ORD1006",
    status: "Shipped",
  },
  {
    id: "7",
    username: "george_k",
    email: "george@example.com",
    book_type: "Thriller",
    price: 27,
    order_id: "#ORD1007",
    status: "Delivered",
  },
  {
    id: "8",
    username: "hannah_t",
    email: "hannah@example.com",
    book_type: "Science Fiction",
    price: 32.5,
    order_id: "#ORD1008",
    status: "Pending",
  },
  {
    id: "9",
    username: "ian_m",
    email: "ian@example.com",
    book_type: "Mystery",
    price: 29,
    order_id: "#ORD1009",
    status: "Shipped",
  },
  {
    id: "10",
    username: "julia_p",
    email: "julia@example.com",
    book_type: "Self-Help",
    price: 24,
    order_id: "#ORD1010",
    status: "Delivered",
  },
];

export const userSuspensionData = [
  {
    id: 1,
    username: "john_smith",
    start_date: "2025-01-10",
    end_date: "2025-02-10",
    suspend: true,
  },
  {
    id: 2,
    username: "emily_johnson",
    start_date: "2025-02-01",
    end_date: "2025-02-20",
    suspend: false,
  },
  {
    id: 3,
    username: "michael_brown",
    start_date: "2025-03-05",
    end_date: "2025-03-25",
    suspend: true,
  },
  {
    id: 4,
    username: "jessica_davis",
    start_date: "2025-01-15",
    end_date: "2025-01-30",
    suspend: false,
  },
  {
    id: 5,
    username: "david_miller",
    start_date: "2025-04-12",
    end_date: "2025-05-01",
    suspend: false,
  },
  {
    id: 6,
    username: "sarah_wilson",
    start_date: "2025-02-18",
    end_date: "2025-03-10",
    suspend: true,
  },
  {
    id: 7,
    username: "christopher_moore",
    start_date: "2025-03-01",
    end_date: "2025-03-30",
    suspend: false,
  },
  {
    id: 8,
    username: "ashley_taylor",
    start_date: "2025-02-25",
    end_date: "2025-03-15",
    suspend: true,
  },
  {
    id: 9,
    username: "james_anderson",
    start_date: "2025-01-20",
    end_date: "2025-02-05",
    suspend: false,
  },
  {
    id: 10,
    username: "olivia_thomas",
    start_date: "2025-03-10",
    end_date: "2025-04-10",
    suspend: true,
  },
];

export const adminUsersData = [
  {
    id: 1,
    username: "JamesSmith",
    email: "james.smith@example.com",
    role: "admin",
  },
  {
    id: 2,
    username: "MaryJohnson",
    email: "mary.johnson@example.com",
    role: "user",
  },
  {
    id: 3,
    username: "JohnWilliams",
    email: "john.williams@example.com",
    role: "user",
  },
  {
    id: 4,
    username: "PatriciaBrown",
    email: "patricia.brown@example.com",
    role: "admin",
  },
  {
    id: 5,
    username: "RobertJones",
    email: "robert.jones@example.com",
    role: "user",
  },
  {
    id: 6,
    username: "LindaGarcia",
    email: "linda.garcia@example.com",
    role: "user",
  },
  {
    id: 7,
    username: "MichaelMiller",
    email: "michael.miller@example.com",
    role: "admin",
  },
  {
    id: 8,
    username: "ElizabethDavis",
    email: "elizabeth.davis@example.com",
    role: "user",
  },
  {
    id: 9,
    username: "WilliamMartinez",
    email: "william.martinez@example.com",
    role: "user",
  },
  {
    id: 10,
    username: "JenniferHernandez",
    email: "jennifer.hernandez@example.com",
    role: "admin",
  },
];

// Example usage
export const policiesData = [
  {
    id: 1,
    policy_title: "Health Protection Plan",
    policy_number: "HP-2025-001",
    last_update: "2025-02-10",
    features: [
      { id: 1, feature: "Hospital Coverage" },
      { id: 2, feature: "Dental Coverage" },
    ],
  },
  {
    id: 2,
    policy_title: "Life Insurance Premium",
    policy_number: "LI-2025-002",
    last_update: "2025-03-14",
    features: [
      { id: 1, feature: "Accidental Death Benefit" },
      { id: 2, feature: "Critical Illness Cover" },
    ],
  },
  {
    id: 3,
    policy_title: "Auto Insurance Standard",
    policy_number: "AI-2025-003",
    last_update: "2025-01-28",
    features: [
      { id: 1, feature: "Collision Coverage" },
      { id: 2, feature: "Theft Protection" },
    ],
  },
  {
    id: 4,
    policy_title: "Home Safety Plan",
    policy_number: "HS-2025-004",
    last_update: "2025-03-20",
    features: [
      { id: 1, feature: "Fire Damage Cover" },
      { id: 2, feature: "Flood Protection" },
    ],
  },
  {
    id: 5,
    policy_title: "Travel Insurance Plus",
    policy_number: "TI-2025-005",
    last_update: "2025-02-25",
    features: [
      { id: 1, feature: "Lost Luggage" },
      { id: 2, feature: "Medical Assistance" },
    ],
  },
];

export const termsConditionsData = [
  {
    id: 1,
    terms_title: "Website Usage Terms",
    terms_number: "TC-2025-001",
    last_update: "2025-02-10",
    features: [
      { id: 1, feature: "Acceptable Use Policy" },
      { id: 2, feature: "User Responsibilities" },
    ],
  },
  {
    id: 2,
    terms_title: "Privacy Policy Agreement",
    terms_number: "TC-2025-002",
    last_update: "2025-03-05",
    features: [
      { id: 1, feature: "Data Collection Rules" },
      { id: 2, feature: "Data Sharing Restrictions" },
    ],
  },
  {
    id: 3,
    terms_title: "Subscription Terms",
    terms_number: "TC-2025-003",
    last_update: "2025-01-28",
    features: [
      { id: 1, feature: "Payment & Billing" },
      { id: 2, feature: "Cancellation Policy" },
    ],
  },
  {
    id: 4,
    terms_title: "Refund Policy Terms",
    terms_number: "TC-2025-004",
    last_update: "2025-04-12",
    features: [
      { id: 1, feature: "Refund Eligibility" },
      { id: 2, feature: "Refund Processing Steps" },
    ],
  },
  {
    id: 5,
    terms_title: "Community Guidelines",
    terms_number: "TC-2025-005",
    last_update: "2025-02-20",
    features: [
      { id: 1, feature: "User Conduct Rules" },
      { id: 2, feature: "Prohibited Activities" },
    ],
  },
];

export const ongoingPromoData = [
  {
    id: 1,
    discount_percentage: 10,
    code: "SAVE10",
    orders_over: 50,
    start_time: "2025-01-01T00:00:00Z",
    end_time: "2025-01-31T23:59:59Z",
  },
  {
    id: 2,
    discount_percentage: 15,
    code: "WINTER15",
    orders_over: 100,
    start_time: "2025-02-01T00:00:00Z",
    end_time: "2025-02-28T23:59:59Z",
  },
  {
    id: 3,
    discount_percentage: 20,
    code: "FLASH20",
    orders_over: 80,
    start_time: "2025-03-05T00:00:00Z",
    end_time: "2025-03-07T23:59:59Z",
  },
  {
    id: 4,
    discount_percentage: 25,
    code: "MEGA25",
    orders_over: 150,
    start_time: "2025-04-01T00:00:00Z",
    end_time: "2025-04-30T23:59:59Z",
  },
];

export const expiredPromoData = [
  {
    id: 1,
    discount_percentage: 10,
    code: "SAVE10",
    orders_over: 50,
    start_time: "2025-01-01T00:00:00Z",
    end_time: "2025-01-31T23:59:59Z",
  },
  {
    id: 2,
    discount_percentage: 15,
    code: "WINTER15",
    orders_over: 100,
    start_time: "2025-02-01T00:00:00Z",
    end_time: "2025-02-28T23:59:59Z",
  },
  {
    id: 3,
    discount_percentage: 20,
    code: "FLASH20",
    orders_over: 80,
    start_time: "2025-03-05T00:00:00Z",
    end_time: "2025-03-07T23:59:59Z",
  },
  {
    id: 4,
    discount_percentage: 25,
    code: "MEGA25",
    orders_over: 150,
    start_time: "2025-04-01T00:00:00Z",
    end_time: "2025-04-30T23:59:59Z",
  },
];
