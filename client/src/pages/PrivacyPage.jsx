import { ShieldCheck } from 'lucide-react'

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Privacy Policy
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Last updated: September 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="space-y-10 text-sm leading-7 text-slate-600">
            <section>
              <p>
                FindBack is a lost and found platform designed to help people
                report lost or found belongings and connect with others who
                may have information about them.
              </p>

              <p className="mt-4">
                This Privacy Policy explains what information may be collected
                when you use FindBack and how that information is used to
                provide and improve the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                1. Information We Collect
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Account Information
                  </h3>

                  <p className="mt-1">
                    When you create an account, FindBack may collect
                    information such as your name and email address.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Report Information
                  </h3>

                  <p className="mt-1">
                    When you create a lost or found report, you may provide
                    information such as the item title, category, description,
                    date, location, and photographs.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Claim and Interaction Information
                  </h3>

                  <p className="mt-1">
                    Information you submit through claims, messages,
                    notifications, and other interactions may be stored to
                    support the lost and found process.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                2. How We Use Information
              </h2>

              <p className="mt-4">
                Information may be used to operate FindBack, authenticate
                accounts, display reports, process claims, provide
                notifications, support communication between users, maintain
                security, and improve the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                3. Report and Location Information
              </h2>

              <p className="mt-4">
                Lost and found reports may contain location information
                provided by users. You should avoid including unnecessary
                sensitive information, private addresses, passwords, financial
                information, or other information that should not be publicly
                shared.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                4. Images
              </h2>

              <p className="mt-4">
                Images uploaded to reports may be stored using our image
                hosting infrastructure and displayed as part of the relevant
                report. Only upload images that you have the right to share.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                5. Authentication and Cookies
              </h2>

              <p className="mt-4">
                FindBack uses authentication cookies to keep users signed in
                and protect authenticated actions. These cookies are used as
                part of the application's account and security functionality.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                6. Data Security
              </h2>

              <p className="mt-4">
                FindBack uses reasonable technical measures intended to protect
                account and application data. However, no internet-based
                service can guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                7. Third-Party Services
              </h2>

              <p className="mt-4">
                FindBack may rely on third-party infrastructure and services
                to operate features such as database storage and image
                hosting. Information handled by those services may be subject
                to their respective policies and terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                8. User Responsibility
              </h2>

              <p className="mt-4">
                Users are responsible for the information they choose to
                publish on FindBack. Do not publish sensitive personal
                information or information belonging to another person
                without permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                9. Changes to This Policy
              </h2>

              <p className="mt-4">
                This Privacy Policy may be updated as FindBack's features and
                services change. The updated version will be published on this
                page with a revised date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                10. Contact
              </h2>

              <p className="mt-4">
                If you have questions about this Privacy Policy or FindBack's
                handling of information, please use the Contact / Support
                section of the platform.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PrivacyPage