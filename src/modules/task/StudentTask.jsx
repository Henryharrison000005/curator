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
      render: (text) => <span className="font-semibold text-[#16243f]">{text}</span>,
      width: 200,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-gray-700">{text}</span>,
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
              <li key={idx} className="text-gray-700">
                {m}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-400 italic">-</span>
        ),
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full bg-white border border-[#e5e7eb] shadow-2xl rounded-lg md:rounded-2xl p-3 md:p-6 lg:p-8 relative z-10">
        <div className="mb-6 md:mb-8">
          <p className="font-mono-label text-[10.5px] text-[#0e8a86] uppercase tracking-[0.24em] font-semibold">
            Student · Taskdesk
          </p>
          <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold text-[#16243f] tracking-tight">
            My Assigned Tasks
          </h1>
          <span className="mt-3 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#0e8a86] to-[#0fb5ae]" />
        </div>

        {/* Mobile Card View - Hidden on md and above */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No tasks assigned yet.</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#16243f] flex-1 truncate">
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
                <div className="text-xs text-gray-500 space-y-1">
                  <div>
                    <span className="font-medium">Assigned:</span> {task.assignedBy}
                  </div>
                  <div>
                    <span className="font-medium">Due:</span> {task.dueDate}
                  </div>
                </div>
                {task.group && task.members && task.members.length > 0 && (
                  <div className="border-t pt-2 mt-2">
                    <div className="font-semibold text-gray-800 mb-1 text-xs">
                      Members:
                    </div>
                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
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

