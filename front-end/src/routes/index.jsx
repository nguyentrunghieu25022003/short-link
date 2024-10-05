import DefaultLayout from "../layouts/default";
import SignIn from "../pages/sign-in/index";
import SignUp from "../pages/sign-up/index";
import Home from "../pages/home/index";
import Histories from "../pages/histories/index";

const publicRoutes = [
    { path: "/sign-in", component: SignIn, layout: DefaultLayout },
    { path: "/sign-up", component: SignUp, layout: DefaultLayout },
]

const privateRoutes = [
    { path: "/", component: Home, layout: DefaultLayout },
    { path: "/histories", component: Histories, layout: DefaultLayout }
];

export { publicRoutes, privateRoutes };