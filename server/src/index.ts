import { Hono } from 'hono'
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';
import { cors } from 'hono/cors'
import { auth } from '../lib/auth';


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use('/*', cors())

app.route("/api/v1/user", userRoutes);
app.route("/api/v1/blog", blogRoutes);

export default app
