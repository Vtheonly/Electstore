// /app/api/send-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactFormData } from '@/types';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ElectroMaison <onboarding@resend.dev>', // Change this to your verified domain
      to: ['contact@electromaison.fr'], // Your business email
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a2a6c;">Nouveau message de contact</h2>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #1a2a6c;">Message:</h3>
            <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Ce message a été envoyé depuis le formulaire de contact d'ElectroMaison
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
