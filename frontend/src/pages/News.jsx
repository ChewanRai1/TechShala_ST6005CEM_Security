import NewsCard from '../components/NewsCard';
// import newsData from '../data/newsData';
import { useState, useEffect, useContext  } from 'react'; 
import { Form, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext'; 
import { Notyf } from 'notyf'; // imports the notyf module
import 'notyf/notyf.min.css'; // imports the style for notyf boxes


export default function News() {

  const notyf = new Notyf(); // <---

  // console.log(newsData);

  const { user } = useContext(UserContext);

  // state for news
  const [news, setNews] = useState([]);
  // state for input boxes
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  // state to open/enable submit button
  const [isActive, setIsActive] = useState(false);

  // const news = newsData.map(news => {
  //     return (
  //         <NewsCard key={news.id} newsProp={news}/>
  //     );
  // })

  useEffect(()=>{

      if((email !== "" && feedback !== "")){

          setIsActive(true)

      } else {

          setIsActive(false)

      }
  },[email, feedback])

  useEffect(() => {
    // we have created a simple request to get all the news from the database
    fetch(`${import.meta.env.VITE_API_URL}/news`)
    .then(res => res.json())
    .then(data => {
      setNews(data.map(news => {
        return (
             <NewsCard key={news._id} newsProp={news}/>
          );
      }));
    });
  }, []);

  
  function sendFeedback(e) {
      e.preventDefault();

      setEmail("");
      setFeedback("");

      notyf.success("Thank you for your feedback. We'll get back to you as soon as we can.")
  }


  return(
    <>
      <h1>News</h1>
      {news}
      {(user.id !== null) ?
      <Form onSubmit={(e) => sendFeedback(e)}>
        <h1 className="my-5 text-center">Feedback</h1>
        <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
                type="email" 
                placeholder="Enter Email" 
                required 
                value={email}
                onChange={e => {setEmail(e.target.value)}}
            />
        </Form.Group>
        <Form.Group className="mb-3 text-cente">
            <Form.Label>Feedback</Form.Label>
            <Form.Control 
                as="textarea"
                rows={5}
                placeholder="Let us know what you think." 
                required
                value={feedback}
                onChange={e => {setFeedback(e.target.value)}}
            />
        </Form.Group>
        {/* conditionally render submit button based on isActive state */}
        { isActive ? 
            <Button variant="primary" type="submit" id="feedbackBtn">
                Send Feedback
            </Button>
            : 
            <Button variant="danger" type="submit" id="feedbackBtn" disabled>
                Send Feedback
            </Button>
        }
      </Form>
      : null 
      }
    </>
  )
}