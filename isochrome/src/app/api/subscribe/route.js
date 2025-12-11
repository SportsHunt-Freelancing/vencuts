import { NextResponse } from "next/server";
import { validateAndCleanData } from "@/lib/validation";
import { appendToGoogleSheets } from "@/lib/googleSheets";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate and clean input data
    const validationResult = validateAndCleanData({ name, email });
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const cleanedData = validationResult.data;

    // Append to Google Sheets
    await appendToGoogleSheets({
      name: cleanedData.name,
      email: cleanedData.email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing! Your data has been saved.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again later." },
      { status: 500 }
    );
  }
}
