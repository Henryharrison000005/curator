import SettingsPage from "../../common/components/SettingsPage";

export default function InstructorSettings() {
  return (
    <SettingsPage
      settingsEndpoint="/api/getInstructorSettings"
      roleLabel="Instructor"
    />
  );
}
