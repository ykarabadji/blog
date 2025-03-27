pro2BLOG

A simple blogging platform built with Node.js, Express, and Prisma.
📌 Features

✅ User authentication (Register/Login)
✅ Create, edit, and delete blog posts
✅ Comment system
✅ Database integration with Prisma
✅ REST API for blog operations
📦 Installation

    Clone the repository:

git clone https://github.com/ykarabadji/blog.git

Navigate to the project directory:

cd blog

Install dependencies:

npm install

Set up the database:

npx prisma migrate dev

Start the server:

    npm start

⚙️ Usage

    Open http://localhost:3000 in your browser.

    Register or log in to create posts.

    Manage posts and comments from the dashboard.

🛠️ Technologies Used

    Node.js (Backend)

    Express.js (Server)

    Prisma (Database ORM)
    HTML, CSS, JavaScript (Frontend)
    
CREATE YOUR OWN .env FILE that contains :
    DATABASE_URL=your_database_url_here
    JWT_SECRET=your_secret_key_here
    PORT=3000

    


