
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
import type { Profile } from "../types/type";


interface GoogleJwtPayload extends JwtPayload {
  name?: string;
  email?: string;
  picture?: string;
}

export default function GoogleLoginButton({
  onSuccess,
}: {
  onSuccess: (p: Profile) => void;
}) {
  const handleSuccess = (res: CredentialResponse) => {
    try {
      const token = res.credential;
      if (!token) throw new Error("Missing credential");
      const payload = jwtDecode<GoogleJwtPayload>(token);
      onSuccess({
        name: payload.name ?? "",
        email: payload.email ?? "",
        picture: payload.picture,
        idToken: token,
      });
    } catch (e) {
      console.error(e);
      alert("Sign-in failed. Please try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Login failed")}
      useOneTap={false}
    />
  );
}
