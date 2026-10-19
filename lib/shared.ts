import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'SAGU';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const gitConfig = {
  user: 'VeCtORbytes',
  repo: 'SaGuSDK',
  branch: 'main',
};

export const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/** This documentation site's own repository. */
export const docsRepoUrl = `https://github.com/${gitConfig.user}/SaGuDocs`;
export const installCommand = 'npm install sagu-sdk zod@3';
export const npmUrl = 'https://www.npmjs.com/package/sagu-sdk';

/** Link to a file or folder in the SDK repository. */
export function sourceUrl(path: string) {
  const kind = path.includes('.') ? 'blob' : 'tree';
  return `${repoUrl}/${kind}/${gitConfig.branch}/${path}`;
}

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
