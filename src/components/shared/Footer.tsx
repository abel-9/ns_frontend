const Footer = () => {
  return (
    <footer className="border-t border-line bg-bg-dark px-4 py-10 text-secondary">
      <div className="page-wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="m-0 text-xl font-extrabold text-primary-foreground">NEXTstep</p>
          <p className="m-0 mt-2 text-sm text-muted">AI-Powered Scholarship Matching</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <a href="#" className="text-secondary no-underline hover:text-primary-foreground">
            Privacy Policy
          </a>
          <a href="#" className="text-secondary no-underline hover:text-primary-foreground">
            Terms of Use
          </a>
          <a href="mailto:nextstep@mu.edu.et" className="text-secondary no-underline hover:text-primary-foreground">
            Contact
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-secondary no-underline hover:text-primary-foreground"
          >
            GitHub
          </a>
        </div>

        <div className="text-sm text-muted lg:text-right">
          Mekelle Institute of Technology · Mekelle University · 2025–2026
        </div>
      </div>
    </footer>
  )
}

export default Footer
