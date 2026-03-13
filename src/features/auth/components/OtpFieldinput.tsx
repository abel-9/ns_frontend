import { useRef } from "react";



type OtpfieldinputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

const Otpfieldinput = ({ value, onChange, length = 6 }: OtpfieldinputProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const setValueAt = (index: number, char: string) => {
    const next = [...digits];
    next[index] = char;
    onChange(next.join(""));
  };

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index: number, rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, "");

    if (!cleaned) {
      setValueAt(index, "");
      return;
    }

    // Supports typing/pasting multiple digits into one box
    const next = [...digits];
    let cursor = index;
    for (const ch of cleaned) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor++;
    }

    onChange(next.join(""));
    if (cursor < length) {
      focusInput(cursor);
    } else {
      inputRefs.current[length - 1]?.blur();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (digits[index]) {
        setValueAt(index, "");
        return;
      }

      if (index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        onChange(next.join(""));
        focusInput(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
    onChange(next.join(""));

    const nextIndex = Math.min(pasted.length, length - 1);
    focusInput(nextIndex);
  };

  return (
    <div className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          id={index === 0 ? "otp" : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`OTP digit ${index + 1}`}
          className="h-12 w-12 text-center rounded-md border outline-none bg-background border-input text-foreground text-lg font-semibold focus:ring-2 focus:ring-primary"
        />
      ))}
    </div>
  );
};

export default Otpfieldinput;