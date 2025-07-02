E-commerce Application
This is an e-commerce web application built using HTML, CSS, JavaScript, and Bootstrap for the frontend. The backend is powered by Java Spring Boot with a PostgreSQL database.

Features
User Registration and Login: Users can create an account, log in, and manage their profile.
Product Catalog: Users can view available products and add them to their shopping cart.
Shopping Cart: Users can add, remove, and modify items in their cart.
Order Management: Users can place orders and track their order status.
Admin Panel: Admins can manage products, users, and view order details.
Technologies Used
Frontend
HTML
CSS
JavaScript
Bootstrap
Backend
Java Spring Boot
PostgreSQL
Requirements
Prerequisites
Before running the project, ensure you have the following software installed:

Visual Studio Code (for Frontend development)

Download: Visual Studio Code
IntelliJ IDEA (for Backend development)

Download: IntelliJ IDEA
Java Development Kit (JDK) 11 or higher (for Backend)

Download: JDK
PostgreSQL (for the database)

Download: PostgreSQL
Node.js (for running the Live Server on VS Code)

Download: Node.js
Extensions for VS Code
To run the frontend, you'll need to install the following extension:

Live Server: A VS Code extension to launch a local development server with live reload.
You can install it from the Extensions Marketplace in VS Code.

Getting Started
1. Clone the Repository
Clone this repository to your local machine:

bash
Copy
git clone https://github.com/yourusername/ecommerce-app.git
2. Setup the Frontend
Step 1: Open the Frontend Folder in VS Code
Navigate to the frontend directory in the project folder.

bash
Copy
cd ecommerce-app/frontend
Step 2: Open VS Code
Open the folder in VS Code and install the Live Server extension if you haven’t already.

Step 3: Run the Frontend
Open index.html or any main HTML file in your project.
Right-click the file and select "Open with Live Server."
This will start a local server and open the frontend in your default browser.

3. Setup the Backend
Step 1: Open the Backend Folder in IntelliJ IDEA
Navigate to the backend directory in the project folder.

bash
Copy
cd ecommerce-app/backend
Open this folder in IntelliJ IDEA.

Step 2: Setup the Database
Install PostgreSQL and create a new database for the project.
Update the application.properties file in src/main/resources to include your PostgreSQL database credentials:
properties
Copy
spring.datasource.url=jdbc:postgresql://localhost:5432/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
Step 3: Run the Backend
Open the EcommerceApplication.java file (main class) in IntelliJ IDEA.
Run the application by clicking the "Run" button or using the following Maven command in the terminal:
bash
Copy
mvn spring-boot:run
The backend will start running on http://localhost:8080.

4. Connecting Frontend to Backend
Ensure your frontend is making API calls to the correct backend URL (e.g., http://localhost:8080/api/products).

5. Testing the Application
You can now test the full application:

Open the frontend in the browser using Live Server.
Access the backend through IntelliJ or any other suitable IDE.
Folder Structure
r
Copy
ecommerce-app/
│
├── frontend/               # Frontend code (HTML, CSS, JS, Bootstrap)
│   ├── components/         # Reusable components
│   │   ├── cart.html       # Cart component (display cart items)
│   │   ├── header.html     # Header component (navigation, logo, etc.)
│   │   ├── login.html      # Login page
│   │   ├── myorders.html   # User's orders page
│   │   ├── products.html   # Product listing page
│   │   ├── sign-up.html    # User sign-up page
│   │   └── userprofile.html # User profile page
│   ├── index.html          # Main entry point of the website
│   ├── style.css           # Custom CSS styles
│   └── app.js              # JavaScript for interactivity and API integration
│
└── backend/                # Backend code (Spring Boot, Java)
    ├── src/
    │   └── main/
    │       ├── java/       # Java source code
    │       └── resources/  # Application properties and other resources
    ├── pom.xml             # Maven configuration
    └── application.properties  # Database and other Spring Boot configurations
Components Overview
1. Cart
The cart.html component displays the user's shopping cart, where they can view, modify, and remove items before proceeding to checkout.
2. Header
The header.html component includes the website's navigation bar, logo, and links to pages like "Home", "Login", and "Cart".
3. Login
The login.html component allows users to log in to their account. It includes input fields for the email and password and communicates with the backend to authenticate users.
4. My Orders
The myorders.html component displays a list of all orders placed by the logged-in user, along with their order details and status.
5. Products
The products.html component lists available products in the store. It provides options to filter and view individual products in more detail.
6. Sign-up
The sign-up.html component allows users to create a new account by providing necessary information like name, email, password, etc.
7. User Profile
The userprofile.html component displays and allows the user to update their personal information like name, email, password, and other profile details.
Contributing
Feel free to fork the repository and submit pull requests if you'd like to contribute to this project. Any contributions, bug fixes, or enhancements are greatly appreciated!

License
This project is licensed under the MIT License - see the LICENSE file for details.
