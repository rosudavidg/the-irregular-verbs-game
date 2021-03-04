import './Game.css';
import axios from 'axios';
import { useState, useEffect, useRef } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const getIrregularVerb = async (setIrregularVerb) => {
    axios.get(`${process.env.REACT_APP_API_URL}/verbs/random`, {}).then((res) => {
        setIrregularVerb(res.data)
    }).catch(() => {
        alert('Getting a new irregular verb failed.');
    });
}

const Streak = ({ value }) => {
    return <div className="streak">Streak: {value}</div>
}

function Game() {
    const [irregularVerb, setIrregularVerb] = useState({ 'infinitive': '', 'past_participle': '', 'simple_past': '' })
    const [simplePast, setSimplePast] = useState('');
    const [pastParticpile, setPastParticiple] = useState('');
    const [streak, setStreak] = useState(0);
    const [hasMistake, setHasMistake] = useState(false);
    const [submitButtonText, setSubmitButtonText] = useState("Submit");
    const simplePastFieldRef = useRef(null);
    const pastParticipleFieldRef = useRef(null);

    useEffect(() => {
        getIrregularVerb(setIrregularVerb);
    }, [])

    const onChangeSimplePast = (e) => {
        e.preventDefault();
        setSimplePast(e.target.value);
    }

    const onChangePastParticiple = (e) => {
        e.preventDefault();
        setPastParticiple(e.target.value);
    }

    const increaseStreak = () => {
        setStreak(streak + 1);
    }

    const resetStreak = () => {
        setStreak(0);
    }

    const isCorrectForm = (answer, target) => {
        return target.toLowerCase().split(',').includes(answer.trim().toLowerCase())
    }

    const isCorrectAnswer = () => {
        return isCorrectForm(simplePast, irregularVerb.simple_past) && isCorrectForm(pastParticpile, irregularVerb.past_participle);
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();

        if (simplePast === '') {
            simplePastFieldRef.current.focus();
            return;
        }

        if (pastParticpile === '') {
            pastParticipleFieldRef.current.focus();
            return;
        }

        if (!hasMistake) {
            if (isCorrectAnswer()) {
                await getIrregularVerb(setIrregularVerb);
                setSimplePast('');
                setPastParticiple('');
                increaseStreak();
                simplePastFieldRef.current.focus();
            } else {
                resetStreak();
                setHasMistake(true);
                setSubmitButtonText("Next");
            }
        } else {
            await getIrregularVerb(setIrregularVerb);
            setSimplePast('');
            setPastParticiple('');
            setSubmitButtonText("Submit");
            setHasMistake(false);
            simplePastFieldRef.current.focus();
        }
    }

    return <div className="game">
        <div className="game-row">
            <Form className="game-form" onSubmit={onSubmitForm}>
                <Form.Group controlId="form-infinitive">
                    <h1 className="game-form-infinitive">{irregularVerb.infinitive}</h1>
                </Form.Group>

                <Form.Group controlId="form-simple-past">
                    <Form.Control ref={simplePastFieldRef} autoComplete="off" type="text" className="game-form-input" onChange={onChangeSimplePast} placeholder="Simple past" value={simplePast} />
                    {
                        hasMistake
                        &&
                        <Form.Label className="form-correct">Correct: {irregularVerb.simple_past}</Form.Label>
                    }
                </Form.Group>

                <Form.Group controlId="form-past-participle">
                    <Form.Control ref={pastParticipleFieldRef} autoComplete="off" type="text" className="game-form-input" onChange={onChangePastParticiple} placeholder="Past Participle" value={pastParticpile} />
                    {
                        hasMistake
                        &&
                        <Form.Label className="form-correct">Correct: {irregularVerb.past_participle}</Form.Label>
                    }
                </Form.Group>

                <Button variant="primary" type="submit">
                    {submitButtonText}
                </Button>
            </Form>
            <Streak value={streak} />
        </div>
    </div>
}

export default Game;
