/*
 * Subscriptions — vendors and venues that have taken a paid BMS subscription.
 * Only these businesses display the "Verified Partner" badge.
 * Contact details remain member-only regardless of subscription status.
 */

export const SUBSCRIBED_VENDOR_NAMES = new Set([
  "Infinity Eventz",
  "Abhijeet Saha",
  "Aditi Arya",
  "Anant Khandelwal",
  "Bhaavya Kapur",
  "Bhavneet Singh Chawla",
  "Avinash Dhariwal",
  "Anuradha",
  "Arti Kumar",
  "Anu Rakesh Sen",
  "Banita Ahuja",
  "Ashmieta Vineet",
  "Akshay Gadilkar",
]);

export const SUBSCRIBED_VENUE_NAMES = new Set([
  "Taj Rishikesh Resort and spa , Uttarakhand",
  "Alila Diwa Goa",
  "Andaz Delhi",
  "Ananda Resort Pushkar",
  "Aahana Resort",
  "Aurika , Udaipur { BUJRA fort }",
  "Amber palms resort surajkund",
  "Acorn Hideaway Resort & Spa , Corbett",
  "Anantaaram",
  "Anya Gurgaon",
  "Aura By Xperience",
]);

export function isVendorVerified(name: string): boolean {
  return SUBSCRIBED_VENDOR_NAMES.has(name);
}

export function isVenueVerified(name: string): boolean {
  return SUBSCRIBED_VENUE_NAMES.has(name);
}
