## Overview
This project is built using React for the frontend and Node.js for the backend, with MongoDB Atlas for database management. The application allows users to add, edit, and delete customer information, including multiple addresses per customer.

## Features
- **Add Customer:** Fill out a form to add a new customer. The form includes PAN verification and dynamic fetching of address details based on postcode.
- **Edit Customer:** Edit customer details, including name, email, mobile number, and addresses.
- **Delete Customer:** Remove a customer from the database.
- **List Customers:** View a list of all customers with options to edit or delete.

## Technologies Used
- **Frontend:**
  - React
  - Tailwind CSS
  - Axios
- **Backend:**
  - Node.js
  - Express
  - MongoDB Atlas

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone [https://github.com/your-username/react](https://github.com/Ameychopde/react-assignment).git
   cd react-assignment
   ```
2. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   cd backend
   npm install
   ```
3. **Set up environment variables:**
   Create a .env file in the backend directory and add your MongoDB Atlas connection string and any other necessary environment 
   variables.
   ```makeafile
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
 4. **Run the application:**
    ```sh
    cd frontend
    npm run dev
    cd backend
    nodemon app.js
    ```

## Project Overview : 
**FrontEnd (UI):**
![WhatsApp Image 2024-07-29 at 21 41 00_fcd36ad0](https://github.com/user-attachments/assets/6899669f-5bdc-4dcf-adac-22477d6f332d)

![WhatsApp Image 2024-07-29 at 21 41 00_42cf8517](https://github.com/user-attachments/assets/f2a1e797-be33-47e8-b674-4e19a743128d)

![WhatsApp Image 2024-07-29 at 21 43 25_13d16493](https://github.com/user-attachments/assets/d15d1563-b90b-45e4-b86f-390303653b1a)

**BackEnd:**
![WhatsApp Image 2024-07-29 at 21 39 50_e7c834ea](https://github.com/user-attachments/assets/a990bc76-24e1-4dfd-bf61-d135901bd466)





