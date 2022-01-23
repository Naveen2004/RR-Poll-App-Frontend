import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {Dashboard, Login, Poll, Signup} from './components';


const Index = () => {
    let navigate = useNavigate();
    useEffect(() => navigate("/dashboard"))
    return <div/>;
}

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="" element={<Index/>}/>
                <Route path="poll/:pollId" element={<Poll/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="signup" element={<Signup/>}/>
                <Route path="dashboard" element={<Dashboard/>}/>
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

