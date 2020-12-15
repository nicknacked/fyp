import React from 'react';

const SignUp1 = React.lazy(() => import('./Demo/Authentication/SignUp/SignUp1'));
const Signin1 = React.lazy(() => import('./Demo/Authentication/SignIn/SignIn1'));

const route = [
    { path: '/login', exact: true, name: 'Signin 1', component: Signin1 },
    { path: '/signup', exact: true, name: 'Signup 1', component: SignUp1 }
];

export default route;