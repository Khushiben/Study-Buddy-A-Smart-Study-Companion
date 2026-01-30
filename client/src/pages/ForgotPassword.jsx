import { useState } from "react";
import "../styles/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState(""); // <-- added for demo link

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetLink(""); // reset previous link
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("📧 Password reset link sent to your email.");
        if (data.resetLink) setResetLink(data.resetLink); // <-- store demo link
      } else {
        setError(data.message || "❌ Email not found.");
      }
    } catch {
      setError("⚠️ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <h2>Forgot Password 🔐</h2>

        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}

        {/* Show clickable reset link for demo/testing */}
        {resetLink && (
          <p style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
             <a href={resetLink} style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>{resetLink}</a>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
