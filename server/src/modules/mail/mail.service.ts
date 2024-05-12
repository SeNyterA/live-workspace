import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  })

  async sendEmail({
    subject,
    text,
    to
  }: {
    to: string
    subject: string
    text: string
  }): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      subject,
      text,
      to
    })
  }
}
