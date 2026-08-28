import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRegister } from "../../store/reducers/auth";
import { backend } from "../auth/services/authenticationService";

export default function StudentRegistration() {
  const dispatch = useDispatch();
  const { loginStatus, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [citizenship, setCitizenship] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [fieldStart, setFieldStart] = useState("");
  const [fieldEnd, setFieldEnd] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    backend
      .get("/api/departments")
      .then((res) => {
        if (active) setDepartments(res.data.data || []);
      })
      .catch(() => {
        if (active) setDepartments([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (!departmentId) {
      setLocalError("Please select your department.");
      return;
    }
    if (fieldEnd && fieldStart && fieldEnd < fieldStart) {
      setLocalError("Field end date cannot be before the start date.");
      return;
    }

    try {
      await dispatch(
        UserRegister({
          username,
          phone_no: phoneNo,
          email,
          password,
          password_confirmation: confirmPassword,
          full_name: fullName,
          college,
          age,
          gender,
          citizenship,
          department_id: departmentId,
          field_start_date: fieldStart,
          field_end_date: fieldEnd,
        })
      ).unwrap();
      setSubmitted(true);
    } catch {
      // error is surfaced via the `error` selector below
    }
  };

  const displayError = localError || error;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 crosshair" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[24rem] w-[24rem] rounded-full bg-[#c4622d]/[0.04] blur-[120px]" />
        <div className="relative z-10 m-auto w-full max-w-lg text-center px-6">
          <div className="fms-card px-10 py-12">
            <div className="mb-5 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center bg-[#5a8a3c] mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p className="font-mono-label text-[10px] text-[#5a8a3c] uppercase tracking-[0.2em] mb-2">
                Received · Pending approval
              </p>
              <h1 className="font-display font-black text-3xl text-[#2d2a24] tracking-tight mb-2">
                Application Submitted
              </h1>
              <p className="text-base text-[#7a756d] leading-relaxed max-w-sm">
                Your field application has been received and is now{" "}
                <span className="font-semibold text-[#2d2a24]">pending instructor approval</span>.
                You will be able to sign in once the instructor accepts your application
                and activates your account.
              </p>
            </div>
            <button type="button" onClick={() => navigate("/Login")} className="w-full btn-fms justify-center text-base">
              Go to Login
            </button>
          </div>
          <div className="mt-7 font-mono-label text-[10px] text-[#a6a199] uppercase tracking-[0.16em]">
            &copy; {new Date().getFullYear()} Field Management System
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-[#e5e0d8] bg-[#faf7f2] px-4 py-3 text-[#2d2a24] focus:outline-none focus:border-[#c4622d] focus:ring-1 focus:ring-[#c4622d]/20 transition-colors placeholder:text-[#a6a199]";
  const labelClass = "block font-mono-label text-[10px] font-semibold text-[#7a756d] mb-2 uppercase tracking-[0.12em]";

  return (
    <div className="min-h-screen bg-[#faf7f2] flex relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 crosshair" />
      <div className="pointer-events-none absolute -top-32 right-0 h-[24rem] w-[24rem] rounded-full bg-[#c4622d]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#c49a2d]/[0.03] blur-[120px]" />
      <div className="relative z-10 w-full max-w-lg my-auto px-6 py-10">
        <div className="fms-card px-8 py-9">
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-4 flex h-12 w-12 items-center justify-center bg-[#c4622d] text-white font-display font-bold text-xl">
              F
              <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#5a8a3c] ring-2 ring-white" />
            </div>
            <h1 className="font-display font-black text-xl text-[#2d2a24] tracking-tight mb-1">Field Management System</h1>
            <p className="font-mono-label text-[10px] text-[#c4622d] uppercase tracking-[0.2em]">Field Application</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className={labelClass}>Full Name</label>
                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Maria Dela Cruz" className={inputClass} required autoComplete="name" maxLength={255} />
              </div>

              <div>
                <label htmlFor="username" className={labelClass}>Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" className={inputClass} required autoComplete="username" maxLength={255} />
              </div>
              <div>
                <label htmlFor="college" className={labelClass}>College</label>
                <input type="text" id="college" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="e.g. College of Engineering" className={inputClass} required maxLength={255} />
              </div>

              <div>
                <label htmlFor="age" className={labelClass}>Age</label>
                <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 22" className={inputClass} required min={15} max={100} />
              </div>
              <div>
                <label htmlFor="gender" className={labelClass}>Gender</label>
                <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="citizenship" className={labelClass}>Citizenship</label>
                <input type="text" id="citizenship" value={citizenship} onChange={(e) => setCitizenship(e.target.value)} placeholder="e.g. Filipino" className={inputClass} required maxLength={255} />
              </div>
              <div>
                <label htmlFor="department" className={labelClass}>Department</label>
                <select id="department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className={inputClass} required>
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.dept_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fieldStart" className={labelClass}>Field Start Date</label>
                <input type="date" id="fieldStart" value={fieldStart} onChange={(e) => setFieldStart(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="fieldEnd" className={labelClass}>Field End Date</label>
                <input type="date" id="fieldEnd" value={fieldEnd} onChange={(e) => setFieldEnd(e.target.value)} className={inputClass} required />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Phone Number</label>
                <input type="tel" id="phone" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} placeholder="Enter your phone number" className={inputClass} required maxLength={15} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={inputClass} required autoComplete="email" />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className={inputClass} required autoComplete="new-password" minLength={8} />
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={inputClass} required autoComplete="new-password" minLength={8} />
              </div>
            </div>

            {displayError && (
              <p className="text-[#b83a2a] text-sm text-center font-medium">{displayError}</p>
            )}

            <button
              disabled={loginStatus === "loading"}
              type="submit"
              className={`w-full btn-fms justify-center text-base ${loginStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loginStatus === "loading" ? "Submitting application..." : "Submit Application"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#7a756d] text-center">
            Already have an account?{" "}
            <Link to="/Login" className="font-semibold text-[#c4622d] hover:text-[#a85225] transition-colors">
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-7 text-center font-mono-label text-[10px] text-[#a6a199] uppercase tracking-[0.16em]">
          &copy; {new Date().getFullYear()} Field Management System
        </div>
      </div>
    </div>
  );
}
