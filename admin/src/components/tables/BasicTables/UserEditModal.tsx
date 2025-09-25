import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import Switch from "../../form/switch/Switch";
import { Modal } from "../../ui/modal";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import api from "../../../libs/axios";
type UserEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id?: number | string;
    name?: string;
    email?: string;
    role?: string;
    is_active?: boolean;
  };
  onSave: () => void;
};

export default function UserEditModal({
  isOpen,
  onClose,
  user,
  onSave,
}: UserEditModalProps) {
  const isEdit = !!user; // true nếu có user => đang edit, false => tạo mới

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "customers",
      is_active: user?.is_active ?? true,
      password: "",
    },
  });

  // Reset form khi modal mở với user khác
  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "customers",
      is_active: user?.is_active ?? true,
    });
  }, [user, reset]);

  const options = [
    { value: "admin", label: "Admin" },
    { value: "customer", label: "Khách hàng" },
    { value: "staff", label: "Nhân viên" },
  ];

  interface UserFormData {
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    password?: string;
  }

  interface ApiError {
    message?: string;
    [key: string]: unknown;
  }

  const onSubmit = async (data: UserFormData): Promise<void> => {
    try {
      if (isEdit) {
        // gọi API update user
        await api.put(`/users/${user?.id}`, data);
      } else {
        // gọi API tạo mới user
        await api.post(`/users`, data);
      }
      onSave(); // callback reload list
      onClose();
    } catch (err: unknown) {
      const error = err as ApiError;
      console.error("Error saving user:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Sửa thông tin người dùng" : "Tạo người dùng mới"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {isEdit
              ? "Cập nhật thông tin chi tiết của người dùng."
              : "Nhập thông tin để tạo người dùng mới."}
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`custom-scrollbar ${
              isEdit ? "h-[350px]" : "h-[450px]"
            }  overflow-y-auto px-2 pb-3`}
          >
            <div className="mt-2">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Thông tin cá nhân
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Tên người dùng</Label>
                  <Input
                    type="text"
                    {...register("name", { required: true })}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register("email", { required: true })}
                  />
                </div>
                {!isEdit && (
                  <>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        {...register("password", { required: true })}
                      />
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <Label>Phân Quyền</Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        options={options}
                        defaultValue={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Trạng thái</Label>
                  <Controller
                    control={control}
                    name="is_active"
                    render={({ field }) => (
                      <Switch
                        label="Hoạt động"
                        defaultChecked={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose} type="button">
              Close
            </Button>
            <Button size="sm" type="submit">
              {isEdit ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
