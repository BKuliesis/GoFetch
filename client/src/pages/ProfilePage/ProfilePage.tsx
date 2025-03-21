// // // import React from 'react';
// // // import profilePic from "server/src/db/IUser";
// // // import userName from "../../db/IUser"; 
// // // import email from "../../db/IUser";
// import { IUser } from "../../models/IUser";

// function ProfilePage() {

//     const { userName, email, profilePic } = IUser;
//     return (
//         <div>
//             <div>
//                 <img src={profilePic}/>
//             </div>
//             <div>
//                 <h1>Profile Page</h1>
//                 <p>Username: {userName}</p>
//                 <p>Email: {email}</p>

//             </div>
//             <div>
//                 <button>Edit Profile</button>
//             </div>
//         </div>
//     );
// }

// export default ProfilePage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function ProfilePage() {
//     const [user, setUser] = useState(null);
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         const getUser = async () => {
//             const userData = await fetchUser();
//             if (userData) {
//                 setUser(userData);
//             } else {
//                 setError("Failed to load user details");
//             }
//         };
//         getUser();
//     }, []);

//     if (error) return <p style={{ color: "red" }}>{error}</p>;
//     if (!user) return <p>Loading...</p>;

//     const handleEdit = () => {
//         navigate("/edit-profile");
//     };

//     return (
//         <div>
//             <div>
//                 <img src={user.profilePic} alt="Profile" width="150" height="150" />
//             </div>
//             <div>
//                 <h1>Profile Page</h1>
//                 <p>Username: {user.userName}</p>
//                 <p>Email: {user.email}</p>
//             </div>
//             <div>
//                 <button onClick={handleEdit}>Edit Profile</button>
//             </div>
//         </div>
//     );
// }

// export default ProfilePage;

// import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IRegisterUser } from "../../models/IUser"; // Keeping the import in case it's needed for TypeScript
import { useState, useEffect } from "react";

const fetchUser = async (): Promise<IRegisterUser | null> => {
    try {
        const response = await fetch("http://localhost:5000/api/user");
        if (!response.ok) throw new Error("Failed to fetch user");
        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

function ProfilePage() {
    const [user, setUser] = useState<IRegisterUser | null>(null);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const userData = await fetchUser();
            if (userData) {
                setUser(userData);
            } else {
                setError("Failed to load user details");
            }
        };
        getUser();
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div>
            {/* <div>
                <img src={user.profilePic} alt="Profile" width="150" height="150" />
            </div> */}
            <div>
                <h1>Profile Page</h1>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
            <div>
                <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            </div>
        </div>
    );
}

export default ProfilePage;
