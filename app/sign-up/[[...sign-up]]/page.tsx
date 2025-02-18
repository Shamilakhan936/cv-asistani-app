import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp
        redirectUrl="/dashboard"
        afterSignUpUrl="/dashboard"
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