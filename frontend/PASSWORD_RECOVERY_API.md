# Password recovery API contract

The frontend now includes a secure **Forgot password** flow at `/forgot-password`.

Because the uploaded frontend project only contains the client and currently exposes these auth calls:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me`
- `POST /auth/password`

there is no existing password-recovery endpoint to call.

To make the new recovery screen fully functional, the backend should expose:

## Request reset

`POST /api/auth/forgot-password`

```json
{
  "email": "owner@example.com"
}
```

Recommended response:

```json
{
  "message": "If an account exists for this email, password-reset instructions have been sent."
}
```

The endpoint should generate a short-lived, single-use reset token and send the reset link by email. It should not return the existing password or reveal whether an email belongs to an account.

## Reset password

A complete recovery flow should then expose a second endpoint such as:

`POST /api/auth/reset-password`

```json
{
  "token": "<single-use-reset-token>",
  "password": "NewPassword!123"
}
```

The backend should hash the new password, invalidate the token, and return a generic success message.
