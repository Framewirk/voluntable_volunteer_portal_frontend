import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { useAuth } from "../context/AuthContext";

import { IconBell } from "../utils/icons";

import { subscribeUser } from "../utils/pushsubs";

const clientId = process.env.REACT_APP_GCLIENT_ID;

export const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link to="/home">
          <Navbar.Brand>Voluntable Admin</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link
                to="/bulkupload"
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Bulk Upload
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/volunteeredtasks"
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Volunteered Tasks
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/publishedtasks"
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Published Tasks
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/myaccount"
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                Account
              </Link>
            </Nav.Link>
          </Nav>
          <Nav style={{ marginRight: "10px" }}>
            <button onClick={() => {
                subscribeUser();
            }}
                style={{ width: "40px", height: "40px", padding: 0 }}
            >
                <IconBell/>
            </button>
          </Nav>
          <Nav>
            <GoogleLogout
              clientId={clientId}
              buttonText="Logout"
              onLogoutSuccess={onLogout}
              render={(renderProps) => (
                <Nav.Link
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Logout
                </Nav.Link>
              )}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
