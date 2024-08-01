import { database } from '@/infra/database'
import { sendMail } from '@/infra/email'
import emailTemplates, { EmailType } from '@/lib/react-mail/templates'
import { NextResponse, type NextRequest } from 'next/server'

async function sendEmail(req: NextRequest) {
  const allowedMethods = ['POST']
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: `method "${req.method}" not allowed` },
      { status: 405 },
    )
  }

  if (req.method === 'POST') {
    const { type, data, to, cc, bcc, userId } = await req.json()

    // 1. use case - required fields/type and send email
    if (!type || !to || !userId || !(type in emailTemplates)) {
      return NextResponse.json(
        { message: 'Tipo de e-mail, dados e destinatário são obrigatórios' },
        { status: 400 },
      )
    }

    const { subject, render } = emailTemplates[type as EmailType]
    const { html, text } = render(data as any)

    const responseEmail = await sendMail({
      to,
      cc,
      bcc,
      text,
      subject,
      html,
    })

    // 2. use case - if type is not in email_types table, add it
    const typeResult = await database.query({
      text: `
        SELECT id
        FROM email_types
        WHERE type = $1
      `,
      values: [type],
    })

    let emailTypeId
    if (typeResult.rows.length === 0) {
      const insertTypeResult = await database.query({
        text: `
          INSERT INTO email_types (type)
          VALUES ($1)
          RETURNING id
        `,
        values: [type],
      })

      emailTypeId = insertTypeResult.rows[0].id
    } else {
      emailTypeId = typeResult.rows[0].id
    }

    // 3. use case - add data in email_logs
    await database.query({
      text: `
        INSERT INTO email_logs (email_logs_id, user_id, "to", cc, bcc, subject, status, response)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      values: [
        emailTypeId,
        userId,
        to,
        cc,
        bcc,
        subject,
        responseEmail.status,
        JSON.stringify(responseEmail),
      ],
    })

    return NextResponse.json(
      {
        message: 'Email enviado com sucesso!',
        responseEmail,
      },
      { status: 200 },
    )
  }
}

export {
  sendEmail as DELETE,
  sendEmail as GET,
  sendEmail as PATCH,
  sendEmail as POST,
  sendEmail as PUT,
}
