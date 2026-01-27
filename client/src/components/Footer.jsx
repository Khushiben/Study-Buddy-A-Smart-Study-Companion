import React from "react";
import "../styles/footer.css";

function Footer({ fixed = false }) {
  return (
    <footer className={`footer ${fixed ? "footer-fixed" : ""}`}>
      <p>© 2025 Study Buddy. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
