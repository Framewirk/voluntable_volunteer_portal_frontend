import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useAlert } from "react-alert";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col } from "react-bootstrap";

const clientId = process.env.REACT_APP_GCLIENT_ID;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const alert = useAlert();
  const redirectpath = location.state?.path || "/home";

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const onSuccess = async (res) => {
    // let response = await login(res);
    // console.log(response);
    let userdata = await login(res);
    if (userdata.token) {
      navigate(redirectpath, { replace: true });
    }
  };
  const onFailure = (err) => {
    alert.error("Login Failed");
    console.log("failed:", err);
  };

  return (
    <Container style={{ height: "100%" }}>
      <Row style={{ height: "100%" }}>
        <Col
          className="d-flex"
          style={{
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <h1>OneDelhi Admin</h1>
          <h3>Voluntable</h3>
        </Col>
        <Col
          className="d-flex"
          style={{
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
            render={(renderProps) => (
              <button
                style={{
                  height: "50px",
                  width: "300px",
                  fontSize: "20px",
                  padding: "5px",
                  alignSelf: "center",
                }}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Login with Google
              </button>
            )}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
