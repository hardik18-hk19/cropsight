export const EMAIL_VERIFY_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #3d5ca3;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .content {
        padding: 30px 20px;
        color: #333333;
        text-align: center;
      }
      .otp {
        display: inline-block;
        margin: 20px 0;
        font-size: 28px;
        letter-spacing: 4px;
        font-weight: bold;
        color: #3d5ca3;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 20px;
        background-color: #f9f9f9;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Verify Your Email</h2>
      </div>
      <div class="content">
        <p>Hello <strong>{{USERNAME}}</strong>,</p>
        <p>Thank you for signing up. Please use the OTP below to verify your email address:</p>
        <div class="otp">{{OTP}}</div>
        <p>This OTP is valid for 24 hours.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>Thanks,<br />Team CropSight</p>
      </div>
      <div class="footer">
        Contact us: <a href="mailto:work18.hk19@gmail.com">support@cropsight.com</a>
      </div>
    </div>
  </body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
    <style>
      body {
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #3d5ca3;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .content {
        padding: 30px 20px;
        color: #333333;
        text-align: center;
      }
      .otp {
        display: inline-block;
        margin: 20px 0;
        font-size: 28px;
        letter-spacing: 4px;
        font-weight: bold;
        color: #3d5ca3;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 20px;
        background-color: #f9f9f9;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Reset Your Password</h2>
      </div>
      <div class="content">
        <p>Hello <strong>{{USERNAME}}</strong>,</p>
        <p>We received a request to reset your password. Please use the OTP below to reset your password:</p>
        <div class="otp">{{OTP}}</div>
        <p>This OTP is valid for 15 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Thanks,<br />Team CropSight</p>
      </div>
      <div class="footer">
        Contact us: <a href="mailto:work18.hk19@gmail.com">support@cropsight.com</a>
      </div>
    </div>
  </body>
</html>
`;
