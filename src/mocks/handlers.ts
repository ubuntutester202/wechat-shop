import { productHandlers } from './handlers/products';
import { cartHandlers } from './handlers/cart';
import { userHandlers } from './handlers/user';
import { orderHandlers } from './handlers/order';

/**
 * MSW API 处理器集合
 * 按功能模块组织，便于维护和扩展
 */
export const handlers = [
  ...productHandlers,  // 商品相关API
  ...cartHandlers,     // 购物车相关API
  ...userHandlers,     // 用户相关API
  ...orderHandlers,    // 订单相关API
]; 