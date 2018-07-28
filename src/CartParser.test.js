import CartParser from './CartParser';
import fs from 'fs';

let parser, validate, calcTotal, parseLine, parse;

beforeEach(() => {
    parser = new CartParser();
    calcTotal = parser.calcTotal.bind(parser);
    validate = parser.validate.bind(parser);
    parseLine = parser.parseLine.bind(parser);
    parse = parser.parse.bind(parser);
});

describe("CartParser - unit tests", () => {
    // Add your unit tests here.

    it ('Should convert from JSON to CSV', () => {
        
        let convertJSON = `Mollis consequat,9.00,2`;
        
        expect(parseLine(convertJSON)).toMatchObject({
            "name": "Mollis consequat",
            "price": 9.00,
            "quantity": 2
        });
        expect(parseLine('Mollis consequat,9.00,2')).toHaveProperty('id');
    });

    it ('Should return the total cost of all orders', () => {
        
        let items = [
        {
            "name": "Mollis consequat",
            "price": 9,
            "quantity": 2
        },
        {
            "name": "Tvoluptatem",
            "price": 10.32,
            "quantity": 1
        },
        {
            "name": "Scelerisque lacinia",
            "price": 18.9,
            "quantity": 1
        },
        {
            "name": "Consectetur adipiscing",
            "price": 28.72,
            "quantity": 10
        },
        {
            "name": "Condimentum aliquet",
            "price": 13.9,
            "quantity": 1
        }
        ];
        
        expect(calcTotal(items)).toBe(348.31999999999994);
    });

    it ('Should return empty array', () => {
        
        let validContent = 
        `Product name,Price,Quantity
        Mollis consequat,9.00,2`;
        
        expect(validate(validContent)).toEqual([]);
    });

    it ('Should return a wrong header', () => {
        
        let wrongHeader = `Product name,Price`;
        
        expect(validate(wrongHeader)).toContainEqual({
          "column": 2,
          "message": `Expected header to be named "Quantity" but received undefined.`,
          "row": 0,
          "type": "header"
        });
    });

    it ('Should return quantity cells is wrong', () => {
        
        let wrongCell = 
        `Product name,Price,Quantity
        Mollis consequat,9.00`;
        
        expect(validate(wrongCell)).toContainEqual({
          "column": -1,
          "message": "Expected row to have 3 cells but received 2.",
          "row": 1,
          "type": "row"
        });
    });

    it ('Should return cell is empty', () => {
       
        let emptyCell = 
        `Product name,Price,Quantity
        ,9.00,2`;
      
        expect(validate(emptyCell)).toContainEqual({
          "column": 0,
          "message": `Expected cell to be a nonempty string but received "".`,
          "row": 1,
          "type": "cell"
        });
    });

    it ('Should return number is a string', () => {
        
        let cellString = 
        `Product name,Price,Quantity
        Mollis consequat,string,2`;
       
        expect(validate(cellString)).toContainEqual({
          "column": 1,
          "message": `Expected cell to be a positive number but received "string".`,
          "row": 1,
          "type": "cell"
        });
    });

    it ('should return negative number', () => {
        
        let negativeNumber = 
        `Product name,Price,Quantity
        Mollis consequat,-1,2`;
        
        expect(validate(negativeNumber)).toContainEqual({
          "column": 1,
          "message": `Expected cell to be a positive number but received "-1".`,
          "row": 1,
          "type": "cell"
        });
    });   

});


describe("CartParser - integration tests", () => {
    // Add your integration tests here.
    
    it('Should return error of wrong header', () => {
        
        expect(() => parser.parse('./samples/test.csv')).toThrow();
    });
});