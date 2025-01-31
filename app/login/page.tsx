import { Suspense } from "react";
import LoginForm from "../ui/components/authentication/login";

const LogIn = () => {
  return (
    <div className="flex justify-center h-screen items-center bg-[#c0c0c0]">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LogIn;
