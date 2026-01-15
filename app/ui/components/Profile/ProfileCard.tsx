import React from "react";
import { Edit, Save, X, LogOut, Calendar } from "lucide-react";

interface ProfileCardProps {
  user: {
    fullName: string;
    position: string;
    country: string;
    iso3?: string;
    joinDate: string;
    avatar: string;
    name?: string;
    uuid?: string;
    rights?: number;
    created_at?: string;
  };
  isEditing: boolean;
  handleEdit: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  setShowLogoutConfirm: (value: boolean) => void;
  personalView?: boolean;
}

const defaultProfileImage = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
  >
    <circle cx="60" cy="60" r="60" fill="#e0e0e0" />
    <circle cx="60" cy="45" r="25" fill="#bdbdbd" />
    <rect x="30" y="75" width="60" height="30" rx="15" fill="#bdbdbd" />
  </svg>
);

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  isEditing,
  handleEdit,
  handleSave,
  handleCancel,
  setShowLogoutConfirm,
  personalView,
}) => (
  <div className="bg-white border border-black border-solid p-6 text-center w-full h-full flex flex-col">
    <div className="mb-4">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
        />
      ) : (
        defaultProfileImage
      )}
    </div>
    <h2 className="text-xl font-bold mb-1">{user?.name || "N/A"}</h2>
    <p className="text-gray-600 mb-2">{user?.position || "N/A"}</p>
    <p className="text-sm text-gray-500 mb-4">{user?.country || "N/A"}</p>

    { personalView && (<div className="space-y-2 text-sm text-gray-600">
      <div className="flex items-center justify-center space-x-2">
        <Calendar className="h-4 w-4" />
        <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
      </div>
    </div>)}

    {personalView && (<div className="mt-auto pt-6 space-y-2">
      {!isEditing ? (
        <button onClick={handleEdit} className="w-full detach py-2 px-4 relative z-10 text-black font-bold">
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </span>
        </button>
      ) : (
        <div className="space-y-2">
          <button onClick={handleSave} className="w-full detach py-2 px-4 relative z-10 text-black font-bold">
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </span>
          </button>
          <button
            onClick={handleCancel}
            className="w-full border border-black py-2 px-4 bg-white hover:bg-gray-100 font-bold"
          >
            <span className="flex items-center justify-center space-x-2">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </span>
          </button>
        </div>
      )}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full border border-red-600 py-2 px-4 bg-white hover:bg-red-50 text-red-600 font-bold"
      >
        <span className="flex items-center justify-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </span>
      </button>
    </div>)}
  </div>
);

export default ProfileCard;
