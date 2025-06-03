'use client';

import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import ProfileDetails from './ProfileDetails';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileModals from './ProfileModals';
import {
  logoutCurrentSession,
  updatedProfile,
  deleteAccount,
} from '@/app/lib/data/platform-api';

interface Country {
  country: string;
  iso3: string;
}

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  country: string;
  position: string;
  joinDate: string;
  avatar: string;
  bio: string;
  created_at?: string;
  name?: string;
  uuid?: string;
  rights?: number;
  language?: string;
  secondary_languages?: string[];
  reviewer?: boolean;
  iso3?: string;
}

interface ProfileContentProps {
  countries: Country[];
  profileData: ProfileData | null;
}

export default function ProfileContent({
  countries,
  profileData,
}: ProfileContentProps) {
  const [user, setUser] = useState<ProfileData | null>(profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData | null>(profileData);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] =
    useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [deleteAccountError, setDeleteAccountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(
    countries || []
  );
  const [countryError, setCountryError] = useState('');
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(!profileData);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUpdateWarning, setShowUpdateWarning] = useState(false);

  useEffect(() => {
    if (!profileData) {
      setIsLoading(true);
      // Simulate loading delay for demonstration purposes
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [profileData]);

  useEffect(() => {
    setFilteredCountries(
      countries.filter((country) =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, countries]);

  const handleSave = async () => {
    if (!editForm?.country) {
      setCountryError('Country is required.');
      return;
    }

    // Ensure only ISO3 codes are sent
    const iso3Code = editForm?.country?.length > 3
     ? countries.find((country) => country.country === editForm?.country)
        ?.iso3 : editForm?.iso3;

    const updatedData = {
      id: user?.uuid || '',
      new_name: editForm?.name || user?.name,
      new_email: editForm?.email || user?.email,
      new_position: editForm?.position || user?.position,
      iso3: editForm?.country?.length > 3 ? iso3Code : editForm?.country,
      language: user?.language || '',
      secondary_languages: user?.secondary_languages || [],
      rights: user?.rights || 1,
    };

    try {
      setIsSubmitting(true);
      const response = await updatedProfile(updatedData);
      if (response?.status === 200) {
        window.location.href = '/login'; // Redirect to login page on successful save
      } else {
        setErrorMessage(response?.message || 'Failed to update profile.'); // Show error message
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the profile.');
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("New passwords don't match!");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long!');
      return;
    }

    if (!passwordForm.currentPassword) {
      setErrorMessage('Please enter your current password!');
      return;
    }

    const updatedData = {
      id: user?.uuid || '',
      new_password: passwordForm.newPassword,
      currentPassword: passwordForm.currentPassword,
      new_name: user?.name || '',
      new_email: user?.email || '',
      new_position: user?.position || '',
      iso3: user?.iso3 || '',
      language: user?.language || '',
      secondary_languages: user?.secondary_languages || [],
      rights: user?.rights || 1,
    };

    try {
      setIsSubmitting(true);
      const response = await updatedProfile(updatedData);
      if (response?.status === 200) {
        window.location.href = '/login'; // Redirect to login page on successful password update
      } else {
        setErrorMessage(response?.message || 'Failed to update password.'); // Show error message in modal
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the password.');
      console.error('Error updating password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail) {
      setEmailErrorMessage('Please enter a valid email address!');
      return;
    }

    if (!currentPassword) {
      setEmailErrorMessage('Please enter your current password!');
      return;
    }

    const updatedData = {
      id: user?.uuid || '',
      new_email: newEmail,
      currentPassword,
      new_name: user?.name || '',
      new_position: user?.position || '',
      iso3: user?.iso3 || '',
      language: user?.language || '',
      secondary_languages: user?.secondary_languages || [],
      rights: user?.rights || 1,
    };

    try {
      setIsSubmitting(true);
      const response = await updatedProfile(updatedData);
      if (response?.status === 200) {
        alert(
          'An email has been sent to your new email address for confirmation.'
        );
        window.location.href = '/login'; // Redirect to login page after email update
      } else {
        if (
          response?.message ===
          'An email has been sent to your email address. Please confirm the email to proceed with the email update.'
        ) {
          window.location.href = '/login'; // Redirect to login page if email already exists
          return;
        }
        setEmailErrorMessage(response?.message || 'Failed to update email.'); // Show error message in modal
      }
    } catch (error) {
      setEmailErrorMessage('An error occurred while updating the email.');
      console.error('Error updating email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      const response = await logoutCurrentSession();
      if (response?.status === 200 && response?.success) {
        window.location.href = '/';
      } else {
        console.error(
          'Failed to logout:',
          response?.message || 'Unknown error'
        );
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsSubmitting(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountPassword) {
      setDeleteAccountError('Password is required to delete your account.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await deleteAccount(
        user?.uuid || '',
        deleteAccountPassword
      );
      if (response?.status === 200) {
        setDeleteAccountError('Your account has been successfully deleted.');
        setTimeout(() => {
          window.location.href = '/'; // Redirect to home page after deletion
        }, 2000);
      } else {
        setDeleteAccountError(response?.message || 'Failed to delete account.');
      }
    } catch (error) {
      setDeleteAccountError('An error occurred while deleting the account.');
      console.error('Error deleting account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 font-bold">
          My{' '}
          <span className="slanted-bg blue">
            <span>Profile</span>
          </span>
        </h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>
      {showUpdateWarning && (
        <div className="mb-4 rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700">
          <p>
            Updating your name, email, or password will log you out and require
            you to log in again.
          </p>
        </div>
      )}
      {errorMessage && (!showPasswordChange || !showChangeEmailModal) && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileCard
            user={user!}
            isEditing={isEditing}
            handleEdit={() => {
              setShowUpdateWarning(true); // Show warning when entering edit mode
              setIsEditing(true);
            }}
            handleSave={handleSave}
            handleCancel={() => {
              setEditForm(user);
              setIsEditing(false);
              setShowUpdateWarning(false); // Hide warning when canceling edit
            }}
            setShowLogoutConfirm={setShowLogoutConfirm}
          />
        </div>
        <div className="lg:col-span-2">
          <ProfileDetails
            user={user!}
            isEditing={isEditing}
            editForm={editForm!}
            handleInputChange={(e) => {
              const { name, value } = e.target;
              setEditForm((prev) => ({ ...prev!, [name]: value }));
            }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            filteredCountries={filteredCountries}
            setEditForm={setEditForm}
            countryError={countryError}
          />
        </div>
      </div>
      <div className="mt-6 border border-solid border-black bg-white p-6">
        <h3 className="mb-6 font-space-mono text-xl font-bold">
          Account Settings
        </h3>
        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordChange(true)}
            className="block w-full border border-solid border-gray-300 p-4 text-left transition-colors hover:border-[#0072bc] hover:bg-gray-50"
          >
            <h4 className="font-bold">Change Password</h4>
            <p className="text-sm text-gray-600">
              Update your account password securely.
            </p>
          </button>
          <button
            onClick={() => setShowChangeEmailModal(true)}
            className="block w-full border border-solid border-gray-300 p-4 text-left transition-colors hover:border-[#0072bc] hover:bg-gray-50"
          >
            <h4 className="font-bold">Update Email</h4>
            <p className="text-sm text-gray-600">
              Change your account email address.
            </p>
          </button>
          <button
            onClick={() => setShowDeleteAccountConfirm(true)}
            className="block w-full border border-solid border-gray-300 p-4 text-left transition-colors hover:border-red-600 hover:bg-red-50"
          >
            <h4 className="font-bold text-red-600">Delete Account</h4>
            <p className="text-sm text-gray-600">
              Permanently delete your account.
            </p>
          </button>
        </div>
      </div>
      <ProfileModals
        userUuid={user?.uuid || ''}
        showPasswordChange={showPasswordChange}
        setShowPasswordChange={setShowPasswordChange}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        handlePasswordSubmit={handlePasswordSubmit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        showChangeEmailModal={showChangeEmailModal}
        setShowChangeEmailModal={setShowChangeEmailModal}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        currentPassword={currentPassword} // Pass currentPassword to ProfileModals
        setCurrentPassword={setCurrentPassword}
        handleEmailChangeSubmit={handleEmailChangeSubmit}
        emailErrorMessage={emailErrorMessage} // Pass emailErrorMessage to ProfileModals
        setEmailErrorMessage={setEmailErrorMessage}
        showDeleteAccountConfirm={showDeleteAccountConfirm}
        setShowDeleteAccountConfirm={setShowDeleteAccountConfirm}
        deleteAccountPassword={deleteAccountPassword}
        setDeleteAccountPassword={setDeleteAccountPassword}
        deleteAccountError={deleteAccountError}
        setDeleteAccountError={setDeleteAccountError}
        handleDeleteAccount={handleDeleteAccount}
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
        handleLogout={handleLogout}
      />
    </div>
  );
}
