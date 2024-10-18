import DefaultLayout from "../layouts/default";
import SignIn from "../pages/sign-in/index";
import SignUp from "../pages/sign-up/index";
import Home from "../pages/home/index";
import Histories from "../pages/histories/index";
import SocialSnapshot from "../pages/social-snapshot/index";

const publicRoutes = [
    { path: "/", component: Home, layout: DefaultLayout },
    { path: "/sign-in", component: SignIn, layout: DefaultLayout },
    { path: "/sign-up", component: SignUp, layout: DefaultLayout },
]

const privateRoutes = [
    { path: "/histories", component: Histories, layout: DefaultLayout },
    { path: "/social-snapshot", component: SocialSnapshot, layout: DefaultLayout }
];

export { publicRoutes, privateRoutes };