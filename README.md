# Blurred Ego (BE)

Blurred Ego (BE) is a web application built with **Next.js** for the frontend and **Strapi** for the backend. The application is deployed on a **VPS server (Ubuntu)**, and the live website can be accessed at **[Blurred Egohkg.com](https://Blurred Egohkg.com)**.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm** or **yarn**
- **Strapi** (backend API)
- **PostgreSQL** (for Strapi database)

### Running Locally

#### 1. Clone the Repository
```bash
git clone https://github.com/Blurredego/Blurred Ego.git
cd Blurred Ego
```

#### 2. Install Dependencies
```bash
npm install  # or yarn install
```

#### 3. Start the Strapi Backend
Navigate to the **Strapi** project inside your repository:
```bash
cd Backend
npm run develop  # or yarn develop
```
Strapi will run at **http://localhost:1337**

#### 4. Start the Next.js Frontend
Navigate to the **Next.js** project:
```bash
cd frontend
npm run dev  # or yarn dev
```

The Next.js app will run at **http://localhost:3000**.

## API Routes

API routes are available at **http://localhost:1337/api/**, which are used by the frontend to fetch and manage data.

## Deployment

### **Live Deployment on VPS (Ubuntu)**
The Blurred Ego application is deployed on a **VPS running Ubuntu**. Below are the steps to deploy:

#### 1. Connect to VPS
```bash
ssh user@your-vps-ip
```

#### 2. Navigate to the Project Directory & Pull Latest Code
```bash
cd /var/www/Blurred Ego
git pull origin main
```

#### 3. Restart Strapi and Next.js
```bash
pm run build  # Build the Next.js project
pm run start  # Start the Next.js server
pm run develop  # Restart Strapi if needed
```

#### 4. Configure Reverse Proxy (Nginx)
Ensure **Nginx** is set up as a reverse proxy to serve the Next.js frontend and Strapi backend.

## Learn More

To learn more about the technologies used:

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Strapi Documentation](https://docs.strapi.io)**
- **[Ubuntu Server Setup](https://ubuntu.com/server/docs)**

## Live Demo
- **[Blurred Egohkg.com](https://Blurred Egohkg.com)**


## License

This project is licensed under the **MIT License**. Feel free to contribute and improve Blurred Ego!

