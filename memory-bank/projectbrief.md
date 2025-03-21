# Project Brief: Front of House Productions (FOHP) Web Application

## 1. Project Overview

**Front of House Productions (FOHP)** is an event production rental company that requires a **web application** to serve as a **customer and employee portal**. The goal of this application is to **streamline event organization**, rental management, and employee operations to provide a **seamless experience** for clients and staff.

## 2. Objectives

- Provide an **intuitive customer portal** for booking event production rentals and managing events.
- Enable **employees to efficiently coordinate**, track, and manage event logistics.
- Offer **management tools** for inventory tracking, scheduling, and financial insights.
- Integrate with **third-party tools** to enhance automation and data accuracy.
- Optimize for **speed and accessibility** across desktop and mobile devices.

## 3. Key Features

### Customer Portal

#### Pre-Rental
- **Tell Us About Your Event Form** (Type, Location, Budget, Contacts, Date/Time)
- **Rental Wishlist & Quotation Tool**
- **Sales Pipeline** (View/Edit Rentals, Submit Documents, Sign Contracts)
- **Venue Specs Submission** (Power, Parking, Contacts, Site Plans)
- **Event Timeline Tracker** (Inquiry → Sales → Delivery → Event → Load Out)
- **Push Notifications & Live Updates**
- **Live Chat Support with FOHP Representatives**

#### Event Planning & Tools
- **Google Earth Venue Mapping** (Stage Placement, Load In/Out, Electrical Access)
- **Promotional Material Generator**
- **Data Storage for Stage Plots, Event Photos/Videos** (Rewards for Uploads)
- **Real-Time Rental Tracking** (Status, Delivery, FOHP Team Assignments)
- **Social Media Sharing Widget** (Easy content uploads to various platforms)
- **Customer Referral Program** (Discounts for Referrals)
- **Interactive Event Budgeting Tool** (Customers input budgets to receive suggested equipment packages)
- **AI-Powered Equipment Recommender** (Suggests the best setups based on event details)
- **Venue Compatibility Checker** (Ensures rental equipment fits the venue's specifications)
- **Guest List & RSVP Manager** (Send invites and track responses)
- **Weather & Environmental Risk Alerts** (Real-time weather tracking with event risk warnings)
- **Real-Time Event Dashboard** (Live updates on event setup and progress)
- **Customizable Stage & Lighting Designer** (Drag-and-drop tool for setups)
- **Digital Event Checklist Generator** (Automated event checklist based on event type)
- **Multi-User Event Collaboration** (Role-based access for team members and vendors)
- **Emergency Contact & Support Line** (Quick-access emergency contacts and support requests)
- **Event Photo & Video Gallery** (Upload event media with branded watermarks for social sharing)
- **Automated Event Summary Report** (Post-event report with history and analytics)
- **Digital Business Card & Networking Feature** (Shareable QR code for rental history)
- **Social Media Auto-Posting Tool** (Schedule and share event updates)
- **Loyalty Rewards & VIP Discounts** (Earn reward points for repeat rentals)

### Employee Portal

#### Logistics & Workflow
- **Clock In/Out & Time Tracking**
- **Google Workspace Integration** (Calendar, Drive, Tasks, Voice)
- **RFID-Enabled Inventory Tracking** (Scan Equipment, Monitor Condition & Location)
- **Job Assignments & Task Lists** (With Comments & Status Updates)
- **Loading Lists & Equipment Checklists**
- **Google Maps Integration for Venue Navigation**
- **SOS Button for Emergencies** (Severity-Based Push Notifications)

#### Technical Support & On-Site Tools
- **Live Equipment Status Dashboard** (RFID-Based Tracking)
- **AI Chatbot for Troubleshooting** (Instant Access to Manuals & FAQs)
- **Production Power Calculator** (Stage Load & Power Estimations)
- **Incident Report Submission Tool** (Safety & Equipment Damage Reporting)
- **Training Library** (Videos, Documents, Quizzes for Employees)
- **Mileage Tracking for Expense Reimbursements**
- **Automated Reimbursement System** (Integrates with multiple payment platforms)

### Management & Admin Tools
- **AI-Generated Employee Scheduling** (Based on Availability & Skills)
- **Real-Time Profit & Expense Dashboard** (Integrated with QuickBooks/Xero)
- **Event Risk Analysis Tool** (Predictive Planning for Weather & Logistics)
- **Live Event Monitoring Dashboard** (Track FOHP Team & Event Progress)
- **Inventory Auto-Restocking Alerts**
- **Emergency Action Plan Generator** (Prepares Safety Protocols Per Venue/Event)
- **Approval System for Purchases & Expenses**

## 4. Integrations

- **Current RMS**: Customer Data (CRM), Inventory Tracking
- **QuickBooks/Xero**: Invoicing & Payments
- **Google Workspace**: Calendar, Drive, Gmail, Tasks, Voice
- **DocuSign/Adobe**: Contract & Document Signing
- **Social Media Platforms**: Facebook, Instagram, X, Snapchat, TikTok, Reddit, YouTube, Discord, Yelp, Google Business Page
- **Google Maps/Earth**: Venue Mapping, Route Optimization
- **RFID Inventory System**: Equipment Tracking & Condition Monitoring
- **Emergency Notification System**: SOS Alerts & Staff Safety Protocols
- **Payment Platforms**: Multiple payment options including digital wallets and cryptocurrency

## 5. Technology Stack

### Current Tech Stack
- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime)
- **Deployment**: Vercel
- **Version Control**: GitHub
- **Authentication**: OAuth (multiple providers)
- **Storage**: Supabase Storage, Google Drive API
- **Push Notifications**: Firebase Cloud Messaging, Twilio

### Future Tech Stack (For Scaling)
- **Backend**: Move from Supabase to a dedicated Node.js/Express.js with PostgreSQL on AWS RDS
- **Deployment**: Move from Vercel to AWS (Lambda, ECS) for larger workloads
- **Storage**: Expand from Supabase Storage to AWS S3 for high-demand media hosting
- **Event-Driven Processing**: Implement Kafka or AWS SQS for handling large-scale event triggers

## 6. Target Users

- **Prospective Customers**: Discovering FOHP's services and capabilities
- **Current Customers**: Managing rentals, planning events, and coordinating with FOHP
- **Employees**: Handling equipment, coordinating events, and managing tasks
- **Management/Admin**: Overseeing operations, finances, and strategic planning
