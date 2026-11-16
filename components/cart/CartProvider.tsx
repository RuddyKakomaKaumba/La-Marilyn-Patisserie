"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CART_CATALOG,
  clampQty,
  lineKey,
  parseCart,
  qtyBounds,
  saleMode,
  summarize,
  type CartItem,
  type CartSummary,
} from "@/lib/cart";
import { CartFloat } from "./CartButton";
import CartDrawer from "./CartDrawer";

/**
 * État du panier, partagé par toutes les pages. Le navigateur ne garde que
 * des références (produit, déclinaison, option, quantité) : aucune donnée
 * personnelle, et aucun prix (toujours recalculé depuis le catalogue).
 */
const STORAGE_KEY = "lm-panier-v1";

type CartContextValue = {
  items: CartItem[];
  summary: CartSummary;
  /** Nombre d'articles distincts (pastille du panier). */
  count: number;
  /** Faux tant que le contenu enregistré n'a pas été relu. */
  ready: boolean;
  add: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>.");
  return ctx;
}

const read = (): CartItem[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseCart(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  try {
    if (items.length)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Stockage indisponible (navigation privée…) : panier le temps de la visite. */
  }
};

const boundsOf = (item: Pick<CartItem, "id" | "variant">) => {
  const product = CART_CATALOG.get(item.id)?.product;
  return product
    ? qtyBounds(product, saleMode(product, item.variant))
    : { min: 1, max: 1 };
};

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const skipWrite = useRef(true);

  useEffect(() => {
    setItems(read());
    setReady(true);
    // Panier modifié dans un autre onglet.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY && e.key !== null) return;
      skipWrite.current = true;
      setItems(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    write(items);
  }, [items, ready]);

  const add = useCallback((item: CartItem) => {
    const entry = CART_CATALOG.get(item.id);
    if (!entry) return;
    const { min, max } = boundsOf(item);
    setItems((prev) => {
      const key = lineKey(item);
      const found = prev.find((i) => lineKey(i) === key);
      if (found) {
        return prev.map((i) =>
          i === found ? { ...i, qty: clampQty(i.qty + item.qty, min, max) } : i,
        );
      }
      return [...prev, { ...item, qty: clampQty(item.qty, min, max) }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (lineKey(i) !== key) return i;
        const { min, max } = boundsOf(i);
        return { ...i, qty: clampQty(qty, min, max) };
      }),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => {
    const summary = summarize(items);
    return {
      items,
      summary,
      count: summary.lines.length,
      ready,
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open,
      close,
    };
  }, [items, ready, add, setQty, remove, clear, isOpen, open, close]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartFloat />
      <CartDrawer />
    </CartContext.Provider>
  );
}
