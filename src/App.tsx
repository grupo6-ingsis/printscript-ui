import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedHome = withAuthenticationRequired(HomeScreen);
const ProtectedRules = withAuthenticationRequired(RulesScreen);

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedHome/>
    },
    {
        path: '/rules',
        element: <ProtectedRules/>
    }
]);

export const queryClient = new QueryClient()
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}


export default App;
