import fs from 'fs';
import path from 'path';
import { IUser, ILoginDetails, Role } from '../models/IUser';
import { IPet } from '../models/IPet';

// DB path
const DB_PATH = path.join(__dirname, './../db');

// Cache structure
interface DbCache {
  users: IUser[];
  pets: IPet[];
}

// Initialize empty cache
const cache: DbCache = {
  users: [],
  pets: [],
};

// Initialize cache by loading data from files
export function initCache(): void {
  console.log('Initializing database cache...');
  try {
    const usersData = fs.readFileSync(`${DB_PATH}/users.json`, 'utf8'); // Load users
    const petsData = fs.readFileSync(`${DB_PATH}/pets.json`, 'utf8');   // Load pets

    cache.users = JSON.parse(usersData);
    cache.pets = JSON.parse(petsData);

    console.log('Database cache initialized successfully');
  } catch (error) {
    console.error('Error initializing database cache:', error);
    process.exit(1);    // Exit the app if cache initialization fails
  }
}

// Get cached users
export function getCachedUsers(): IUser[] {
  return cache.users;
}

// Get cached pets
export function getCachedPets(): IPet[] {
  return cache.pets;
}

// Get a specific user with their pets populated
export function getCachedUserWithPets(id: number): IUser | null {
  const user = cache.users.find(user => user.userDetails.id === id);
  if (!user) return null;

  const userWithPets = { ...user };   // Clone the user to avoid modifying the cache directly
  const petIds = user.ownerRoleInfo?.petIDs || [];    // Get the pet IDs (handle the structure mismatch in your data)
  const userPets = cache.pets.filter(pet => petIds.includes(pet.id)); // Populate pets
  if (userWithPets.ownerRoleInfo) {
    userWithPets.ownerRoleInfo.pets = userPets;
  }

  return userWithPets;
}

// Get all users with their pets populated
export function getCachedUsersWithPets(): IUser[] {
  return cache.users.map(user => {
    const userWithPets = { ...user };   // Clone the user to avoid modifying the cache directly
    const petIds = user.ownerRoleInfo?.petIDs || [];    // Get the pet IDs (handle the structure mismatch in your data)
    const userPets = cache.pets.filter(pet => petIds.includes(pet.id)); // Populate pets
    if (userWithPets.ownerRoleInfo) {
      userWithPets.ownerRoleInfo.pets = userPets;
    }

    return userWithPets;
  });
}

export function RegisterUserCache(user: ILoginDetails): { success: boolean; message: string; user?: IUser } {
  if (!user) {
    return { success: false, message: 'User data is required' };
  }

  try {
    // Validate required fields
    if (!user.email || !user.password) {
      return { success: false, message: 'Email, and password are required' };
    }
    // Check if email already exists
    const existingUser = cache.users.find(u => u.userDetails.loginDetails.email === user.email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Generate a new ID
    const newId = Math.max(...cache.users.map(u => u.userDetails.id), 0) + 1;

    // Create new user object
    const newUser: IUser = {
      userDetails: {
        id: newId,
        fname: '',
        lname: '',
        loginDetails: {
          email: user.email,
          username: user.email,
          password: user.password, // Note: In a real app, we should hash passwords(idc for now)
        },
      },
      roles: ['petowner' as Role],
      primaryUserInfo: {
        profilePic: '',
        dob: new Date(),
        location: { name: '', longitude: 0, latitude: 0 },
        suspended: false,
        suspendReason: null,
        suspendEndsAt: null,
      },
      ownerRoleInfo: {
        petIDs: [],
      },
      minderRoleInfo: {
        rating: 0,
        bio: '',
        pictures: [],
        availability: '',
        distanceRange: 0,
        verified: false,
        serviceIDs: [],
      }
    };

    // Add to cache
    cache.users.push(newUser);

    // Write back to the database file
    fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(cache.users, null, 2) ,'utf8');

    // Return success without password
    // const { userDetails.loginDetails.password, ...userWithoutPassword } = newUser
    const { userDetails: { loginDetails: { password, ...loginDetails }, ...userDetails }, ...userWithoutPassword } = newUser;
    return {
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword as IUser
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

// Function to refresh the cache (useful for when data changes)
export function refreshCache(): void {
  initCache();
}