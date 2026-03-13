import useTimer from "#/hooks/timer";
import { Route } from "#/routes/auth/email-verification";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { verifyEmail } from "../services";
import { toast } from "sonner";
import Otpfieldinput from "../components/OtpFieldinput";

const OTP_EXPIRY_SECONDS = 5 * 60;
const OTP_LENGTH = 6;

const EmailVerificationScreen = () => {
  const navigate = Route.useNavigate();
  const resolvedEmail = Route.useSearch().email;
  const [otp, setOtp] = useState("");
  const secondsLeft = useTimer(OTP_EXPIRY_SECONDS);

  const { mutate: verifyUserEmail } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      navigate({ to: "/auth/signin" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify email");
    },
  });

  const handleVerifyEmail = () => {
    verifyUserEmail({ data: { email: resolvedEmail, otp } });
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const canResend = secondsLeft === 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm bg-bg-light border-border text-foreground">
        <h1 className="text-2xl font-semibold mb-2">Email Verification</h1>
        <p className="text-sm mb-6 text-muted-foreground">
          Enter the verification code sent to{" "}
          <span className="font-semibold text-foreground">{resolvedEmail || "your email"}</span>.
        </p>

        {!resolvedEmail && (
          <p className="text-xs mb-4 text-error">
            No email found. Navigate here from signup with route state:{" "}
            <code>{`navigate('/email-verification', { state: { email } })`}</code>
          </p>
        )}

        <label className="block text-sm font-medium mb-2" htmlFor="otp">
          Verification Code
        </label>

        <Otpfieldinput value={otp} onChange={setOtp} length={OTP_LENGTH} />

        <button
          type="button"
          className="w-full mt-4 rounded-md px-4 py-2 font-medium transition-colors bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleVerifyEmail}
          disabled={otp.length !== OTP_LENGTH}
        >
          Verify Email
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Code expires in <span className="font-semibold text-foreground">{formattedTime}</span>
          </span>

          <button
            type="button"
            disabled={!canResend}
            className={`font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              canResend ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;