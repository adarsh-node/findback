import { Mail, MessageCircle, ShieldAlert } from 'lucide-react'

function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <Mail className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Contact / Support
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                We're here to help with FindBack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Support */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Need help?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Contact us if you have a problem with your account, report,
              claim, notification, or any other part of FindBack.
            </p>

            <a
              href="mailto:findback.support@gmail.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <Mail className="h-4 w-4" />
              Email Support
            </a>

            <p className="mt-4 break-all text-sm text-slate-500">
              findback.support@gmail.com
            </p>
          </section>

          {/* Safety */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldAlert className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Safety & reporting
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              If you encounter a suspicious claim, fraudulent report,
              inappropriate content, or unsafe behavior, please contact
              support with the relevant details.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Please do not include passwords, payment information, or other
              unnecessary sensitive information in your email.
            </p>
          </section>
        </div>

        {/* Email */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">
            For general questions and support:
          </p>

          <a
            href="mailto:findback.support@gmail.com"
            className="mt-2 inline-block text-base font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            findback.support@gmail.com
          </a>
        </section>
      </main>
    </div>
  )
}

export default ContactPage