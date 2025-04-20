
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAG40axoJfPkF7I1DLeND3Nznqbmz0Ue7k",
  authDomain: "hackathon-2025anushka.firebaseapp.com",
  databaseURL: "https://hackathon-2025anushka-default-rtdb.firebaseio.com",
  projectId: "hackathon-2025anushka",
  storageBucket: "hackathon-2025anushka.firebasestorage.app",
  messagingSenderId: "654810414567",
  appId: "1:654810414567:web:136aced504a029cdd2d142",
  measurementId: "G-0XNV0QPQVH"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export const getUserData = async (userId: string) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const listenToUserXp = (userId: string, callback: (xp: number) => void) => {
  const xpRef = ref(database, `users/${userId}/xp`);
  return onValue(xpRef, (snapshot) => {
    const xp = snapshot.exists() ? snapshot.val() : 0;
    callback(xp);
  });
};

export const listenToCertifiedTasks = (userId: string, callback: (tasks: any[]) => void) => {
  const tasksRef = ref(database, `users/${userId}/tasks`);
  return onValue(tasksRef, (snapshot) => {
    if (snapshot.exists()) {
      const tasksData = snapshot.val();
      const certifiedTasks = Object.values(tasksData).filter((task: any) => 
        task.certified === true && task.completed === true
      );
      callback(certifiedTasks);
    } else {
      callback([]);
    }
  });
};

export { app, database, auth };
