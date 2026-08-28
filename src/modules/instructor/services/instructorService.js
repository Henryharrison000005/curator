import { backend } from "../../auth/services/authenticationService";

export const getInstructorStudents = async () => {
  const response = await backend.get("/api/instructor/students");
  return response.data;
};

export const getDepartmentSupervisors = async (departmentId) => {
  const response = await backend.get(
    `/api/instructor/departments/${departmentId}/supervisors`
  );
  return response.data;
};

export const updateStudentAssignment = async (studentId, data) => {
  const response = await backend.patch(
    `/api/instructor/students/${studentId}`,
    data
  );
  return response.data;
};

export const getApplications = async () => {
  const response = await backend.get("/api/instructor/applications");
  return response.data;
};

export const acceptApplication = async (applicationId, data) => {
  const response = await backend.post(
    `/api/instructor/applications/${applicationId}/accept`,
    data
  );
  return response.data;
};

export const rejectApplication = async (applicationId, data) => {
  const response = await backend.post(
    `/api/instructor/applications/${applicationId}/reject`,
    data
  );
  return response.data;
};
