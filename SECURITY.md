# Security Policy

The **SattaDarshan** team takes the security, data privacy, and integrity of our civic platform seriously. We appreciate the responsible disclosure of any vulnerabilities found by researchers, developers, and users.

---

## Supported Versions

Security updates and patches are actively applied to the production deployment running on the `main` branch.

| Branch / Environment | Status | Supported |
| :--- | :--- | :--- |
| `main` (Production) | Active / Live (`https://satta-darshan-7jgo.vercel.app`) | :white_check_mark: |
| Development / Staging Branches | Ephemeral / Non-production | :x: |

---

## Reporting a Vulnerability

If you believe you have discovered a security vulnerability in SattaDarshan, please report it privately. **Do NOT file a public issue or discuss the vulnerability publicly until it has been resolved.**

### Preferred Reporting Methods

1. **GitHub Private Vulnerability Reporting (Recommended):**
   - Navigate to the **[Security tab](https://github.com/Rajchhapariya/SattaDarshan/security)** of this repository.
   - Click **"Report a vulnerability"** to open a private advisory draft.

2. **Direct Email:**
   - Send an email to the lead maintainer at **`rajchhapariya8@gmail.com`** with the subject line:
     `[SECURITY] SattaDarshan Vulnerability Report`

3. **Secure Web Contact:**
   - You can also submit an inquiry through our production **[Contact Desk](https://satta-darshan-7jgo.vercel.app/contact)** by setting the subject to `Security Vulnerability Disclosure`.

---

## What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:

- **Vulnerability Type:** (e.g., SSRF, XSS, Authentication Bypass, Secret Exposure, PII Leakage)
- **Affected Route / Component:** URL path, API endpoint, or file name.
- **Steps to Reproduce:** Clear, reproducible steps or a minimal proof-of-concept (PoC).
- **Potential Impact:** An explanation of how an attacker could exploit this vulnerability and what data/systems could be affected.
- **Proposed Fix (Optional):** If you have a remediation patch or recommendation.

---

## Response & Disclosure Process

1. **Acknowledgment:** We will acknowledge receipt of your report within **48 hours**.
2. **Investigation & Triage:** We will investigate the issue to confirm exploitability and determine severity.
3. **Remediation:** Once confirmed, a fix will be implemented, verified locally, and deployed to production.
4. **Coordinated Disclosure:** We will notify you once the fix is live. We request that you observe a standard 30-day coordinated disclosure period before sharing details publicly.
5. **Credit & Attribution:** With your permission, we are pleased to credit responsible researchers in our release notes or commit history.

---

## Scope & Ground Rules

### In Scope
- Server-Side Request Forgery (SSRF) or bypasses in the media avatar proxy.
- Unauthenticated or unauthorized execution on `/api/revalidate`.
- Data exposure or PII leakage in `/api/contact` or `/api/corrections`.
- MongoDB injection or unauthorized database mutation vectors.
- Cross-Site Scripting (XSS) or script injection in JSON-LD / HTML rendering.
- Exposure of production secrets, credentials, or private keys.

### Out of Scope
- Denial of Service (DoS/DDoS) attacks against third-party edge hosting (Vercel) or CDN infrastructure.
- Automated vulnerability scanner reports without a verified, actionable proof-of-concept.
- Social engineering, phishing, or physical attacks against maintainers.
- Missing HTTP security headers that do not have a practical, demonstrable attack scenario.

Thank you for helping keep SattaDarshan secure for all citizens!
