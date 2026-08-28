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
        <div className="min-h-screen bg-[#faf7f2] flex relative overflow-hidden">
            {/* left brand panel */}
            <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between px-12 py-10 overflow-hidden bg-[#2d2a24]">
                <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-30" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-[24rem] w-[24rem] rounded-full bg-[#c4622d]/[0.08] blur-[100px]" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-[#c4622d] text-white font-display font-bold text-lg">
                        F
                    </div>
                    <div className="leading-tight">
                        <span className="font-display font-bold text-white text-lg tracking-tight block">FMS</span>
                        <span className="font-mono-label text-[9px] text-white/40 uppercase tracking-[0.2em]">Field Station</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <p className="font-mono-label text-[10px] text-[#c4622d] uppercase tracking-[0.24em] mb-6">
                        Authorized access only
                    </p>
                    <h1 className="font-display font-black text-[2.6rem] leading-[1.08] text-white tracking-tight">
                        Every field hour,
                        <br />
                        <span className="italic text-[#c4622d]">accounted for.</span>
                    </h1>
                    <p className="mt-6 text-white/45 text-[0.9rem] leading-relaxed max-w-sm">
                        FMS is where student field training becomes visible — applications filed,
                        attendance signed off, tasks assigned.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-5 font-mono-label text-[9px] text-white/25 uppercase tracking-[0.18em]">
                    <span>Placement</span>
                    <span className="h-[3px] w-[3px] rounded-full bg-[#c4622d]" />
                    <span>Supervision</span>
                    <span className="h-[3px] w-[3px] rounded-full bg-white/15" />
                    <span>Reporting</span>
                </div>
            </div>

            {/* form panel */}
            <div className="flex-1 min-h-screen flex flex-col justify-center items-center relative px-6 py-10">
                <div className="pointer-events-none absolute inset-0 crosshair" />

                <div className="relative z-10 w-full max-w-md">
                    {/* mobile brand */}
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="flex h-10 w-10 items-center justify-center bg-[#c4622d] text-white font-display font-bold text-lg">
                            F
                        </div>
                        <div className="leading-tight">
                            <span className="font-display font-bold text-[#2d2a24] text-lg tracking-tight block">FMS</span>
                            <span className="font-mono-label text-[9px] text-[#a6a199] uppercase tracking-[0.2em]">Field Station</span>
                        </div>
                    </div>

                    <div className="fms-card p-8">
                        <p className="font-mono-label text-[10px] text-[#c4622d] uppercase tracking-[0.2em] mb-2">
                            Sign in
                        </p>
                        <h2 className="font-display font-black text-2xl text-[#2d2a24] tracking-tight mb-1">
                            Welcome back
                        </h2>
                        <p className="text-sm text-[#7a756d] mb-8">
                            Enter your credentials to continue.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block font-mono-label text-[10px] font-semibold text-[#7a756d] mb-2 uppercase tracking-[0.12em]">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border border-[#e5e0d8] bg-[#faf7f2] px-4 py-3 text-[#2d2a24] focus:outline-none focus:border-[#c4622d] focus:ring-1 focus:ring-[#c4622d]/20 transition-colors placeholder:text-[#a6a199]"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block font-mono-label text-[10px] font-semibold text-[#7a756d] mb-2 uppercase tracking-[0.12em]">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-[#e5e0d8] bg-[#faf7f2] px-4 py-3 text-[#2d2a24] focus:outline-none focus:border-[#c4622d] focus:ring-1 focus:ring-[#c4622d]/20 transition-colors placeholder:text-[#a6a199]"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            {error && (
                                <p className="text-[#b83a2a] text-sm text-center font-medium">{error}</p>
                            )}

                            <button
                                disabled={loginStatus === "loading"}
                                type="submit"
                                className={`w-full btn-fms justify-center text-base py-3 ${loginStatus === "loading" ? "opacity-50 cursor-wait" : ""}`}
                            >
                                {loginStatus === "loading" ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in…
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-sm text-[#7a756d] text-center">
                            No account yet?{" "}
                            <Link to="/StudentRegistration" className="font-semibold text-[#c4622d] hover:text-[#a85225] transition-colors">
                                Register here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 text-center font-mono-label text-[10px] text-[#a6a199] uppercase tracking-[0.16em]">
                        &copy; {new Date().getFullYear()} Field Management System
                    </div>
                </div>
            </div>
        </div>
    );
}
