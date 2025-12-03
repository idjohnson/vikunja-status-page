# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A React-based status page that displays user requests from a Vikunja task management API. The application fetches tasks labeled "userrequest" and organizes them into active and resolved categories.

## Development Commands

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
# Runs on http://localhost:5173
```

### Build
```bash
npm run build
# Output: dist/
```

### Preview Production Build
```bash
npm run preview
```

## Environment Configuration

The application requires two environment variables in `.env`:
- `VITE_VIKUNJA_API_URL` - Base URL for the Vikunja API (e.g., `https://vikunja.steeped.icu/api/v1`)
- `VITE_VIKUNJA_API_TOKEN` - API token with read permissions for tasks and labels

Use `.env.example` as a template:
```bash
cp .env.example .env
```

## Architecture

### Data Flow
1. **App.jsx** - Root component that manages application state (tasks, loading, error)
2. **vikunja.js** - API client that:
   - Fetches all labels from `/api/v1/labels`
   - Finds the "userrequest" label ID
   - Queries tasks using filter syntax: `labels = <label_id>`
   - Returns all matching tasks
3. **TaskList.jsx** - Receives tasks and separates them into:
   - **Active**: `!task.done && task.percent_done !== 100`
   - **Resolved**: `task.done || task.percent_done === 100`
4. **TaskCard.jsx** - Displays individual task with metadata (dates, priority, progress, labels)

### Key Components

**`src/api/vikunja.js`** - Singleton API client
- All API requests go through the `request()` method
- Authentication via Bearer token in Authorization header
- Primary method: `getUserRequestTasks()` which implements the label filtering logic

**`src/App.jsx`** - State management and refresh mechanism
- Fetches data on mount via `useEffect`
- Manual refresh via `handleRefresh()`
- Tracks `lastUpdated` timestamp

**`src/components/TaskList.jsx`** - Task organization
- Handles loading, error, and empty states
- Implements active/resolved categorization logic

**`src/components/TaskCard.jsx`** - Task presentation
- Displays task metadata from Vikunja API response
- Renders labels with custom colors from `label.hex_color`
- Priority mapping: 0=Unset, 1=Low, 2=Medium, 3=High, 4=Urgent, 5=Critical

### Styling Architecture
- CSS modules per component (e.g., `TaskCard.css`, `TaskList.css`)
- Global styles in `App.css` and `index.css`
- Gradient backgrounds and smooth animations defined in component stylesheets

## Vikunja API Integration

### Endpoints Used
- `GET /labels` - Fetch all available labels
- `GET /tasks/all?filter=labels=<id>&per_page=100` - Fetch filtered tasks

### Filter Syntax
The Vikunja filter parameter uses the syntax: `labels = <label_id>`

### Task Structure
Key fields from API response:
- `id`, `title`, `description`
- `done` (boolean), `percent_done` (0-100)
- `created`, `updated` (ISO date strings)
- `priority` (0-5 integer)
- `labels` (array of label objects with `id`, `title`, `hex_color`)

## Customization Points

### Changing the Target Label
Edit `src/api/vikunja.js` in the `getUserRequestTasks()` method:
```javascript
const userRequestLabel = labels.find(
  label => label.title.toLowerCase() === 'userrequest' // Change this
);
```

### Task Categorization Logic
Edit `src/components/TaskList.jsx`:
```javascript
const activeTasks = tasks.filter(
  (task) => !task.done && task.percent_done !== 100
);
```

### Pagination
Currently fetches max 100 tasks per request. Adjust in `src/api/vikunja.js`:
```javascript
per_page: 100  // Modify this value
```

## Tech Stack
- **Vite** - Build tool and dev server
- **React 18** - UI framework (uses hooks: `useState`, `useEffect`)
- **Native Fetch API** - HTTP requests (no axios or external HTTP library)
- **CSS** - Styling (no preprocessor or CSS-in-JS library)
