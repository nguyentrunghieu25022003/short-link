import DefaultLayout from "../layouts/default";
import Home from "../pages/home/index";

const publicRoutes = [
    { path: "/", component: Home, layout: DefaultLayout },
]

const privateRoutes = [];

export { publicRoutes, privateRoutes };