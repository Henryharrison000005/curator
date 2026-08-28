import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Userlogin } from "../../store/reducers/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    const { isAuthenticated, loginStatus, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            dispatch(Userlogin({ email, password }));
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-ink flex relative overflow-hidden">
            {/* left brand panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-ink-2">
                <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-50" />
                <div className="pointer-events-none absolute -top-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-moss/25 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 w-full h-40 bg-gradient-to-t from-ink to-transparent" />

                <div className="relative flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-moss-2 to-moss text-white shadow-[0_8px_24px_-8px_rgba(15,181,174,0.9)] font-display font-black text-xl">
                        F
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-signal ring-2 ring-ink-2" />
                    </div>
                    <div className="leading-tight">
                        <span className="font-display font-bold text-white text-xl tracking-tight block">FMS</span>
                        <span className="font-mono-label text-[9.5px] text-white/45 uppercase tracking-[0.22em]">Field Atlas</span>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <p className="font-mono-label text-[10.5px] text-moss uppercase tracking-[0.26em] mb-5">
                        One secure gateway
                    </p>
                    <h1 className="font-display font-semibold text-4xl leading-[1.12] text-white tracking-tight">
                        Field oversight,
                        <br />
                        <span className="text-moss">charted in one place.</span>
                    </h1>
                    <p className="mt-5 text-white/60 text-base leading-relaxed">
                        Placement, tasks, and attendance across every site — logged,
                        approved, and reporting in real time.
                    </p>
                </div>

                <div className="relative flex items-center gap-6 font-mono-label text-[10px] text-white/35 uppercase tracking-[0.18em]">
                    <span>Placement</span>
                    <i className="not-italic h-1 w-1 rounded-full bg-moss" />
                    <span>Supervision</span>
                    <i className="not-italic h-1 w-1 rounded-full bg-signal" />
                    <span>Reporting</span>
                </div>
            </div>

            {/* form panel */}
            <div className="flex-1 min-h-screen flex flex-col justify-center items-center relative px-6 py-10">
                <div className="pointer-events-none absolute inset-0 topogrid opacity-60" />
                <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-moss/10 blur-3xl" />

                <div className="relative z-10 w-full max-w-md">
                    {/* mobile brand */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-moss-2 to-moss text-white font-display font-black text-xl">
                            F
                        </div>
                        <div className="leading-tight">
                            <span className="font-display font-bold text-ink-text text-xl tracking-tight block">FMS</span>
                            <span className="font-mono-label text-[9.5px] text-ink-2-text uppercase tracking-[0.22em]">Field Atlas</span>
                        </div>
                    </div>

                    <div className="fms-card px-9 py-9">
                        <p className="font-mono-label text-[10.5px] text-moss-2 uppercase tracking-[0.24em]">
                            Authorized access
                        </p>
                        <h2 className="mt-2 font-display font-semibold text-2xl text-ink-text tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-1 text-sm text-ink-2-text">
                            Sign in with your registered credentials.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-[13px] font-semibold text-ink-text mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border border-bone rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 bg-ivory/50 transition placeholder:text-ink-2-text/50"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-[13px] font-semibold text-ink-text mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-bone rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-moss focus:ring-2 focus:ring-moss/15 bg-ivory/50 transition placeholder:text-ink-2-text/50"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            {error && (
                                <p className="text-signal-2 text-sm text-center font-medium">{error}</p>
                            )}

                            <button
                                disabled={loginStatus === "loading"}
                                type="submit"
                                className={`w-full btn-fms justify-center text-base ${loginStatus === "loading" ? "opacity-60 cursor-wait" : ""}`}
                            >
                                {loginStatus === "loading" ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in…
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-ink-2-text text-center">
                            No account yet?{" "}
                            <Link to="/StudentRegistration" className="font-semibold text-moss-2 hover:text-moss underline-offset-2 hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-7 text-center font-mono-label text-[10.5px] text-ink-2-text/70 uppercase tracking-[0.18em]">
                        &copy; {new Date().getFullYear()} Field Management System
                    </div>
                </div>
            </div>
        </div>
    );
}
