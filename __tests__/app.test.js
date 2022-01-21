const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const  seed  = require('../db/seeds/seed.js');
const app = require('../app')
const request = require('supertest');
const jestSorted = require('jest-sorted')


// Seeding
beforeEach(() => seed(testData));
afterAll(() => db.end());

// User Tests
describe('api get users', () => {
    test('returns status 200 and array of users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((res) => {
            expect(res.body.users).toBeInstanceOf(Array);
                res.body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        avatar_url: expect.any(String),
                        name: expect.any(String)
                    })
                })
        })
    })
    test('URL spelled wrong', () => {
        return request(app) 
        .get('/api/user')
        .expect(404)
        .then((res) => {
        expect(res.body.msg).toBe("Not Found")
        })
    })
})

// Topic Tests
describe('Get topics', () => {
    test('Status 200 and all topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
            expect(res.body.topics.length).toBe(3)
        })
    })
})

// Articles Tests
describe('api articles', () => {
    test('/api/articles responds with status 200 and array of articles with additional comments', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
            expect(res.body.articles).toBeInstanceOf(Array);
                res.body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                })
           })
     })
     test('URL misspelled gives 404 error', () => {
         return request(app) 
         .get('/api/articlea')
         .expect(404)
         .then((res) => {
             expect(res.body.msg).toBe('Not Found')
         })
     })
     test('/api/aritcles responds with status 200 and sorted by date default', () => {
         return request(app)
         .get('/api/articles')
         .expect(200)
         .then((res) => {
             expect(res.body.articles).toBeSorted('created_at')
         })
     })
     test('Comment request responds with comment array', () => {
         return request(app)
         .get('/api/articles/1/comments')
         .expect(200)
         .then((res) => {
             expect(res.body.comments).toBeInstanceOf(Array);
             res.body.comments.forEach((comment) => {
                 expect(comment).toMatchObject({
                     comment_id: expect.any(Number),
                     author: expect.any(String),
                     article_id: expect.any(Number),
                     votes: expect.any(Number),
                     created_at: expect.any(String),
                     body: expect.any(String)
                 })
             })
         })
     })
     test.only('Return 400 and Bad Request if trying to get comments of invalid article', () => {
         return request(app)
         .get('/api/articles/notanid/comments')
         .expect(400)
         .then((res) => {
             expect(res.body.msg).toBe('Bad Request')
         })
     })
})

describe('Update votes', () => {
    test('Given article id, update votes by set amount', () => {
        return request(app)
        .patch('/api/articles/1')
        .send( {inc_votes: 5} )
        .expect(200)
        .then((res) => {
            expect(res.body.article.votes).toBe(105)
        })
    })
    test('404 Not Found if not given a number', () => {
        return request(app)
        .patch('/api/aritcles/1')
        .send( { inc_votes: 't'})
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found")
        })
    })
})

describe(' Get Article by id', () => {
    test('returns 200 and single article', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
            expect(res.body.article.article_id).toBe(1);
            expect(res.body.article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                })
           })
    test("Invlaid id responds with 400 and Bad Request", () => {
        return request(app)
        .get('/api/articles/notanid')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe("Bad Request")
        })
    })
    test("Review Id that doesn't exist gives 404 Not Found", () => {
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        // .then((res) => {
            
        //     expect(res.body.msg).toBe("Not Found")
        // })
    })
        
        })


       // Comments
describe('Add comment', () => {
    test('Object with username and body adds comment based on comment id', () => {
        return request(app)
        .post('/api/articles/9/comments')
        .send({username: "butter_bridge", body: "comment comment"})
        .expect(201)
    })
})





describe('delete comment', () => {
    test('delete comment', () => {
        return request(app)
        .delete('/api/comments/9')
        .expect(204)
    })
})
    

describe('GET comments', () => {
    test('return comment object', () => {
        return request(app)
        .get('/api/comments')
        .expect(200)
    })
})

