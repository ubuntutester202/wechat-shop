import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 购物车商品项接口
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants: { [key: string]: string }; // 选中的变体，如 { color: 'black', size: 'M' }
  stock: number;
}

// 购物车状态接口
interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  
  // 操作方法
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // 计算方法
  calculateTotals: () => void;
  
  // 获取特定商品的购物车信息
  getCartItemByProduct: (productId: string, variants: { [key: string]: string }) => CartItem | undefined;
}

// 生成购物车项ID的辅助函数
const generateCartItemId = (productId: string, variants: { [key: string]: string }) => {
  const variantString = Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  return `${productId}|${variantString}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,

      addItem: (newItem) => {
        const state = get();
        const itemId = generateCartItemId(newItem.productId, newItem.selectedVariants);
        
        // 检查是否已存在相同商品和变体的项
        const existingItemIndex = state.items.findIndex(item => item.id === itemId);
        
        if (existingItemIndex >= 0) {
          // 如果存在，更新数量
          const updatedItems = [...state.items];
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = existingItem.quantity + newItem.quantity;
          
          // 检查库存限制
          if (newQuantity <= existingItem.stock) {
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity
            };
          } else {
            // 超出库存，设置为最大库存
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.stock
            };
          }
          
          set({ items: updatedItems });
        } else {
          // 如果不存在，添加新项
          const cartItem: CartItem = {
            ...newItem,
            id: itemId
          };
          
          set({ items: [...state.items, cartItem] });
        }
        
        // 重新计算总数
        get().calculateTotals();
      },

      removeItem: (itemId) => {
        const state = get();
        const updatedItems = state.items.filter(item => item.id !== itemId);
        set({ items: updatedItems });
        get().calculateTotals();
      },

      updateQuantity: (itemId, quantity) => {
        const state = get();
        
        if (quantity <= 0) {
          // 如果数量为0或负数，移除项
          get().removeItem(itemId);
          return;
        }
        
        const updatedItems = state.items.map(item => {
          if (item.id === itemId) {
            // 检查库存限制
            const newQuantity = Math.min(quantity, item.stock);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        set({ items: updatedItems });
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      calculateTotals: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        set({ totalItems, totalPrice });
      },

      getCartItemByProduct: (productId, variants) => {
        const itemId = generateCartItemId(productId, variants);
        return get().items.find(item => item.id === itemId);
      }
    }),
    {
      name: 'cart-storage', // 持久化存储的key
      // 只持久化必要的状态
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      })
    }
  )
); 