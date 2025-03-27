// export default ProfilePage;
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { IAddress, IUser, Role } from "../../models/IUser";
import { editUser } from "../../services/Registry";

function Profile() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState<string>(`${user.name.fname} ${user.name.sname}`);
    const [email, setEmail] = useState<string>(user.loginDetails.email);
    const [address, setAddress] = useState<IAddress>(user.primaryUserInfo.address);
    const [role, setRole] = useState<Role>(user.currentRole);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        setHasUnsavedChanges(
            name !== `${user.name.fname} ${user.name.sname}` ||
            email !== user.loginDetails.email ||
            JSON.stringify(address) !== JSON.stringify(user.primaryUserInfo.address) ||
            role !== user.currentRole
        );
    }, [name, email, address, role]);

    const handleSave = async () => {
        const updatedData: IUser = {
            ...user,
            name: { fname: name.split(" ")[0], sname: name.split(" ")[1] },

            primaryUserInfo: { ...user.primaryUserInfo, address },
            currentRole: role
        };

        await editUser(user.id, updatedData);

        updateUser();
        await updateUser(updatedData);
        setHasUnsavedChanges(false);
    };

    return (
        <div>
            <h2>Your Profile</h2>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Street</label>
                <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
            </div>
            <div>
                <label>City</label>
                <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
            </div>

            <div>
                <label>Postcode</label>
                <input
                    type="text"
                    value={address.postcode}
                    onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                />
            </div>

            <div>
                <label>Country</label>
                <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
            </div>
            <div>
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                    {Object.values(Role).map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                            {roleOption}
                        </option>
                    ))}
                </select>
            </div>
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
