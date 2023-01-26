// LIBRARY IMPORTS
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useRouter } from 'next/router';
import Link from 'next/link';

// CUSTOM IMPORTS


export default function NavBar() {

    const router = useRouter()

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid className='ms-4'>
                <Navbar.Brand href="#home">
                    <img
                        src="icon.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top me-2"
                        alt="NightOut logo"
                    />
                    NightOut
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="m-auto">
                        <Link href="/" passHref>
                            <Nav.Link className={router.pathname == "/" ? "active" : ""}>HOME</Nav.Link>
                        </Link>
                        <Link href="/about" passHref>
                            <Nav.Link className={router.pathname == "/about" ? "active" : ""}>ABOUT</Nav.Link>
                        </Link>
                        <Link href="/team" passHref>
                            <Nav.Link className={router.pathname == "/team" ? "active" : ""}>TEAM</Nav.Link>
                        </Link>
                        <Link href="/contact" passHref>
                            <Nav.Link className={router.pathname == "/contact" ? "active" : ""}>CONTACT</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}