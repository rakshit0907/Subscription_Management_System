# Brightloop – Subscription Management System

A centralized platform designed to simplify subscription-based business operations by bringing product management, subscriptions, recurring billing, invoicing, and payment tracking together in one place.

---

## 1. Problem Statement

Subscription-based businesses often face difficulties managing their operations across different processes. Handling products, subscription plans, customer information, quotations, recurring invoices, payments, taxes, and overdue balances manually can be time-consuming and lead to errors.

As businesses grow, keeping track of multiple subscriptions, billing schedules, and customer payments becomes increasingly complicated.

There is a need for a single platform that can manage the complete subscription lifecycle, automate recurring billing, and provide a clear view of business finances.

## 2. Our Solution

Brightloop is a subscription management platform that brings all major subscription-related operations under one system.

It allows businesses to manage products, plans, customers, quotations, subscriptions, invoices, and payments through a centralized dashboard.

The platform automates recurring invoice generation, calculates taxes and discounts, tracks payment statuses, and identifies overdue invoices. It also provides separate access for administrators, staff members, and customers.

The main objective is to reduce manual work, minimize billing errors, and make subscription management easier for businesses.

## 3. Key Features & Functionalities

### 3.1 Product & Plan Management

* Create and manage products and their variants.
* Configure subscription plans with different billing cycles.
* Support daily, weekly, monthly, and yearly billing.
* Set plan availability, minimum quantities, and subscription rules.
* Manage taxes and discounts.

### 3.2 User & Role Management

* Secure customer registration and login.
* Separate access for Admin, Staff, and Customers.
* Admin-controlled staff creation and management.
* Password reset and authentication functionality.
* Role-based access to different sections of the platform.

### 3.3 Quotation Management

* Create and manage quotation templates.
* Generate quotations for customers.
* Convert quotations into subscriptions.
* Manage quotation details, products, and quantities.

### 3.4 Subscription Lifecycle Management

* Create and manage customer subscriptions.
* Track subscriptions through different stages:

  * Draft
  * Quotation
  * Confirmed
  * Active
  * Closed
* Support pausing, closing, and renewing subscriptions according to plan rules.
* Manage subscription quantities, products, and billing dates.

### 3.5 Automated Invoicing & Billing

* Automatically generate invoices for active subscriptions.
* Support recurring billing cycles.
* Calculate applicable taxes and discounts.
* Track invoice due dates and outstanding balances.
* Prevent duplicate invoices for the same subscription billing period.
* Handle missed billing periods.

### 3.6 Payment Management

* Record customer payments against invoices.
* Support partial and complete payments.
* Automatically update payment statuses.
* Track paid, outstanding, and overdue amounts.
* Maintain payment history.

### 3.7 Dashboard & Analytics

* View the total number of active subscriptions.
* Monitor revenue and payment statistics.
* Track outstanding and overdue invoices.
* Visualize revenue trends through charts.
* Access important business information from one dashboard.

### 3.8 Customer Portal

* Allow customers to access their subscription information.
* View active and previous subscriptions.
* Access invoices and payment history.
* Track outstanding payments.

## 4. How the System Works

Brightloop follows a structured workflow to manage the complete subscription process.

### Step 1: User Authentication

Users log in according to their assigned roles. Administrators, staff members, and customers get access to the functionalities relevant to them.

### Step 2: Product & Plan Configuration

The administrator creates products, variants, subscription plans, billing cycles, taxes, and applicable discounts.

### Step 3: Quotation Creation

Staff members can create quotations using available products and plans. These quotations can later be converted into subscriptions.

### Step 4: Subscription Creation

A subscription is created with customer details, selected plans, quantities, pricing, and billing information.

### Step 5: Subscription Activation

The subscription moves through its defined lifecycle. Once activated, it becomes eligible for recurring billing according to its configured schedule.

### Step 6: Automated Invoice Generation

The backend billing process checks active subscriptions and generates invoices when their billing dates arrive. It also handles missed billing periods while preventing duplicate invoices.

### Step 7: Payment Processing

Payments are recorded against generated invoices. The system updates paid and outstanding balances and keeps track of partial payments.

### Step 8: Financial Tracking

The dashboard provides an overview of subscriptions, revenue, payments, outstanding balances, and overdue invoices.

### Step 9: Customer Access

Customers can access their subscriptions, invoices, and payment information through the customer portal.

## 5. Technology Stack

### Frontend

| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| Next.js 14     | Frontend framework                |
| React          | Component-based UI development    |
| TypeScript     | Type-safe development             |
| Tailwind CSS   | Styling and responsive layouts    |
| shadcn/ui      | Reusable UI components            |
| TanStack Table | Data tables and record management |
| Recharts       | Dashboard charts and analytics    |
| Zod            | Frontend form validation          |
| Axios          | API communication                 |

### Backend

| Technology       | Purpose                               |
| ---------------- | ------------------------------------- |
| NestJS           | Backend framework and REST APIs       |
| Node.js          | Server-side runtime                   |
| TypeScript       | Backend development                   |
| Prisma ORM       | Database management and queries       |
| PostgreSQL 16    | Relational database                   |
| JWT              | User authentication                   |
| bcrypt           | Password hashing                      |
| class-validator  | Backend request validation            |
| @nestjs/schedule | Automated billing and scheduled tasks |

### Additional Technologies

| Technology     | Purpose                                      |
| -------------- | -------------------------------------------- |
| Nodemailer     | Email notifications                          |
| Mailpit        | Local email testing                          |
| PDFKit         | PDF invoice generation                       |
| Docker         | Containerization and development environment |
| Docker Compose | Managing development services                |
| Git & GitHub   | Version control and team collaboration       |
| VS Code        | Development environment                      |
| Swagger        | API documentation and testing                |

## 6. Team Members & Responsibilities

Our team consists of four members, with each person responsible for different parts of the development process.

| Team Member | Role                          | Responsibilities                                                                                                                                                                                    |
| ----------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rakshit     | Team Lead & Backend Developer | Handles the core subscription engine, invoicing, automated billing, discount application, payment processing, overdue tracking, and final integration.                                              |
| Shashank    | Frontend Lead                 | Works on the Next.js application structure, authentication pages, admin and staff dashboards, subscription management interface, invoice and payment screens, charts, and frontend API integration. |
| Samarth     | Backend Developer             | Handles authentication APIs, JWT and role-based access control, staff management, product and plan APIs, taxes, discounts, and customer portal APIs.                                                |
| Shivam      | Full Stack Developer & QA     | Works on database seed data, customer portal UI, reports APIs, PDF invoice generation, documentation, testing, and performance checks.                                                              |

## 7. Security & Reliability

Security and data consistency are important parts of the platform.

* JWT-based authentication using secure HTTP-only cookies.
* Password hashing using bcrypt.
* Role-based authorization for protected operations.
* Customer-specific data access restrictions.
* Server-side validation of business operations.
* Duplicate invoice prevention through billing-period uniqueness.
* Transaction-safe discount and payment operations.
* Decimal-based financial calculations to maintain monetary accuracy.
* Database indexing and pagination for improved performance.

## 8. Performance & Scalability

Brightloop is designed to support businesses managing thousands of subscription records.

Some of the performance considerations include:

* Paginated API responses.
* Database indexing for frequently queried fields.
* Optimized dashboard aggregation queries.
* Efficient recurring billing processes.
* Prevention of duplicate billing operations.
* Responsive frontend interfaces.
* A target page response time of under 2 seconds under the specified workload.

## 9. Project Objective

Brightloop aims to make subscription management simpler by bringing the entire process into one centralized platform.

From managing products and subscriptions to generating recurring invoices and tracking payments, the platform helps businesses reduce manual operations and maintain better control over their finances.
