import { FastifyInstance } from 'fastify';
import { UserCreate } from '../interfaces/user.interface';
import { UserUseCase } from '../usecases/user.usecase';

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();
  fastify.post<{ Body: UserCreate }>('/', async (req, reply) => {
    const { name, email } = req.body;
    try {
      const data = await userUseCase.create({
        name,
        email,
      });
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
  fastify.get('/', (req, reply) => {
    reply.send({ hello: 'world' });
  });
}
