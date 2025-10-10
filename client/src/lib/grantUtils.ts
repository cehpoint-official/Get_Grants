import { Grant } from "@shared/schema";

export const getGrantStatus = (grant: Grant): Grant['status'] => {
    const now = new Date();
    const deadline = new Date(grant.deadline);
    const startDate = grant.startDate ? new Date(grant.startDate) : new Date(grant.createdAt);
    
    // Set time to 0 to compare dates only
    now.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    // Debug logging (remove in production)
    console.log(`Grant: ${grant.title}`);
    console.log(`Current date: ${now.toDateString()}`);
    console.log(`Start date: ${startDate.toDateString()}`);
    console.log(`Deadline: ${deadline.toDateString()}`);

    // If deadline has passed, grant is expired
    if (now > deadline) {
        console.log(`Status: Expired (deadline passed)`);
        return "Expired";
    }

    // If start date is in the future, grant is upcoming
    if (now < startDate) {
        console.log(`Status: Upcoming (start date in future)`);
        return "Upcoming";
    }

    // Check if deadline is within 7 days (Closing Soon)
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);
    if (deadline <= sevenDaysFromNow) {
        console.log(`Status: Closing Soon (deadline within 7 days)`);
        return "Closing Soon";
    }

    // If we're past start date and deadline is more than 7 days away, it's active
    console.log(`Status: Active (past start date, deadline more than 7 days away)`);
    return "Active";
};

export const getStatusColor = (status: Grant['status']): string => {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-800";
        case "Upcoming":
            return "bg-blue-100 text-blue-800";
        case "Closing Soon":
            return "bg-orange-100 text-orange-800";
        case "Expired":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const getStatusBadgeVariant = (status: Grant['status']): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
        case "Active":
            return "default";
        case "Upcoming":
            return "outline";
        case "Closing Soon":
            return "outline";
        case "Expired":
            return "destructive";
        default:
            return "outline";
    }
};