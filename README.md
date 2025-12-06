# Next.js Modular Application

## Overview

This project is a modular Next.js 16 application built with modern tools
such as TypeScript, TanStack Query, Tailwind CSS v4, ShadCN, and more.
The architecture emphasizes clean separation, code splitting, and
maintainable components.

## Installation

After cloning the repository, navigate to the root folder and run:

```bash
npm install
npm run start
```

> you will need nodejs installed on your computer

## Architecture

The project follows a fully modular folder structure. Any query,
component, hook, or validation schema related to a specific feature is
placed next to its own page. This improves discoverability and prevents
scattered files.

### Global Layer (`shared/`)

This folder contains: - Global configs\

- Error handling utilities\
- Reusable hooks\
- Wrappers and providers used across the entire application

### Home Page Features

The homepage includes:

- Infinite Pagination
- Multi‑filter system
- Category selection
- URL‑based state persistence

All filter states are stored in URL search params. TanStack Query
listens for URL param changes using a custom hook (`useProductFilters`).
Whenever filters change, a new API call is triggered automatically.

## Query Layer

Each feature has:

- An async function responsible for Axios API calls

- A React Query hook that wraps the async request
- A component layer consuming the hook

### Data Mapping

Inside the async function, server responses pass through a mapper
located in `types/`.\
The mapper:

- Converts API fields to camelCase

- Normalizes structures
- Ensures consistent typing across the app

## Forms & Validation

Creating a new product uses:

- React Hook Form

- Zod for schema validation

Any server‑side validation errors returned from the API are displayed
under the corresponding input field.

## Features

The application supports:

- Create new product
- Delete product
- View all products
- Filter by status
- Filter by category
- Filter by max/min stock
- Filter by max/min price

## Technologies Used

- Next.js 16
- TypeScript
- TanStack Query
- ShadCN
- Tailwind CSS v4
- Axios
- Modular folder architecture

# Screen Shot

<img width="1460" height="750" src="https://github.com/user-attachments/assets/76a6b0fb-dcdd-47aa-bc31-ca3eac60f122" />
