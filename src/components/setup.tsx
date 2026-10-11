export function Setup() {
  return (
    <div className="site-container site-setup">
      <h1>Connect your Kookee project</h1>
      <p>
        This site shows a Kookee project&apos;s blog, changelog, help center, pages and roadmap. It needs one API key
        to read them.
      </p>
      <ol>
        <li>
          Sign in to <a href="https://kookee.dev">Kookee</a> and create a project, or open one you already have.
        </li>
        <li>
          In the project, open <strong>API keys</strong> and press <strong>Create Key</strong>.
        </li>
        <li>
          Set the key as <code>KOOKEE_API_KEY</code>: in <code>.dev.vars</code> for local development, then restart{' '}
          <code>npm run dev</code>; or as a secret in the Worker&apos;s <strong>Settings → Variables and Secrets</strong> on Cloudflare, then redeploy.
        </li>
        <li>
          In <strong>Settings → Project</strong>, add your site&apos;s domain and{' '}
          <code>http://localhost</code> to <strong>Allowed Origins</strong>, so other sites cannot use the key
          from a browser.
        </li>
      </ol>
      <p>The README covers the rest: what the key can do, how content stays fresh, and what the errors mean.</p>
    </div>
  );
}
