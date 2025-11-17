// /lib/actions.ts
'use server'

// Example server action for handling the contact form
export async function submitContactForm(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  // Here you would typically:
  // 1. Validate the data
  // 2. Send an email or save the message to your Supabase database
  console.log({ name, email, message });

  // Return a success or error message
  return { success: true, message: "Message sent successfully!" };
}
