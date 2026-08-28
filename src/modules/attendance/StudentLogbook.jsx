import  { useState , useEffect } from "react";
import { backend } from '../../modules/auth/services/authenticationService';
import { message } from 'antd';


export default function LogbookPage() {
  const [showForm, setShowForm] = useState(false);
  const [formattedDate] = useState(() =>
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  );
  const [entries, setEntries] = useState([]);
  const [weekNo, setWeekNo] = useState("");
  const [hours, setHours] = useState("");
  const [activity, setActivity] = useState("");

const dateParts = formattedDate.split(',');
dateParts.shift();
const dayToDisplay = dateParts.join().trim();

  async function loadEntries(){
   try{ 
    const response = await backend.get('/api/getAttendance');
      const data = response.data.data;
      if( !Array.isArray(data) || data.length === 0 || !data ){
        return;
      }
     const sorted =  data.sort((a,b)=>new Date(a.date_iso)-new Date(b.date_iso));
      setEntries(sorted)

   }catch(err){
    message.error(err.message)
   }
  }

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await backend.get('/api/getAttendance');
        const data = response.data.data;
        if (ignore || !Array.isArray(data) || data.length === 0) {
          return;
        }
        const sorted = data.sort((a, b) => new Date(a.date_iso) - new Date(b.date_iso));
        setEntries(sorted);
      } catch (err) {
        message.error(err.message);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);


  // --- Geolocation wrapped in a Promise for cleaner syntax ---
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
       return reject("Geolocation not supported");
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };

          resolve(coords);
        },
      (err) => reject(new Error(err?.message || "Location permission denied"))
      );
    });
  };

  


  // --- Input validation separated for clarity ---
  const validateInputs = () => {
    const weekNum = Number(weekNo);
    const workHours = Number(hours);

    if (!weekNo || !hours || !activity) {
      message.warning("Please fill all fields.");
      return false;
    }

    if (weekNum <= 0 || weekNum > 6) {
      message.warning("Week number must be between 1 and 6.");
      return false;
    }

    if (workHours <= 0 || workHours > 12) {
      message.warning("Working hours must be between 1 and 12.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }

      try {
      const coords = await getLocation();
      const now = new Date();
      const date_iso = now.toISOString();
      const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
      const formattedDate = now.toISOString().split("T")[0];
      const newEntry = {   
        'date' : formattedDate,
        'date_iso': date_iso,
        'work_hours' : hours,
        'week_no' : weekNo,
        'day': dayName,
        'activity' : activity,
        'location': coords,
        'status':'pending',
        'verified_by' :null,
        'verified_at' : null,

      };
      

      await backend.post("/api/logbookStore", newEntry);
        message.success("Attendance submitted successfully!");

      // Clear form
      setShowForm(false);

      setWeekNo("");
      setHours("");
      setActivity("");
      loadEntries(); 
    } catch (err) {
      message.error(err.response?.data?.message || err.message || "Failed to submit attendance.");
    }
  };

  const handleDownload = () => {
    if (entries.length === 0) {
      message.error("No logbook data to download.");
      return;
    }

    let csv = "Index,Week No,Day,Date,Work Hours,Activity,Time In,Time Out,Status,Verified By,Verified At\n";

    entries.forEach((entry, index) => {
      csv += `${index + 1},${entry.week_no},${entry.day},${entry.date},${entry.work_hours},"${entry.activity}",${entry.time_in},${entry.time_out},${entry.status},${entry.verified_by},${entry.verified_at}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "logbook.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // const handleDownloadPDF= () => {
  //   if (!entries ||entries.length === 0) {
  //     toast.error("No logbook data to download.");
  //     return;
  //   }
  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   const logoUrl = logo;
  //   const logoSize = 25;
  //   const logoX = (pageWidth - logoSize) / 2;

  //   try {
  //   const img = new Image();
  //   img.src = logoUrl;  
  //   doc.addImage(img, "PNG", logoX, 10, logoSize, logoSize);
  // } catch (err) {
  //   toast.warn("Logo failed to load - proceeding with text only");
  // }

  // doc.setFont("helvetica", "bold");
  // doc.setFontSize(12);
  
  // // Centered Header Text
  // // The '45' and '52' are Y-coordinates (distance from top)
  // doc.text("FIELD MANAGEMENT SYSTEM", pageWidth / 2, 45, { align: "center" });
  // doc.text(`LOGBOOK FOR ${studentName?.toUpperCase() || "STUDENT"}`, pageWidth / 2, 52, { align: "center" });


  
  // const tableRows = entries.map((entry, index) => [
  //   index + 1,
  //   entry.week_no,
  //   entry.day,
  //   entry.date,
  //   entry.work_hours,
  //   entry.activity, // autoTable handles text wrapping automatically!
  //   entry.time_in,
  //   entry.time_out, // Combined for cleaner layout
  //   entry.status,
  //   entry.verified_by,
  //   entry.verified_at
  // ]);

  // // Define Columns
  // const tableHeaders = [
  //  "Index","Week No","Day","Date","Work Hours","Activity","Time In","Time Out","Status","Verified By","Verified At"
  // ];

  // doc.autoTable({
  //   head: [tableHeaders],
  //   body: tableRows,
  //   startY: 60, // Start table below the header text
  //   theme: "grid",
  //   headStyles: { 
  //       fillColor: [0, 158, 0], // Brand Teal Color
  //       fontSize: 9,
  //       halign: "center" 
  //   },
  //   styles: { 
  //       fontSize: 8, // Smaller font to fit all your columns
  //       cellPadding: 2,
  //       valign: "middle"
  //   },
  //   columnStyles: {
  //       5: { cellWidth: "auto" } // Activity gets the most space
  //   }
    
  // });


  // let finalY = doc.lastAutoTable.finalY;
  
  // // 2. Define how much space the signature block needs
  // const signatureBlockHeight = 40;
  
  // // 3. check if we have room on the current page, or need a new one
  // if (pageHeight - finalY < signatureBlockHeight) {
  //   doc.addPage();
  //   finalY = 20; // Start at top of new page
  // } else {
  //   // Push it to the bottom area specifically
  //   // If you want it specifically at the very bottom of the page:
  //   finalY = pageHeight - signatureBlockHeight - 10;
  // }

  // doc.setFont("helvetica", "normal");
  // doc.setFontSize(11);

  // // Center alignment for signature block
  // const centerX = pageWidth / 2;
  
  // doc.text("Supervisor's Name : __________________________", centerX, finalY + 10, { align: "center" });
  // doc.text("Supervisor's Signature: _______________________", centerX, finalY + 25, { align: "center" });

  // doc.save(`${studentName || "Logbook"}_Report.pdf`);


  // };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-mono-label text-[10.5px] text-[#0e8a86] uppercase tracking-[0.24em] font-semibold">
            Student · Attendance
          </p>
          <h1 className="mt-1.5 font-display text-2xl md:text-3xl font-bold text-[#16243f] tracking-tight">
            Field Logbook
          </h1>
          <span className="mt-2.5 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#0e8a86] to-[#0fb5ae]" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#0e8a86] to-[#0fb5ae] text-white px-5 py-2.5 text-sm font-semibold shadow-[0_10px_20px_-12px_rgba(15,181,174,0.7)] transition hover:brightness-105"
          >
            Fill Log Book
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#16243f] text-[#16243f] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#16243f] hover:text-white"
          >
            Download Logbook
          </button>
        </div>
      </div>

      {showForm && (
        <div className="border p-4 rounded bg-gray-100">
          <p className="font-semibold mb-2">Date: { dayToDisplay}</p>

          <div className="mb-2">
            <label className="block font-medium">Week No:</label>
            <input
              type="number"
              value={weekNo}
              onChange={(e) => setWeekNo(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Working Hours:</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Activity:</label>
            <textarea
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="border p-2 w-full rounded"
              rows="4"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Save
          </button>
        </div>
      )}

      {/* Preview Table */}
      {entries.length > 0 && (
        <table className="mt-6 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Index</th>
              <th className="border p-2">Week No</th>
              <th className="border p-2">Day</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Work Hours</th>
              <th className="border p-2">Activity</th>
              <th className="border p-2">Time In</th>
              <th className="border p-2">Time Out</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Verified By</th>
              <th className="border p-2">Verified At</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{entry.week_no}</td>
                <td className="border p-2">{entry.day}</td>
                <td className="border p-2">{entry.date}</td>
                <td className="border p-2">{entry.work_hours}</td>
                <td className="border p-2">{entry.activity}</td>
                <td className="border p-2">{entry.time_in}</td>
                <td className="border p-2">{entry.time_out}</td>
                <td className="border p-2">{entry.status}</td>
                <td className="border p-2">{entry.verified_by}</td>
                <td className="border p-2">{entry.verified_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

