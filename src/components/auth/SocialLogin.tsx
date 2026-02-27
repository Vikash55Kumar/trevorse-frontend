import googleLogo from "../../assets/google.png"
export default function SocialLogin() {
  return (
    <button className="w-full border rounded-md py-2 flex items-center justify-center gap-2">
     <img src={googleLogo} className="size-6" alt="" />
      Sign in with Google
    </button>
  );
}