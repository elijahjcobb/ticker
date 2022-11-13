export function generateKey(data: {
  tickId: string;
  userId: string;
  tickUserId: string;
  type: string;
}): string {
  return `${data.tickId}:${data.userId}:${data.tickUserId}:${data.type}`;
}
