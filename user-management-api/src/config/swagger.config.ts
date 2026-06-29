import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { env } from './env.config';

function resolveOpenApiPath(): string {
  const candidates = [
    path.join(__dirname, '../docs/openapi.yaml'),
    path.join(process.cwd(), 'src/docs/openapi.yaml'),
    path.join(process.cwd(), 'dist/docs/openapi.yaml'),
  ];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(`OpenAPI spec not found. Checked: ${candidates.join(', ')}`);
  }

  return found;
}

const spec = yaml.load(fs.readFileSync(resolveOpenApiPath(), 'utf8')) as Record<string, unknown>;

export const swaggerSpec = {
  ...spec,
  servers: [{ url: env.API_PUBLIC_URL, description: 'API' }],
};
