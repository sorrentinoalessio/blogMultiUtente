import * as chai from 'chai';
const { expect } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../../server.js';
import mongoose from 'mongoose';
import CryptoUtils from '../../../src/utils/CryptoUtils.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import sinon from 'sinon';
const sandbox = sinon.createSandbox();
import * as postService from '../../../src/services/postService.js';


chai.use(chaiHttp);
describe('Add post controller tests', () => {
    afterEach(async () => {
        await fixturesUtils.clearDb();
        sandbox.restore();
    });

    describe('POST add post failure', () => {
        it('Should return 400 if name is not defined', async () => {

            //Crea user
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);

            //Crea payload per creare post
            const postData = {
                description: 'Test Description'
            };

            // POST con token e payload
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)

            //Asserzioni
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "title" is required');
        })

        it('Should return 400 if description is not defined', async () => {

            //Crea user
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);

            //Crea payload per creare post
            const postData = {
                title: 'Test Name'
            };

            // POST con token e payload
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)

            //Asserzioni
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "description" is required');
        })

        it('Should return 401 if token is not provided', async () => {

            //Crea user
            //const user = await fixturesUtils.createUser({}, true);

            //Crea payload per creare post (non serve perchè l'errore viene mandato prima)
            const postData = {
                name: 'Test Name',
                description: 'Test Description'
            };

            // POST senza token e con payload
            const res = await request.execute(app)
                .post('/user/post/create')
                .send(postData)

            //Asserzioni
            expect(res.status).eq(401);
            //expect(res.body.ownerId).eq(undefined);
        })

        it('Should return 401 if token is not valid', async () => {

            //Crea fake token
            const token = null;

            //Crea payload per creare post (non serve perchè l'errore viene mandato prima)
            const postData = {
                name: 'Test Name',
                description: 'Test Description'
            };

            // POST con fake token e con payload
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)

            //Asserzioni
            expect(res.status).eq(401);
            //expect(res.body.ownerId).eq(undefined);
        })

       
    })

    describe('POST add post success', () => {
        it('Should return 201 and post in status draft', async () => {

            //Crea user
            const user = await fixturesUtils.createUser({}, true);
            const token = CryptoUtils.generateToken(user, 86400);

            //Crea payload per creare post
            const postData = {
                title: 'Test Name',
                description: 'Test Description',
                status: "draft",
            };

            // POST con token e payload
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)

            //Asserzioni
            expect(res.status).eq(201);
            expect(res.body._id).to.exist;
            expect(res.body.name).eq(postData.title);
            expect(res.body.ownerId).eq(user._id.toString());
        })
    })
})
