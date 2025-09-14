"use client"
import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding-flow"

export default function OnboardingPage() {
  const router = useRouter()

  const handleOnboardingComplete = (data: any) => {
    // Here you would save the user data to your backend/database
    console.log("Onboarding completed with data:", data)

    // Redirect to dashboard
    router.push("/")
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />
}
