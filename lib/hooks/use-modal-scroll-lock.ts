"use client";

const properties = ["position", "top", "left", "right", "overflow"] as const;
const locks = new WeakMap<Document, { count: number; restore: () => void }>();

/** All modal surfaces share one lock, including when they close out of order. */
export function lockModalScroll(document: Document) {
  let lock = locks.get(document);
  if (!lock) {
    const body = document.body;
    const view = document.defaultView;
    const x = view?.scrollX ?? 0;
    const y = view?.scrollY ?? 0;
    const previous = properties.map((name) => ({
      name,
      value: body.style.getPropertyValue(name),
      priority: body.style.getPropertyPriority(name),
    }));
    // Fixed positioning also holds the page on iOS at scroll boundaries.
    body.style.position = "fixed";
    body.style.top = `${-y}px`;
    body.style.left = `${-x}px`;
    body.style.right = "0";
    body.style.overflow = "hidden";
    lock = {
      count: 0,
      restore: () => {
        for (const { name, value, priority } of previous) {
          if (value) body.style.setProperty(name, value, priority);
          else body.style.removeProperty(name);
        }
        // A site's smooth-scroll rule must not animate restoration.
        const root = document.documentElement;
        const behavior = root.style.getPropertyValue("scroll-behavior");
        const priority = root.style.getPropertyPriority("scroll-behavior");
        root.style.setProperty("scroll-behavior", "auto", "important");
        view?.scrollTo(x, y);
        if (behavior) root.style.setProperty("scroll-behavior", behavior, priority);
        else root.style.removeProperty("scroll-behavior");
      },
    };
    locks.set(document, lock);
  }
  lock.count += 1;
  const current = lock;
  return () => {
    current.count -= 1;
    if (current.count === 0) {
      current.restore();
      locks.delete(document);
    }
  };
}
