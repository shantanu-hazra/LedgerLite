# Procura

## 📌 Description

**Procura** is a lightweight, offline-first billing and invoicing application designed to work like installed software rather than a traditional website. It enables businesses to create invoices and quotations, manage products and services, apply client-wise discounts, and generate professional PDF invoices — all without requiring a constant internet connection.

Procura follows a **local-first architecture**, storing all critical data locally and remaining fully functional offline. Cloud sync, email delivery, and analytics are planned as future enhancements.

---

## 🎯 Key Objectives

* Operate fully **offline**
* Provide fast and simple **invoice & quotation creation**
* Maintain **local storage** of clients, products, and invoices
* Generate **downloadable PDF invoices**
* Keep the system modular, scalable, and desktop-oriented

---

## 🚀 Features

### ✅ MVP (Implemented / In Scope)

* Create invoices and quotations
* Add and manage products & services
* Auto-calculate totals, taxes, and discounts
* Client-wise discounts (up to 15%)
* Local storage using PostgreSQL
* Download invoices as PDF
* Invoice templates
* Dashboard to view and filter invoices
* Desktop-style UI experience

### ✨ Planned Enhancements

* Email invoices
* Cloud sync (MongoDB)
* Analytics dashboard
* Customer database
* Dark / Light mode
* Payment tracking

---

## 🧩 Architecture Overview

Procura is built using a **modular architecture**:

* **UI Module** – Invoice & quotation creation, client interactions
* **Dashboard Module** – Invoice listing, filtering, search
* **Invoice Module** – Invoice lifecycle management
* **Product Module** – Product & service price management
* **Storage Module** – Local data persistence
* **PDF Module** – Invoice PDF generation
* **Sync Module (Future)** – Cloud synchronization

---

## 🗄️ Database Design (PostgreSQL)

### Products

* id
* type
* original_rate
* hsn

### Services

* id
* type
* original_cost
* hsn

### Clients

* id
* name
* gstIn
* address
* email_id
* discount_value (max 15%)

### Invoices

* id
* items
* client_id
* total_cost
* issued_by
* issued_time
* pdf_id

### Quotations

* id
* client_id
* items
* total_cost
* issued_by
* pdf_id

---

## 🔌 API Overview (Local)

* Confirm invoice
* Fetch invoices
* Fetch product/service costs

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (Desktop-style UI)
* **Backend:** Local service layer
* **Database:** PostgreSQL (local-first)
* **PDF Generation:** Built-in

---

## 📦 Installation & Setup (High-Level)

```bash
# install dependencies
npm install

# run in development
npm run dev

# build for production
npm run build
npm start
```

---

## 📄 License

This project is currently under active development. Licensing details will be added later.

---

## 🧠 Philosophy

Procura prioritizes **reliability over flash**, **offline usability over cloud dependency**, and **clarity over complexity**. It is built for real-world billing workflows where internet access is optional, not mandatory.
