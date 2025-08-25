# 🛒 E-commerce App

A modern, full-stack e-commerce platform built with **Vite, React, TypeScript, Tailwind CSS, Supabase, and Stripe**.  
This project demonstrates user authentication, product management, shopping cart functionality, and payment integration.

---

##  Tech Stack

- **Vite** – Lightning-fast frontend tooling  
- **React (TypeScript)** – Component-based UI with type safety  
- **Tailwind CSS** – Utility-first styling for responsive design  
- **Supabase** – Backend-as-a-service (database, authentication, storage)  
- **Stripe** – Secure payment gateway  

---

## 📂 Project Structure
├── public/ # Static assets
├── src/ # React components, hooks, pages
├── supabase/ # Supabase config, migrations, serverless functions
├── .env # Local environment variables (ignored in git)
├── .gitignore # Files to exclude from git
├── package.json # Dependencies and scripts
├── vite.config.ts # Vite configuration

.env

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# If using Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

