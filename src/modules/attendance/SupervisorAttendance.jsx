import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Tag, Modal, Card, message } from "antd";
import { backend } from "../../modules/auth/services/authenticationService";

export default function SupervisorAttendance() {
  const { user } = useSelector((state) => state.auth);
  const supervisorName = user?.username || "Supervisor";
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await backend.get("/api/getSupervisorAttendance");
      const data = res.data.data;
      if (!Array.isArray(data) || data.length === 0 || !data) return;
      setAttendance(
        data.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } catch (e) {
      message.error(
        e?.response?.data?.message || e.message || "Failed to load records"
      );
    }
  };

  const shallowEqual = (objA, objB, keys) =>
    keys.every((k) => String(objA[k]) === String(objB[k]));

  const [updatingId, setUpdatingId] = useState({});

  const updateStatus = async (id, payload) => {
    if (updatingId[id]) return;
    setUpdatingId((prev) => ({ ...prev, [id]: true }));

    const original = attendance.find((t) => t.id === id);
    const optimistic = { ...original, ...payload };
    setAttendance((prev) =>
      prev.map((t) => (t.id === id ? optimistic : t))
    );

    try {
      const res = await backend.patch(
        `/api/updateSupervisorAttendance/${id}`,
        payload
      );
      const updated = res?.data?.data;
      if (updated) {
        if (shallowEqual(optimistic, updated, Object.keys(updated))) {
          setAttendance((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
          );
        } else {
          await fetchAttendance();
        }
      }
      message.success(res?.data?.message || "Record updated successfully");
    } catch (err) {
      setAttendance((prev) =>
        prev.map((t) => (t.id === id ? original : t))
      );
      message.error(
        err?.response?.data?.message || err.message || "Failed to update record"
      );
    } finally {
      setUpdatingId((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleApprove = (record) => {
    if (!record.time_in || !record.time_out) {
      message.error(
        "Cannot approve before both sign-in and sign-out are present."
      );
      return;
    }
    Modal.confirm({
      title: "Approve attendance?",
      content: `Approve ${record.student_name || record.student_id} for ${record.date_iso}?`,
      okText: "Approve",
      onOk: () => updateStatus(record.id, { status: "verified" }),
    });
  };

  const handleReject = (record) => {
    Modal.confirm({
      title: "Reject attendance?",
      content: `Reject ${record.student_name || record.student_id} for ${record.date_iso}?`,
      okText: "Reject",
      okButtonProps: { danger: true },
      onOk: () => updateStatus(record.id, { status: "rejected" }),
    });
  };

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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            disabled={record.status === "verified"}
            onClick={() => handleApprove(record)}
          >
            Approve
          </Button>
          <Button
            danger
            disabled={record.status === "rejected"}
            onClick={() => handleReject(record)}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <Card
      title={
        <div>
          <p className="font-mono-label text-[10.5px] text-[#0e8a86] uppercase tracking-[0.24em] font-semibold">
            Supervisor · Attendance
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="font-display text-xl md:text-2xl font-bold text-[#16243f] tracking-tight">
              Verify Student Attendance
            </h1>
            <Tag color="geekblue">{supervisorName}</Tag>
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
