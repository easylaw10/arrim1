// Simple in-memory cache to store verified phone numbers
const verifiedPhones = new Set<string>();

export const verificationCache = {
  addVerifiedPhone: (phone: string) => {
    verifiedPhones.add(phone);
  },
  
  isPhoneVerified: (phone: string) => {
    return verifiedPhones.has(phone);
  },
  
  clearVerifiedPhone: (phone: string) => {
    verifiedPhones.delete(phone);
  }
};