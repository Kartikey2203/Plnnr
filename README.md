# Plnnr 🗓️

> **The Event Management Platform for the Future.**
>
> *Seamlessly plan, discover, and manage events with AI-powered tools.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-Backend-red?style=for-the-badge)](https://www.convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge)](https://clerk.com/)

---

## 🌟 Features

-   **🤖 AI-Powered Event Generation**: Create detailed event plans instantly using Google's Generative AI.
-   **🎫 Seamless Ticketing & Registration**: Integrated booking system with QR code generation for check-ins.
-   **🔍 Smart Search**: Find events easily with location-based filtering and specialized categories.
-   **🎨 Dynamic Theming**: Beautiful, responsive UI with dark mode support and custom event themes.
-   **🔐 Secure Authentication**: Robust user management provided by Clerk.
-   **📱 Mobile-First Design**: Optimized for all devices, from desktops to smartphones.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **npm** or **pnpm**
-   **Convex Account** (for backend services)
-   **Clerk Account** (for authentication)
-   **Google Gemini API Key** (for AI features)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Kartikey2203/Plnnr.git
    cd Plnnr
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    # Convex
    CONVEX_DEPLOYMENT=your_convex_deployment
    NEXT_PUBLIC_CONVEX_URL=your_convex_url

    # ClerkAuth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key

    # Google Gemini AI
    GOOGLE_API_KEY=your_google_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Start the Convex backend**
    In a separate terminal:
    ```bash
    npx convex dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16, React 19, Tailwind CSS, Radix UI
-   **Backend**: Convex (Real-time database & backend functions)
-   **Authentication**: Clerk
-   **AI**: Google Generative AI (Gemini)
-   **Utilities**: `date-fns`, `zod`, `react-hook-form`, `lucide-react`

## 🎨 Design References

-   [Onboarding Flow](https://mobbin.com/screens/59f50ced-5736-4086-8986-bbc712a8a2e8?utm_source=copy_link&utm_medium=link&utm_campaign=screen_sharing)
-   [Search Interface](https://mobbin.com/screens/f6573e16-66e5-4dae-bf93-9861f7ea04bb?utm_source=copy_link&utm_medium=link&utm_campaign=screen_sharing)
-   [Create Event](https://mobbin.com/screens/5883ba8b-9c30-4173-9e0d-2ab5db72da93?utm_source=copy_link&utm_medium=link&utm_campaign=screen_sharing)
-   [QR Scanner](https://mobbin.com/screens/b0badc87-7915-456c-bb32-d635cc48f2d4?utm_source=copy_link&utm_medium=link&utm_campaign=screen_sharing)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
