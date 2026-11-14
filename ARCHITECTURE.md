# 🏛️ FableNest — System Architecture Documentation

This document describes the architectural design, component interactions, data models, and workflows powering the **FableNest** personalized storybook platform.

---

## 1. System Topology & High-Level Architecture

FableNest follows a decoupled microservice architecture structured into three core tiers:

1. **Frontend Presentation Tier (`FableNest_Web`)**: Interactive client application built on Next.js 16 with SSR/SSG and client-side rendering.
2. **Core Business Tier (`FableNest_backend`)**: Node.js & Express RESTful service managing users, book lifecycles, payments, and orchestration.
3. **AI Generation Tier (`FableNest_AI`)**: Python FastAPI service running vision analysis, LLM narrative generation, and character-consistent image rendering.

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Tier (Next.js 16)"]
        UI["Web App (App Router)"]
        State["Redux Toolkit Store"]
        i18n["next-intl Localization"]
    end

    subgraph Backend ["Business & Orchestration Tier (Express + TypeScript)"]
        API["Express REST API"]
        AuthMid["JWT Auth & RBAC"]
        BookSvc["Book Orchestration Service"]
        OrderSvc["Cart & Payment Engine"]
        FlipSvc["Flipbook Service"]
        PrismaORM["Prisma Client"]
    end

    subgraph Data ["Data & Storage Tier"]
        MongoDB[("MongoDB Database")]
        S3[("AWS S3 Asset Bucket")]
    end

    subgraph AIService ["AI Microservice (FastAPI + Python)"]
        FastAPIApp["FastAPI Gateway"]
        VisionMod["OpenAI Vision Feature Extractor"]
        StoryGen["Story Text Generator"]
        ImageGen["Batch Image Generator"]
    end

    subgraph External ["External Third-Party APIs"]
        StripeAPI["Stripe Payments API"]
        HeyzineAPI["Heyzine Flipbook API"]
        OpenAIAPI["OpenAI / Model Provider API"]
    end

    UI -->|HTTPS / REST / SSE| API
    API --> AuthMid
    AuthMid --> BookSvc
    AuthMid --> OrderSvc
    BookSvc --> PrismaORM
    OrderSvc --> PrismaORM
    PrismaORM --> MongoDB

    BookSvc -->|Store generated assets| S3
    BookSvc -->|Request Story & Art| FastAPIApp
    BookSvc -->|Generate 3D Flipbook| FlipSvc
    FlipSvc --> HeyzineAPI

    OrderSvc -->|Process Transactions| StripeAPI

    FastAPIApp --> VisionMod
    FastAPIApp --> StoryGen
    FastAPIApp --> ImageGen
    VisionMod --> OpenAIAPI
    StoryGen --> OpenAIAPI
    ImageGen --> OpenAIAPI
```

---

## 2. Component Breakdown

### 2.1 Frontend Client (`FableNest_Web`)
- **Framework**: Next.js 16 (App Router), React 19.
- **Styling & UI**: Tailwind CSS v4, Radix UI primitives, Lucide Icons, Framer Motion.
- **State Management**: Redux Toolkit & Redux Persist for wizard form progression and shopping cart state.
- **Internationalization**: `next-intl` supporting English (`en`), French (`fr`), Italian (`it`), and Spanish (`sp`).
- **Core User Journeys**:
  - `create-own-book/`: 7-step wizard (`child-details` ➔ `character` ➔ `photo-upload` ➔ `image-style` ➔ `language` ➔ `story-idea` ➔ `preview` / `full-book`).
  - `checkout/`: Address input, cart overview, Stripe payment element integration.
  - `dashboard/`: Admin console for reviewing drafts, users, and promo codes.

---

### 2.2 Core Backend Server (`FableNest_backend`)
- **Runtime**: Node.js, Express.js, TypeScript.
- **Persistence**: MongoDB accessed via **Prisma ORM**.
- **Key Modules**:
  - `book`: Orchestrates book creation, page regeneration, auto-generated drafts, and PDF generation.
  - `flipbook`: Integrates with the Heyzine API to transform compiled PDFs into responsive 3D flipbook URLs.
  - `payment`: Validates cart calculations, applies promo codes, and completes Stripe PaymentIntents.
  - `order`: Manages order lifecycles (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
  - `auth` & `user`: Manages JWT access/refresh tokens, password resets with OTP, and profile images.

---

### 2.3 AI Microservice (`FableNest_AI`)
- **Runtime**: Python 3.10+, FastAPI, Uvicorn, Pillow (PIL).
- **Core Endpoints**:
  - `POST /api/v1/generate_story`: Accepts character metadata (name, age, gender, language, style, story concept) and returns structured chapter outlines and illustration prompts.
  - `POST /api/v1/generate_images_first`: Generates the cover page and introductory chapter illustrations (teaser generation).
  - `POST /api/v1/generate_images_full`: Sequential batch generation for all book pages with character consistency.
  - `POST /api/v1/image-to-image`: Image conversion, resizing, and style transfer endpoints.
- **Character Consistency Pipeline**:
  1. Uploaded child portrait is analyzed by Vision models.
  2. Extracted features (skin color, hair tone, eye color, eyebrow shape) are injected into base character prompts.
  3. Subsequent generation calls pass continuous character prompts to guarantee visual coherence across pages.

---

## 3. End-to-End Sequence Workflows

### 3.1 Personalized Book Creation & Preview Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Web as FableNest Web
    participant Backend as Backend Service
    participant AI as AI Microservice
    participant S3 as AWS S3
    participant Heyzine as Heyzine API

    User->>Web: Fill child details, style, language & upload photo
    Web->>Backend: POST /api/book/create (FormData)
    Backend->>Backend: Save draft book in MongoDB
    Backend->>AI: POST /api/v1/generate_story (Metadata + Image)
    AI-->>Backend: Return chapter outlines & prompts
    
    alt Initial Teaser (User Preview)
        Backend->>AI: POST /generate_images_first
        AI-->>Backend: Return cover & first page images
        Backend->>S3: Upload images to S3
        Backend-->>Web: Return preview pages & bookId
        Web->>User: Display preview flipbook
    else Full Book Purchase / Finalization
        Backend->>AI: POST /generate_images_full (Sequential batch)
        AI-->>Backend: Return all generated page images
        Backend->>S3: Upload full pages
        Backend->>Backend: Compile PDF document
        Backend->>Heyzine: POST /api1/rest (PDF URL)
        Heyzine-->>Backend: Return 3D flipbook URL
        Backend-->>Web: Book fully generated & ready for download/print
    end
```

---

### 3.2 Order & Stripe Checkout Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Web as FableNest Web
    participant Backend as Backend Service
    participant Stripe as Stripe Gateway
    participant DB as MongoDB

    Customer->>Web: Add book to cart & proceed to checkout
    Customer->>Web: Enter shipping address & apply promo code
    Web->>Backend: POST /api/payment/create
    Backend->>DB: Validate cart items, pricing & promo code
    Backend->>Stripe: Create PaymentIntent
    Stripe-->>Backend: Return clientSecret
    Backend-->>Web: Send payment confirmation payload
    Web->>Customer: Render Stripe Payment Element
    Customer->>Stripe: Submit payment details
    Stripe-->>Customer: Payment Successful
    Stripe-->>Backend: Webhook / Confirm Payment
    Backend->>DB: Update Order Status -> PROCESSING
    Backend->>DB: Empty user Cart
    Backend-->>Customer: Order Confirmation & Receipt
```

---

## 4. Database Schema (Prisma Data Model)

```mermaid
erDiagram
    User ||--o{ Book : creates
    User ||--o{ Order : places
    User ||--o| Cart : owns
    User ||--o| Address : has
    User ||--o{ Payment : makes

    Book ||--|{ BookPage : contains
    Book ||--o{ CartItem : included_in
    Book ||--o{ OrderItem : ordered_as

    Cart ||--o{ CartItem : holds
    Order ||--o{ OrderItem : comprises

    User {
        string id PK
        string email
        string firstName
        string lastName
        enum role "USER | ADMIN | SUPER_ADMIN"
    }

    Book {
        string id PK
        string title
        string characterName
        int characterAge
        enum gender
        enum language
        enum style
        enum status "DRAFT | PUBLISHED"
        string coverImageUrl
        string pdfUrl
        boolean isAutoGenerated
    }

    BookPage {
        string id PK
        string bookId FK
        string name
        string content
        string prompt
        string fullPageUrl
        string leftUrl
        string rightUrl
    }

    Order {
        string id PK
        string userId FK
        float totalAmount
        float discount
        enum orderStatus
        json shippingAddress
    }

    Cart {
        string id PK
        string userId FK
    }

    CartItem {
        string id PK
        string cartId FK
        string bookId FK
        int quantity
    }
```

---

## 5. Security & Architectural Patterns

- **Environment Isolation**: Configuration is decoupled via `.env` files and validated at boot time.
- **Fail-Safe Fallbacks**: If Vision model analysis fails on an uploaded portrait, default character description fallbacks engage smoothly without interrupting the generation pipeline.
- **Stateless Authentication**: JWT tokens with short-lived access lifespans and refresh rotation patterns.
- **Separation of Concerns**: Compute-heavy AI and image operations are isolated in a Python microservice to prevent blocking Node.js event-loop operations.
