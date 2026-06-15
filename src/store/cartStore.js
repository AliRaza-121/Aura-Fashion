import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isOpen: false,
      directCheckoutItem: null,

      // UI Actions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Direct Checkout Actions
      setDirectCheckoutItem: (product, quantity = 1, size, color) => {
        set({
          directCheckoutItem: {
            product: product._id,
            title: product.title || product.name,
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            size: size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'),
            color: color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default'),
            quantity,
          }
        });
      },
      clearDirectCheckoutItem: () => set({ directCheckoutItem: null }),

      // Cart Actions
      addToCart: (product, quantity = 1, size, color) => {
        const { cartItems } = get();
        
        const finalSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
        const finalColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');

        const existingItemIndex = cartItems.findIndex(
          (item) => item.product === product._id && item.size === finalSize && item.color === finalColor
        );

        if (existingItemIndex >= 0) {
          // If product with same size and color exists, update quantity
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ cartItems: updatedItems, isOpen: true });
        } else {
          // Add new item
          set({
            cartItems: [
              ...cartItems,
              {
                product: product._id,
                title: product.title || product.name,
                price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                size: finalSize,
                color: finalColor,
                quantity,
              },
            ],
            isOpen: true,
          });
        }
      },

      removeFromCart: (productId, size, color) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => !(item.product === productId && item.size === size && item.color === color)
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product === productId && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      // Computed properties (getters)
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        return get().cartItems.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'aura-cart-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ cartItems: state.cartItems }), // Only persist cartItems
    }
  )
);
