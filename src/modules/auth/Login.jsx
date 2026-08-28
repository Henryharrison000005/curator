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
        <div className="min-h-screen bg-[#0a0a0a] flex relative overflow-hidden">
            {/* left brand panel */}
            <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between px-12 py-10 overflow-hidden bg-[#0e0e0e] border-r border-[#1e1e1e]">
                <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-40" />
                <div className="pointer-events-none absolute -top-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-[#ccff00]/[0.04] blur-[120px]" />
                <div className="pointer-events-none absolute bottom-0 right-0 w-full h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center bg-[#ccff00] text-[#0a0a0a] font-display font-black text-xl border-2 border-[#ccff00]">
                        F
                    </div>
                    <div className="leading-tight">
                        <span className="font-display font-black text-[#f5f0e8] text-lg tracking-tight block">FMS</span>
                        <span className="font-mono-label text-[9px] text-[#6b6560] uppercase tracking-[0.28em]">Surveyor</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <p className="font-mono-label text-[10px] text-[#ccff00] uppercase tracking-[0.3em] mb-6">
                        One secure gateway
                    </p>
                    <h1 className="font-display font-black text-[2.8rem] leading-[1.05] text-[#f5f0e8] tracking-tight">
                        Field
                        <br />
                        <span className="text-[#ccff00] italic">oversight,</span>
                        <br />
                        one record.
                    </h1>
                    <p className="mt-8 text-[#6b6560] text-[0.95rem] leading-relaxed max-w-md">
                        Placement, tasks, and attendance across every site — logged,
                        approved, and reported in real time.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-6 font-mono-label text-[9px] text-[#3a3a3a] uppercase tracking-[0.2em]">
                    <span>Placement</span>
                    <span className="h-1 w-1 rounded-full bg-[#ccff00]" />
                    <span>Supervision</span>
                    <span className="h-1 w-1 rounded-full bg-[#ff4d4d]" />
                    <span>Reporting</span>
                </div>
            </div>

            {/* form panel */}
            <div className="flex-1 min-h-screen flex flex-col justify-center items-center relative px-6 py-10">
                <div className="pointer-events-none absolute inset-0 crosshair" />

                <div className="relative z-10 w-full max-w-md">
                    {/* mobile brand */}
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="flex h-11 w-11 items-center justify-center bg-[#ccff00] text-[#0a0a0a] font-display font-black text-xl border-2 border-[#ccff00]">
                            F
                        </div>
                        <div className="leading-tight">
                            <span className="font-display font-black text-[#f5f0e8] text-xl tracking-tight block">FMS</span>
                            <span className="font-mono-label text-[9px] text-[#6b6560] uppercase tracking-[0.28em]">Surveyor</span>
                        </div>
                    </div>

                    <div className="fms-card p-8">
                        <p className="font-mono-label text-[10px] text-[#ccff00] uppercase tracking-[0.28em] mb-2">
                            Authorized access
                        </p>
                        <h2 className="font-display font-black text-3xl text-[#f5f0e8] tracking-tight mb-1">
                            Welcome back
                        </h2>
                        <p className="text-sm text-[#6b6560] mb-8">
                            Sign in with your registered credentials.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block font-mono-label text-[10px] font-semibold text-[#9a938a] mb-2 uppercase tracking-[0.16em]">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border-2 border-[#2a2a2a] bg-[#0e0e0e] rounded-none px-4 py-3 text-[#f5f0e8] focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-[#3a3a3a] font-medium"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block font-mono-label text-[10px] font-semibold text-[#9a938a] mb-2 uppercase tracking-[0.16em]">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border-2 border-[#2a2a2a] bg-[#0e0e0e] rounded-none px-4 py-3 text-[#f5f0e8] focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-[#3a3a3a] font-medium"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            {error && (
                                <p className="text-[#ff4d4d] text-sm text-center font-medium">{error}</p>
                            )}

                            <button
                                disabled={loginStatus === "loading"}
                                type="submit"
                                className={`w-full btn-fms justify-center text-base py-3 ${loginStatus === "loading" ? "opacity-40 cursor-wait" : ""}`}
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

                        <p className="mt-8 text-sm text-[#6b6560] text-center">
                            No account yet?{" "}
                            <Link to="/StudentRegistration" className="font-bold text-[#ccff00] hover:text-[#b8e600] transition-colors">
                                Register here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 text-center font-mono-label text-[10px] text-[#3a3a3a] uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Field Management System
                    </div>
                </div>
            </div>
        </div>
    );
}
