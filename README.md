# Qolabs Server

A microservices-based backend for Qolabs (a social networking application) built with Spring Boot and Java 21.

## Project Overview

This project is a comprehensive social media platform backend that allows users to create profiles, connect with others, share posts, chat, and receive notifications. The system is built using a microservices architecture to ensure scalability, maintainability, and resilience.

## Architecture

The application follows a microservices architecture with the following components:

- **Discovery Server**: Service registry using Netflix Eureka
- **API Gateway**: Entry point for all client requests, handles routing and authentication
- **User Service**: Manages user profiles, authentication, and networking (connections between users)
- **Post Service**: Handles creation and management of posts and contributions
- **Media Service**: Manages media files (images, videos) using Azure Storage
- **Chat Service**: Handles real-time messaging between users
- **Notification Service**: Manages user notifications
- **Feed Service**: Aggregates and personalizes content for user feeds

The services communicate with each other through:
- RESTful APIs for synchronous communication
- Kafka for asynchronous event-driven communication (in development environment)

## Technologies

- **Java 21**: Programming language
- **Spring Boot 3.4.4**: Application framework
- **Spring Cloud**: For microservices patterns
- **Spring Cloud Azure**: For Azure integration
- **PostgreSQL**: Database for persistent storage
- **Docker**: Containerization
- **Kafka**: Event streaming platform (for development)
- **JWT**: Authentication mechanism

## Services Description

### Discovery Server
Central registry for all microservices, allowing them to discover and communicate with each other without hardcoded URLs.

### API Gateway
Single entry point for all client requests, handles routing to appropriate services, authentication, and load balancing.

### User Service
Manages user accounts, profiles, authentication, and networking (connections between users).

### Post Service
Handles creation, retrieval, updating, and deletion of posts and contributions. Supports different post types and visibility settings.

### Media Service
Manages upload, storage, and retrieval of media files using Azure Storage.

### Chat Service
Enables real-time messaging between users.

### Notification Service
Manages and delivers notifications to users about various events (new connections, comments, likes, etc.).

### Feed Service
Aggregates and personalizes content for user feeds based on their connections and preferences.

## Setup and Installation

### Prerequisites
- Java 21
- Docker and Docker Compose
- Maven

### Development Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/social-media-backend.git
   cd social-media-backend
   ```

2. Set up environment variables (create a `.env` file in the project root with the following variables):
   ```
   # Spring Profile
   SPRING_PROFILES_ACTIVE=dev
   
   # Discovery Server
   EUREKA_CLIENT_SERVICE_URL_DEFAULT_ZONE=http://discovery-server/eureka/
   
   # JWT
   JWT_SECRET=0299************************************************d8c9
   JWT_EXPIRATION=3600000
   
   # Database
   SPRING_DATABASE_USERNAME=user
   SPRING_DATABASE_PASSWORD=*****************
   SPRING_DATABASE_DATASOURCE_URL=jdbc:postgresql://database:5432
   
   USER_SERVICE_DATABASE_NAME=user_service
   CHAT_SERVICE_DATABASE_NAME=chat_service
   MEDIA_SERVICE_DATABASE_NAME=media_service
   NOTIFICATION_SERVICE_DATABASE_NAME=notification_service
   POST_SERVICE_DATABASE_NAME=post_service
   
   # Service bus
   AZURE_SERVICEBUS_CONNECTION_STRING=Endpoint=sb://***********.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=***********************
   
   # Storage
   STORAGE_NAME=Azure
   STORAGE_BASE_URL=https://************.blob.core.windows.net
   
   # Azure Storage
   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=***************;AccountKey=*****************************;EndpointSuffix=core.windows.net
   
   # Max upload size
   SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE=500MB
   SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE=500MB
   
   FILE_MAX_IMAGE_SIZE=10
   FILE_MAX_VIDEO_SIZE=500
   FILE_MAX_ATTACHMENT_SIZE=20
   
   # Azure Storage: Container name
   STORAGE_CONTAINERS_IMAGE_NAME=images
   STORAGE_CONTAINERS_VIDEO_NAME=videos
   STORAGE_CONTAINERS_ATTACHMENT_NAME=attachments
   
   # Google OAuth2
   OAUTH2_GOOGLE_CLIENT_ID=***************************************.apps.googleusercontent.com
   OAUTH2_GOOGLE_CLIENT_SECRET=*****************************
   
   # Microsoft OAuth2
   OAUTH2_MICROSOFT_CLIENT_ID=*****************************
   OAUTH2_MICROSOFT_CLIENT_SECRET=**********************************
   
   OAUTH2_REDIRECT_URI=http://localhost:5000/auth/callback
   ```

3. Start the development environment:
   ```
   docker-compose up -d
   ```

## Building and Running Locally

To build and run the services locally:

1. Build the project:
   ```
   ./mvnw clean install
   ```

2. Run individual services:
   ```
   ./mvnw spring-boot:run -pl <service-name>
   ```

## API Documentation

API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui.html` (when running locally)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

MIT

## Developers

- Saad Aboulhoda - [GitHub](https://github.com/saad-aboulhoda)