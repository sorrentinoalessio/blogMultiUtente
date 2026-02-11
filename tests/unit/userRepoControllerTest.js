import * as chai from 'chai';
const { expect } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../server.js';
import mongoose from 'mongoose';
import fixturesUtils from '../fixtures/fixturesUtils.js';
import sinon from 'sinon';
import mailer, { createTransport } from 'nodemailer';
import CryptoUtils from '../../src/utils/CryptoUtils.js'
import e from 'express';



const sandbox = sinon.createSandbox();
let user;
let token;

//* 
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

    describe('GET  user by email for resetPassword fail', () => {
        it('Should return 400 if email not passed', async () => {

            const res = await request.execute(app)
                .post('/user/reset_password')
                .send({})
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "email" is required')
        })

        it('Should return 400 if email not exist', async () => {
            const emailFake = "email@fake.com"
            const res = await request.execute(app)
                .post('/user/reset_password')
                .send({ emailFake })
            expect(res.status).eq(400);
            expect(res.body.message).eq(`ValidationError: "email" is required. "emailFake" is not allowed`)
        })

        it('Should return 500 if email not object', async () => {
            const res = await request.execute(app)
                .post('/user/reset_password')
                .send()
            expect(res.status).eq(500);
        })

    })
    describe('GET  user by email for resetPassword success', () => {
        it('Should return 200 if email exist found', async () => {
            const email = user.email
            const sendMailStub = sandbox.stub().resolves({
                messageId: '1'
            });
            sandbox.stub(mailer, 'createTransport').returns({
                sendMail: sendMailStub
            });
            const res = await request.execute(app)
                .post('/user/reset_password')
                .send({ email })
            expect(res.status).eq(200);
            expect(sendMailStub.called).to.be.true;
        });
    });

    describe.skip('POST  passwordNew for resetPassword success', () => {
        it('Should return 200 if password  valid', async () => {
            const res = await request.execute(app)
                .post(`/user/new_password/${user.registrationToken}`)
                .send({ "passwordNew": "123456" })
            expect(res.status).eq(200);

        })

    });
     describe('POST  passwordNew for resetPassword fail', () => {
        it('Should return 400 if password  not valid', async () => {
            const res = await request.execute(app)
                .post(`/user/new_password/${user.registrationToken}`)
                .send({ "passwordNew": "1" })
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "passwordNew" length must be at least 3 characters long')

        })

         it('Should return 400 if password  is empty', async () => {
            const res = await request.execute(app)
                .post(`/user/new_password/${user.registrationToken}`)
                .send({ "passwordNew": "" })
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "passwordNew" is not allowed to be empty')

        })

    });
   

});


