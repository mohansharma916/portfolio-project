import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ParkingPage from "../pages/Parking";




export const router = createBrowserRouter([
   { 
    path: "/",
    element: <MainLayout />,
    children: [
        {
            index:true,
            element:<ParkingPage />
        },
    ]
}
])