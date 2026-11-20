---
slug: "kabo"
title: "KABO: Customer Loyalty & Review Platform"
date: "2026-10-06"
description: "A digital loyalty platform that replaces paper stamp cards with Apple Wallet and Google Wallet passes, and turns happy customers into Google reviews."
liveUrl: "https://kabo.my"
image: "/images/projects/kabo.webp"
featured: true
tags: ["Next.js", "React", "Tailwind CSS", "Supabase", "Vercel"]
---

**KABO** is a digital loyalty platform for local businesses. It replaces paper stamp cards with passes that live in the customer's **Apple Wallet** or **Google Wallet**, so there's no app to download and no card to lose. It also helps businesses earn more **Google reviews**, while catching unhappy feedback privately before it goes public.

- **Role:** Founder, designer and full-stack developer
- **Platform:** Web app for merchants, wallet passes for customers
- **Status:** Live at [kabo.my](https://kabo.my), with paid plans

---

## The problem

Paper stamp cards get lost, and standalone loyalty apps ask customers for one download too many. Most happy customers never leave a review, while unhappy ones often do, in public.

KABO fixes both: customers join in seconds from a QR code at the counter, their card sits in the wallet they already use, and every visit ends with a quick rating that steers them the right way.

---

## How it works

1. **Scan:** the customer scans the QR code at the counter and registers with their phone number.
2. **Save:** a loyalty card is added to their Apple Wallet or Google Wallet.
3. **Collect:** each visit adds a stamp, and the card in their wallet updates by itself.
4. **Reward and review:** they earn rewards, rate their visit, and are invited to leave a Google review.

---

## Features

### For customers
- **Wallet passes, no app:** the loyalty card lives in Apple Wallet or Google Wallet and updates instantly when a stamp is earned or a reward is redeemed.
- **Nearby reminders:** the card pops up on the lock screen near the shop, showing how many stamps are left to the next reward. KABO never sees where customers are; the phone handles it.
- **Store page:** returning customers check their stamps with their phone number, on a page styled in the shop's own colours.

### For merchants
- **Card designer:** a live editor for the card's colours, logo, reward goal and stamp icons.
- **Reviews and feedback:** customers rate each visit. Lower ratings go to a private feedback inbox, higher ratings are thanked and invited to post a Google review, and the review link is always there for everyone.
- **Promotions and birthdays:** send or schedule promotions that appear on every customer's pass, plus automatic birthday messages.
- **Dashboard:** visits, returning customers and trends at a glance, a customer list, and printable counter QR codes.
- **Plans and billing:** a 14-day free trial with no card needed, then monthly, yearly or one-time plans, paid by card or FPX online banking.

---

## Built with

- **Next.js, React and TypeScript** for the web app, styled with **Tailwind CSS**.
- **Supabase** for the database and secure merchant accounts.
- **Apple Wallet and Google Wallet** integrations, including live pass updates.
- **CHIP**, a Malaysian payment gateway, for subscriptions.
- **Vercel** for hosting and scheduled jobs such as renewals, reminders and birthday messages.

---

## What I learned

- **Shipping a real product:** taking KABO from idea to a live, paid service, including billing, trials and the emails around them.
- **Wallet platforms:** how Apple Wallet and Google Wallet passes are issued and kept up to date after they're on a customer's phone.
- **Privacy by design:** building location reminders that work without ever collecting a customer's location.
- **Designing for two audiences:** a few seconds of effort for customers at the counter, and enough control and insight for the business owner.
