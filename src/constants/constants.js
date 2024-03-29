// index.js

// Initialize form with empty strings
export const initialFormState = {
    address: '',
    coords: '',
    numOfStops: '',
    activities: '',
    radius: '',
}

// Initialize the select options for React Select
export const numOfStops = [
    { value: 1, label: 'One', name: 'numOfStops' },
    { value: 2, label: 'Two', name: 'numOfStops' },
    { value: 3, label: 'Three', name: 'numOfStops' },
    { value: 4, label: 'Four', name: 'numOfStops' },
]
export const activities = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'bar', label: 'Bar' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'coffee', label: 'Coffee' },
]
export const radius = [
    { value: 5, label: '5 miles', name: 'radius' },
    { value: 10, label: '10 miles', name: 'radius' },
    { value: 15, label: '15 miles', name: 'radius' },
    { value: 25, label: '25 miles', name: 'radius' },
    { value: 50, label: '50 miles', name: 'radius' },
]

// map.js

// Alphabet for use in Map Details
export const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

