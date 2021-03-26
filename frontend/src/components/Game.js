import './Game.css';
import axios from 'axios';
import { useState, useEffect, useRef } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const getIrregularVerb = async (setIrregularVerb, setDisplayedForm, focusOnFirstField) => {
    const forms = ['infinitive', 'simplePast', 'pastParticiple']

    axios.get(`${process.env.REACT_APP_API_URL}/verbs/random`, {}).then((res) => {
        setIrregularVerb({
            'infinitive': res.data.infinitive,
            'simplePast': res.data.simple_past,
            'pastParticiple': res.data.past_participle,
        });

        const form = forms[Math.floor(Math.random() * forms.length)];

        setDisplayedForm(form);
        focusOnFirstField(form);
    }).catch(() => {
        alert('Getting a new irregular verb failed.');
    });
}

const Streak = ({ value }) => {
    return <div className="streak">Streak: {value}</div>
}

function Game() {
    const [irregularVerb, setIrregularVerb] = useState({ 'infinitive': '', 'simplePast': '', 'pastParticiple': '' });

    const [displayedForm, setDisplayedForm] = useState('');

    const [streak, setStreak] = useState(0);

    const [infinitive, setInfinitive] = useState('');
    const [simplePast, setSimplePast] = useState('');
    const [pastParticiple, setPastParticiple] = useState('');

    const [hadMistakeInfinitive, setHadMistakeInfinitive] = useState(false);
    const [hadMistakeSimplePast, setHadMistakeSimplePast] = useState(false);
    const [hadMistakePastParticiple, setHadMistakePastParticiple] = useState(false);

    const [submitButtonText, setSubmitButtonText] = useState("Submit");

    const infinitiveFieldRef = useRef(null);
    const simplePastFieldRef = useRef(null);
    const pastParticipleFieldRef = useRef(null);

    let InfinitiveRenderedComponent;
    let SimplePastRenderedComponent;
    let PastParticipleRenderedComponent;

    useEffect(() => {
        getIrregularVerb(setIrregularVerb, setDisplayedForm, focusOnFirstField);
    }, [])

    const onChangeInfinitive = (e) => {
        e.preventDefault();
        setInfinitive(e.target.value)
    }

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
        if (displayedForm === 'infinitive') {
            return isCorrectForm(simplePast, irregularVerb.simplePast) && isCorrectForm(pastParticiple, irregularVerb.pastParticiple);
        } else if (displayedForm === 'simplePast') {
            return isCorrectForm(infinitive, irregularVerb.infinitive) && isCorrectForm(pastParticiple, irregularVerb.pastParticiple);
        }

        return isCorrectForm(infinitive, irregularVerb.infinitive) && isCorrectForm(simplePast, irregularVerb.simplePast);
    }

    const focusOnFirstField = (displayedForm) => {
        if (displayedForm === 'infinitive') {
            simplePastFieldRef.current.focus();
        } else {
            infinitiveFieldRef.current.focus();
        }
    }

    const resetInputFields = () => {
        setInfinitive('');
        setSimplePast('');
        setPastParticiple('');
    }

    const resetMistakeVariables = () => {
        setHadMistakeInfinitive(false);
        setHadMistakeSimplePast(false);
        setHadMistakePastParticiple(false);
    }

    const checkForMistakes = () => {
        if (!isCorrectForm(infinitive, irregularVerb.infinitive)) {
            setHadMistakeInfinitive(true);
        }

        if (!isCorrectForm(simplePast, irregularVerb.simplePast)) {
            setHadMistakeSimplePast(true);
        }

        if (!isCorrectForm(pastParticiple, irregularVerb.pastParticiple)) {
            setHadMistakePastParticiple(true);
        }
    }

    const hadMistake = () => {
        return hadMistakeInfinitive || hadMistakeSimplePast || hadMistakePastParticiple;
    }

    const formatForm = (form) => {
        return form.replace(",", ", ");
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();

        if (displayedForm !== 'infinitive' && infinitive === '') {
            infinitiveFieldRef.current.focus();
            return;
        }

        if (displayedForm !== 'simplePast' && simplePast === '') {
            simplePastFieldRef.current.focus();
            return;
        }

        if (displayedForm !== 'pastParticiple' && pastParticiple === '') {
            pastParticipleFieldRef.current.focus();
            return;
        }

        if (!hadMistake()) {
            if (isCorrectAnswer()) {
                resetInputFields();
                increaseStreak();

                await getIrregularVerb(setIrregularVerb, setDisplayedForm, focusOnFirstField);
            } else {
                checkForMistakes();
                setSubmitButtonText("Next");
            }
        } else {
            resetStreak();
            resetInputFields();
            resetMistakeVariables();

            setSubmitButtonText("Submit");

            await getIrregularVerb(setIrregularVerb, setDisplayedForm, focusOnFirstField);
        }
    }

    if (displayedForm === 'infinitive') {
        InfinitiveRenderedComponent = <Form.Group controlId="form-infinitive">
            <h1 className="game-form-infinitive">{formatForm(irregularVerb.infinitive)}</h1>
        </Form.Group>
    } else {
        InfinitiveRenderedComponent = <Form.Group controlId="form-infinitive">
            <Form.Control ref={infinitiveFieldRef} autoComplete="off" type="text" className="game-form-input" onChange={onChangeInfinitive} placeholder="Infinitive" value={infinitive} />
            {
                hadMistakeInfinitive
                &&
                <Form.Label className="form-correct">Correct: {irregularVerb.infinitive}</Form.Label>
            }
        </Form.Group>
    }

    if (displayedForm === 'simplePast') {
        SimplePastRenderedComponent = <Form.Group controlId="form-simple-past">
            <h1 className="game-form-infinitive">{formatForm(irregularVerb.simplePast)}</h1>
        </Form.Group>
    } else {
        SimplePastRenderedComponent = <Form.Group controlId="form-simple-past">
            <Form.Control ref={simplePastFieldRef} autoComplete="off" type="text" className="game-form-input" onChange={onChangeSimplePast} placeholder="Simple past" value={simplePast} />
            {
                hadMistakeSimplePast
                &&
                <Form.Label className="form-correct">Correct: {irregularVerb.simplePast}</Form.Label>
            }
        </Form.Group>
    }

    if (displayedForm === 'pastParticiple') {
        PastParticipleRenderedComponent = <Form.Group controlId="form-simple-past">
            <h1 className="game-form-infinitive">{formatForm(irregularVerb.pastParticiple)}</h1>
        </Form.Group>
    } else {
        PastParticipleRenderedComponent = <Form.Group controlId="form-past-participle">
            <Form.Control ref={pastParticipleFieldRef} autoComplete="off" type="text" className="game-form-input" onChange={onChangePastParticiple} placeholder="Past Participle" value={pastParticiple} />
            {
                hadMistakePastParticiple
                &&
                <Form.Label className="form-correct">Correct: {irregularVerb.pastParticiple}</Form.Label>
            }
        </Form.Group>
    }

    return <div className="game">
        <div className="game-row">
            <Form className="game-form" onSubmit={onSubmitForm}>
                {InfinitiveRenderedComponent}
                {SimplePastRenderedComponent}
                {PastParticipleRenderedComponent}

                <Button variant="primary" type="submit">
                    {submitButtonText}
                </Button>
            </Form>
            <Streak value={streak} />
        </div>
    </div>
}

export default Game;
