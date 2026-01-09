export default function PrivacyPolicy() {
  return (
    <section className="flex justify-center items-center min-h-screen mt-8 2xl:mt-0">
      <div className="w-[80%] flex flex-col gap-2">
        <h1 className="text-3xl">Privacy Policy</h1>

        <p>
          We respect your privacy and are committed to protecting your personal information. This privacy policy
          explains how we handle data in our application.
        </p>

        <h2 className="text-xl">1. Information We Collect</h2>
        <p>
          When you sign in with your Google account or connect your Google Calendar, we may collect the following
          information:
        </p>
        <ul>
          <li>Your email address</li>
          <li>
            (Optional) Only if you click Link Google Account button, store refresh token from Google (used to interact
            with your Google Calendar) in database
          </li>
        </ul>

        <h2 className="text-xl">2. How We Use This Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Authenticate you and manage your session</li>
          <li>Create and manage events in your Google Calendar on your behalf</li>
        </ul>

        <h2 className="text-xl">3. How We Store and Protect Your Data</h2>
        <p>
          Refresh tokens are securely stored on our server in an access-controlled environment, they are never shared
          with third parties and are only transmitted over secure HTTPS connections. Tokens are stored in HttpOnly
          cookies and cannot be accessed via JavaScript.
        </p>

        <h2 className="text-xl">4. Data Sharing</h2>
        <p>We do not sell, rent, or share your personal data with third parties.</p>

        <h2 className="text-xl">5. Revoking Access</h2>
        <p>
          You may revoke our access to your Google Calendar at any time via your Google Account settings:
          {' '}
          <a
            className="text-blue-400"
            href="https://myaccount.google.com/permissions"
            rel="noreferrer noopener"
            target="_blank"
          >
            Google Account Permissions
          </a>
          .
        </p>

        <h2 className="text-xl">6. Contact</h2>
        <p>
          If you have any questions or concerns regarding this policy, please contact app creator at:
          {' '}
          <strong>bering856@gmail.com</strong>
        </p>

        <h2 className="text-xl">7. Password Security</h2>
        <p>
          If you register using an email and password, your password is never stored in plain text. Instead, we use a
          secure hashing algorithm to store only a hashed version of your password. This ensures that even if our
          database is compromised, your actual password remains protected.
        </p>
      </div>
    </section>
  );
}
