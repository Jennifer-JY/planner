import { Suspense } from "react";
import RegisterForm from "../ui/components/authentication/register";

const Register = () => {
  return (
    <div className="flex justify-center h-screen items-center bg-[#c0c0c0]">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default Register;
