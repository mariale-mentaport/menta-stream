import { BrowserRouter, Routes, Route , useRoutes} from "react-router-dom";

// routes
import Home from "pages/Home";


// ==============================|| ROUTING RENDER ||============================== //
const ThemeRoutes= () => {
    // const mainRoute = MainRoutes()
    // return useRoutes([mainRoute]);

    return (
     
      <Routes>
        <Route path="/" element={<Home />}>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/dropstream" element={<DropStream />} /> */}
        </Route>
      </Routes>

    )
}
export default ThemeRoutes
