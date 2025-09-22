import { FirebaseError } from "firebase/app";

export interface UserFriendlyError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: string;
}

const FIREBASE_ERROR_MESSAGES: Record<string, UserFriendlyError> = {
  'auth/user-not-found': {
    title: 'Account Not Found',
    message: 'No account found with this email address. Please check your email or create a new account.',
    type: 'error',
    action: 'Try signing up instead'
  },
  'auth/wrong-password': {
    title: 'Incorrect Password',
    message: 'The password you entered is incorrect. Please try again.',
    type: 'error',
    action: 'Reset password'
  },
  'auth/invalid-email': {
    title: 'Invalid Email',
    message: 'Please enter a valid email address.',
    type: 'error'
  },
  'auth/email-already-in-use': {
    title: 'Email Already Registered',
    message: 'An account with this email already exists. Please try logging in instead.',
    type: 'error',
    action: 'Go to Login'
  },
  'auth/weak-password': {
    title: 'Password Too Weak',
    message: 'Please choose a stronger password with at least 6 characters.',
    type: 'error'
  },
  'auth/invalid-credential': {
    title: 'Invalid Login Details',
    message: 'The email or password you entered is incorrect. Please check and try again.',
    type: 'error'
  },
  'auth/too-many-requests': {
    title: 'Too Many Attempts',
    message: 'You\'ve tried too many times. Please wait a few minutes before trying again.',
    type: 'warning',
    action: 'Try again later'
  },
  'auth/network-request-failed': {
    title: 'Connection Problem',
    message: 'Unable to connect to our servers. Please check your internet connection and try again.',
    type: 'error',
    action: 'Retry'
  },
  'auth/operation-not-allowed': {
    title: 'Sign-in Method Disabled',
    message: 'This sign-in method is currently disabled. Please try a different method.',
    type: 'error'
  },
  'auth/requires-recent-login': {
    title: 'Re-authentication Required',
    message: 'For security reasons, please log in again to continue.',
    type: 'warning',
    action: 'Login Again'
  },
  'auth/user-disabled': {
    title: 'Account Disabled',
    message: 'Your account has been disabled. Please contact support for assistance.',
    type: 'error',
    action: 'Contact Support'
  },
  'auth/invalid-verification-code': {
    title: 'Invalid Verification Code',
    message: 'The verification code you entered is incorrect. Please try again.',
    type: 'error'
  },
  'auth/invalid-verification-id': {
    title: 'Verification Failed',
    message: 'The verification process failed. Please try again.',
    type: 'error'
  },
  'auth/code-expired': {
    title: 'Code Expired',
    message: 'The verification code has expired. Please request a new one.',
    type: 'error',
    action: 'Request New Code'
  },
  'auth/missing-phone-number': {
    title: 'Phone Number Required',
    message: 'Please provide a valid phone number to continue.',
    type: 'error'
  },
  'auth/invalid-phone-number': {
    title: 'Invalid Phone Number',
    message: 'Please enter a valid phone number with country code.',
    type: 'error'
  },
  'auth/quota-exceeded': {
    title: 'Service Temporarily Unavailable',
    message: 'We\'re experiencing high traffic. Please try again in a few minutes.',
    type: 'warning',
    action: 'Try Again Later'
  },
  'auth/app-deleted': {
    title: 'App Configuration Error',
    message: 'There\'s a configuration issue. Please contact support.',
    type: 'error',
    action: 'Contact Support'
  },
  'auth/invalid-api-key': {
    title: 'Configuration Error',
    message: 'There\'s a configuration issue. Please contact support.',
    type: 'error',
    action: 'Contact Support'
  },
  'auth/invalid-user-token': {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    type: 'warning',
    action: 'Login Again'
  },
  'auth/user-token-expired': {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    type: 'warning',
    action: 'Login Again'
  },
  'auth/null-user': {
    title: 'Authentication Error',
    message: 'There was an authentication error. Please try logging in again.',
    type: 'error',
    action: 'Login Again'
  },
  'auth/invalid-email-verified': {
    title: 'Email Not Verified',
    message: 'Please verify your email address before continuing.',
    type: 'warning',
    action: 'Verify Email'
  },
  'auth/credential-already-in-use': {
    title: 'Account Already Exists',
    message: 'This account is already linked to another user. Please try a different method.',
    type: 'error'
  },
  'auth/account-exists-with-different-credential': {
    title: 'Account Already Exists',
    message: 'An account already exists with this email using a different sign-in method.',
    type: 'error',
    action: 'Try Different Method'
  },
  'auth/popup-closed-by-user': {
    title: 'Sign-in Cancelled',
    message: 'You cancelled the sign-in process. Please try again if you want to continue.',
    type: 'info',
    action: 'Try Again'
  },
  'auth/popup-blocked': {
    title: 'Popup Blocked',
    message: 'Please allow popups for this site to complete the sign-in process.',
    type: 'warning',
    action: 'Allow Popups'
  },
  'auth/cancelled-popup-request': {
    title: 'Sign-in In Progress',
    message: 'A sign-in process is already in progress. Please wait for it to complete.',
    type: 'info'
  },
  'auth/timeout': {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please check your connection and try again.',
    type: 'error',
    action: 'Retry'
  }
};

const FIRESTORE_ERROR_MESSAGES: Record<string, UserFriendlyError> = {
  'permission-denied': {
    title: 'Access Denied',
    message: 'You don\'t have permission to perform this action.',
    type: 'error',
    action: 'Contact Support'
  },
  'unavailable': {
    title: 'Service Unavailable',
    message: 'Our database is temporarily unavailable. Please try again in a few minutes.',
    type: 'warning',
    action: 'Try Again Later'
  },
  'unauthenticated': {
    title: 'Authentication Required',
    message: 'Please log in to continue.',
    type: 'warning',
    action: 'Login'
  },
  'not-found': {
    title: 'Not Found',
    message: 'The requested information could not be found.',
    type: 'error'
  },
  'already-exists': {
    title: 'Already Exists',
    message: 'This item already exists.',
    type: 'warning'
  },
  'failed-precondition': {
    title: 'Operation Failed',
    message: 'This operation cannot be completed at this time.',
    type: 'error'
  },
  'aborted': {
    title: 'Operation Cancelled',
    message: 'The operation was cancelled. Please try again.',
    type: 'info',
    action: 'Try Again'
  },
  'out-of-range': {
    title: 'Invalid Range',
    message: 'The requested range is invalid.',
    type: 'error'
  },
  'unimplemented': {
    title: 'Feature Not Available',
    message: 'This feature is not yet available.',
    type: 'info'
  },
  'internal': {
    title: 'Internal Error',
    message: 'An internal error occurred. Please try again later.',
    type: 'error',
    action: 'Try Again Later'
  },
  'data-loss': {
    title: 'Data Error',
    message: 'There was a data error. Please try again.',
    type: 'error',
    action: 'Try Again'
  }
};

const NETWORK_ERROR_PATTERNS = [
  { pattern: /network/i, message: 'Please check your internet connection and try again.' },
  { pattern: /timeout/i, message: 'The request timed out. Please try again.' },
  { pattern: /offline/i, message: 'You appear to be offline. Please check your connection.' },
  { pattern: /connection/i, message: 'Connection failed. Please try again.' }
];

export function getFirebaseErrorMessage(error: any): UserFriendlyError {
  if (error?.code && FIREBASE_ERROR_MESSAGES[error.code]) {
    return FIREBASE_ERROR_MESSAGES[error.code];
  }

  if (error?.code && FIRESTORE_ERROR_MESSAGES[error.code]) {
    return FIRESTORE_ERROR_MESSAGES[error.code];
  }

  const errorMessage = error?.message || error?.toString() || '';
  for (const { pattern, message } of NETWORK_ERROR_PATTERNS) {
    if (pattern.test(errorMessage)) {
      return {
        title: 'Connection Problem',
        message,
        type: 'error',
        action: 'Retry'
      };
    }
  }

  if (error instanceof FirebaseError) {
    return {
      title: 'Firebase Error',
      message: 'A Firebase service error occurred. Please try again.',
      type: 'error',
      action: 'Try Again'
    };
  }

  if (error?.message) {
    return {
      title: 'Error',
      message: error.message,
      type: 'error'
    };
  }

  return {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    type: 'error',
    action: 'Try Again'
  };
}

export function isNetworkError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || '';
  return NETWORK_ERROR_PATTERNS.some(({ pattern }) => pattern.test(errorMessage));
}

export function isFirebaseError(error: any): boolean {
  return error?.code && (FIREBASE_ERROR_MESSAGES[error.code] || FIRESTORE_ERROR_MESSAGES[error.code]);
}

export function shouldRetry(error: any): boolean {
  const retryableErrors = [
    'auth/network-request-failed',
    'auth/timeout',
    'unavailable',
    'aborted',
    'internal'
  ];
  
  return retryableErrors.includes(error?.code) || isNetworkError(error);
}