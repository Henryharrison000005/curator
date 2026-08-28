import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Tag, Card, message } from "antd";
import { backend } from "../../modules/auth/services/authenticationService";

export default function InstructorAttendance() {
  const { user } = useSelector((state) => state.auth);
  const instructorName = user?.username || "Instructor";
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    let active = false;
    (async () => {
      try {
        const res = await backend.get("/api/getSupervisorAttendance");
        const data = res.data.data;
        if (active || !Array.isArray(data) || data.length === 0) return;
        setAttendance(
          data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (e) {
        message.error(
          e?.response?.data?.message || e.message || "Failed to load records"
        );
      }
    })();
    return () => {
      active = true;
    };
  }, []);

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    { title: "Day", dataIndex: "day", key: "day" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Student",
      dataIndex: "student_name",
      key: "student_name",
      render: (_, record) => record.student_name || record.student_id,
    },
    { title: "Time In", dataIndex: "time_in", key: "time_in" },
    { title: "Time Out", dataIndex: "time_out", key: "time_out" },
    {
      title: "Approval",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "verified" ? (
          <Tag color="green">Approved</Tag>
        ) : status === "rejected" ? (
          <Tag color="red">Rejected</Tag>
        ) : (
          <Tag>Pending</Tag>
        ),
    },
  ];

  return (
    <Card
      title={
        <div>
          <p className="font-mono-label text-[10.5px] text-[#ccff00] uppercase tracking-[0.24em] font-semibold">
            Instructor · Attendance
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="font-display text-xl md:text-2xl font-bold text-[#f5f0e8] tracking-tight">
              Cohort Attendance Monitor
            </h1>
            <Tag color="geekblue">{instructorName}</Tag>
          </div>
        </div>
      }
      className="max-w-7xl mx-auto mt-6 shadow"
    >
      <Table
        columns={columns}
        dataSource={attendance}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 12 }}
      />
    </Card>
  );
}
