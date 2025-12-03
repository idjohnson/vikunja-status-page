# Vikunja User Request Status Page

A modern, elegant status page for displaying user requests from a Vikunja API backend. The application automatically fetches and displays all tasks labeled with "userrequest", organizing them into active and resolved issues.

## Features

- 🎨 **Modern UI**: Clean, responsive design with gradient backgrounds and smooth animations
- 🔄 **Real-time Updates**: Manual refresh capability to fetch the latest user requests
- 📊 **Organized Display**: Automatic separation of active and resolved issues
- 🏷️ **Label Support**: Visual display of task labels with custom colors
- ⚡ **Fast Performance**: Built with Vite and React for optimal loading times
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- A Vikunja instance with API access
- API token with read permissions for tasks and labels

## Getting Started

### 1. Clone or Download the Project

```bash
cd ~/projects/vikunja-status-page
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your Vikunja API details:

```env
VITE_VIKUNJA_API_URL=https://vikunja.steeped.icu/api/v1
VITE_VIKUNJA_API_TOKEN=your_api_token_here
```

**Note:** To get an API token:
1. Log into your Vikunja instance
2. Go to Settings → API Tokens
3. Create a new token with read permissions
4. Copy the token to your `.env` file

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## How It Works

### Task Filtering

The application queries the Vikunja API for all tasks with the "userrequest" label:

1. Fetches all available labels from the API
2. Finds the label with title "userrequest" (case-insensitive)
3. Uses the Vikunja filter syntax to retrieve matching tasks: `labels = <label_id>`
4. Organizes tasks into active and resolved categories

### Task Status

Tasks are considered **resolved** if:
- `done` field is `true`, OR
- `percent_done` field is `100`

All other tasks are considered **active**.

### Displayed Information

For each task, the status page shows:
- **Title**: Task name
- **Description**: Full task description
- **Status Badge**: Visual indicator of active/resolved state
- **Created Date**: When the task was created
- **Updated Date**: Last modification date
- **Priority**: Task priority level (Low, Medium, High, Urgent, Critical)
- **Progress**: Completion percentage
- **Labels**: All associated labels with custom colors

## Project Structure

```
vikunja-status-page/
├── src/
│   ├── api/
│   │   └── vikunja.js          # Vikunja API client
│   ├── components/
│   │   ├── TaskCard.jsx        # Individual task display
│   │   ├── TaskCard.css
│   │   ├── TaskList.jsx        # Task list container
│   │   └── TaskList.css
│   ├── App.jsx                 # Main application component
│   ├── App.css
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## API Reference

The application uses the following Vikunja API endpoints:

- `GET /api/v1/labels` - Fetch all labels
- `GET /api/v1/tasks/all?filter=labels=<id>&per_page=100` - Fetch filtered tasks

For complete API documentation, visit: https://vikunja.steeped.icu/api/v1/docs

## Customization

### Changing Colors

Edit the CSS files to customize the color scheme:
- `src/App.css` - Main application colors and gradients
- `src/components/TaskCard.css` - Task card styling
- `src/components/TaskList.css` - Task list layout

### Modifying Label Filter

To track different labels, edit `src/api/vikunja.js` and change the label title in the `getUserRequestTasks()` method.

## Troubleshooting

### "No userrequest label found" Warning

Make sure you have a label named "userrequest" in your Vikunja instance. The search is case-insensitive.

### CORS Issues

If you encounter CORS errors, ensure your Vikunja instance allows requests from your domain. Check the `service.frontendurl` setting in your Vikunja configuration.

### Authentication Errors

Verify that:
1. Your API token is correct in the `.env` file
2. The token has not expired
3. The token has read permissions for tasks and labels

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Docker Support

You can run the application using Docker. This setup includes an Nginx server that serves the application on port 3030 and proxies API requests to avoid CORS issues.

NOTE: the `.env` file needs to use Linux LFs so that it is properl put into the Nginx path on the container by the docker entrypoint script.  I recommend using `dos2unix .env` to ensure proper line endings.

### 1. Build the Docker Image

```bash
docker build -t vikunja-status-page .
```

### 2. Run the Container

You must mount your `.env` file to the container to provide configuration.

```bash
docker run -d \
  -p 3030:3030 \
  -v $(pwd)/.env:/app/.env \
  vikunja-status-page
```

The application will be available at `http://localhost:3030`.

A common approach I use is to build and run locally with new versions each time:

```
$ export VER=16 && docker stop vikunja-status && docker rm vikunja-status && docker build -t vikunja-status-page:$VER . && docker run -d -p 3030:3030 -v "${PWD}/.env:/app/.env:ro" --name vikunja-status vikunja-status-page:$VER
```

### Runtime Configuration

The Docker container uses a custom entrypoint script that reads the mounted `.env` file and generates a runtime configuration file (`config.js`). This allows you to change environment variables without rebuilding the image.

**Important:** To utilize the Nginx proxy and avoid CORS issues, set your `VITE_VIKUNJA_API_URL` in `.env` to a relative path:

```env
VITE_VIKUNJA_API_URL=/api/v1
VITE_VIKUNJA_API_TOKEN=your_token_here
```

This ensures API requests are routed through the local Nginx server, which then forwards them to the actual Vikunja instance.
