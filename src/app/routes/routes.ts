import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { bannerRouter } from '../modules/banner/banner.routes';
import { shopRouter } from '../modules/shop/shop.routes';
import { dashboardRoutes } from '../modules/dashboard/dashboard.routes';
import { contentRouter } from '../modules/content/content.routes';
import { eventRouter } from '../modules/event/event.routes';
import { contactRoutes } from '../modules/contact/contact.routes';
import { newsletterRoutes } from '../modules/newsletter/newsletter.routes';
import { subscriptionRouter } from '../modules/subscription/subscription.routes';

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
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
  {
    path: '/content',
    route: contentRouter,
  },
  {
    path: '/event',
    route: eventRouter,
  },
  {
    path: '/contact',
    route: contactRoutes,
  },
  {
    path: '/newsletter',
    route: newsletterRoutes,
  },
  {
    path: '/subscription',
    route: subscriptionRouter,
  },
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
