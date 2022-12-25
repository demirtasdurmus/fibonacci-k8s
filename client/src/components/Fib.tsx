import { useState, useEffect } from "react"
import axios from 'axios'


export const Fib = () => {
    const [entity, setEntity] = useState({
        seenIndexes: [],
        values: {},
        index: ''
    })

    const fetchValues = async () => {
        try {
            const values = await axios.get('/api/values/current')
            setEntity({ ...entity, values: values.data })
        } catch (error: any) {
            const err = error.response ? error.response.data.message : error.message
            console.error(err)
        }
    }

    const fetchIndexes = async () => {
        try {
            const seenIndexes = await axios.get('/api/values/all')
            setEntity({ ...entity, seenIndexes: seenIndexes.data })
        } catch (error: any) {
            const err = error.response ? error.response.data.message : error.message
            console.error(err)
        }
    }

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()
            await axios.post('/api/values', {
                index: entity.index,
            })
            setEntity({ ...entity, index: "" })
        } catch (error: any) {
            const err = error.response ? error.response.data.message : error.message
            console.error(err)
        }
    }

    const createSeenIndexes = () => {
        return entity.seenIndexes.map(({ number }) => number).join(', ')
    }

    const renderValues = () => {
        const entries = [];

        for (let key in entity.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {JSON.stringify(entity.values)}
                </div>
            );
        }
        return entries;
    }

    useEffect(() => {
        fetchIndexes()
        fetchValues()
        return () => {
        }
    }, [])


    return (
        <div>
            <h1>Form</h1>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={entity.index}
                    onChange={(event) => setEntity({ ...entity, index: event.target.value })}
                />
                <button>Submit</button>
            </form>

            <p>Indexes I have seen:</p>
            {createSeenIndexes()}

            <p>Calculated Values:</p>
            {renderValues()}
        </div>
    );
}