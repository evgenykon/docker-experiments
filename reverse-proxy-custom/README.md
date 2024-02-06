# Custom cached HTTPS reverse proxy with Docker

```mermaid
sequenceDiagram
    Client->>Nginx: GET /
    Nginx-->Nginx: check cache
    Nginx->>Client: response
```