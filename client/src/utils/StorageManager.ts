import User, { PrimaryUser, PetOwner } from "../models/User";

export function saveUser(user: User): void {
    localStorage.setItem("userID", user.userDetails.id.toString());
    
    if (user.isAdmin()) {
        localStorage.setItem("userType", "admin");
    } else if (user.userClass instanceof PrimaryUser) {
        if (user.userClass.role instanceof PetOwner) {
            localStorage.setItem("userType", "petowner");
        } else {
            localStorage.setItem("userType", "petminder");
        }
    }
}

export function getUserID(): number | null {
    const storedUser = localStorage.getItem("userID");
    return storedUser ? parseInt(storedUser, 10) : null;
}

export function clearUser(): void {
    localStorage.removeItem("userID");
    localStorage.removeItem("userType");
}