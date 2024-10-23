# MOnagement

This is the frontend codes for an item management web application.

## Table of Contents

- [Completed Features](#completed-features)
- [Upcoming Features](#upcoming-features)
- [Project Structure](#project-structure)

## Completed Features

### 1. Item Management

- ✅ **CRUD Operations:** Add, view, edit, and delete items.
- ✅ **Categorization:** Organize items by types and subtypes.
- ✅ **Expiration & Stock Tracking:** Track item expiration dates and low stock levels.

### 2. User Interface

- ✅ **Interactive Tables:** Display and manage items, types, and subtypes.
- ✅ **Modals for Item Creation:** Easily add new items, types, and subtypes through pop-up forms.
- ✅ **Inplace Editing:** Allow editing of items, types, and subtypes directly within the table.
- ✅ **Batch Operations:** Select multiple items for batch actions, such as deletion.
- ✅ **Real-time Notifications:** Display status messages for actions like adding or deleting items.

### 3. API Integration

- ✅ **Axios for API Requests:** Seamless interaction with backend services for real-time data.

## Upcoming Features

- 🔜 **Login System:** Implement user authentication to secure access to the application.
- 🔜 **Scan to Add Item:** Enable users to scan barcodes or QR codes for quick item addition.
- 🔜 **Automated Testing and Deployment:** Implement CI/CD pipelines to automate testing and deployment processes.

## Project Structure

The project structure under the `src` directory is organized as follows:

```
src/

├── assets/ # CSS and style-related files

├── components/ # Reusable Vue components

├── router/ # Router configuration for the SPA

├── services/ # API interaction files

├── views/ # Vue files representing pages

├── App.vue # Root Vue component

└── main.js # Application entry point


```
