import { Prisma } from '@prisma/client';

/**
 * Returns the next human-readable number ("SUB-0001", "INV-0001").
 * Call it with the *transaction client* so the number is only consumed if the
 * surrounding transaction commits. The upsert takes a row lock, so concurrent
 * callers serialise instead of getting duplicates.
 */
export async function nextNumber(tx: Prisma.TransactionClient, key: 'SUB' | 'INV', pad = 4): Promise<string> {
  const bump = () =>
    tx.counter.upsert({
      where: { key },
      create: { key, value: 1 },
      update: { value: { increment: 1 } },
    });
  let counter;
  try {
    counter = await bump();
  } catch (e) {
    // Two first-ever callers can race on creating the row; the loser retries as an update.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') counter = await bump();
    else throw e;
  }
  return `${key}-${String(counter.value).padStart(pad, '0')}`;
}
