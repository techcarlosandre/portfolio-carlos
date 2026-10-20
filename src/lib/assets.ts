const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function getAssetPath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  let basePath = envBasePath;
  // If running in browser and URL contains base path (e.g. GitHub Pages repo path), ensure basePath is applied
  if (!basePath && typeof window !== "undefined" && window.location.pathname.startsWith("/portfolio-carlos")) {
    basePath = "/portfolio-carlos";
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (basePath && cleanPath.startsWith(basePath)) {
    return cleanPath;
  }
  return `${basePath}${cleanPath}`;
}
