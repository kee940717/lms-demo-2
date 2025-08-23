// Zoom Integration
export interface ZoomMeeting {
  id: string
  courseId: string
  title: string
  description: string
  startTime: Date
  duration: number // in minutes
  meetingId: string
  passcode?: string
  joinUrl: string
  hostId: string
}

// Marketing Integration
export interface MarketingContact {
  email: string
  firstName: string
  lastName: string
  role: string
  signupDate: Date
  tags: string[]
}

// Mock Zoom meetings
const zoomMeetings: ZoomMeeting[] = []

// Zoom Integration Functions
export async function createZoomMeeting(meetingData: {
  courseId: string
  title: string
  description: string
  startTime: Date
  duration: number
  hostId: string
}) {
  // Mock Zoom API call - replace with real Zoom SDK
  const meeting: ZoomMeeting = {
    id: Date.now().toString(),
    ...meetingData,
    meetingId: Math.random().toString().substring(2, 12),
    passcode: Math.random().toString().substring(2, 8),
    joinUrl: `https://zoom.us/j/${Math.random().toString().substring(2, 12)}`,
  }

  zoomMeetings.push(meeting)
  return meeting
}

export async function getZoomMeetings(courseId: string) {
  return zoomMeetings.filter((m) => m.courseId === courseId)
}

export async function updateZoomMeeting(id: string, updates: Partial<ZoomMeeting>) {
  const meetingIndex = zoomMeetings.findIndex((m) => m.id === id)
  if (meetingIndex !== -1) {
    zoomMeetings[meetingIndex] = { ...zoomMeetings[meetingIndex], ...updates }
    return zoomMeetings[meetingIndex]
  }
  return null
}

export async function deleteZoomMeeting(id: string) {
  const meetingIndex = zoomMeetings.findIndex((m) => m.id === id)
  if (meetingIndex !== -1) {
    zoomMeetings.splice(meetingIndex, 1)
    return true
  }
  return false
}

// Marketing Integration Functions
export async function syncToBrevo(contact: MarketingContact) {
  // Mock Brevo API call
  console.log("Syncing to Brevo:", contact)

  try {
    // Replace with actual Brevo API call
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        email: contact.email,
        attributes: {
          FIRSTNAME: contact.firstName,
          LASTNAME: contact.lastName,
          ROLE: contact.role,
          SIGNUP_DATE: contact.signupDate.toISOString(),
        },
        listIds: [1], // Replace with your list ID
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Brevo sync error:", error)
    return false
  }
}

export async function syncToSender(contact: MarketingContact) {
  // Mock Sender.net API call
  console.log("Syncing to Sender.net:", contact)

  try {
    // Replace with actual Sender.net API call
    const response = await fetch("https://api.sender.net/v2/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
      },
      body: JSON.stringify({
        email: contact.email,
        firstname: contact.firstName,
        lastname: contact.lastName,
        groups: ["radiology-students"], // Replace with your group
        fields: {
          role: contact.role,
          signup_date: contact.signupDate.toISOString(),
        },
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Sender.net sync error:", error)
    return false
  }
}

export async function sendWhatsAppWelcome(contact: MarketingContact, phoneNumber: string) {
  // Mock WhatsApp API call
  console.log("Sending WhatsApp welcome:", contact, phoneNumber)

  try {
    // Replace with actual WhatsApp Business API call
    const message = `Welcome to RadiologyLMS, ${contact.firstName}! 🏥\n\nYour account has been created successfully. Start your radiology education journey today!\n\nBest regards,\nRadiologyLMS Team`

    const response = await fetch("https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: message,
        },
      }),
    })

    return response.ok
  } catch (error) {
    console.error("WhatsApp send error:", error)
    return false
  }
}

// Unified marketing sync function
export async function syncUserToMarketing(user: {
  email: string
  firstName: string
  lastName: string
  role: string
  phone?: string
}) {
  const contact: MarketingContact = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    signupDate: new Date(),
    tags: [`role:${user.role}`, "new-signup"],
  }

  // Sync to all platforms
  const results = await Promise.allSettled([
    syncToBrevo(contact),
    syncToSender(contact),
    user.phone ? sendWhatsAppWelcome(contact, user.phone) : Promise.resolve(true),
  ])

  return {
    brevo: results[0].status === "fulfilled" ? results[0].value : false,
    sender: results[1].status === "fulfilled" ? results[1].value : false,
    whatsapp: results[2].status === "fulfilled" ? results[2].value : false,
  }
}
