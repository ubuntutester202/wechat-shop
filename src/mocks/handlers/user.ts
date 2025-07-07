import { http, HttpResponse } from 'msw';

// API 基础路径
const API_BASE = '/api';

// 模拟用户数据
let mockUsers: Array<{
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  addresses: Array<{
    id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
  }>;
  createdAt: Date;
}> = [
  {
    id: 'user_1',
    email: 'test@example.com',
    name: '测试用户',
    avatar: '/assets/images/avatar-placeholder.png',
    phone: '138****8888',
    addresses: [
      {
        id: 'addr_1',
        name: '张三',
        phone: '13888888888',
        address: '北京市朝阳区XX街道XX号',
        isDefault: true
      }
    ],
    createdAt: new Date('2024-01-01')
  }
];

// 模拟当前用户（登录状态）
let currentUser: string | null = null;

export const userHandlers = [
  // 用户注册
  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
      name: string;
    };

    console.log('[MSW] 用户注册:', { email: body.email, name: body.name });

    // 检查邮箱是否已存在
    const existingUser = mockUsers.find(user => user.email === body.email);
    if (existingUser) {
      return new HttpResponse(JSON.stringify({
        success: false,
        message: '邮箱已被注册'
      }), { status: 400 });
    }

    // 创建新用户
    const newUser = {
      id: `user_${Date.now()}`,
      email: body.email,
      name: body.name,
      addresses: [],
      createdAt: new Date()
    };

    mockUsers.push(newUser);
    currentUser = newUser.id;

    // 模拟网络延迟
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({
          success: true,
          data: {
            user: { ...newUser },
            token: `mock_token_${newUser.id}`
          },
          message: '注册成功'
        }));
      }, 800);
    });
  }),

  // 用户登录
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
    };

    console.log('[MSW] 用户登录:', { email: body.email });

    const user = mockUsers.find(u => u.email === body.email);
    if (!user) {
      return new HttpResponse(JSON.stringify({
        success: false,
        message: '用户不存在'
      }), { status: 401 });
    }

    // 模拟密码验证（在真实环境中应该验证密码）
    currentUser = user.id;

    // 模拟网络延迟
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({
          success: true,
          data: {
            user: { ...user },
            token: `mock_token_${user.id}`
          },
          message: '登录成功'
        }));
      }, 600);
    });
  }),

  // 获取当前用户信息
  http.get(`${API_BASE}/user/profile`, ({ request }) => {
    console.log('[MSW] 获取用户信息');

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !currentUser) {
      return new HttpResponse(null, { status: 401 });
    }

    const user = mockUsers.find(u => u.id === currentUser);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      data: user
    });
  }),

  // 更新用户信息
  http.put(`${API_BASE}/user/profile`, async ({ request }) => {
    const body = await request.json() as {
      name?: string;
      phone?: string;
      avatar?: string;
    };

    console.log('[MSW] 更新用户信息:', body);

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !currentUser) {
      return new HttpResponse(null, { status: 401 });
    }

    const userIndex = mockUsers.findIndex(u => u.id === currentUser);
    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // 更新用户信息
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };

    return HttpResponse.json({
      success: true,
      data: mockUsers[userIndex],
      message: '用户信息更新成功'
    });
  }),

  // 用户登出
  http.post(`${API_BASE}/auth/logout`, () => {
    console.log('[MSW] 用户登出');
    
    currentUser = null;
    return HttpResponse.json({
      success: true,
      message: '已安全退出'
    });
  }),

  // 获取收货地址列表
  http.get(`${API_BASE}/user/addresses`, ({ request }) => {
    console.log('[MSW] 获取收货地址列表');

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !currentUser) {
      return new HttpResponse(null, { status: 401 });
    }

    const user = mockUsers.find(u => u.id === currentUser);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      data: user.addresses
    });
  }),

  // 添加收货地址
  http.post(`${API_BASE}/user/addresses`, async ({ request }) => {
    const body = await request.json() as {
      name: string;
      phone: string;
      address: string;
      isDefault?: boolean;
    };

    console.log('[MSW] 添加收货地址:', body);

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !currentUser) {
      return new HttpResponse(null, { status: 401 });
    }

    const userIndex = mockUsers.findIndex(u => u.id === currentUser);
    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const newAddress = {
      id: `addr_${Date.now()}`,
      ...body,
      isDefault: body.isDefault || false
    };

    // 如果设为默认地址，取消其他地址的默认状态
    if (newAddress.isDefault) {
      mockUsers[userIndex].addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    mockUsers[userIndex].addresses.push(newAddress);

    return HttpResponse.json({
      success: true,
      data: newAddress,
      message: '地址添加成功'
    });
  })
]; 