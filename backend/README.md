# Instagram Clone - Backend

## Technologies Used
- Java 17
- Spring Boot 3.1.5
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

## Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6+

## Setup Instructions

### 1. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE instagram_db;
```

### 2. Configure Database
Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run the Application
```bash
mvn clean install
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/{userId}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username
- `PUT /api/users/me` - Update current user profile
- `POST /api/users/{userId}/follow` - Follow a user
- `DELETE /api/users/{userId}/follow` - Unfollow a user
- `GET /api/users/search?query={query}` - Search users
- `GET /api/users/{userId}/followers` - Get user followers
- `GET /api/users/{userId}/following` - Get user following

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/{postId}` - Get post by ID
- `GET /api/posts/user/{userId}` - Get posts by user
- `GET /api/posts/feed` - Get feed (posts from following)
- `GET /api/posts/all` - Get all posts
- `POST /api/posts/{postId}/like` - Like a post
- `DELETE /api/posts/{postId}/like` - Unlike a post
- `DELETE /api/posts/{postId}` - Delete a post

### Comments
- `POST /api/posts/{postId}/comments` - Create a comment
- `GET /api/posts/{postId}/comments` - Get post comments
- `DELETE /api/posts/{postId}/comments/{commentId}` - Delete a comment

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Encrypted)
- fullName
- bio
- profilePicture
- createdAt

### Posts Table
- id (Primary Key)
- imageUrl
- caption
- user_id (Foreign Key)
- createdAt

### Comments Table
- id (Primary Key)
- content
- user_id (Foreign Key)
- post_id (Foreign Key)
- createdAt

### User Followers (Join Table)
- user_id
- follower_id

### Post Likes (Join Table)
- user_id
- post_id
