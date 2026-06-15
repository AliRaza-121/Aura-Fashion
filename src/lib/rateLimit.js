// A simple in-memory rate limiter using a sliding window or basic token bucket algorithm.
// Note: In a production distributed environment (e.g. Vercel Edge), you'd use Upstash Redis.
// This works perfectly for a standard Node/Next.js environment.

const rateLimitMap = new Map();

export default function rateLimit(request, limit = 100, windowMs = 60 * 1000) {
  // Use IP if available, otherwise fallback to a generic key
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  const now = Date.now();
  const windowStart = now - windowMs;

  let requestData = rateLimitMap.get(ip);

  if (!requestData) {
    requestData = { count: 1, startTime: now };
    rateLimitMap.set(ip, requestData);
    return { success: true };
  }

  // If the window has expired, reset it
  if (requestData.startTime < windowStart) {
    requestData.count = 1;
    requestData.startTime = now;
    rateLimitMap.set(ip, requestData);
    return { success: true };
  }

  // If still within window
  requestData.count += 1;

  if (requestData.count > limit) {
    return { success: false, limit, current: requestData.count };
  }

  return { success: true, limit, current: requestData.count };
}
