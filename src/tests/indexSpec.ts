import supertest from "supertest";
import app from '../index';

const request = supertest(app)

describe('Testing the ENDPOINT is work', () =>{
    it('should be main routs / return is work done', async() =>{
        await request.get('/').expect(200);
    })
})