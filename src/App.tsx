import React, {Fragment} from 'react';
import {Route,Routes, BrowserRouter as Router} from "react-router-dom";
import "./index.css"
import LoginPage from "./LoginPage";
import {PrivateRouteClient} from "./utils/PrivateRouteClient";
import HomePageClient from "./mainPages/HomePageClient";
import FindDriverPage from "./mainPages/FindDriverPage";
import OrdersPageDriver from "./mainPages/OrdersPageDriver";
import {PrivateRouteDriver} from "./utils/PrivateRouteDriver";
import ViewOrders from "./mainPages/ViewOrders";
import AcceptOrder from "./mainPages/AcceptOrder";
import ProfilePage from "./mainPages/ProfilePage";
import SearchUsers from "./mainPages/SearchUsers";
import MainPageDriver from "./mainPages/MainPageDriver";
import ViewFollowedPeoplePage from "./mainPages/ViewFollowedPeoplePage";
import RegisterPage from "./RegisterPage";

const App: React.FC = () => (

    <Router>
      <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path="/home/client" element={<PrivateRouteClient component={HomePageClient} roles={['client']} />} />
          <Route path="/find/driver" element={<PrivateRouteClient component={FindDriverPage} roles={['client']} />} />
          <Route path="/home/driver" element={<PrivateRouteDriver component={MainPageDriver} roles={['driver']} />} />
          <Route path="/orders/driver" element={<PrivateRouteDriver component={OrdersPageDriver} roles={['driver']} />} />
          <Route path="/view/orders" element={<PrivateRouteDriver component={ViewOrders} roles={['driver']} />} />
          <Route path="/view/followed" element={<PrivateRouteDriver component={ViewFollowedPeoplePage} roles={['driver']} />} />
          <Route path="/search/driver" element={<PrivateRouteDriver component={SearchUsers} roles={['driver']} />} />
          <Route path="/profile/driver/:username?" element={<PrivateRouteDriver component={ProfilePage} roles={['driver']} />} />
          <Route path="/profile/client/:username?" element={<PrivateRouteClient component={ProfilePage} roles={['client']} />} />

          <Route path="/view/order/information" element={<PrivateRouteDriver component={AcceptOrder} roles={['driver']} />} />
      </Routes>
    </Router>

);

export default App;