import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { bannerRouter } from '../modules/banner/banner.routes';
import { shopRouter } from '../modules/shop/shop.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/banner',
    route: bannerRouter,
  },
  {
    path: '/shop',
    route: shopRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
