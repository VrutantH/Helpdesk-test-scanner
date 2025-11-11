# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update current user profile

### Tickets
- `GET /tickets` - Get all tickets (with pagination and filters)
- `POST /tickets` - Create new ticket
- `GET /tickets/:id` - Get single ticket
- `PUT /tickets/:id` - Update ticket
- `DELETE /tickets/:id` - Delete ticket (Admin only)

### Comments
- `GET /tickets/:id/comments` - Get ticket comments
- `POST /tickets/:id/comments` - Add comment to ticket
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### File Uploads
- `POST /upload` - Upload file attachment

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error