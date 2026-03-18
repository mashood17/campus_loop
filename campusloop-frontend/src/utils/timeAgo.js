const SECONDS = 1;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;
const WEEKS = 7 * DAYS;
const MONTHS = 30 * DAYS;
const YEARS = 365 * DAYS;

export default function timeAgo(dateString) {
  if (!dateString) return "";

  // Normalize to UTC — Flask returns naive datetime strings without 'Z'
  // Appending 'Z' tells JavaScript to treat it as UTC before converting to local time
  const normalized = dateString.endsWith("Z") ? dateString : dateString + "Z";
  const date = new Date(normalized);

  // Guard against invalid dates
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Future date guard — clock skew between client and server
  if (diff < 0) return "just now";

  if (diff < 1 * MINUTES) return "just now";
  if (diff < 2 * MINUTES) return "1 minute ago";
  if (diff < 1 * HOURS) return `${Math.floor(diff / MINUTES)} minutes ago`;
  if (diff < 2 * HOURS) return "1 hour ago";
  if (diff < 1 * DAYS) return `${Math.floor(diff / HOURS)} hours ago`;
  if (diff < 2 * DAYS) return "yesterday";
  if (diff < 1 * WEEKS) return `${Math.floor(diff / DAYS)} days ago`;
  if (diff < 2 * WEEKS) return "1 week ago";
  if (diff < 1 * MONTHS) return `${Math.floor(diff / WEEKS)} weeks ago`;
  if (diff < 2 * MONTHS) return "1 month ago";
  if (diff < 1 * YEARS) return `${Math.floor(diff / MONTHS)} months ago`;
  if (diff < 2 * YEARS) return "1 year ago";

  return `${Math.floor(diff / YEARS)} years ago`;
}