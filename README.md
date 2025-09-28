# Welcome to your MediLink project

## Project info

MediLink is a web-based platform designed to streamline drug request and delivery management in healthcare settings. Developed by Oluwaferanmi Adewusi, it connects clinics (healthcare providers), pharmacies, and delivery riders to facilitate efficient handling of medication requests. Key features include:

- **Request Submission**: Clinics can create new drug requests by uploading photos of prescriptions or selecting items directly from pharmacy inventory.
- **Status Tracking**: Real-time monitoring of request statuses (e.g., pending, confirmed, in transit, delivered) with visual indicators and notifications.
- **Role-Based Dashboards**: Tailored interfaces for clinics (request management), pharmacies (inventory and order fulfillment), and riders (delivery assignments).
- **History and Analytics**: Access to past requests, rejection reasons, order details, and search/filter options for better oversight.
- **Secure Collaboration**: Ensures seamless communication and data flow while maintaining user authentication and role-specific access.

This platform enhances operational efficiency, reduces errors in drug dispensing, and improves patient care by enabling quick, trackable deliveries.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To deploy MediLink, you can use popular hosting platforms like Vercel, Netlify, or GitHub Pages. For example:

- **Vercel**: Connect your GitHub repo to Vercel, and it will automatically build and deploy on every push.
- **Netlify**: Drag and drop the built files or connect via Git for continuous deployment.
- Follow the platform's quick-start guide for a live URL in minutes.

## Can I connect a custom domain to my project?

Yes, you can!

Most deployment platforms (e.g., Vercel, Netlify) support custom domains natively. Configure your DNS settings to point to the hosted site, and update the platform's domain settings accordingly.

Read more here: [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains) or [Netlify Custom Domains](https://docs.netlify.com/domains-https/custom-domains/).
