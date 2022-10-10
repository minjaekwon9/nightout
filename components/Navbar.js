// LIBRARY IMPORTS
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useRouter } from 'next/router';

// CUSTOM IMPORTS


//LIBRARY IMPORTS
import Link from 'next/link';

export default function NavBar() {

    const router = useRouter()

    return (
        <Navbar bg="dark" variant="dark">
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
                <Nav className="m-auto">
                    <Link href="/" passHref>
                        <Nav.Link className={router.pathname == "/" ? "active" : ""}>HOME</Nav.Link>
                    </Link>
                    <Link href="/about" passHref>
                        <Nav.Link className={router.pathname == "/about" ? "active" : ""}>ABOUT</Nav.Link>
                    </Link>
                    <Link href="/contact" passHref>
                        <Nav.Link className={router.pathname == "/contact" ? "active" : ""}>CONTACT US</Nav.Link>
                    </Link>
                </Nav>
            </Container>
        </Navbar>
    )
}