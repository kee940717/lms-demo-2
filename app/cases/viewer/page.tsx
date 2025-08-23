import { DashboardLayout } from "@/components/dashboard-layout"
import { DicomViewer } from "@/components/dicom-viewer"

export default function DicomViewerPage() {
  return (
    <DashboardLayout>
      <div className="h-full">
        <DicomViewer />
      </div>
    </DashboardLayout>
  )
}
