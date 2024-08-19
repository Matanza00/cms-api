import nodemailer, { Transporter } from "nodemailer";
import { PAYMENT_TEMPLATE } from "../templates/email-templates";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined;
}

interface User {
  email: string;
  name: string;
}

export default class Email {
  private to: string;
  private name: string;
  private from: string;
  private message: string;
  private subject: string;

  constructor(user: User, message: string, subject: string) {
    if (!user.email || !user.name) {
      throw new Error("User must have both email and name.");
    }
    this.to = user.email;
    this.name = user.name;
    this.message = message;
    this.subject = subject;
    this.from = `NXC CMS <${process.env.EMAIL_FROM || "no-reply@example.com"}>`;
  }

  // Creates a transport instance using nodemailer
  private newTransport(): Transporter {
    return nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465, // or 587 for STARTTLS
      secure: true, // true for port 465, false for port 587
      auth: {
        user: process.env.EMAIL_USERNAME || "default_username",
        pass: process.env.EMAIL_PASSWORD || "default_password",
      },
    });
  }

  // Sends an email
  private async send(): Promise<void> {
    try {
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject: this.subject,
        text: this.message,
        html: PAYMENT_TEMPLATE(this.message), // Ensure PAYMENT_TEMPLATE is a function and handles nulls
      };

      console.log(`Sending email to ${this.to} with subject ${this.subject}`);

      await this.newTransport().sendMail(mailOptions);
      console.log(`Email sent to ${this.to} with subject ${this.subject}`);
    } catch (error) {
      if (isError(error)) {
        console.error("Error sending email:", error.message);
        throw new Error(`Failed to send email: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Failed to send email: An unexpected error occurred.");
      }
    }
  }

  public async sendWelcome(): Promise<void> {
    this.subject = "Welcome Email.";
    await this.send();
  }

  public async sendPasswordReset(): Promise<void> {
    this.subject = "Reset Password OTP";
    await this.send();
  }

  public async sendPasswordSetLink(): Promise<void> {
    this.subject = "CMS Password Generator Link";
    await this.send();
  }

  public async sendCredentials(): Promise<void> {
    this.subject = "CMS Login Credentials";
    await this.send();
  }

  public async sendPeriodicMaintenance(): Promise<void> {
    this.subject = "Periodic Maintenance Reminder";
    await this.send();
  }
}
