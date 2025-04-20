
import { auth, database } from './firebase';
import { ref, onValue, get } from 'firebase/database';
import { toast } from '@/hooks/use-toast';

// Function to check if a user has reached milestone for certificate
export const checkForCertificateEligibility = (userId: string, callback: (type: 'xp' | 'task', data: any) => void) => {
  // Check for XP milestones
  const xpRef = ref(database, `users/${userId}/xp`);
  const xpListener = onValue(xpRef, async (snapshot) => {
    if (snapshot.exists()) {
      const currentXp = snapshot.val();
      
      // Check if user has reached 100 XP milestone
      if (currentXp >= 100) {
        // Check if certificate has been shown before
        const certificatesRef = ref(database, `users/${userId}/certificates/xp100`);
        const certificateSnapshot = await get(certificatesRef);
        
        if (!certificateSnapshot.exists()) {
          callback('xp', {
            milestone: 100,
            xp: currentXp,
            date: new Date().toISOString()
          });
        }
      }
      
      // Check for 200 XP milestone
      if (currentXp >= 200) {
        const certificates200Ref = ref(database, `users/${userId}/certificates/xp200`);
        const certificate200Snapshot = await get(certificates200Ref);
        
        if (!certificate200Snapshot.exists()) {
          callback('xp', {
            milestone: 200,
            xp: currentXp,
            date: new Date().toISOString()
          });
        }
      }
    }
  });
  
  // Check for certified tasks completion
  const tasksRef = ref(database, `users/${userId}/tasks`);
  const tasksListener = onValue(tasksRef, (snapshot) => {
    if (snapshot.exists()) {
      const tasks = snapshot.val();
      
      // Look for completed tasks with certified=true
      Object.entries(tasks).forEach(([taskId, taskData]: [string, any]) => {
        if (taskData.completed && taskData.certified) {
          // Check if this task's certificate has been shown
          const taskCertRef = ref(database, `users/${userId}/certificates/tasks/${taskId}`);
          get(taskCertRef).then(certSnapshot => {
            if (!certSnapshot.exists()) {
              callback('task', {
                taskId,
                name: taskData.name,
                date: taskData.completedDate || new Date().toISOString()
              });
            }
          });
        }
      });
    }
  });
  
  // Return unsubscribe function
  return () => {
    xpListener();
    tasksListener();
  };
};

// Initialize certificate checker for current user
export const initCertificateChecker = () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  const unsubscribe = checkForCertificateEligibility(user.uid, (type, data) => {
    if (type === 'xp') {
      toast({
        title: "🏆 XP Milestone Achieved!",
        description: `You've reached ${data.milestone} XP! Check your certificates.`,
        duration: 8000,
      });
    } else if (type === 'task') {
      toast({
        title: "🌟 New Certificate Available!",
        description: `You've earned a certificate for: ${data.name}`,
        duration: 8000,
      });
    }
  });
  
  return unsubscribe;
};
