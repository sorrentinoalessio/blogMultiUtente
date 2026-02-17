import fixturesUtils from "../../fixtures/fixturesUtils.js";
import sinon from "sinon";
import CryptoUtils from "../../../src/utils/CryptoUtils.js";
import path from "path";
import { expect } from "chai";
import request from "supertest";
import app from "../../../server.js"; 


const sandbox = sinon.createSandbox();
let user;
let token;

describe('Upload avatar user tests', () => {
    
    afterEach(async () => {
        sandbox.restore();
    });

    beforeEach(async () => {
        await fixturesUtils.clearDb();
        user = await fixturesUtils.createUser({email: "test@email.com"}, true);
        token = CryptoUtils.generateToken(user, 86400);
    });

    it('Should return 200 if avatar is valid', async () => {
        const filePath = path.resolve("avatar/uploads/test.jpg");
        const res = await request(app)
            .post(`/user/profile/avatar/upload`)
            .set('Authorization', `Bearer ${token}`)
            .attach("uploadedFile", filePath);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'File caricato con successo');
        expect(res.body.file).to.be.an('object');
        expect(res.body.file.filename).to.contain(user.userId || user._id);
    });
});