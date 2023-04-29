import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BulkUpload from "./pages/BulkUpload";
import VolunteeredTasks from "./pages/VolunteeredTasksPage";
import PublishedTasks from "./pages/PublishedTasks";
import AccountPage from "./pages/AccountPage";

import { RequireAuth } from "./components/RequireAuth";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const options = {
        timeout: 5000,
        position: positions.BOTTOM_CENTER
    };
    return (
        <Provider template={AlertTemplate} {...options}>
            <AuthProvider>
                <div className="App">
                    <Router>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />

                            <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
                            <Route path="/bulkupload" element={<RequireAuth><BulkUpload /></RequireAuth>} />
                            <Route path="/volunteeredtasks" element={<RequireAuth><VolunteeredTasks /></RequireAuth>} />
                            <Route path="/publishedtasks" element={<RequireAuth><PublishedTasks /></RequireAuth>} />
                            <Route path="/myaccount" element={<RequireAuth><AccountPage /></RequireAuth>} />
                            <Route path="/" element={<Navigate to="/login"/>} />
                        </Routes>
                    </Router>
                </div>
            </AuthProvider>
        </Provider>
    );
}

export default App;
