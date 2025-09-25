import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function UsersPage() {
  return (
    <>
      <PageMeta title="Shop" description="Shop" />
      <PageBreadcrumb pageTitle="Quản lý người dùng" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách người dùng">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
