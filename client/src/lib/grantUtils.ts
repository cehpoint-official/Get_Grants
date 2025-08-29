import { Grant } from "@shared/schema";

export const getGrantStatus = (grant: Grant): Grant['status'] => {
    const now = new Date();
    const deadline = new Date(grant.deadline);
    const startDate = grant.startDate ? new Date(grant.startDate) : new Date(grant.createdAt);
    
    // Set time to 0 to compare dates only
    now.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    if (now > deadline) {
        return "Expired";
    }

    if (now < startDate) {
        return "Upcoming";
    }

    // Closing soon if deadline is within 7 days
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);
    if (deadline <= sevenDaysFromNow) {
        return "Closing Soon";
    }

    return "Active";
};