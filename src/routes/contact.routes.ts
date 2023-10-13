import { FastifyInstance } from 'fastify';
import { Contact, ContactCreate } from '../interfaces/contacts.interface';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ContactUseCase } from '../usecases/contact.usecase';

export async function contactsRoutes(fastify: FastifyInstance) {
  const contactUseCase = new ContactUseCase();
  fastify.addHook('preHandler', authMiddleware);

  fastify.post<{ Body: ContactCreate }>('/', async (request, reply) => {
    const { name, email, phone } = request.body;
    const emailUser = request.headers['email'];

    try {
      const data = await contactUseCase.create({
        email: request.body.email,
        name,
        phone,
        userEmail: emailUser,
      });
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
  fastify.get('/', async (req, reply) => {
    const emailUser = req.headers['email'];
    try {
      const data = await contactUseCase.listAllContacts(emailUser);
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
  fastify.put<{ Body: Contact; Params: { id: string } }>(
    '/:id',
    async (req, reply) => {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      try {
        const data = await contactUseCase.updateContact({
          id,
          name,
          email,
          phone,
        });
        return reply.send(data);
      } catch (error) {
        reply.send(error);
      }
    },
  );
  fastify.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const { id } = req.params;
    try {
      const data = await contactUseCase.delete(id);
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
}
