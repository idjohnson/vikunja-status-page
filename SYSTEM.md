# System Architecture

## Overview
This application is a Status Page frontend that displays specific tasks from a Vikunja instance. It allows users to view the status of "user requests" without needing direct access to the Vikunja project.

## System Context Diagram (C4 Model)

```mermaid
C4Context
    title System Context Diagram for Vikunja Status Page

    Person(user, "User", "A user checking the status of requests.")
    System(statusPage, "Vikunja Status Page", "React Application served via Nginx. Displays active and resolved requests.")
    System_Ext(vikunja, "Vikunja", "Project Management System. Stores tasks and labels.")

    Rel(user, statusPage, "Views status updates", "HTTPS")
    Rel(statusPage, vikunja, "Fetches tasks and labels", "HTTPS/JSON")
```

## Container Diagram

```mermaid
C4Container
    title Container Diagram for Vikunja Status Page

    Person(user, "User", "A user checking the status of requests")

    System_Boundary(c1, "Status Page Application") {
        Container(web_app, "Single Page Application", "React, Vite", "Provides the UI for viewing tasks.")
        Container(nginx, "Web Server", "Nginx", "Serves static content and proxies API requests to Vikunja.")
    }

    System_Ext(vikunja, "Vikunja API", "The backend storing task data.")

    Rel(user, nginx, "Visits URL", "HTTP/3030")
    Rel(nginx, web_app, "Delivers", "Static Files")
    Rel(web_app, nginx, "API Requests (/api/...)", "JSON/HTTP")
    Rel(nginx, vikunja, "Proxies Requests", "HTTPS")
```

## Data Flow
1.  **Initialization**: The React application loads in the user's browser.
2.  **Configuration**: The app checks for environment variables (`VITE_VIKUNJA_API_URL`, `VITE_VIKUNJA_API_TOKEN`, `VITE_USER_REQUEST_LABEL`) to configure the API connection.
3.  **Label Lookup**: The app requests all labels from Vikunja to find the ID of the configured label (default: `userrequest`).
4.  **Task Fetching**: The app requests all tasks filtered by the found Label ID.
5.  **Rendering**: Tasks are sorted into "Active" and "Resolved" lists based on their completion status and rendered to the user.

## User Flow Diagram
![User Flow Diagram](./nanobanana-output/user_flow_for_vikunja_status_pag.png)