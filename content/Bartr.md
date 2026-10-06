---
title: "Bartr: Item Trading Platform"
date: "2025-06-20"
description: "A web-based peer-to-peer item trading platform with real-time messaging, user ratings, and administrative controls."
---

**BARTR** is a web-based item trading platform engineered to enable secure, direct item exchanges between users without financial transactions. 

Built using a service-oriented architecture, BARTR combines a **Python/Flask** backend with **SQLAlchemy ORM** and a **MySQL** database. The platform integrates real-time messaging for negotiation, user ratings, and built-in administrative moderation tools.

### Key Features & Architecture
- **Trading Engine & Item Catalog:** Enables users to list items, browse structured categories, upload media assets, and initiate direct trade offers.
- **In-App Messaging System:** Integrated real-time messaging pipeline allowing users to discuss terms, negotiate trades, and coordinate item exchanges directly.
- **Ratings & Reviews:** Features a trust-building feedback system where users leave reviews and ratings following completed trades.
- **Administrative Control Panel:** Comprehensive admin dashboard equipped with moderation tools to oversee platform governance, user activity, and transaction compliance.
- **Database Architecture:** Built on Flask-SQLAlchemy interfacing with MySQL (`bartr_db`), utilizing relational schema designs for users, listings, offers, and chat history.