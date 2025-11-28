1. Project Title

RentEase – A full-stack rental listing platform for owners and tenants.



🧩 2. Problem Statement

Finding rental homes is often stressful, unorganized, and unreliable. Many rely on brokers, random posts, or incomplete listings.
Similarly, property owners struggle to reach proper tenants and manage their listings.

RentEase solves this by providing a centralized, transparent, user-friendly web platform where:

Owners can post verified listings

Tenants can search, filter, and connect directly

No intermediaries, no confusion



🏗️ 3. System Architecture
Frontend → Backend (API) → Database

Tech Breakdown

Frontend: React.js, React Router, Axios

Backend: Node.js + Express.js

Database: MySQL with Prisma ORM

Authentication: JWT + bcrypt.js

Hosting:

Frontend → Vercel / Netlify

Backend → Render / Railway

Database → PlanetScale / Aiven


🚀 4. Key Features
🔐 Authentication & Authorization

Secure Signup/Login

Role-based access (Owner / Tenant)

🏡 CRUD Operations

Owners can Create, Read, Update, Delete property listings

Property data: images, rent, address, size, description, amenities

🔍 Search / Filter / Sort

Search by location / keyword

Filter by price, type, amenities

Sort by rent or date added

📊 Dashboards

Owners: manage their listings

Tenants: view saved/contacted properties

📄 Property Details Page

Full details with images, location, features, owner info

☁️ Hosting & Deployment

Fully deployed full-stack app with separate frontend + backend + database hosting



⚙️ 5. Tech Stack
Layer	Technologies
Frontend	HTML, CSS, JavaScript, React.js, React Router, Axios
Backend	Node.js, Express.js
Database	MySQL with Prisma ORM
Authentication	JWT, bcrypt.js
Hosting	Vercel (Frontend), Render/Railway (Backend), PlanetScale (DB)
📡 6. API Overview
Authentication
Endpoint	Method	Description	Access
/api/auth/signup	POST	Register a new user (Owner or Tenant)	Public
/api/auth/login	POST	Login and return JWT token	Public
Properties
Endpoint	Method	Description	Access
/api/properties	GET	Fetch all property listings	Authenticated
/api/properties	POST	Create a new listing	Owner Only
/api/properties/:id	PUT	Update property	Owner Only
/api/properties/:id	DELETE	Delete property	Owner Only
Favorites
Endpoint	Method	Description	Access
/api/favorites	POST	Add property to favorites	Tenant
/api/favorites/:id	DELETE	Remove property from favorites	Tenant
