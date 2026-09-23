import {
  Bell,
  ClipboardList,
  FileText,
  Mail,
  PlusCircle,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white shadow-sm">
                F
              </span>

              <div>
                <div className="text-lg font-bold tracking-tight text-slate-900">
                  FindBack
                </div>

                <p className="text-xs text-slate-400">
                  Lost & found, connected.
                </p>
              </div>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              Helping people reconnect with their lost belongings.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Explore</h3>

            <div className="mt-4 space-y-3">
              <Link
                to="/reports"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <Search className="h-5 w-5 text-slate-600" />
                <span>Browse Reports</span>
              </Link>

              <Link
                to="/reports/new"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <PlusCircle className="h-5 w-5 text-slate-600" />
                <span>Report an Item</span>
              </Link>

              <Link
                to="/contact"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <Mail className="h-5 w-5 text-slate-600" />
                <span>Contact / Support</span>
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Account</h3>

            <div className="mt-4 space-y-3">
              <Link
                to="/profile"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <User className="h-5 w-5 text-slate-600" />
                <span>Profile</span>
              </Link>

              <Link
                to="/profile/reports"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <ClipboardList className="h-5 w-5 text-slate-600" />
                <span>My Reports</span>
              </Link>

              <Link
                to="/profile/claims"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <Bell className="h-5 w-5 text-slate-600" />
                <span>My Claims</span>
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>

            <div className="mt-4 space-y-3">
              <Link
                to="/privacy"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <ShieldCheck className="h-5 w-5 text-slate-600" />
                <span>Privacy Policy</span>
              </Link>

              <Link
                to="/terms"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <FileText className="h-5 w-5 text-slate-600" />
                <span>Terms of Service</span>
              </Link>

              <Link
                to="/guidelines"
                className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <Users className="h-5 w-5 text-slate-600" />
                <span>Community Guidelines</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © 2026 FindBack. All rights reserved.
          </p>

          <p className="text-xs text-slate-400">
            Made with <span className="text-red-500">♥</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
