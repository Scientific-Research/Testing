const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
  it("should throw an error with code 500 if accessing the database fails!", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "123456",
      },
    };

    // expect(AuthController.login);
    AuthController.login(req, {}, () => {}).then((result) => {
      //   console.log(result);
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an existing user", function (done) {
    mongoose
      .connect(
        "mongodb+srv://Maximilian-Nodejs-MS:Southkorea121@cluster0.llotg6f.mongodb.net/test-messages?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then((result) => {
        // app.listen(8080);
        // console.log("Connected to Server successfully!");
        const user = new User({
          email: "test@test.com",
          password: "123456",
          name: "Test",
          posts: [],
          _id: "655e881d6e882877785a5cfd",
        });
        return user.save();
      })
      .then(() => {
        const req = { userId: "655e881d6e882877785a5cfd" };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal("I am new!");
          //   done();
          User.deleteMany({})
            .then(() => {
              return mongoose.disconnect();
            })
            .then(() => {
              done();
            });
        });
      })
      .catch((err) => console.log(err));
  });
});
