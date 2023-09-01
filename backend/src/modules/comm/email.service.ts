import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private readonly sesClient = new SESv2Client({
    region: process.env.AWS_SES_REGION
  })

  async sendInvitation(toEmail: string): Promise<void> {
    this.logger.debug(`Sending invitation to ${toEmail} ...`)
    const params = {
      Content: {
        Simple: {
          Subject: {
            Data: 'Inviation to join traintracker.io'
          },
          Body: {
            Text: {
              Data: `Create your account by clicking on this link ${process.env.SIGNUP_LINK}`
            }
          }
        }
      },
      FromEmailAddress: 'nguyen.trungchinh@gmail.com',
      Destination: {
        ToAddresses: [toEmail]
      }
    }
    const command = new SendEmailCommand(params)
    await this.sesClient.send(command)
  }
}
