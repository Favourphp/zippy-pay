## Getting Started

### Prerequisites

- Node.js
- MongoDB
- SMTP Server (for sending emails)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Favourphp/zippy-pay.git
   cd EventTrak-Backend

### Configuration
1. Create a .env file in the root directory and add the following variables:

- PORT=5000
- MONGODB_URI=your_mongodb_uri
- JWT_SECRET=your_secret_key
- EMAIL_ADDRESS=your_email_address
- EMAIL_PASSWORD=your_email_password
- SECRET=SESSION



## Usage

### User Authentication

- Register a new user: POST /api/user/register
- Log in: POST /api/user/login
- Verify user account: POST /api/user/confirm/:userID
- Forget password: POST /api/user/forget-password
- Reset password: POST /api/user/reset-password/:token
- Log out: GET /api/user/logout




