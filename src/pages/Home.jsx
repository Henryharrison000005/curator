import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const TICKER = [
  "Attendance Logbook",
  "Field Supervision",
  "Task Distribution",
  "Student Placement",
  "Supervisor Review",
  "Department Oversight",
  "Monthly Reporting",
];

const STEPS = [
  {
    no: "01",
    title: "File your field application",
    body: "Create a student account and submit your placement details. The form captures who you are, where you are being placed, and the field you are entering.",
    tag: "Register",
    to: "/StudentRegistration",
  },
  {
    no: "02",
    title: "Your details reach the instructor",
    body: "Your application is delivered to the overseeing instructor. Nothing is auto-approved — a real person reviews your placement before anything goes live.",
    tag: "Under review",
  },
  {
    no: "03",
    title: "Accepted, then you're in",
    body: "On acceptance your account is switched on automatically. Your sign-in is issued the moment you're cleared — no waiting on a manual password handover.",
    tag: "Accepted",
  },
];

const CAPABILITIES = [
  {
    no: "01",
    title: "Attendance logbook",
    body: "Students log every field day with work hours, activity and location. A supervisor marks each entry verified before it counts towards the record.",
    meta: "Weekly log · Supervisor sign-off",
  },
  {
    no: "02",
    title: "Task distribution",
    body: "Supervisors issue field tasks straight to their own students. Assignments stay scoped to the supervisor who created them — no crossed wires.",
    meta: "Assigned · Tracked · Completed",
  },
  {
    no: "03",
    title: "Field supervision",
    body: "Every student answers to a named supervisor and sits inside a department. Oversight stays clear-cut: the right eyes on the right students.",
    meta: "Own students · Department view",
  },
  {
    no: "04",
    title: "Reporting & review",
    body: "Attendance, tasks and progress flow into structured views for each role. Instructors watch the whole cohort; supervisors watch their section.",
    meta: "Per-role dashboards",
  },
];

const ROLES = [
  {
    name: "Student",
    mono: "you are on the ground",
    blurb: "File your application, then fill your logbook each field day and watch your supervisors sign off your hours.",
    points: ["Submit field application", "Log daily attendance", "Receive assigned tasks", "Track your approvals"],
    sigil: "S",
  },
  {
    name: "Supervisor",
    mono: "you keep the field honest",
    blurb: "Take charge of the students assigned to you — verify their logbook, hand out tasks, and run their evaluation.",
    points: ["Own your students", "Verify attendance", "Create & assign tasks", "Approve submissions"],
    sigil: "V",
  },
  {
    name: "Instructor",
    mono: "you run the programme",
    blurb: "Sit above each department. Accept or decline student applications, manage supervisors, and see the whole cohort.",
    points: ["Review applications", "Manage departments", "Oversee supervisors", "Monitor the cohort"],
    sigil: "I",
  },
];

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Monogram({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center border-2 font-display font-black leading-none ${className}`}
    >
      F
    </span>
  );
}

export default function Home() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-ink" style={{ background: "var(--ivory)" }}>
      {/* ============================ NAV ============================ */}
      <header
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-pine/95 shadow-lg shadow-black/20 backdrop-blur" : "bg-transparent"
        }`}
        style={{ background: scrolled ? "rgba(12,51,37,0.94)" : "transparent" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3" aria-label="Field Management home">
            <Monogram className="h-9 w-9 border-current text-[var(--signal)] text-lg" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-black tracking-tight text-ivory">Field Management</span>
              <span className="font-mono-label text-[0.62rem] uppercase tracking-[0.22em] opacity-70 text-ivory">
                Placement · Supervision · Reporting
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { href: "#flow", label: "How it works" },
              { href: "#capabilities", label: "Capabilities" },
              { href: "#roles", label: "Who it's for" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link font-mono-label text-xs uppercase tracking-[0.18em] text-ivory/85 hover:text-ivory"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/Login"
              className="hidden rounded-full border border-ivory/30 px-5 py-2 font-mono-label text-xs uppercase tracking-[0.18em] text-ivory transition hover:border-ivory hover:bg-ivory/10 sm:block"
            >
              Log in
            </Link>
            <Link
              to="/StudentRegistration"
              className="rounded-full bg-[var(--signal)] px-5 py-2 font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-pine shadow-lg shadow-black/20 transition hover:bg-[var(--signal-2)] hover:text-white"
              style={{ color: "var(--pine)" }}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section
        className="grain relative overflow-hidden pt-28 pb-20 text-ivory sm:pt-36 md:pb-28"
        style={{ background: "radial-gradient(130% 140% at 10% -12%, #172a4e 0%, #101c33 50%, #0a1424 100%)" }}
      >
        <div className="ledger-rules-pine pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-[var(--leaf)] opacity-[0.14] blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-[1.05fr_0.95fr]">
          {/* left copy */}
          <div>
            <p
              className="rise font-mono-label flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.28em] text-[var(--signal)]"
              style={{ "--rise-delay": "80ms" }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--leaf)] lamp" />
              Field Management System
            </p>

            <h1
              className="rise font-display mt-6 text-[2.6rem] font-black leading-[0.98] tracking-tight sm:text-6xl md:text-[4.1rem]"
              style={{ "--rise-delay": "180ms" }}
            >
              Every field hour,
              <br />
              <span className="italic text-[var(--signal)]">accounted for.</span>
            </h1>

            <p
              className="rise mt-7 max-w-md text-[1.05rem] leading-relaxed text-ivory/75"
              style={{ "--rise-delay": "280ms" }}
            >
              FMS is where student field training becomes visible — applications filed,
              attendance signed off, tasks assigned, and the whole programme supervised from one place.
            </p>

            <div
              className="rise mt-9 flex flex-wrap items-center gap-4"
              style={{ "--rise-delay": "380ms" }}
            >
              <Link
                to="/StudentRegistration"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--signal)] px-7 py-3.5 font-mono-label text-sm font-semibold uppercase tracking-[0.16em] transition hover:bg-[var(--signal-2)] hover:text-white"
                style={{ color: "var(--pine)" }}
              >
                Begin your application
                <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/Login"
                className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-7 py-3.5 font-mono-label text-sm uppercase tracking-[0.16em] text-ivory transition hover:border-[var(--signal)] hover:text-[var(--signal)]"
              >
                Log in
              </Link>
            </div>

            <p
              className="rise mt-8 font-mono-label text-[0.72rem] uppercase tracking-[0.14em] text-ivory/55"
              style={{ "--rise-delay": "460ms" }}
            >
              <span className="caret text-[var(--signal)]">▮</span> Access is issued after instructor approval —
              default password is your surname in capitals.
            </p>
          </div>

          {/* right ledger card */}
          <div className="rise relative" style={{ "--rise-delay": "320ms" }}>
            <div className="relative ml-auto w-full max-w-md rotate-[1.2deg]">
              <div
                className="absolute -inset-3 -rotate-1 rounded-[28px] border border-ivory/20"
                aria-hidden="true"
              />
              <div
                className="grain relative rounded-[24px] p-1 shadow-2xl shadow-black/40"
                style={{ background: "var(--paper)" }}
              >
                <div className="rounded-[18px] p-6 sm:p-7" style={{ background: "var(--paper)" }}>
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--line)" }}>
                    <p className="font-mono-label text-[0.65rem] uppercase tracking-[0.24em] text-[var(--ink-2)]">
                      Field Application
                    </p>
                    <span className="font-mono-label text-[0.65rem] uppercase tracking-[0.18em] text-[var(--moss)]">
                      FMS·2481
                    </span>
                  </div>

                  <div className="mt-5 space-y-1.5">
                    {[
                      { k: "STUDENT", v: "A. MASAWI", state: "accepted" },
                      { k: "PLACEMENT", v: "Field Site · Zone 4", state: "ok" },
                      { k: "FIELD", v: "Business Management", state: "ok" },
                    ].map((row, i) => (
                      <div
                        key={row.k}
                        className="ledger-line flex items-center justify-between rounded-lg px-3 py-2.5"
                        style={{
                          "--line-delay": `${620 + i * 160}ms`,
                          background: i === 0 ? "rgba(15,181,174,0.08)" : "transparent",
                        }}
                      >
                        <span className="font-mono-label text-[0.65rem] uppercase tracking-[0.14em] text-[var(--ink-2)]">
                          {row.k}
                        </span>
                        <span className="flex items-center gap-2 font-mono-label text-xs font-semibold text-[var(--ink)]">
                          {row.state === "ok" && (
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--moss)]" />
                          )}
                          {row.v}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* status strip */}
                  <div className="mt-5 rounded-xl p-4" style={{ background: "var(--pine)" }}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-[var(--ivory)]/70">
                        Application status
                      </span>
                      <span className="lamp inline-block h-2 w-2 rounded-full bg-[var(--leaf)]" />
                    </div>
                    <p className="font-mono-label mt-1 text-xs uppercase tracking-[0.14em] text-[var(--signal)]">
                      Approved · on instructor authority
                    </p>
                    <p className="mt-2 border-t pt-2 font-mono-label text-[0.62rem] text-[var(--ivory)]/70" style={{ borderColor: "rgba(244,239,225,0.14)" }}>
                      sign-in &gt; <span className="text-[var(--ivory)]">MASAWI</span>
                      <span className="caret text-[var(--signal)]">▮</span>
                    </p>
                  </div>
                </div>

                {/* approved stamp */}
                <div className="stamp pointer-events-none absolute right-6 top-20 sm:right-8">
                  <div className="flex h-24 w-24 rotate-[-10deg] items-center justify-center rounded-full border-4 text-center"
                    style={{ borderColor: "var(--signal-2)", color: "var(--signal-2)" }}
                  >
                    <span className="font-display text-[1.15rem] font-black uppercase leading-none">
                      Approved
                      <span className="mt-0.5 block font-mono-label text-[0.5rem] font-medium tracking-[0.2em]">
                        INSTRUCTOR
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom hairline */}
        <div className="relative mx-auto mt-16 max-w-6xl px-6">
          <div className="flex items-center justify-between border-t pt-5 font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-ivory/45"
            style={{ borderColor: "rgba(244,239,225,0.12)" }}
          >
            <span>Application · Attendance · Tasks</span>
            <span className="hidden sm:block">EST. FIELD TRAINING PROGRAMME</span>
            <span>FMS v1.0</span>
          </div>
        </div>
      </section>

      {/* ============================ TICKER ============================ */}
      <div className="marquee overflow-hidden border-y-2 border-pine py-3" style={{ background: "var(--signal)", borderColor: "var(--pine)" }}>
        <div className="marquee-track items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {TICKER.map((term) => (
                <span key={`${dup}-${term}`} className="flex items-center font-mono-label text-xs font-semibold uppercase tracking-[0.22em] text-pine">
                  <span className="mx-4">{term}</span>
                  <span className="text-pine/60">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================ HOW IT WORKS ============================ */}
      <section id="flow" className="scroll-mt-24 py-20 sm:py-28" style={{ background: "var(--ivory)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal max-w-2xl">
            <p className="font-mono-label text-[0.7rem] uppercase tracking-[0.26em] text-[var(--moss)]">
              The route in
            </p>
            <h2 className="font-display mt-4 text-4xl font-black leading-tight tracking-tight text-[var(--pine)] sm:text-5xl">
              Three short steps to a working account.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--ink-2)]">
              The application is deliberately human-checked. You file, an instructor decides, and only then does
              your access switch on.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.no}
                className="rule-card reveal rounded-2xl border p-7"
                style={{
                  "--reveal-delay": `${i * 120}ms`,
                  background: "var(--paper)",
                  borderColor: "var(--line)",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-5xl font-black leading-none text-pine/15">
                    {step.no}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 font-mono-label text-[0.6rem] font-semibold uppercase tracking-[0.18em]"
                    style={{
                      background: step.tag === "Accepted" ? "rgba(15,181,174,0.14)" : "rgba(255,176,32,0.18)",
                      color: step.tag === "Accepted" ? "var(--moss)" : "#7a5700",
                    }}
                  >
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-2xl font-bold leading-snug text-[var(--pine)]">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-[var(--ink-2)]">{step.body}</p>
                {step.to && (
                  <Link
                    to={step.to}
                    className="mt-5 inline-flex items-center gap-2 font-mono-label text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pine)] hover:text-[var(--signal-2)]"
                  >
                    Start here <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* activation callout — the capital surname default password */}
          <div
            className="reveal grain relative mt-8 overflow-hidden rounded-2xl border text-ivory"
            style={{ background: "radial-gradient(120% 160% at 100% 0%, #172a4e 0%, #101c33 60%, #0a1424 100%)", borderColor: "rgba(244,239,225,0.16)" }}
          >
            <div className="ledger-rules-pine pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative grid gap-8 p-8 sm:p-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
              <div>
                <p className="font-mono-label text-[0.7rem] uppercase tracking-[0.26em] text-[var(--signal)]">
                  On acceptance
                </p>
                <h3 className="font-display mt-3 text-2xl font-bold leading-snug text-ivory sm:text-3xl">
                  Your first password is your surname — in capitals.
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-ivory/70">
                  The moment an instructor accepts your field application, your account activates. For your very
                  first sign-in the password is your surname written in ALL CAPS — no spaces. Change it after you
                  log in.
                </p>
              </div>

              <div className="rounded-xl border border-ivory/15 bg-black/20 p-6 backdrop-blur-sm">
                <p className="font-mono-label text-[0.62rem] uppercase tracking-[0.22em] text-ivory/55">
                  Try it — your surname
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <code className="font-display text-3xl font-black tracking-tight text-ivory">BUKURA</code>
                  <span className="font-mono-label text-ivory/40">→</span>
                  <code className="rounded-md bg-[var(--signal)] px-3 py-1.5 font-mono-label text-sm font-semibold text-pine">
                    BUKURA
                  </code>
                </div>
                <p className="mt-4 border-t border-ivory/12 pt-3 font-mono-label text-[0.62rem] text-ivory/50">
                  surname <span className="text-ivory/80">BUKURA</span> · default password{" "}
                  <span className="text-[var(--signal)]">BUKURA</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section id="capabilities" className="scroll-mt-24 py-20 sm:py-28" style={{ background: "var(--paper)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal max-w-2xl">
            <p className="font-mono-label text-[0.7rem] uppercase tracking-[0.26em] text-[var(--moss)]">
              Capabilities
            </p>
            <h2 className="font-display mt-4 text-4xl font-black leading-tight tracking-tight text-[var(--pine)] sm:text-5xl">
              A ledger built for the whole placement.
            </h2>
          </div>

          <div className="paper-rules mt-14">
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.no}
                className={`reveal group grid gap-2 border-b py-8 transition sm:grid-cols-[auto_1fr_1.2fr_auto] sm:items-baseline sm:gap-6 ${
                  i === 0 ? "border-t" : ""
                }`}
                style={{
                  "--reveal-delay": `${i * 90}ms`,
                  borderColor: "var(--line)",
                }}
              >
                <span className="font-mono-label text-sm text-[var(--signal-2)]">{cap.no}</span>
                <h3 className="font-display text-2xl font-bold leading-tight text-[var(--pine)] sm:text-3xl">
                  {cap.title}
                </h3>
                <p className="leading-relaxed text-[var(--ink-2)]">{cap.body}</p>
                <span className="font-mono-label hidden text-[0.62rem] uppercase tracking-[0.14em] text-[var(--ink-2)]/70 sm:block">
                  {cap.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ ROLES ============================ */}
      <section id="roles" className="scroll-mt-24 py-20 sm:py-28" style={{ background: "var(--ivory)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal max-w-2xl">
            <p className="font-mono-label text-[0.7rem] uppercase tracking-[0.26em] text-[var(--moss)]">
              Who it's for
            </p>
            <h2 className="font-display mt-4 text-4xl font-black leading-tight tracking-tight text-[var(--pine)] sm:text-5xl">
              Three roles, one shared record.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ROLES.map((role, i) => (
              <div
                key={role.name}
                className="rule-card reveal relative overflow-hidden rounded-2xl border p-7"
                style={{
                  "--reveal-delay": `${i * 120}ms`,
                  background: "var(--paper)",
                  borderColor: "var(--line)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute -right-3 -top-6 text-[7rem] font-black leading-none text-pine/8"
                >
                  {role.sigil}
                </span>
                <p className="font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-[var(--signal-2)]">
                  {role.mono}
                </p>
                <h3 className="font-display mt-3 text-3xl font-black text-[var(--pine)]">{role.name}</h3>
                <p className="mt-3 leading-relaxed text-[var(--ink-2)]">{role.blurb}</p>
                <ul className="mt-6 space-y-2.5 border-t pt-5" style={{ borderColor: "var(--line)" }}>
                  {role.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-sm text-[var(--ink)]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--moss)]" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="border-t-2 border-pine py-16 sm:py-20" style={{ background: "var(--signal)" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <p className="font-mono-label text-[0.7rem] uppercase tracking-[0.28em] text-pine/70">
            Your placement starts with one form
          </p>
          <h2 className="font-display max-w-2xl text-4xl font-black leading-tight tracking-tight text-pine sm:text-5xl">
            File your field application, get accepted, start logging.
          </h2>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/StudentRegistration"
              className="rounded-full bg-pine px-8 py-3.5 font-mono-label text-sm font-semibold uppercase tracking-[0.16em] text-ivory shadow-xl transition hover:bg-[var(--pine-3)]"
            >
              Register now
            </Link>
            <Link
              to="/Login"
              className="rounded-full border-2 border-pine px-8 py-3.5 font-mono-label text-sm font-semibold uppercase tracking-[0.16em] text-pine transition hover:bg-pine hover:text-ivory"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="py-14 text-ivory" style={{ background: "var(--pine-3)" }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Monogram className="h-9 w-9 border-current text-[var(--signal)] text-lg" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-black">Field Management</span>
                <span className="font-mono-label text-[0.62rem] uppercase tracking-[0.22em] text-ivory/50">
                  Placement · Supervision · Reporting
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs leading-relaxed text-ivory/60">
              A supervision system for student field training — applications, attendance and tasks kept in one
              accountable record.
            </p>
          </div>

          <div>
            <p className="font-mono-label text-[0.65rem] uppercase tracking-[0.22em] text-ivory/45">System</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
              <li><Link to="/Login" className="hover:text-[var(--signal)]">Log in</Link></li>
              <li><Link to="/StudentRegistration" className="hover:text-[var(--signal)]">Register</Link></li>
              <li><a href="#capabilities" className="hover:text-[var(--signal)]">Capabilities</a></li>
              <li><a href="#roles" className="hover:text-[var(--signal)]">Roles</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono-label text-[0.65rem] uppercase tracking-[0.22em] text-ivory/45">Field note</p>
            <p className="mt-4 font-mono-label text-sm leading-relaxed text-ivory/60">
              Default first password = your surname in CAPITALS.
              <br />
              Change it on your first sign-in.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl border-t border-ivory/12 px-6 pt-6">
          <div className="flex flex-col justify-between gap-2 font-mono-label text-[0.62rem] uppercase tracking-[0.18em] text-ivory/40 sm:flex-row">
            <span>© {new Date().getFullYear()} Field Management System</span>
            <span>Built for supervised field training</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
