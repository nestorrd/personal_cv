# Personal CV Web Application

This project is a web application for displaying a personal curriculum vitae, built with a modern frontend and backend architecture.

## Project Structure

```
.
├── frontend/          # Static frontend application
├── backend/          # Go backend server
├── scripts/          # Utility scripts
├── bin/             # Binaries and executables
├── docs/            # Documentation
└── .devcontainer/   # Development environment configuration
```

## Prerequisites

- Docker
- Go (for backend development)
- A modern web browser (for frontend)

## Development Environment Setup

1. Clone this repository:

   ```bash
   git clone git@github.com:nestorrd/personal_cv.git
   cd personal_cv
   ```

2. Verify environment setup:

   ```bash
   ./verify-setup.sh
   ```

3. Start the development environment:
   ```bash
   make dev
   ```

## Available Scripts

- `make dev`: Starts the development environment
- `make build`: Builds the application
- `make test`: Runs tests
- `make clean`: Cleans generated files

## Development

### Frontend

The frontend is a static web application located in the `frontend/` directory. It consists of HTML, CSS, and JavaScript files that are served directly by the Go backend.

### Backend

The backend is written in Go and provides:

- A REST API
- Static file serving for the frontend
- Server-side functionality

The Go code is located in the `backend/` directory, with `main.go` as the entry point.

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
