// import {useState, useEffect, useContext} from 'react';
// import UserContext from "../context/UserContext";

// import {Container, Card, Button, Row, Col} from "react-bootstrap";
// import {useParams, useNavigate, Link} from "react-router-dom";
// import { Notyf } from 'notyf'; // imports the notyf module
// import 'notyf/notyf.min.css'; // imports the style for notyf boxes

// export default function CourseView(){

// 	const notyf = new Notyf(); // <---

// 	const {courseId} = useParams(); // retrieves the courseId from the url
// 	const navigate = useNavigate();

// 	const {user} = useContext(UserContext);

// 	const [name, setName] = useState("");
// 	const [description, setDescription] = useState("");
// 	const [price, setPrice] = useState(0);


// 	useEffect(() => {
// 		fetch(`${process.env.REACT_APP_API_URL}/courses/specific/${courseId}`)
// 		.then(res=> res.json())
// 		.then(data => {
// 			console.log(data);
// 			setName(data.name);
// 			setDescription(data.description);
// 			setPrice(data.price);
// 		});
// 	}, [courseId]);


// 	function enroll(courseId){
// 		fetch(`${process.env.REACT_APP_API_URL}/users/enroll`, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type" : "application/json",
// 				Authorization: `Bearer ${localStorage.getItem('token')}`
// 			},
// 			body: JSON.stringify({
// 				enrolledCourses: [{courseId}],
// 				totalPrice: price
// 			})
// 		})
// 		.then(res=>res.json())
// 		.then(data => {

// 			console.log(data.message);
// 			if(data.message === "Admin is forbidden"){
// 				notyf.error("Admin Forbidden"); 
// 			}
// 			else if(data.message === "Enrolled successfully"){
// 				notyf.success("Enrollment successfully");
// 				navigate("/courses"); // redirection to courses page
// 			}
// 			else{
// 				notyf.error("Internal Server Error. Notify System Admin"); 
// 			}

// 		})
// 	}


// 	return( 
// 		<Container className="mt-5">
// 			<Row>
// 				<Col lg={{span:6, offset:3}}>
// 					<Card>
// 						<Card.Body className="text-center">
// 							<Card.Title>{name}</Card.Title>

// 							<Card.Subtitle>Description:</Card.Subtitle>
// 							<Card.Text>{description}</Card.Text>

// 							<Card.Subtitle>Price:</Card.Subtitle>
// 							<Card.Text>Php{price}</Card.Text>


// 							<Card.Subtitle>Class Schedule:</Card.Subtitle>
// 							<Card.Text>8am - 5pm</Card.Text>

// 							{/*conditinal rendering*/}
// 							{user.id !== null? 
// 								<Button varian="primary" block="true" onClick={()=>enroll(courseId)}>Enroll</Button>
// 								:
// 								<Link className="btn btn-danger" to="/login">Log In to Enroll	</Link>

// 							}
// 						</Card.Body>
// 					</Card>
// 				</Col>
// 			</Row>

// 		</Container>
// 	);
// }

import {useState, useEffect, useContext} from 'react';
import UserContext from "../context/UserContext";
import {Container, Card, Button, Row, Col} from "react-bootstrap";
import {useParams, useNavigate, Link} from "react-router-dom";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function CourseView(){
    const notyf = new Notyf();
    const {courseId} = useParams();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    useEffect(() => {
        // Changed process.env to import.meta.env
        fetch(`${import.meta.env.VITE_API_URL}/courses/specific/${courseId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log('Course data:', data);
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
        })
        .catch(error => {
            console.error('Error fetching course:', error);
            notyf.error('Error loading course details');
        });
    }, [courseId]);

    function enroll(courseId){
        // Changed process.env to import.meta.env
        fetch(`${import.meta.env.VITE_API_URL}/users/enroll`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                enrolledCourses: [{courseId}],
                totalPrice: price
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Enrollment response:', data);
            
            if(data.message === "Admin is forbidden"){
                notyf.error("Admin Forbidden");
            }
            else if(data.message === "Enrolled successfully"){
                notyf.success("Enrollment successful");
                navigate("/courses");
            }
            else{
                notyf.error("Internal Server Error. Please try again later.");
            }
        })
        .catch(error => {
            console.error('Enrollment error:', error);
            notyf.error('Error during enrollment. Please try again.');
        });
    }

    return( 
        <Container className="mt-5">
            <Row>
                <Col lg={{span:6, offset:3}}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>{name}</Card.Title>

                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text>{description}</Card.Text>

                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>Php {price}</Card.Text>

                            <Card.Subtitle>Class Schedule:</Card.Subtitle>
                            <Card.Text>8am - 5pm</Card.Text>

                            {user.id !== null ? 
                                <Button 
                                    variant="primary" 
                                    onClick={() => enroll(courseId)}
                                    className="w-100"
                                >
                                    Enroll
                                </Button>
                                :
                                <Link 
                                    className="btn btn-danger w-100" 
                                    to="/login"
                                >
                                    Log In to Enroll
                                </Link>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}