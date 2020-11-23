import './Game.css';
import axios from 'axios';
import { useState, useEffect } from "react"

const getIrregularVerb = async (setIrregularVerb) => {
    axios.get(`${process.env.REACT_APP_API_URL}/verbs/random`, {}).then((res) => {
        // setIrregularVerb(res.data)
        console.log(res.data)
    }).catch(() => {
        alert('Getting a new irregular verb failed.');
    });
}

function Game() {
    const [irregularVerb, setIrregularVerb] = useState('halkalla')

    useEffect(() => {
        getIrregularVerb(setIrregularVerb);
    }, [])

    return <div>{irregularVerb}</div>
}

export default Game;
