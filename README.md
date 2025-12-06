## Installation

After cloning the repository, navigate to the root folder and run:

```bash
npm install
npm run start
```

#### Watch `localhost:3000`

> you will need nodejs installed on your computer

## Structure (homepage)

The project follows a fully modular folder structure. Any query,
component, hook, or validation schema related to a specific feature is
placed next to its own page. This improves discoverability and prevents
scattered files.

- UI components
- Query + Async API functions
- Zod schemas
- Custom hooks
- Types & mappers
- Local utils
- i18n

```
src
├── app
│   ├── (home)
│   │   ├── hooks
│   │   ├── schemas
│   │   ├── components
│   │   ├── utils
│   │   ├── i18n
│   │   ├── page.tsx
│   │   └── layout.tsx
----------------------
```

### Global Layer (`shared/`)

This folder contains:

- Global configs
- Error handling utilities
- Reusable hooks
- Reusable components
- Wrappers and providers used across the entire application

## Query Layer

Each feature has:

- An async function responsible for Axios API calls and Map incoming response data or Map into custom Readable Error type

- An Abstraction Layer Around React Query hook that wraps the async request

#### Data Mapping

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

# Git

> You can explore the full development progress and changes by viewing the Git commit history in this repository.

# Architecture & Call Flow

##### The architectural decision I made was that the code is written in a decoupled manner, and the filters operate independently of the list and the API. Through our custom hook, we send the filters to the URL, and on the other side, React Query, via another hook, reads all the URL filters. If there’s any change, it detects the update and calls the API again with the new filters.

##### Our call flow is as follows: the page loads, and React Query reaches the hook we wrote, which then calls our async function. Within that async function, we use Axios. At the final layer, when the data returns, if there’s no error, it’s passed to the mapper. If there is an error, it’s converted into an error and returned. If the response is correct, the response is passed to the mapper, which then normalizes and processes it before returning it to us. This async function then hands the data back to the abstraction hook we created, and finally, it returns to the component and is rendered.

# Screen Shot

<img width="1460" height="750" src="https://github.com/user-attachments/assets/76a6b0fb-dcdd-47aa-bc31-ca3eac60f122" />
