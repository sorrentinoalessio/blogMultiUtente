import * as chai from 'chai';
const { expect } = chai;
import { request } from 'chai-http';
import app from '../../server.js'
import CryptoUtils from '../../src/utils/CryptoUtils.js';
import fixturesUtils from '../../tests/fixtures/fixturesUtils.js';
import sinon from 'sinon';
import { postStatus } from '../../src/constants/const.js';


const sandbox = sinon.createSandbox();
let user;
let token;


describe('Repo post controller tests', () => {
    afterEach(async () => {
        await fixturesUtils.clearDb();
        sandbox.restore();
    });
    beforeEach(async () => {
        await fixturesUtils.clearDb();
        user = await fixturesUtils.createUser({}, true);
        token = CryptoUtils.generateToken(user, 86400);
    });

    describe('GET  post by Id fail', () => {
        it('Should return 201 if post not exist', async () => {
            const userFake = await fixturesUtils.createUser({ email: 'postnotexist@mail.com' }, true);
            const tokenFake = CryptoUtils.generateToken(userFake, 86400);
            const res = await request.execute(app)
                .get('/user/post')
                .set('Authorization', `Bearer ${tokenFake}`)
                .send()
            expect(res.status).eq(201);
            expect(res.text).eq('[]')


        })
        it('Should return 401 if token is not provided', async () => {
            const res = await request.execute(app)
                .get('/user/post')
                .send()
            expect(res.status).eq(401)
            expect(res.body.ownerId).eq(undefined);
        })


    })

    describe('GET post repo success', () => {
        it('Should return 201 list post', async () => {
            const postData = {
                title: "titolo",
                description: "descrizione"
            }

            const res = await request.execute(app)
                .get('/user/post')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
            expect(res.body.ownerId).eq(postData.ownerId)
        })
    })

    describe('GET post by postId and userId success', () => {
        it('Should return 201 post', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const res = await request.execute(app)
                .get(`/user/post/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })
    })
    describe('GET posts public', () => {
        it('Should return 201 post', async () => {
            const postData = await fixturesUtils.createPost({ status: postStatus.PUBLIC }, true);
            const res = await request.execute(app)
                .get(`/post`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })
    })
    describe('PATCH post update status success', () => {
        it('Should return status 201', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const bodyUpdateStatus = {
                status: 'public'
            }
            const res = await request.execute(app)
                .patch(`/user/post/status/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(bodyUpdateStatus)
            expect(res.status).eq(201);

        })
    })
    describe('PATCH post update status fail body status empty or not [public, draft, delete]  ', () => {
        it('Should return status 400 is body is empty', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const bodyUpdateStatus = {
                status: ''
            }

            const res = await request.execute(app)
                .patch(`/user/post/status/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(bodyUpdateStatus)
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "status" must be one of [public, draft, delete]. "status" is not allowed to be empty');

        })
        it('Should return status 400 for status not [public, draft, delete] ', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const bodyUpdateStatus = {
                status: 'archived'
            }
            const res = await request.execute(app)
                .patch(`/user/post/status/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(bodyUpdateStatus)
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "status" must be one of [public, draft, delete]');

        })
    })

    describe('GET tag by postId and userId fail', () => {
        it('Should return 500 if userId not found', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(500);

        })
        it('Should return 201 if tag not found', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })
        it('Should return 400 if idPost not found', async () => {
            const postData = {}
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "id" must only contain hexadecimal characters. "id" length must be 24 characters long');
        })
    })
    describe('GET tag by postId and userId succes', () => {

        it('Should return 201 if tag found', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id  }, true);
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })

    })
})
