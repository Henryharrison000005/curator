import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { backend } from "../auth/services/authenticationService";
import TaskForm from "./TaskForm";

const statusColors = {
  "Not Started": "red",
  "In Progress": "orange",
  Completed: "green",
};

const SupervisorTasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [tasksRes, settingsRes, studentsRes] = await Promise.all([
          backend.get("/api/getSupervisorTasks"),
          backend.get("/api/getSupervisorSettings"),
          backend.get("/api/getSupervisorStudents"),
        ]);
        const { data = [] } = tasksRes?.data || {};
        setTasks(data);
        setDepartmentId(settingsRes?.data?.data?.department_id ?? null);
        const { data: studentList = [] } = studentsRes?.data || {};
        setStudents(studentList);
      } catch (error) {
        console.error("Error loading supervisor tasks:", error);
        message.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await backend.patch(`/api/supervisor/tasks/${editingTask.id}`, {
          ...values,
          department_id: departmentId,
        });
        message.success("Task updated successfully!");
      } else {
        await backend.post("/api/storeTask", {
          ...values,
          department_id: departmentId,
        });
        message.success("Task created successfully!");
      }
      const tasksRes = await backend.get("/api/getSupervisorTasks");
      const { data = [] } = tasksRes?.data || {};
      setTasks(data);
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to save task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold text-[#f5f0e8]">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status] || "blue"}>{status || "Not Started"}</Tag>
      ),
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
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Button type="link" onClick={() => openEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full bg-[#141414] border border-[#2a2a2a] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] rounded-lg md:rounded-2xl p-3 md:p-6 lg:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <p className="font-mono-label text-[10.5px] text-[#ccff00] uppercase tracking-[0.24em] font-semibold">
              Supervisor · Taskdesk
            </p>
            <h1 className="mt-1.5 text-2xl md:text-3xl font-bold font-display text-[#f5f0e8] tracking-tight">
              Manage Group Tasks
            </h1>
            <span className="mt-2.5 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#ccff00] to-[#b8e600]" />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            className="bg-[#ccff00] text-[#0a0a0a] hover:bg-[#b8e600]"
          >
            Add Task
          </Button>
        </div>

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

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        footer={null}
        title={editingTask ? "Edit Task" : "Add Task"}
        width={520}
      >
        <TaskForm
          initialValues={editingTask}
          students={students}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default SupervisorTasks;
