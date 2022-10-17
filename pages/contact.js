// LIBRARY IMPORTS
import React, { useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import emailjs from '@emailjs/browser'
import Notiflix from 'notiflix'

// CUSTOM IMPORTS
import { default as Navbar } from '../components/Navbar'

export default function Contact() {

    const form = useRef()

    const sendEmail = (e) => {
        e.preventDefault()
        emailjs.sendForm('contact_service', 'contact_form', form.current, '3N2FH8Rf_RLs67D4S')
            .then(() => {
                Notiflix.Notify.success("Your message has been sent, we will get back to you shortly!",
                    { timeout: 10000, fontSize: "1rem", width: "530px", position: "center-top", clickToClose: true, })
            }, (error) => {
                Notiflix.Notify.failure("An error has occurred, please try again.",
                    { timeout: 10000, fontSize: "1rem", width: "380px", position: "center-top", clickToClose: true, })
            })
        e.target.reset()
    }

    return (
        <div>
            <Navbar />
            {/* Sends an email to minjaekwon24601@gmail.com using EmailJS */}
            <Container
                className='my-5 p-4 rounded'
                style={{ maxWidth: 650 }}
            >
                <h1 className='mb-4 text-center'>Shoot us an email!</h1>
                <Form ref={form} onSubmit={sendEmail} style={{ fontSize: '1.2rem' }}>
                    <Form.Group as={Row} className="mb-4" controlId="contactFormName">
                        <Form.Label column sm="2" >Name: </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                name="user_name"
                                type="text"
                                placeholder="Enter your name"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-4" controlId="contactFormEmail">
                        <Form.Label column sm="2" >Email: </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                name="user_email"
                                type="email"
                                placeholder="Enter your email"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-4" controlId="contactFormMsg">
                        <Form.Label column sm="2" >Message: </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                required
                                name="message"
                                as="textarea"
                                rows={3}
                                placeholder="Enter your message"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </Col>
                    </Form.Group>
                    <div className='text-center'>
                        <Button variant="outline-light" type="submit" style={{ fontSize: '1.2rem' }}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}