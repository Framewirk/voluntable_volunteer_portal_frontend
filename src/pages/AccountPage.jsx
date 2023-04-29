import React, { useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { useAuth } from "../context/AuthContext";

import { AppNavbar } from "../components/AppNavbar";

const AccountPage = () => {
    const { user } = useAuth();
    // const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    return (
        <>
        <AppNavbar />
        <Container style={{ marginTop: "5%" }}>
        <Row>
            <Col>
            <div style={{ fontSize: 30, textAlign: "center" }}>
                Name : {user?.fullName}
            </div>
            <div style={{ fontSize: 30, textAlign: "center" }}>
                Email : {user?.email}
            </div>
            </Col>
        </Row>
        </Container>
        </>
    );
}

export default AccountPage;