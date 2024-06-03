# Photo Sharing API

API for photo sharing app that allows user to create, edit, delete and view photos and captions

## Table of Content

- [Features](#features)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Run](#run)

## Features

1. Register a user
2. Login and Logout
3. Create a post with image and caption
4. Edit, delete, view posts
5. Authentication and authorization with JWT

## Dependencies

- Node
- TypeScript
- Express
- MySQL
- TypeORM
- Json Web Token
- Nodemon

## Installation

### Prerequisite

- Node.js needs to be installed on your device
- XAMPP needs to be installed

### Clone the github repository

```
git clone https://github.com/dipika-baj/photo-mania-backend.git
```

### Change the directory

```
cd photo-sharing-app
```

### Install all dependencies

```
npm install
```

### Environment

Specify `.env` file as per `.env.example`

| Name        | Value              | Description                            |
| ----------- | ------------------ | -------------------------------------- |
| DB_PORT     | 3000               | The server runs on port 3000           |
| DB_NAME     | database_name      | The name of the database               |
| DB_HOST     | localhost          | The server uses localhost for database |
| DB_USERNAME | localhost_username | Username of the localhost server       |
| DB_PASSWORD | localhost_password | Password of the localhost server       |
| DB_PORT     | 3306               | MySQL runs on port 3306                |
| SECRET      | jwt_secret         | Secret for JWT                         |
| JWT_EXPIRE  | 1                  | Expiry time for the JWT                |

## Run

```
npm run dev
```
