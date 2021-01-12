import express from 'express';
import { initialiseRoutes } from '../initialise';

it('Testing route initialisation', () => {
    const app = express();

    initialiseRoutes(app);

    const routes: { path: string; methods: string[] }[] = [];

    app._router.stack.map((route: any) => {
        if (route.route) {
            routes.push({
                path: route.route.path,
                methods: Object.keys(route.route.methods),
            });
        }
    });

    expect(routes.length).toStrictEqual(1);
});
