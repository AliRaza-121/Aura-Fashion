import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistItems: [],

      // Actions
      addToWishlist: (product) => {
        const { wishlistItems } = get();
        const existingItemIndex = wishlistItems.findIndex(
          (item) => item.product === product._id
        );

        if (existingItemIndex < 0) {
          // Add new item
          set({
            wishlistItems: [
              ...wishlistItems,
              {
                product: product._id,
                title: product.title || product.name,
                price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                category: product.category,
              },
            ],
          });
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(
            (item) => item.product !== productId
          ),
        }));
      },

      toggleWishlist: (product) => {
        const { wishlistItems } = get();
        const exists = wishlistItems.some(item => item.product === product._id);
        if (exists) {
          get().removeFromWishlist(product._id);
        } else {
          get().addToWishlist(product);
        }
      },

      isInWishlist: (productId) => {
        return get().wishlistItems.some((item) => item.product === productId);
      },

      clearWishlist: () => set({ wishlistItems: [] }),
    }),
    {
      name: 'aura-wishlist-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ wishlistItems: state.wishlistItems }),
    }
  )
);
