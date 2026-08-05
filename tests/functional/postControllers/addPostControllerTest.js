import * as chai from 'chai';
const { expect } = chai;
import { request } from 'chai-http';
import supertest from 'supertest';
import path from 'path';
import app from '../../../server.js';
import CryptoUtils from '../../../src/utils/CryptoUtils.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();

describe('Add post controller tests', () => {
    afterEach(async () => {
        await fixturesUtils.clearDb();
        sandbox.restore();
    });

    describe('POST add post failure', () => {
        it('Should return 400 if name is not defined', async () => {

            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);
            const postData = {
                description: 'Test Description'
            };
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "title" is required');
        })
        it('Should return 400 if description is not defined', async () => {

            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);
            const postData = {
                title: 'Test Name'
            };
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)

            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "description" is required');
        })

        it('Should return 401 if token is not provided', async () => {
            const postData = {
                name: 'Test Name',
                description: 'Test Description'
            };

            const res = await request.execute(app)
                .post('/user/post/create')
                .send(postData)
            expect(res.status).eq(401)
        })

        it('Should return 401 if token is not valid', async () => {
            const token = null;
            const postData = {
                name: 'Test Name',
                description: 'Test Description'
            };
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)
            expect(res.status).eq(401);
            expect(res.body.ownerId).eq(undefined);
        })

    })

    describe('POST add post success', () => {
        it('Should return 201 and post in status draft', async () => {
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);
            const postData = {
                title: "nome post",
                description: "descrizione post",
                tag: ["cinema"],
                img: "https://www.example.com/image.jpg"
            }
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)
            expect(res.status).eq(201);
            expect(res.body._id).to.exist;
            expect(res.body.title).eq(postData.title);
            expect(res.body.description).eq(postData.description);
            expect(res.body.ownerId).eq(user._id.toString());
            expect(res.body.img).eq(postData.img);
        })

        it('Should return 201 and persist uploaded image when creating a post', async () => {
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);
            const filePath = path.resolve('avatar/uploads/test.jpg');

            const res = await supertest(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .field('title', 'post con immagine')
                .field('description', 'descrizione con immagine')
                .field('tag', JSON.stringify(['cinema']))
                .attach('uploadedFile', filePath);

            expect(res.status).eq(201);
            expect(res.body._id).to.exist;
            expect(res.body.img).to.include('uploads');
            expect(res.body.img).to.include(user._id.toString());
        })

        it('Should return 201 and persist uploaded image when updating a post', async () => {
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);
            const post = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const filePath = path.resolve('avatar/uploads/test.jpg');

            const res = await supertest(app)
                .patch(`/user/post/update/${post._id}`)
                .set('Authorization', `Bearer ${token}`)
                .field('title', 'post aggiornato con immagine')
                .field('description', 'descrizione aggiornata')
                .field('tag', JSON.stringify(['cinema']))
                .attach('uploadedFile', filePath);

            expect(res.status).eq(201);
            expect(res.body._id).to.exist;
            expect(res.body.img).to.include('uploads');
            expect(res.body.img).to.include(user._id.toString());
        })
    })
})
