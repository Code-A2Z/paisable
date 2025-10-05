process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	process.env.MONGO_URI = mongoUri;
	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
	server.close();
});

describe('Auth API', () => {
	beforeEach(async () => {
		await User.deleteMany({});
	});
  
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should allow a new user to sign up', async () => {
    const newUser = {
      email: 'testuser@gmail.com',
      password: 'Password123!',
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    
    const savedUser = await User.findOne({ email: 'testuser@gmail.com' });
    expect(savedUser).not.toBeNull();
    expect(savedUser.defaultCurrency).toBe('USD');
    expect(savedUser.isSetupComplete).toBe(false);
  });

  it('should allow user to complete setup', async () => {
    // First create a user
    const newUser = {
      email: 'testuser@gmail.com',
      password: 'Password123!',
    };

    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    const token = signupResponse.body.token;

    // Complete setup
    const setupResponse = await request(app)
      .put('/api/auth/setup')
      .set('Authorization', `Bearer ${token}`)
      .send({ defaultCurrency: 'EUR' });

    expect(setupResponse.statusCode).toBe(200);
    expect(setupResponse.body.defaultCurrency).toBe('EUR');
    expect(setupResponse.body.isSetupComplete).toBe(true);

    // Verify user was updated in database
    const updatedUser = await User.findOne({ email: 'testuser@gmail.com' });
    expect(updatedUser.defaultCurrency).toBe('EUR');
    expect(updatedUser.isSetupComplete).toBe(true);
  });

  it('should require authentication for setup endpoint', async () => {
    const response = await request(app)
      .put('/api/auth/setup')
      .send({ defaultCurrency: 'EUR' });

    expect(response.statusCode).toBe(401);
  });

  it('should require defaultCurrency in setup request', async () => {
    const newUser = {
      email: 'testuser@gmail.com',
      password: 'Password123!',
    };

    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    const token = signupResponse.body.token;

    const setupResponse = await request(app)
      .put('/api/auth/setup')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(setupResponse.statusCode).toBe(400);
    expect(setupResponse.body.message).toBe('Default currency is required');
  });

	it('should allow a new user to sign up', async () => {
		const newUser = {
			email: 'testuser@gmail.com',
			password: 'Password123!',
		};

		const response = await request(app).post('/api/auth/signup').send(newUser);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('token');

		const savedUser = await User.findOne({ email: 'testuser@gmail.com' });
		expect(savedUser).not.toBeNull();
	});

	it('should reject signup with an existing email', async () => {
		const testUser = {
			email: 'duplicate@gmail.com',
			password: 'Password123!',
		};

		await request(app).post('/api/auth/signup').send(testUser).expect(201);

		const response = await request(app)
			.post('/api/auth/signup')
			.send(testUser)
			.expect(400);

		expect(response.body.message).toBe('User already exists');

		const users = await User.find({ email: testUser.email });
		expect(users.length).toBe(1);
	});

	it('should reject signup when email is missing', async () => {
		const missingEmailUser = {
			email: "",
			password: 'Password123!',
		};

		const response = await request(app)
			.post('/api/auth/signup')
			.send(missingEmailUser)
			.expect(400);

		expect(response.body.message).toBe('Please enter all fields');

		const users = await User.find({});
		expect(users.length).toBe(0);
	});

	it('should reject signup when password is missing', async () => {
		const missingPasswordUser = {
			email: 'user@example.com',
			password: "",
		};

		const response = await request(app)
			.post('/api/auth/signup')
			.send(missingPasswordUser)
			.expect(400);

		expect(response.body.message).toBe('Please enter all fields');

		const users = await User.find({});
		expect(users.length).toBe(0);
	});
});