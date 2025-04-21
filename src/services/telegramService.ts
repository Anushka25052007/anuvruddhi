
import { auth, database } from './firebase';
import { ref, get } from 'firebase/database';

/**
 * Sends a notification to Telegram when a user completes a task or reaches a milestone
 * @param message The message to send to Telegram
 * @returns Promise that resolves when the message is sent
 */
export const sendTelegramNotification = async (message: string): Promise<void> => {
  try {
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://api.telegram.org/bot7870937947:AAHJY3kj7_P1YUFpqGMWRI2Dx-YfBRfBaHI/sendMessage?chat_id=7010295728&text=${encodedMessage}`;
    
    const response = await fetch(telegramUrl);
    
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
    }
    
    console.log("Telegram notification sent successfully");
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
};

/**
 * Formats and sends a notification when a user completes a task
 * @param userId The user's ID
 * @param taskName The name of the completed task
 * @param xpEarned The XP earned for completing the task
 */
export const notifyTaskCompletion = async (userId: string, taskName: string, xpEarned: number): Promise<void> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userName = userData.fullName || 'A user';
      
      await sendTelegramNotification(`🎉 ${userName} just completed task "${taskName}" and earned ${xpEarned} XP in Anuvruddhi!`);
    }
  } catch (error) {
    console.error("Error notifying task completion:", error);
  }
};

/**
 * Formats and sends a notification when a user reaches an XP milestone
 * @param userId The user's ID
 * @param milestone The XP milestone reached (e.g., 100, 200)
 */
export const notifyXpMilestone = async (userId: string, milestone: number): Promise<void> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userName = userData.fullName || 'A user';
      
      await sendTelegramNotification(`🏆 ${userName} has reached ${milestone} XP milestone in Anuvruddhi!`);
    }
  } catch (error) {
    console.error("Error notifying XP milestone:", error);
  }
};

/**
 * Formats and sends a notification when a user earns a certificate
 * @param userId The user's ID
 * @param achievementName The name of the achievement
 */
export const notifyCertificateEarned = async (userId: string, achievementName: string): Promise<void> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userName = userData.fullName || 'A user';
      
      await sendTelegramNotification(`🎓 ${userName} has earned a certificate for "${achievementName}" in Anuvruddhi!`);
    }
  } catch (error) {
    console.error("Error notifying certificate earned:", error);
  }
};
