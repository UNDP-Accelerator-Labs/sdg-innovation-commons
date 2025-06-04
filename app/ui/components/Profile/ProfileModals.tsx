import React from "react";
import Modal from "@/app/ui/components/Modal";
import { Button } from "@/app/ui/components/Button";

interface ProfileModalsProps {
  showPasswordChange: boolean;
  setShowPasswordChange: (value: boolean) => void;
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: (value: any) => void;
  handlePasswordSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string; 
  setErrorMessage: (value: string) => void;

  showChangeEmailModal: boolean;
  setShowChangeEmailModal: (value: boolean) => void;
  newEmail: string;
  setNewEmail: (value: string) => void;
  currentPassword: string; // Current password for email update
  setCurrentPassword: (value: string) => void;
  handleEmailChangeSubmit: (e: React.FormEvent) => Promise<void>;
  emailErrorMessage: string; // Error message specific to the email modal
  setEmailErrorMessage: (value: string) => void;

  showDeleteAccountConfirm: boolean;
  setShowDeleteAccountConfirm: (value: boolean) => void;
  deleteAccountPassword: string;
  setDeleteAccountPassword: (value: string) => void;
  deleteAccountError: string;
  setDeleteAccountError: (value: string) => void;
  handleDeleteAccount: () => Promise<void>;
  userUuid: string; // Pass user's UUID for delete account API call

  showLogoutConfirm: boolean;
  setShowLogoutConfirm: (value: boolean) => void;
  handleLogout: () => Promise<void>;

  showContactContributorModal: boolean;
  setShowContactContributorModal: (value: boolean) => void;
  contactContributorForm: {
    message: string;
  };
  setContactContributorForm: (value: any) => void;
  handleContactContributorSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProfileModals: React.FC<ProfileModalsProps> = ({
  showPasswordChange,
  setShowPasswordChange,
  passwordForm,
  setPasswordForm,
  handlePasswordSubmit,
  isSubmitting,
  errorMessage, 
  setErrorMessage,

  showChangeEmailModal,
  setShowChangeEmailModal,
  newEmail,
  setNewEmail,
  currentPassword, // Current password for email update
  setCurrentPassword,
  handleEmailChangeSubmit,
  emailErrorMessage, // Error message specific to the email modal
  setEmailErrorMessage,

  showDeleteAccountConfirm,
  setShowDeleteAccountConfirm,
  deleteAccountPassword,
  setDeleteAccountPassword,
  deleteAccountError,
  setDeleteAccountError,
  handleDeleteAccount,
  userUuid, 

  showLogoutConfirm,
  setShowLogoutConfirm,
  handleLogout,

  showContactContributorModal,
  setShowContactContributorModal,
  contactContributorForm,
  setContactContributorForm,
  handleContactContributorSubmit,
}) => {
  return (
    <>
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Logout"
      >
        <p className="text-left text-sm text-gray-500">
          Are you sure you want to logout? You will need to sign in again to access your account.
        </p>
        <div className="mt-10 flex w-full flex-row space-x-10 text-center">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="w-full grow-0 cursor-pointer border border-black bg-transparent font-space-mono text-lg font-bold hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <Button
            type="button"
            className="w-full grow-0 border-l-0"
            onClick={handleLogout}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordChange}
        onClose={() => {
          setShowPasswordChange(false);
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setErrorMessage("");
        }}
        title="Change Password"
      >
        <p className="text-left text-sm text-gray-500">
          You will be logged out of all active sessions after changing your password. Please ensure you remember your new password.
          If you forget it, you will need to reset your password using the "Forgot Password" option on the login page.
        </p>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{errorMessage}</p>
            </div>
          )}
          <div>
            <label htmlFor="currentPassword" className="text-sm font-bold font-space-mono">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              className="w-full border border-black p-2"
              placeholder="Enter current password"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm font-bold font-space-mono">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              className="w-full border border-black p-2"
              placeholder="Enter new password"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-bold font-space-mono">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              className="w-full border border-black p-2"
              placeholder="Confirm new password"
              disabled={isSubmitting}
            />
          </div>
          <div className="mt-10 flex w-full flex-row space-x-10 text-center">
            <button
              onClick={() => {
                setShowPasswordChange(false);
                setPasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="w-full grow-0 cursor-pointer border border-black bg-transparent font-space-mono text-lg font-bold hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="w-full grow-0 border-l-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Change Password"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Email Modal */}
      <Modal
        isOpen={showChangeEmailModal}
        onClose={() => {
          setShowChangeEmailModal(false);
          setNewEmail("");
          setCurrentPassword(""); 
          setEmailErrorMessage(""); 
        }}
        title="Update Email"
      >
        <p className="text-left text-sm text-gray-500 mb-4">
          After submitting your new email, an authorization email will be sent to the provided address. You must confirm the action before your email is updated. 
        </p>
        <form onSubmit={handleEmailChangeSubmit} className="space-y-4">
          {emailErrorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{emailErrorMessage}</p>
            </div>
          )}
          <div>
            <label htmlFor="newEmail" className="text-sm font-bold font-space-mono">
              New Email
            </label>
            <input
              id="newEmail"
              name="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="w-full border border-black p-2"
              placeholder="Enter new email"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="currentPassword" className="text-sm font-bold font-space-mono">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full border border-black p-2"
              placeholder="Enter current password"
              disabled={isSubmitting}
            />
          </div>
          <div className="mt-10 pt-5 flex w-full flex-row space-x-10 text-center">
            <button
              onClick={() => {
                setShowChangeEmailModal(false);
                setNewEmail("");
                setCurrentPassword(""); // Clear current password when modal is closed
                setEmailErrorMessage(""); // Clear error message when modal is closed
              }}
              className="w-full grow-0 cursor-pointer border border-black bg-transparent font-space-mono text-lg font-bold hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="w-full grow-0 border-l-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Update Email"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountConfirm}
        onClose={() => {
          setShowDeleteAccountConfirm(false);
          setDeleteAccountPassword("");
          setDeleteAccountError("");
        }}
        title="Delete Account"
      >
        <p className="text-left text-sm text-gray-500">
          Your account and personal data will be deleted. Your contributions may remain in anonymized form unless you explicitly request full removal.
        </p>
        <div className="mt-4">
          <label htmlFor="deleteAccountPassword" className="text-sm font-bold font-space-mono">
            Password
          </label>
          <input
            id="deleteAccountPassword"
            name="deleteAccountPassword"
            type="password"
            value={deleteAccountPassword}
            onChange={(e) => {
              setDeleteAccountPassword(e.target.value);
              setDeleteAccountError("");
            }}
            className="w-full border border-black p-2 mt-1"
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
          {deleteAccountError && <p className="mt-2 text-sm text-red-500">{deleteAccountError}</p>}
        </div>
        <div className="mt-10 flex w-full flex-row space-x-10 text-center">
          <button
            onClick={() => {
              setShowDeleteAccountConfirm(false);
              setDeleteAccountPassword("");
              setDeleteAccountError("");
            }}
            className="w-full grow-0 cursor-pointer border border-black bg-transparent font-space-mono text-lg font-bold hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <Button
            type="button"
            className="w-full grow-0 border-l-0"
            onClick={handleDeleteAccount} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Modal>

      {/* Contact Contributor Modal */}
      <Modal
        isOpen={showContactContributorModal}
        onClose={() => {
          setShowContactContributorModal(false);
          setContactContributorForm({ message: '' });
          setErrorMessage('');
        }}
        title="Contact Contributor"
      >
        <p className="text-left text-sm text-gray-500 mb-4">
          Send a message to the contributor. Please be respectful and concise.
        </p>
        <form onSubmit={handleContactContributorSubmit} className="space-y-4">
          {errorMessage && (
            <div
              className={`bg-${errorMessage.includes('success') ? 'green' : 'red'}-100 border border-${errorMessage.includes('success') ? 'green' : 'red'}-400 text-${errorMessage.includes('success') ? 'green' : 'red'}-700 px-4 py-3 rounded mb-4`}
            >
              <p>{errorMessage}</p>
            </div>
          )}
          <div>
            <label htmlFor="message" className="text-sm font-bold font-space-mono">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={contactContributorForm.message}
              onChange={(e) =>
                setContactContributorForm({ message: e.target.value })
              }
              required
              className="w-full border border-black p-2 h-32 resize-none"
              placeholder="Enter your message"
              disabled={isSubmitting}
            />
          </div>
          <div className="mt-10 flex w-full flex-row space-x-10 text-center">
            <button
              onClick={() => {
                setShowContactContributorModal(false);
                setContactContributorForm({ message: '' });
                setErrorMessage('');
              }}
              className="w-full grow-0 cursor-pointer border border-black bg-transparent font-space-mono text-lg font-bold hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button type="submit" className="w-full grow-0 border-l-0" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileModals;
