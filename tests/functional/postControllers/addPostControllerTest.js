import * as chai from 'chai';
const { expect } = chai;
import { request } from 'chai-http';
import app from '../../../server.js';
import CryptoUtils from '../../../src/utils/CryptoUtils.js';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import sinon from 'sinon';
import TagUtils from '../../../src/utils/TagUtils.js';

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
                tag: ["cinema"]
            }
            console.log(postData)
            
            const res = await request.execute(app)
                .post('/user/post/create')
                .set('Authorization', `Bearer ${token}`)
                .send(postData)
                console.log(res)
           // postData.tag = await TagUtils.createTagUtils(postData.tag)
            expect(res.status).eq(201);
            expect(res.body._id).to.exist;
            expect(res.body.title).eq(postData.title);
            expect(res.body.description).eq(postData.description);
            expect(res.body.ownerId).eq(user._id.toString());
        })
    })
})
