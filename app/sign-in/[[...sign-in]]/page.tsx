import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn 
        fallbackRedirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
          },
        }}
      />
    </div>
  );
} 