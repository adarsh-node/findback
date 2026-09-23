import { Users } from 'lucide-react'

function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <Users className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Community Guidelines
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
                FindBack works best when people provide honest information,
                respect one another, and use the platform responsibly. These
                guidelines explain the basic behavior expected from everyone
                using the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                1. Be Honest
              </h2>

              <p className="mt-4">
                Provide accurate information when creating lost or found
                reports. Do not intentionally provide false descriptions,
                locations, dates, photographs, or other misleading information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                2. Do Not Make False Claims
              </h2>

              <p className="mt-4">
                Only claim an item when you genuinely believe it belongs to
                you. When submitting a claim, provide identifying information
                that can help the report owner verify your ownership.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                3. Protect Personal Information
              </h2>

              <p className="mt-4">
                Avoid publishing unnecessary personal information such as
                passwords, financial details, identification numbers, private
                addresses, or another person's private information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                4. Communicate Respectfully
              </h2>

              <p className="mt-4">
                Treat other users with respect. Do not use FindBack to harass,
                threaten, intimidate, insult, or repeatedly contact another
                person against their wishes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                5. Upload Appropriate Content
              </h2>

              <p className="mt-4">
                Only upload images and other content that are relevant to the
                lost or found item. Do not upload illegal, abusive,
                discriminatory, sexually explicit, or intentionally harmful
                content.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                6. Do Not Misuse the Platform
              </h2>

              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Do not create fake accounts or impersonate another person.
                </li>
                <li>
                  Do not create reports for items you did not actually lose or
                  find.
                </li>
                <li>
                  Do not repeatedly submit duplicate or misleading reports.
                </li>
                <li>
                  Do not attempt to access another user's account or data.
                </li>
                <li>
                  Do not intentionally disrupt or abuse FindBack.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                7. Stay Safe During Handover
              </h2>

              <p className="mt-4">
                FindBack cannot guarantee the identity or intentions of
                another user. When arranging an item handover, use reasonable
                caution and choose a safe and appropriate location.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                8. Report Problems
              </h2>

              <p className="mt-4">
                If you encounter suspicious activity, fraudulent claims,
                abusive behavior, or inappropriate content, use the available
                support channels to report the issue.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                9. Enforcement
              </h2>

              <p className="mt-4">
                FindBack may review reports of abuse or misuse and may remove
                content or restrict accounts when there is a reasonable basis
                to believe these guidelines or the Terms of Service have been
                violated.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                10. Keep FindBack Helpful
              </h2>

              <p className="mt-4">
                The goal of FindBack is simple: help people reconnect with
                their lost belongings. Honest reports, useful information, and
                respectful communication help make that possible.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GuidelinesPage