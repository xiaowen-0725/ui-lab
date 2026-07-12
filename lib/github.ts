/**
 * Resolves the GitHub API URL for the repo's star count from
 * NEXT_PUBLIC_REPO_URL (e.g. https://github.com/owner/repo). Returns null
 * when the env var is unset or isn't a parseable GitHub repo URL.
 */
function githubRepoApiUrl(): string | null {
  const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;
  if (!repoUrl) return null;

  try {
    const { hostname, pathname } = new URL(repoUrl);
    if (hostname !== "github.com") return null;

    const [owner, repo] = pathname.replace(/^\/+/, "").replace(/\/+$/, "").split("/");
    if (!owner || !repo) return null;

    return `https://api.github.com/repos/${owner}/${repo}`;
  } catch {
    return null;
  }
}

export async function getGithubStarCount(): Promise<number | null> {
  const apiUrl = githubRepoApiUrl();
  if (!apiUrl) return null;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 60 * 60,
      },
    });

    if (!response.ok) return null;

    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "stargazers_count" in data &&
      typeof data.stargazers_count === "number"
    ) {
      return data.stargazers_count;
    }
  } catch {
    return null;
  }

  return null;
}
