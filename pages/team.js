// LIBRARY IMPORTS
import { default as Navbar } from '../components/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Team() {
    return (
        <div>
            <Navbar />
            <Container>
                <Row className='my-5'>
                    <Col className='text-center'>
                        <h1 className='display-3'>NightOut Team</h1>
                    </Col>
                </Row>
                <Row style={{ maxWidth: 900 }}>
                    <Col md="6" lg="5">
                        <img
                            src="minjae.jpeg"
                            alt="Headshot of Minjae Kwon"
                            style={{ borderRadius: 10 }}
                        />
                    </Col>
                    <Col md="6" lg="7">
                        <h1 className='display-5'>Minjae Kwon</h1>
                        <p className='my-3' style={{ fontSize: '1.1rem' }}>Software Engineer</p>
                        <p>
                            Focused on creating a great user experience on web-based
                            applications. Has experience in developing consumer-focused websites
                            using React.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}