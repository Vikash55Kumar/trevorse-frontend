import AuthCard from "../../components/auth/AuthCard";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Divider } from "../../components/ui/Divider";
import SocialLogin from "../../components/auth/SocialLogin";
import { useNavigate } from "react-router-dom";


import type React from "react";

export default function LoginPage() {
  const navigate = useNavigate()
 function EnterEventHandler(e:React.KeyboardEvent<HTMLInputElement>){
      if(e.key==="Enter"){
                  navigate("/auth/phone")
              }
 }
   
   const clickhandler=()=>{
         navigate("/auth/phone")
   }
  return (
    <AuthCard
      title="Get started with Trevoros"
      description="Start learning and trading in minutes."
    >
      <div className="space-y-4">
        <Input label="Email" placeholder="Enter your email" onKeyUp={EnterEventHandler} />

        <Button onclick={clickhandler} >Get Started </Button>

        <Divider text="Or Continue With" />

        <SocialLogin />

        <p className="text-sm text-center">
          Already registered? <span className="text-blue-600">Login</span>
        </p>
      </div>
    </AuthCard>
  );
}