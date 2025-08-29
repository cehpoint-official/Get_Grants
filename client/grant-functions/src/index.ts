import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Yeh function har roz subah 1 baje chalega
export const updategrantstatuses = onSchedule("every 24 hours", async (event) => {
  logger.info("Starting scheduled grant status update.");

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const grantsRef = db.collection("grants");
  const snapshot = await grantsRef.get();
  const batch = db.batch();

  snapshot.forEach(doc => {
      const grant = doc.data();
      if (grant.deadline) {
          const deadline = (grant.deadline as admin.firestore.Timestamp).toDate();
          const startDate = grant.startDate 
              ? (grant.startDate as admin.firestore.Timestamp).toDate() 
              : (grant.createdAt as admin.firestore.Timestamp).toDate();
          
          deadline.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);

          let newStatus = grant.status;
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(now.getDate() + 7);

          if (now > deadline) {
              newStatus = "Expired";
          } else if (now < startDate) {
              newStatus = "Upcoming";
          } else if (deadline <= sevenDaysFromNow) {
              newStatus = "Closing Soon";
          } else {
              newStatus = "Active";
          }

          if (newStatus !== grant.status) {
              const grantDocRef = grantsRef.doc(doc.id);
              batch.update(grantDocRef, { status: newStatus });
              logger.info(`Updating grant ${doc.id} from ${grant.status} to ${newStatus}`);
          }
      }
  });

  try {
    await batch.commit();
    logger.info("Grant statuses updated successfully.");
  } catch (error) {
    logger.error("Error committing batch for grant status updates:", error);
  }
});