import React from "react";
import { User, Mail, Building, Briefcase } from "lucide-react";

interface ProfileDetailsProps {
  user: {
    fullName: string;
    email: string;
    country: string;
    iso3?: string;
    position: string;
    name?: string;
    uuid?: string;
  };
  isEditing: boolean;
  editForm: {
    fullName: string;
    email: string;
    country: string;
    position: string;
    name?: string;
    uuid?: string;
    countryName?: string; 
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
  filteredCountries: any[];
  setEditForm: (value: any) => void;
  countryError: string;
  personalView?: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  user,
  isEditing,
  editForm,
  handleInputChange,
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  filteredCountries = [],
  setEditForm,
  countryError,
  personalView,
}) => (
  <div className="bg-white border border-black border-solid p-6 w-full h-full flex flex-col">
    <h3 className="text-xl font-bold mb-6 font-space-mono">Profile Information</h3>
    {!isEditing ? (
      <div className="space-y-6 flex-grow">
        <div>
          <label className="text-sm font-bold font-space-mono text-gray-600">Full Name</label>
          <div className="flex items-center space-x-2 mt-1">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-lg">{user.name}</span>
          </div>
        </div>
        {personalView && (<div>
          <label className="text-sm font-bold font-space-mono text-gray-600">Email</label>
          <div className="flex items-center space-x-2 mt-1">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-lg">{user.email}</span>
          </div>
        </div>)}
        <div>
          <label className="text-sm font-bold font-space-mono text-gray-600">Country</label>
          <div className="flex items-center space-x-2 mt-1">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-lg">{user.country}</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-bold font-space-mono text-gray-600">Position</label>
          <div className="flex items-center space-x-2 mt-1">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span className="text-lg">{user.position}</span>
          </div>
        </div>
      </div>
    ) : (<>
      {personalView && (
        <form className="space-y-6 flex-grow">
        <div>
          <label htmlFor="fullName" className="text-sm font-bold font-space-mono">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={editForm.name || user.name} 
            onChange={handleInputChange}
            className="w-full border border-black p-2 mt-1"
          />
        </div>

        {/* TODO: Fix the country search */}
        <div className="space-y-2 relative">
          <label htmlFor="country" className="text-sm font-bold font-space-mono">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Search for country"
            value={ showDropdown ? searchTerm : editForm.countryName ?? user.country } // Show search term when dropdown is open, otherwise show user's country
            onChange={(e) => {
                setSearchTerm(e.target.value)
            }} 
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow selection
            required
            className="w-full border border-black p-2"
          />
          {showDropdown &&  (
            <ul className="absolute z-10 bg-white border border-black w-full max-h-40 overflow-y-auto list-none p-0">
              {filteredCountries.map((country) => (
                <li
                  key={country.location.lat + country.location.lng}
                  onClick={() => {
                    setEditForm((prev: typeof editForm) => ({ ...prev, country: country.iso3, countryName: country.country })); // Set ISO3 code for API calls
                    setSearchTerm(country.country); // Display country name in the field
                    setShowDropdown(false);
                  }}
                  className="p-2 hover:bg-[#d2f960] cursor-pointer"
                >
                  {country.country}
                </li>
              ))}
            </ul>
          )}
          {countryError && <p className="text-red-500 text-sm">{countryError}</p>}
        </div>
        <div>
          <label htmlFor="position" className="text-sm font-bold font-space-mono">
            Position
          </label>
          <input
            id="position"
            name="position"
            type="text"
            value={editForm.position}
            onChange={handleInputChange}
            className="w-full border border-black p-2 mt-1"
          />
        </div>
      </form>)}
      </>
    )}
  </div>
);

export default ProfileDetails;
