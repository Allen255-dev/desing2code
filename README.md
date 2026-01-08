# 🎨 Design2Code - AI Design to Code Converter

Design2Code is a premium, AI-powered platform that converts your design screenshots into high-quality, production-ready code in seconds. Built with a modern tech stack and a focus on visual excellence.

## 🚀 Key Features

- **Multi-Framework Output**: Supports React + Tailwind, Vue.js 3, and pure HTML/CSS.
- **Intelligent Generation**: Context-aware AI simulation that understands UI elements from screenshots.
- **Subscription & Monetization**: Built-in tiered pricing (Starter, Pro, Enterprise) with feature gating and subscription lifecycle management.
- **Snippet Management**: Save and browse your history of generated designs with a sleek, searchable interface.
- **Premium UI/UX**: Dark mode by default, glassmorphism aesthetics, and smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Theming**: Next Themes

## 🏁 Getting Started

To get this project running on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd design2code-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open the App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing the Monetization System

1. Navigate to the **Pricing** page.
2. Select the **Pro Plan** ($25/mo).
3. Complete the **Simulated Checkout** modal.
4. Observe the **Subscription Countdown** and **Pro Badge** in the sidebar.
5. Try generating a project using **React** or **Vue** options (which are locked for free users).

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (FileUpload, CodeViewer, CheckoutModal, etc.).
- `src/context`: Global state management for projects and subscriptions.
- `src/data`: Mock data for snippets and history.
- `public`: Static assets and images.

---
Created with ❤️ by the Design2Code Team.

