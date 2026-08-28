import { useEffect, useState } from "react";
import { backend } from "../auth/services/authenticationService";
import { Table, Tag } from "antd";

export default function StudentTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      try {
        const response = await backend.get("/api/studentGetTasks");
        const { data = [] } = response?.data || {};
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  const columns = [
    {
      title: "Task Name",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-[#f5f0e8]">{text}</span>,
      width: 200,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-[#9a938a]">{text}</span>,
      ellipsis: true,
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      key: "assignedBy",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const colors = {
          "Not Started": "red",
          "In Progress": "orange",
          Completed: "green",
        };
        return <Tag color={colors[status] || "blue"}>{status}</Tag>;
      },
    },
    {
      title: "Group Members",
      dataIndex: "members",
      key: "members",
      render: (members) =>
        members && members.length > 0 ? (
          <ul className="pl-2 text-xs">
            {members.map((m, idx) => (
              <li key={idx} className="text-[#9a938a]">
                {m}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-[#3a3a3a] italic">-</span>
        ),
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full bg-[#141414] border border-[#2a2a2a] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] rounded-lg md:rounded-2xl p-3 md:p-6 lg:p-8 relative z-10">
        <div className="mb-6 md:mb-8">
          <p className="font-mono-label text-[10.5px] text-[#ccff00] uppercase tracking-[0.24em] font-semibold">
            Student · Taskdesk
          </p>
          <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold text-[#f5f0e8] tracking-tight">
            My Assigned Tasks
          </h1>
          <span className="mt-3 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#ccff00] to-[#b8e600]" />
        </div>

        {/* Mobile Card View - Hidden on md and above */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center text-[#6b6560] py-8">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-[#3a3a3a] py-8">No tasks assigned yet.</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border border-[#2a2a2a] rounded-lg p-3 bg-[#141414] shadow-[0_4px_12px_-6px_rgba(0,0,0,0.4)] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#f5f0e8] flex-1 truncate">
                    {task.title}
                  </h3>
                  <Tag
                    color={
                      task.status === "Completed"
                        ? "green"
                        : task.status === "In Progress"
                        ? "orange"
                        : "red"
                    }
                    className="text-xs"
                  >
                    {task.status}
                  </Tag>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {task.description}
                </p>
                <div className="text-xs text-[#6b6560] space-y-1">
                  <div>
                    <span className="font-medium">Assigned:</span> {task.assignedBy}
                  </div>
                  <div>
                    <span className="font-medium">Due:</span> {task.dueDate}
                  </div>
                </div>
                {task.group && task.members && task.members.length > 0 && (
                  <div className="border-t pt-2 mt-2">
                    <div className="font-semibold text-[#f5f0e8] mb-1 text-xs">
                      Members:
                    </div>
                    <ul className="list-disc list-inside text-xs text-[#9a938a] space-y-0.5">
                      {task.members.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View - Hidden below md */}
        <div className="hidden md:block overflow-x-auto">
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 800 }}
            size="middle"
          />
        </div>
      </div>
    </div>
  );
}

