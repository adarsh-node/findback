import { FileText } from "lucide-react";

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <FileText className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Terms of Service
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
                Welcome to FindBack. FindBack is a platform that helps people
                report lost and found belongings and connect with others who may
                have information about those items.
              </p>

              <p className="mt-4">
                By creating an account or using FindBack, you agree to follow
                these Terms of Service and use the platform responsibly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                1. Use of FindBack
              </h2>

              <div className="mt-4 space-y-3">
                <p>
                  FindBack is intended to help users report lost or found
                  belongings and facilitate communication between people who may
                  be connected to those reports.
                </p>

                <p>
                  You must use the platform only for lawful and legitimate
                  purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                2. Account Responsibility
              </h2>

              <p className="mt-4">
                You are responsible for providing accurate account information
                and for keeping your account credentials secure. You are also
                responsible for activity performed through your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                3. Reports and Information
              </h2>

              <p className="mt-4">
                Users should provide truthful and reasonably accurate
                information when creating lost or found reports. Do not
                intentionally create false reports, misleading descriptions,
                fraudulent claims, or duplicate reports intended to misuse the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                4. Claims and Ownership
              </h2>

              <p className="mt-4">
                Users must not falsely claim ownership of an item. When
                submitting a claim, provide information that can reasonably help
                the report owner verify that the item belongs to you.
              </p>

              <p className="mt-4">
                FindBack does not independently guarantee that a person is the
                lawful owner of an item. Users are responsible for making
                appropriate verification decisions before completing a handover.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                5. Communication and Handover
              </h2>

              <p className="mt-4">
                Users should communicate respectfully and use reasonable caution
                when arranging the return of an item. FindBack does not control
                physical meetings, transportation, payments, or the physical
                exchange of belongings between users.
              </p>

              <p className="mt-4">
                Users are responsible for choosing a safe and appropriate method
                and location for any handover.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                6. Prohibited Conduct
              </h2>

              <p className="mt-4">You must not use FindBack to:</p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Create fraudulent or intentionally misleading reports.</li>
                <li>Submit false ownership claims.</li>
                <li>Harass, threaten, or impersonate another user.</li>
                <li>Upload unlawful, abusive, or inappropriate content.</li>
                <li>Attempt to access another user's account or data.</li>
                <li>Use the platform for illegal activities.</li>
                <li>Abuse or deliberately disrupt the service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                7. User Content
              </h2>

              <p className="mt-4">
                You remain responsible for the information, descriptions,
                photographs, and other content you submit to FindBack. You
                should only upload content that you have the right to use and
                share.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                8. Safety
              </h2>

              <p className="mt-4">
                FindBack cannot guarantee the identity, intentions, or behavior
                of another user. Do not share passwords, financial credentials,
                or unnecessary sensitive information with other users.
              </p>

              <p className="mt-4">
                If a physical handover is required, users should take reasonable
                precautions and choose a safe environment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                9. Moderation and Account Restrictions
              </h2>

              <p className="mt-4">
                FindBack may restrict, suspend, or remove accounts, reports,
                claims, or other content when there is a reasonable basis to
                believe that the platform is being misused or these terms are
                being violated.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                10. Service Availability
              </h2>

              <p className="mt-4">
                FindBack is provided on an evolving basis and may occasionally
                experience maintenance, interruptions, bugs, or changes to
                functionality. We do not guarantee that the service will always
                be available or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                11. Limitation of Responsibility
              </h2>

              <p className="mt-4">
                FindBack provides a platform for connecting users. FindBack is
                not a party to the physical exchange of belongings and does not
                guarantee that a reported item will be recovered, that a claim
                will be legitimate, or that a handover will occur.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                12. Changes to These Terms
              </h2>

              <p className="mt-4">
                These Terms of Service may be updated as FindBack evolves.
                Changes will be published on this page with an updated date.
                Continued use of the platform after changes are published may
                constitute acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                13. Contact
              </h2>

              <p className="mt-4">
                If you have questions about these Terms of Service or the
                FindBack platform, please use the Contact / Support section.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TermsPage;
