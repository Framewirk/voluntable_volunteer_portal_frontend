import { create } from 'axios';

let APIinstance = null;

APIinstance = create({
    baseURL: process.env.REACT_APP_BACKEND_API,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('voluntable:admin:token')}`
    }
});

const refreshKey = () => {
    APIinstance = create({
        baseURL: process.env.REACT_APP_BACKEND_API,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('voluntable:admin:token')}`
        }
    });
}

export { APIinstance, refreshKey };