import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { IAddress, IUser, Role } from "../../models/IUser";
import { uploadImage, editUser } from "../../services/Registry";
import ImageViewer from "../../components/ImageViewer";

function Profile() {
    const { user, refreshUser } = useAuth();

    const [name, setName] = useState<string>(`${user.name.fname} ${user.name.sname}`);
    const [email, setEmail] = useState<string>(user.loginDetails.email);
    const [address, setAddress] = useState<IAddress>(user.primaryUserInfo.address);
    const [role] = useState<Role>(user.currentRole);
    const [profilePicture, setProfilePicture] = useState<string>(user.primaryUserInfo.profilePic);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [pictureFileNames, setPictureFileNames] = useState<string[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        setHasUnsavedChanges(
            name !== `${user.name.fname} ${user.name.sname}` ||
            email !== user.loginDetails.email ||
            JSON.stringify(address) !== JSON.stringify(user.primaryUserInfo.address) ||
            role !== user.currentRole ||
            selectedFile !== null
        );
    }, [name, email, address, role, selectedFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        let updatedProfilePicture = profilePicture;

        if (selectedFile) {
            try {
                const uploadedUrl = await uploadImage(selectedFile);
                if (uploadedUrl) {
                    updatedProfilePicture = uploadedUrl;
                } else {
                    alert("Failed to upload image.");
                    return;
                }
            } catch (error) {
                console.error("Image upload error:", error);
                alert("Error uploading image.");
                return;
            }
        }

        const updatedUser: IUser = {
            ...user,
            name: { fname: name.split(" ")[0], sname: name.split(" ")[1] },
            loginDetails: { ...user.loginDetails, email },
            primaryUserInfo: { 
                ...user.primaryUserInfo, 
                address,
                profilePicture: updatedProfilePicture
            }
        }
        const newPictureFileNames = [...pictureFileNames, ...updatedProfilePicture];
        setPictureFileNames(newPictureFileNames);;


        try {
            await editUser(user.id, updatedUser); 
            await refreshUser();
            setSelectedFile(null);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to save changes.");
        }
    };

    return (
        <div>
            <h2>Your Profile</h2>

            {/* Profile Picture */}
            <div>
                <img 
                    src={profilePicture || "/default-profile.png"} 
                    alt="Profile" 
                    onClick={() => setShowImageViewer(true)} 
                    style={{ width: "100px", height: "100px", borderRadius: "50%", cursor: "pointer" }}
                />
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {/* Image Viewer */}
            {showImageViewer && (
                <ImageViewer 
                    imageSrc={profilePicture} 
                    onClose={() => setShowImageViewer(false)} 
                />
            )}

            {/* Name */}
            <div>
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Email */}
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Address */}
            <div>
                <label>Street</label>
                <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            </div>
            <div>
                <label>City</label>
                <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div>
                <label>Postcode</label>
                <input type="text" value={address.postcode} onChange={(e) => setAddress({ ...address, postcode: e.target.value })} />
            </div>
            <div>
                <label>Country</label>
                <input type="text" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>

            {/* Role */}
            <div>
                 <label>Registered Role/s</label>
                 <ul>
                     {(Array.isArray(user.roles) ? user.roles : [user.roles]).map((roleOption: Role) => (
                        <li key={roleOption}>{roleOption}</li>
                    ))}
                </ul>
            </div>

            {/* Save Button */}
            <div>
                <button
                    disabled={!hasUnsavedChanges}
                    onClick={handleSave}
                    className={`btn btn-primary ${!hasUnsavedChanges ? "disabled" : ""}`}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default Profile;
